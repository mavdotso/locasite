import { NextRequest, NextResponse } from 'next/server';
import { getGoogleBusinessAuthUrl } from '@/app/lib/google-business-oauth';

export async function GET(request: NextRequest) {
  try {
    // Get businessId from query params
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    // Generate state parameter with businessId
    // Note: In production, you should verify the user owns this business
    // This can be done in the callback or by passing a signed token
    const state = Buffer.from(JSON.stringify({
      businessId,
      timestamp: Date.now()
    })).toString('base64');

    // Get OAuth URL
    const authUrl = getGoogleBusinessAuthUrl(state);

    return NextResponse.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication URL' },
      { status: 500 }
    );
  }
}