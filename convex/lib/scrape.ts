import { RateLimiter } from "@convex-dev/rate-limiter";
import axios from "axios";
import { api, components, internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import { generateDefaultDescription } from "./businessDescriptions";
import { convexEnv } from "./env";
import { logger } from "./logger";

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
	let requestUrl: string | undefined;
	let requestPreview: boolean = false;

	try {
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: {
					"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
					"Access-Control-Allow-Methods": "POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
					Vary: "Origin",
				},
			});
		}
		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
				status: 405,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
					"Access-Control-Allow-Methods": "POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization",
					Allow: "POST, OPTIONS",
					Vary: "Origin",
				},
			});
		}
		const ct = request.headers.get("content-type") || "";
		if (!ct.includes("application/json")) {
			return new Response(
				JSON.stringify({
					error: "Unsupported Media Type. Use application/json.",
				}),
				{
					status: 415,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
						Vary: "Origin",
					},
				},
			);
		}

		const { url, preview = false } = await request.json();
		requestUrl = url;
		requestPreview = preview;

		// Apply rate limiting for all unauthenticated requests
		// Use different limits for preview vs full creation
		// Parse IP address properly to prevent spoofing
		const xff = request.headers.get("x-forwarded-for") || "";
		const cfIp = request.headers.get("cf-connecting-ip") || "";
		const identifier = xff.split(",")[0]?.trim() || cfIp || "anonymous";
		const rateLimitKey = requestPreview ? "previewScrape" : "businessCreation";
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
						"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
						Vary: "Origin",
					},
				},
			);
		}

		if (!requestUrl || !requestUrl.includes("google.com/maps")) {
			return new Response(
				JSON.stringify({
					error: "Invalid URL. Please provide a Google Maps URL.",
				}),
				{
					status: 400,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
						Vary: "Origin",
					},
				},
			);
		}

		// Extract business name from URL
		const nameMatch = requestUrl.match(/place\/([^/@]+)/);
		let businessName = nameMatch
			? decodeURIComponent(nameMatch[1].replace(/\+/g, " "))
			: null;

		// Try alternative pattern for complex URLs
		if (!businessName) {
			const complexMatch = requestUrl.match(/maps\/place\/([^/@?]+)/);
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
						"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
						Vary: "Origin",
					},
				},
			);
		}

		// Use Google Places API to search for the business
		const apiKey = convexEnv.GOOGLE_MAPS_API_KEY;
		const findPlaceResponse = await axios.get(
			`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`,
			{ timeout: 10000 },
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
						"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
						Vary: "Origin",
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
			{ timeout: 10000 },
		);

		const statusText = detailsResponse.data.status;
		if (statusText !== "OK" || !detailsResponse.data.result) {
			return new Response(
				JSON.stringify({
					error: "Failed to retrieve place details from Google Places API.",
					status: statusText,
				}),
				{
					status:
						statusText === "NOT_FOUND" || statusText === "ZERO_RESULTS"
							? 404
							: 502,
					headers: {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
						Vary: "Origin",
					},
				},
			);
		}
		const place = detailsResponse.data.result;

		const MAX_PHOTOS = 25;
		// Return only photo references to avoid exposing API key
		// Frontend should use a browser-restricted key or proxy endpoint
		const photoReferences = (place.photos ?? [])
			.slice(0, MAX_PHOTOS)
			.map((photo: GooglePlacePhoto) => photo.photo_reference);

		// Convert photo references to absolute proxy URLs to avoid origin ambiguity
		const baseUrl = new URL("/api/photos", convexEnv.NEXT_PUBLIC_APP_URL);
		const photos = photoReferences.map((ref: string) => {
			const u = new URL(baseUrl.toString());
			u.searchParams.set("ref", ref);
			u.searchParams.set("width", "800");
			return u.toString();
		});

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
					rating: `${review.rating} stars`,
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

		if (!requestPreview) {
			try {
				// Create business without authentication (internal mutation)
				const result = await ctx.runMutation(
					internal.businesses.createBusinessWithoutAuth,
					{
						businessData,
					},
				);

				businessId = result.businessId;
				domainId = result.domainId;
			} catch (error) {
				logger.error("Error creating business from Google Maps", error, {
					metadata: {
						placeId,
						businessName: place.name,
						preview: requestPreview,
						identifier,
						category: place.types?.[0],
					},
				});
			}
		} else {
			logger.info("Business creation skipped for preview request", {
				metadata: {
					placeId,
					businessName: place.name,
					preview: requestPreview,
					identifier,
				},
			});
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
					"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
					Vary: "Origin",
				},
			},
		);
	} catch (error) {
		logger.error("Failed to scrape Google Maps", error, {
			metadata: {
				url: requestUrl || "unknown",
				preview: requestPreview,
				action: "scrapeGoogleMaps",
			},
		});

		return new Response(
			JSON.stringify({
				error: "Failed to fetch business data from Google Places API.",
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": convexEnv.CLIENT_ORIGIN || "*",
					Vary: "Origin",
				},
			},
		);
	}
});
