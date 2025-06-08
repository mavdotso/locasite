import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchAction } from 'convex/nextjs';
import { Id } from '@/convex/_generated/dataModel';

// Exchange authorization code for access token
async function exchangeCodeForToken(code: string, redirectUri: string) {
  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Google Business OAuth credentials not configured');
  }
  
  const tokenEndpoint = 'https://oauth2.googleapis.com/token';
  
  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  
  const response = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Token exchange failed:', error);
    throw new Error('Failed to exchange code for token');
  }
  
  const data = await response.json();
  return data.access_token;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  
  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    const errorDescription = searchParams.get('error_description');
    return NextResponse.redirect(
      new URL(`/dashboard/claims?error=auth_failed&message=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }
  
  if (!code) {
    return NextResponse.redirect(
      new URL('/dashboard/claims?error=no_code', request.url)
    );
  }
  
  // Validate state parameter to prevent CSRF
  if (!state) {
    return NextResponse.redirect(
      new URL('/dashboard/claims?error=invalid_state', request.url)
    );
  }
  
  try {
    // Parse the state parameter (should contain claimId and CSRF token)
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { claimId } = stateData;
    
    // In production, validate CSRF token against session
    // For now, we'll just check that claimId exists
    if (!claimId) {
      throw new Error('Invalid state: missing claimId');
    }
    
    // Exchange authorization code for access token
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google-business/callback`;
    const accessToken = await exchangeCodeForToken(code, redirectUri);
    
    // Verify business ownership using the access token
    const result = await fetchAction(api.businessClaims.verifyGoogleBusinessOwnership, {
      claimId: claimId as Id<"businessClaims">,
      googleAccessToken: accessToken
    });
    
    if (result.success) {
      return NextResponse.redirect(
        new URL(`/dashboard/claims?success=verification_complete&message=${encodeURIComponent(result.message)}`, request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/dashboard/claims?error=verification_failed&message=${encodeURIComponent(result.message)}`, request.url)
      );
    }
    
  } catch (error) {
    console.error('Google Business OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.redirect(
      new URL(`/dashboard/claims?error=verification_failed&message=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}