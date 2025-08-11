import { NextRequest, NextResponse } from 'next/server';

// Photo proxy endpoint to prevent API key exposure
// Uses server-side API key to fetch Google Places photos
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const photoReference = searchParams.get('ref');
    const width = searchParams.get('width') || '800';
    
    if (!photoReference) {
      return NextResponse.json(
        { error: 'Photo reference is required' },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': process.env.CLIENT_ORIGIN ?? '*',
            'Vary': 'Origin',
          },
        }
      );
    }

    // Validate width parameter
    const widthNum = parseInt(width);
    if (isNaN(widthNum) || widthNum < 1 || widthNum > 1600) {
      return NextResponse.json(
        { error: 'Invalid width parameter' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Fetch photo from Google Places API
    // Fetch photo from Google Places API (encode all params safely)
    const photoUrl = new URL('https://maps.googleapis.com/maps/api/place/photo');
    photoUrl.searchParams.set('maxwidth', String(widthNum));
    photoUrl.searchParams.set('photoreference', photoReference);
    photoUrl.searchParams.set('key', apiKey);
    
    const response = await fetch(photoUrl.toString(), { redirect: 'follow' });
    if (!response.ok) {
      console.error('Failed to fetch photo from Google Places API:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch photo' },
        { status: response.status }
      );
    }

    // Get the image data and content type
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error in photo proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}