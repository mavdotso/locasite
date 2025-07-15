import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForTokens,
  getBusinessAccounts,
} from "@/app/lib/google-business-oauth";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/dashboard?error=${encodeURIComponent(error)}`, request.url),
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/dashboard?error=missing_parameters", request.url),
      );
    }

    // Decode and validate state
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, "base64").toString());
    } catch {
      return NextResponse.redirect(
        new URL("/dashboard?error=invalid_state", request.url),
      );
    }

    const { businessId } = stateData;

    // Exchange code for tokens
    let tokens;
    try {
      tokens = await exchangeCodeForTokens(code);
    } catch (tokenError) {
      // Token exchange failed - error details in redirect
      return NextResponse.redirect(
        new URL(
          `/dashboard?error=token_exchange_failed&details=${encodeURIComponent(String(tokenError))}`,
          request.url,
        ),
      );
    }

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(
        new URL("/dashboard?error=missing_tokens", request.url),
      );
    }

    // Get business accounts
    const accountsResponse = await getBusinessAccounts(tokens.access_token);
    const accounts = accountsResponse.accounts || [];

    // Store tokens and account info in Convex
    await fetchMutation(api.businesses.updateGoogleBusinessAuth, {
      businessId,
      googleBusinessAuth: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: tokens.expiry_date || Date.now() + 3600000,
        accounts: accounts.map(
          (account: {
            name: string;
            accountName: string;
            type: string;
            verificationState?: string;
          }) => ({
            accountId: account.name.split("/").pop(),
            accountName: account.accountName,
            type: account.type,
            verificationState: account.verificationState,
          }),
        ),
      },
    });

    // Redirect to business verification page
    return NextResponse.redirect(
      new URL(
        `/dashboard/businesses/${businessId}/verify?success=true`,
        request.url,
      ),
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=oauth_failed", request.url),
    );
  }
}
