import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/convex/_generated/api';
import { fetchAction } from 'convex/nextjs';
import { Id } from '@/convex/_generated/dataModel';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  // In a real implementation, you would:
  // 1. Exchange the authorization code for an access token
  // 2. Use the access token to verify business ownership
  // 3. Update the claim status in Convex
  
  if (error) {
    return NextResponse.redirect(
      new URL('/dashboard/claims?error=auth_failed', request.url)
    );
  }
  
  if (!code) {
    return NextResponse.redirect(
      new URL('/dashboard/claims?error=no_code', request.url)
    );
  }
  
  // For demonstration purposes, we'll redirect with a success message
  // In production, you would:
  // 1. Exchange code for access token using Google OAuth2 endpoint
  // 2. Call the verifyGoogleBusinessOwnership action with the token
  // 3. Handle the result appropriately
  
  try {
    // Get the pending claim ID from session/cookie
    // This is a simplified version - in production use secure session handling
    const claimId = searchParams.get('state'); // Usually passed via OAuth state parameter
    
    if (claimId) {
      // In a real implementation:
      // const accessToken = await exchangeCodeForToken(code);
      // const result = await fetchAction(api.businessClaims.verifyGoogleBusinessOwnership, {
      //   claimId: claimId as Id<"businessClaims">,
      //   googleAccessToken: accessToken
      // });
      
      return NextResponse.redirect(
        new URL(`/dashboard/claims?success=verification_complete`, request.url)
      );
    }
    
    return NextResponse.redirect(
      new URL('/dashboard/claims', request.url)
    );
    
  } catch (error) {
    console.error('Google Business OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard/claims?error=verification_failed', request.url)
    );
  }
}