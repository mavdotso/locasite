import { httpAction } from "../_generated/server";
import { api, components, internal } from "../_generated/api";
import { RateLimiter } from "@convex-dev/rate-limiter";
import axios from "axios";
import { generateDefaultDescription } from "./businessDescriptions";
import { convexEnv } from "./env";

const MINUTE = 60 * 1000; // 1 minute in milliseconds

const rateLimiter = new RateLimiter(components.rateLimiter, {
  previewScrape: { kind: "fixed window", rate: 3, period: MINUTE },
  businessCreation: { kind: "fixed window", rate: 5, period: MINUTE }, // Limit unauthenticated business creation
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

    // Apply rate limiting for all unauthenticated requests
    // Use different limits for preview vs full creation
    // Parse IP address properly to prevent spoofing
    const xff = request.headers.get("x-forwarded-for") || "";
    const cfIp = request.headers.get("cf-connecting-ip") || "";
    const identifier = xff.split(",")[0]?.trim() || cfIp || "anonymous";
    const rateLimitKey = preview ? "previewScrape" : "businessCreation";
    const status = await rateLimiter.limit(ctx, rateLimitKey, {
      key: identifier,
    });

    if (!status.ok) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again in a minute.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
            Vary: "origin",
          },
        },
      );
    }

    if (!url || !url.includes("google.com/maps")) {
      return new Response(
        JSON.stringify({
          error: "Invalid URL. Please provide a Google Maps URL.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
            Vary: "origin",
          },
        },
      );
    }

    // Extract business name from URL
    const nameMatch = url.match(/place\/([^/@]+)/);
    let businessName = nameMatch
      ? decodeURIComponent(nameMatch[1].replace(/\+/g, " "))
      : null;

    // Try alternative pattern for complex URLs
    if (!businessName) {
      const complexMatch = url.match(/maps\/place\/([^/@?]+)/);
      if (complexMatch) {
        businessName = decodeURIComponent(complexMatch[1].replace(/\+/g, " "));
      }
    }

    if (!businessName) {
      return new Response(
        JSON.stringify({ error: "Could not extract business name from URL." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
            Vary: "origin",
          },
        },
      );
    }

    // Use Google Places API to search for the business
    const apiKey = convexEnv.GOOGLE_MAPS_API_KEY;
    const findPlaceResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`,
    );

    if (
      !findPlaceResponse.data.candidates ||
      findPlaceResponse.data.candidates.length === 0
    ) {
      return new Response(
        JSON.stringify({ error: "Business not found in Google Places API." }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
            Vary: "origin",
          },
        },
      );
    }

    const placeId = findPlaceResponse.data.candidates[0].place_id;

    // Get detailed information using the place_id
    const fields = [
      "name",
      "formatted_address",
      "formatted_phone_number",
      "website",
      "opening_hours",
      "rating",
      "reviews",
      "photos",
      "editorial_summary",
      "types",
    ].join(",");

    const detailsResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`,
    );

    const place = detailsResponse.data.result;

    // Format the data - limit to first 5 photos to control API costs
    const MAX_PHOTOS = 5;
    // TODO: Return only photo references instead of full URLs with API keys
    // This would require frontend updates to use a browser-restricted key or proxy endpoint
    const photos = (place.photos ?? [])
      .slice(0, MAX_PHOTOS)
      .map(
        (photo: GooglePlacePhoto) =>
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`,
      );

    const businessData = {
      name: place.name || "",
      address: place.formatted_address || "",
      phone: place.formatted_phone_number || "",
      website: place.website || "",
      hours: place.opening_hours?.weekday_text || [],
      rating: place.rating || null,
      reviews:
        place.reviews?.map((review: GooglePlaceReview) => ({
          reviewer: review.author_name,
          rating: Number(review.rating) || 0,
          text: review.text,
        })) || [],
      photos: photos,
      description:
        place.editorial_summary?.overview ||
        generateDefaultDescription(place.name, place.types?.[0]),
      placeId: placeId,
    };
    
    // Keep the full data for response (including category for frontend use)
    const fullBusinessData = {
      ...businessData,
      category: place.types?.[0] || undefined,
    };

    // AI content generation removed - will be a premium feature

    // Always create the business (without auth requirement)
    let businessId = null;
    let domainId = null;
    
    try {
      // Create business without authentication (internal mutation)
      // Include category from Google Places types for better categorization
      const result = await ctx.runMutation(
        internal.businesses.createBusinessWithoutAuth,
        {
          businessData: {
            ...businessData,
            category: place.types?.[0] || undefined,
          },
        },
      );
      
      businessId = result.businessId;
    } catch (error) {
      console.error("Error creating business:", error);
    }

    const ok = businessId !== null;
    return new Response(
      JSON.stringify({
        success: ok,
        data: fullBusinessData, // Return full data for frontend
        businessId,
        domainId,
        preview: false, // Always create business now
        hasAIContent: false,
      }),
      {
        status: ok ? 200 : 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN,
          Vary: "origin",
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch business data from Google Places API.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN || "*",
          Vary: "origin",
        },
      },
    );
  }
});
