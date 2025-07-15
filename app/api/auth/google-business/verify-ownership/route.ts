import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAction } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";
import { getGoogleBusinessAuthUrl } from "@/app/lib/google-business-oauth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const businessId = searchParams.get("businessId");
  const claimId = searchParams.get("claimId");

  if (!businessId || !claimId) {
    return NextResponse.json(
      { error: "Missing businessId or claimId" },
      { status: 400 },
    );
  }

  // Generate state parameter with businessId and claimId
  const state = Buffer.from(JSON.stringify({ businessId, claimId })).toString(
    "base64",
  );

  // Generate Google OAuth URL
  const authUrl = getGoogleBusinessAuthUrl(state);

  // Redirect to Google OAuth
  return NextResponse.redirect(authUrl);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, accessToken } = body;

    if (!claimId || !accessToken) {
      return NextResponse.json(
        { error: "Missing claimId or accessToken" },
        { status: 400 },
      );
    }

    // Verify ownership using the Convex action
    const result = await fetchAction(
      api.businessClaims.verifyGoogleBusinessOwnership,
      {
        claimId: claimId as Id<"businessClaims">,
        googleAccessToken: accessToken,
      },
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error verifying ownership:", error);
    return NextResponse.json(
      {
        error: "Failed to verify ownership",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
