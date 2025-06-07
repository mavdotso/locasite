import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
import { RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";
import axios from "axios";

const MINUTE = 60 * 1000; // 1 minute in milliseconds

const rateLimiter = new RateLimiter(components.rateLimiter, {
  previewScrape: { kind: "fixed window", rate: 3, period: MINUTE },
});

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

export const scrapeGoogleMaps = httpAction(async (ctx, request) => {
  try {
    const { url, preview = false } = await request.json();
    
    // Apply rate limiting for preview requests (unauthenticated users)
    if (preview) {
      const identifier = request.headers.get("x-forwarded-for") || "anonymous";
      const status = await rateLimiter.limit(ctx, "previewScrape", { key: identifier });
      
      if (!status.ok) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a minute.' }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
              "Vary": "origin"
            }
          }
        );
      }
    }

    if (!url || !url.includes('google.com/maps')) {
      return new Response(
        JSON.stringify({ error: 'Invalid URL. Please provide a Google Maps URL.' }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
            "Vary": "origin"
          }
        }
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
      return new Response(
        JSON.stringify({ error: 'Could not extract business name from URL.' }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
            "Vary": "origin"
          }
        }
      );
    }

    // Use Google Places API to search for the business
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const findPlaceResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`
    );

    console.log(findPlaceResponse)

    if (!findPlaceResponse.data.candidates || findPlaceResponse.data.candidates.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Business not found in Google Places API.' }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
            "Vary": "origin"
          }
        }
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
      description: place.editorial_summary?.overview || '',
      placeId: placeId
    };

    // Generate AI content for the business
    let aiContent = null;
    try {
      console.log('Starting AI content generation for:', businessData.name);
      const aiResult = await ctx.runAction(api.aiContentGenerator.generateBusinessContent, {
        businessData: {
          name: businessData.name,
          address: businessData.address,
          phone: businessData.phone,
          website: businessData.website,
          description: businessData.description,
          reviews: businessData.reviews,
          rating: businessData.rating
        }
      });
      console.log('AI content generation successful:', aiResult);
      aiContent = aiResult.content;
    } catch (error) {
      console.error('AI content generation failed:', error);
      // Continue without AI content if generation fails
    }

    // Only save to database if not in preview mode
    let businessId = null;
    if (!preview) {
      businessId = await ctx.runMutation(api.businesses.create, {
        business: {
          ...businessData,
          aiGeneratedContent: aiContent
        }
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: businessData, businessId, preview }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
          "Vary": "origin"
        }
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch business data from Google Places API.' }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
          "Vary": "origin"
        }
      }
    );
  }
});