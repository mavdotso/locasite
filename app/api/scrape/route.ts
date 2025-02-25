import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface GooglePlaceReview {
    author_name: string;
    rating: number;
    text: string;
}

interface GooglePlacePhoto {
    photo_reference: string;
    height: number;
    width: number;
}

export async function POST(req: NextRequest) {
    try {
        const { url } = await req.json();

        if (!url || !url.includes('google.com/maps')) {
            return NextResponse.json(
                { error: 'Invalid URL. Please provide a Google Maps URL.' },
                { status: 400 }
            );
        }

        // Extract business name from URL
        const nameMatch = url.match(/place\/([^/@]+)/);
        let businessName = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, ' ')) : null;

        // Try alternative pattern for complex URLs
        if (!businessName) {
            const complexMatch = url.match(/maps\/place\/([^/@?]+)/);
            if (complexMatch) {
                businessName = decodeURIComponent(complexMatch[1].replace(/\+/g, ' '));
            }
        }

        if (!businessName) {
            return NextResponse.json(
                { error: 'Could not extract business name from URL.' },
                { status: 400 }
            );
        }

        // Use Google Places API to search for the business
        const apiKey = process.env.GOOGLE_MAPS_API;
        const findPlaceResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`
        );

        if (!findPlaceResponse.data.candidates || findPlaceResponse.data.candidates.length === 0) {
            return NextResponse.json(
                { error: 'Business not found in Google Places API.' },
                { status: 404 }
            );
        }

        const placeId = findPlaceResponse.data.candidates[0].place_id;

        // Get detailed information using the place_id
        const fields = [
            'name',
            'formatted_address',
            'formatted_phone_number',
            'website',
            'opening_hours',
            'rating',
            'reviews',
            'photos',
            'editorial_summary'
        ].join(',');

        const detailsResponse = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`
        );

        const place = detailsResponse.data.result;

        // Format the data
        const businessData = {
            name: place.name || '',
            address: place.formatted_address || '',
            phone: place.formatted_phone_number || '',
            website: place.website || '',
            hours: place.opening_hours?.weekday_text || [],
            rating: place.rating || null,
            reviews: place.reviews?.map((review: GooglePlaceReview) => ({
                reviewer: review.author_name,
                rating: `${review.rating} stars`,
                text: review.text
            })) || [],
            photos: place.photos?.map((photo: GooglePlacePhoto) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
            ) || [],
            description: place.editorial_summary?.overview || ''
        };

        return NextResponse.json({ success: true, data: businessData });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch business data from Google Places API.' },
            { status: 500 }
        );
    }
}