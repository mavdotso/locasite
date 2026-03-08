import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { convexEnv } from "./lib/env";
import { generateDefaultDescription } from "./lib/businessDescriptions";
import axios from "axios";

interface TextSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  photos?: Array<{ photo_reference: string; height: number; width: number }>;
  geometry?: { location: { lat: number; lng: number } };
}

interface PlaceDetailsResult {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text?: string[] };
  rating?: number;
  user_ratings_total?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
  }>;
  photos?: Array<{ photo_reference: string; height: number; width: number }>;
  editorial_summary?: { overview: string };
  types?: string[];
}

// Filter logic: returns true if business qualifies for site creation
function passesFilter(
  result: TextSearchResult,
  website: string | undefined,
  minRating: number,
  minReviews: number,
): boolean {
  // Must have no website
  if (website && website.trim().length > 0) return false;
  // Must meet rating threshold
  if (result.rating !== undefined && result.rating < minRating) return false;
  // Must meet review count threshold
  if (
    result.user_ratings_total !== undefined &&
    result.user_ratings_total < minReviews
  )
    return false;
  return true;
}

// Delay helper (Google requires ~2s between page token requests)
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Scrape businesses for a single city+category combo
export const bulkScrapeByQuery = internalAction({
  args: {
    city: v.string(),
    state: v.string(),
    category: v.string(),
    minRating: v.optional(v.number()),
    minReviews: v.optional(v.number()),
    jobId: v.optional(v.id("scrapeJobs")),
  },
  handler: async (ctx, args): Promise<{ jobId: string; totalFound: number; totalFiltered: number; totalCreated: number; totalSkipped: number }> => {
    const apiKey = convexEnv.GOOGLE_MAPS_API_KEY;
    const minRating = args.minRating ?? 3.5;
    const minReviews = args.minReviews ?? 10;
    const queryString = `${args.category} in ${args.city}, ${args.state}`;

    // Create or use existing job
    const jobId =
      args.jobId ??
      (await ctx.runMutation(internal.scrapeJobs.createJob, {
        query: queryString,
        city: args.city,
        state: args.state,
        category: args.category,
        minRating,
        minReviews,
      }));

    await ctx.runMutation(internal.scrapeJobs.updateProgress, {
      jobId,
      status: "running",
    });

    let totalFound = 0;
    let totalFiltered = 0;
    let totalCreated = 0;
    let totalSkipped = 0;

    try {
      // Step 1: Text Search API — get up to 60 results (3 pages)
      const allResults: TextSearchResult[] = [];
      let nextPageToken: string | undefined;

      for (let page = 0; page < 3; page++) {
        const params: Record<string, string> = {
          query: queryString,
          key: apiKey,
        };
        if (nextPageToken) {
          params.pagetoken = nextPageToken;
        }

        const searchResponse = await axios.get(
          "https://maps.googleapis.com/maps/api/place/textsearch/json",
          { params },
        );

        const results: TextSearchResult[] =
          searchResponse.data.results || [];
        allResults.push(...results);

        nextPageToken = searchResponse.data.next_page_token;
        if (!nextPageToken) break;

        // Google requires ~2s delay before using next_page_token
        await delay(2000);
      }

      totalFound = allResults.length;
      await ctx.runMutation(internal.scrapeJobs.updateProgress, {
        jobId,
        totalFound,
      });

      // Step 2: For each result, check website via Place Details (basic fields only)
      for (const result of allResults) {
        try {
          // Lightweight Place Details call — just website field
          const detailsResponse = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: result.place_id,
                fields: "website",
                key: apiKey,
              },
            },
          );

          const website = detailsResponse.data.result?.website;

          if (!passesFilter(result, website, minRating, minReviews)) {
            continue;
          }

          totalFiltered++;

          // Step 3: Full Place Details for qualified businesses
          const fullDetailsResponse = await axios.get(
            "https://maps.googleapis.com/maps/api/place/details/json",
            {
              params: {
                place_id: result.place_id,
                fields:
                  "name,formatted_address,formatted_phone_number,opening_hours,rating,user_ratings_total,reviews,photos,editorial_summary,types",
                key: apiKey,
              },
            },
          );

          const place: PlaceDetailsResult =
            fullDetailsResponse.data.result;
          if (!place) continue;

          // Format photos (limit to 5)
          const MAX_PHOTOS = 5;
          const photos = (place.photos ?? [])
            .slice(0, MAX_PHOTOS)
            .map(
              (photo) =>
                `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`,
            );

          // Format reviews (limit to 5)
          const reviews = (place.reviews ?? []).slice(0, 5).map((r) => ({
            reviewer: r.author_name,
            rating: Number(r.rating) || 0,
            text: r.text,
          }));

          // Create business in DB (idempotent by placeId)
          const createResult = await ctx.runMutation(
            internal.businesses.createBusinessWithoutAuth,
            {
              businessData: {
                name: place.name || result.name,
                placeId: result.place_id,
                address:
                  place.formatted_address || result.formatted_address,
                phone: place.formatted_phone_number || undefined,
                website: undefined, // These businesses have no website
                hours: place.opening_hours?.weekday_text || [],
                rating: place.rating || result.rating,
                reviewCount: place.user_ratings_total || result.user_ratings_total,
                reviews,
                photos,
                description:
                  place.editorial_summary?.overview ||
                  generateDefaultDescription(
                    place.name || result.name,
                    place.types?.[0],
                  ),
                category: place.types?.[0] || args.category,
                batchId: jobId,
              },
            },
          );

          if (createResult.businessId) {
            totalCreated++;
          }
        } catch (err) {
          const errMsg =
            err instanceof Error ? err.message : String(err);
          totalSkipped++;
          await ctx.runMutation(internal.scrapeJobs.updateProgress, {
            jobId,
            error: `Failed for ${result.name}: ${errMsg}`,
          });
        }
      }

      // Update final progress and complete
      await ctx.runMutation(internal.scrapeJobs.updateProgress, {
        jobId,
        totalFound,
        totalFiltered,
        totalCreated,
        totalSkipped,
      });

      await ctx.runMutation(internal.scrapeJobs.completeJob, {
        jobId,
        status: "completed",
      });

      return { jobId, totalFound, totalFiltered, totalCreated, totalSkipped };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      await ctx.runMutation(internal.scrapeJobs.updateProgress, {
        jobId,
        error: `Job failed: ${errMsg}`,
      });
      await ctx.runMutation(internal.scrapeJobs.completeJob, {
        jobId,
        status: "failed",
      });
      throw err;
    }
  },
});

// Orchestrator: run bulk scrapes for multiple city+category combos
export const startBulkScrape = internalAction({
  args: {
    targets: v.array(
      v.object({
        city: v.string(),
        state: v.string(),
        category: v.string(),
      }),
    ),
    minRating: v.optional(v.number()),
    minReviews: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const jobIds: string[] = [];

    for (let i = 0; i < args.targets.length; i++) {
      const target = args.targets[i];

      // Create job record first
      const jobId = await ctx.runMutation(internal.scrapeJobs.createJob, {
        query: `${target.category} in ${target.city}, ${target.state}`,
        city: target.city,
        state: target.state,
        category: target.category,
        minRating: args.minRating,
        minReviews: args.minReviews,
      });

      jobIds.push(jobId);

      // Schedule each scrape with staggered delay (10s apart to avoid rate limits)
      await ctx.scheduler.runAfter(
        i * 10000,
        internal.bulkScraper.bulkScrapeByQuery,
        {
          city: target.city,
          state: target.state,
          category: target.category,
          minRating: args.minRating,
          minReviews: args.minReviews,
          jobId,
        },
      );
    }

    return { jobIds, totalTargets: args.targets.length };
  },
});
