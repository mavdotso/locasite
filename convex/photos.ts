import { httpAction } from "./_generated/server";
import { convexEnv } from "./lib/env";
import { logger } from "./lib/logger";

// Constants for photo fetching
const MAX_WIDTH = 800;
const GOOGLE_PHOTOS_BASE_URL = "https://maps.googleapis.com/maps/api/place/photo";

/**
 * Proxy endpoint for fetching Google Places photos
 * This keeps the API key server-side and prevents exposure
 */
export const getPhoto = httpAction(async (ctx, request) => {
  const url = new URL(request.url);
  const photoReference = url.searchParams.get("ref");
  const width = url.searchParams.get("width") || MAX_WIDTH.toString();
  
  if (!photoReference) {
    return new Response("Photo reference required", { status: 400 });
  }
  
  // Validate width is a number and within reasonable bounds
  const parsedWidth = parseInt(width);
  if (isNaN(parsedWidth) || parsedWidth < 1 || parsedWidth > 2000) {
    return new Response("Invalid width parameter", { status: 400 });
  }
  
  const apiKey = convexEnv.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return new Response("Photo service unavailable", { status: 503 });
  }
  
  try {
    // Fetch the photo from Google Places API
    const photoUrl = `${GOOGLE_PHOTOS_BASE_URL}?maxwidth=${parsedWidth}&photoreference=${photoReference}&key=${apiKey}`;
    const response = await fetch(photoUrl);
    
    if (!response.ok) {
      return new Response("Failed to fetch photo", { status: response.status });
    }
    
    // Forward the image with appropriate headers
    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });
  } catch (error) {
    logger.error("Error fetching photo from Google Places API", error, {
      metadata: { photoReference, width: parsedWidth }
    });
    return new Response("Failed to fetch photo", { status: 500 });
  }
});