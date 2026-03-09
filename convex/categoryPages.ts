import {
  query,
  internalQuery,
  internalMutation,
  internalAction,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// --- Slug helpers ---

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// US state abbreviations
const STATE_ABBREVS: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR", california: "CA",
  colorado: "CO", connecticut: "CT", delaware: "DE", florida: "FL", georgia: "GA",
  hawaii: "HI", idaho: "ID", illinois: "IL", indiana: "IN", iowa: "IA",
  kansas: "KS", kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK",
  oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT", vermont: "VT",
  virginia: "VA", washington: "WA", "west virginia": "WV", wisconsin: "WI",
  wyoming: "WY",
};

const VALID_STATE_CODES = new Set(Object.values(STATE_ABBREVS));

function parseAddress(address: string): { city: string; state: string } | null {
  // Format: "123 Main St, City, FL 32789, USA" or "City, State ZIP"
  let parts = address.split(",").map((p) => p.trim());
  if (parts.length < 2) return null;

  // Strip trailing country (e.g., "USA", "United States")
  const last = parts[parts.length - 1].toLowerCase();
  if (last === "usa" || last === "us" || last === "united states") {
    parts = parts.slice(0, -1);
  }
  if (parts.length < 2) return null;

  // State+ZIP is the last part, city is second-to-last
  const stateZipPart = parts[parts.length - 1];
  const cityPart = parts[parts.length - 2];

  // Extract state from "FL 32789" or "Florida" or "FL"
  const stateMatch = stateZipPart.match(
    /^([A-Za-z\s]+?)(?:\s+\d{5}(?:-\d{4})?)?$/
  );
  if (!stateMatch) return null;

  const stateRaw = stateMatch[1].trim();
  let stateCode = stateRaw.toUpperCase();

  // If it's a full state name, convert to abbreviation
  if (stateCode.length > 2) {
    stateCode = STATE_ABBREVS[stateRaw.toLowerCase()] || "";
  }

  if (!VALID_STATE_CODES.has(stateCode) || !cityPart) return null;

  return {
    city: cityPart.trim(),
    state: stateCode,
  };
}

// --- Public queries (used by Next.js pages) ---

export const listByCityCategory = query({
  args: {
    city: v.string(),
    categorySlug: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 24;

    const results = await ctx.db
      .query("businesses")
      .withIndex("by_city_category", (q) =>
        q.eq("city", args.city).eq("categorySlug", args.categorySlug)
      )
      .paginate({ numItems: limit, cursor: args.cursor ?? null });

    // Filter to only published businesses
    const businesses = results.page.filter((b) => b.isPublished !== false);

    return {
      businesses: businesses.map((b) => ({
        _id: b._id,
        name: b.name,
        address: b.address,
        phone: b.phone,
        rating: b.rating,
        reviewCount: b.reviewCount,
        category: b.category,
        photos: b.photos.slice(0, 1),
        city: b.city,
        cityDisplay: b.cityDisplay,
        state: b.state,
        categorySlug: b.categorySlug,
        domainId: b.domainId,
      })),
      continueCursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});

export const getCategoriesForCity = query({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    // Use .take() with a reasonable limit for a single city
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .take(5000);

    const categoryMap = new Map<
      string,
      { categorySlug: string; categoryDisplay: string; count: number }
    >();

    for (const b of businesses) {
      if (!b.categorySlug || b.isPublished === false) continue;
      const existing = categoryMap.get(b.categorySlug);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(b.categorySlug, {
          categorySlug: b.categorySlug,
          categoryDisplay: b.category || b.categorySlug,
          count: 1,
        });
      }
    }

    return Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);
  },
});

export const getCityInfo = query({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    const first = await ctx.db
      .query("businesses")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .first();

    if (!first) return null;

    return {
      city: first.city!,
      cityDisplay: first.cityDisplay!,
      state: first.state!,
    };
  },
});

// Batch lookup subdomains for multiple businesses
export const getSubdomainsForBusinesses = query({
  args: { domainIds: v.array(v.id("domains")) },
  handler: async (ctx, args) => {
    const result: Record<string, string> = {};
    for (const domainId of args.domainIds) {
      const domain = await ctx.db.get(domainId);
      if (domain?.subdomain) {
        result[domainId] = domain.subdomain;
      }
    }
    return result;
  },
});

// --- Internal queries (used by sitemap httpAction via pagination loop) ---

export const getCityCategoryPage = internalQuery({
  args: {
    cursor: v.optional(v.string()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageSize = args.pageSize ?? 500;

    const results = await ctx.db
      .query("businesses")
      .withIndex("by_city_category")
      .paginate({ numItems: pageSize, cursor: args.cursor ?? null });

    // Extract only the fields we need for sitemap (city, categorySlug)
    const entries: { city: string; categorySlug: string }[] = [];
    for (const b of results.page) {
      if (b.city && b.categorySlug && b.isPublished !== false) {
        entries.push({ city: b.city, categorySlug: b.categorySlug });
      }
    }

    return {
      entries,
      cursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});

// --- Backfill migration ---

export const backfillCityCategoryBatch = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize ?? 100;

    const results = await ctx.db
      .query("businesses")
      .paginate({ numItems: batchSize, cursor: args.cursor ?? null });

    let updated = 0;
    for (const business of results.page) {
      // Skip if already backfilled
      if (business.city && business.categorySlug) continue;

      const updates: Record<string, string> = {};

      // Parse city/state from address
      if (!business.city && business.address) {
        const parsed = parseAddress(business.address);
        if (parsed) {
          updates.city = toSlug(parsed.city);
          updates.cityDisplay = parsed.city;
          updates.state = parsed.state;
        }
      }

      // Normalize category to slug
      if (!business.categorySlug && business.category) {
        updates.categorySlug = normalizeCategorySlug(toSlug(business.category));
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(business._id, updates);
        updated++;
      }
    }

    return {
      updated,
      processed: results.page.length,
      continueCursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});

export const runBackfillCityCategory = internalAction({
  handler: async (ctx) => {
    let cursor: string | undefined = undefined;
    let totalUpdated = 0;
    let totalProcessed = 0;

    let isDone = false;
    while (!isDone) {
      const result: {
        updated: number;
        processed: number;
        continueCursor: string;
        isDone: boolean;
      } = await ctx.runMutation(
        internal.categoryPages.backfillCityCategoryBatch,
        { cursor, batchSize: 100 }
      );

      totalUpdated += result.updated;
      totalProcessed += result.processed;

      if (result.isDone) {
        isDone = true;
      } else {
        cursor = result.continueCursor;
      }
    }

    console.log(
      `Backfill complete: ${totalUpdated} updated out of ${totalProcessed} processed`
    );
  },
});

// Normalize subcategories to broad parent slugs (Phase 1 SEO strategy, MAV-865)
const CATEGORY_NORMALIZATION_MAP: Record<string, string> = {
  "italian-restaurant": "restaurants",
  "mexican-restaurant": "restaurants",
  "chinese-restaurant": "restaurants",
  "japanese-restaurant": "restaurants",
  "thai-restaurant": "restaurants",
  "indian-restaurant": "restaurants",
  "american-restaurant": "restaurants",
  "fast-food-restaurant": "restaurants",
  "seafood-restaurant": "restaurants",
  "pizza-restaurant": "restaurants",
  "sandwich-shop": "restaurants",
  "burger-restaurant": "restaurants",
  "bbq-restaurant": "restaurants",
  "breakfast-restaurant": "restaurants",
  cafe: "coffee-shops",
  "coffee-shop": "coffee-shops",
  bakery: "coffee-shops",
  "donut-shop": "coffee-shops",
  "beauty-salon": "hair-salons",
  "hair-salon": "hair-salons",
  "barber-shop": "hair-salons",
  barbershop: "hair-salons",
  "nail-salon": "nail-salons",
  spa: "nail-salons",
  "waxing-salon": "nail-salons",
  "eyebrow-threading": "nail-salons",
  "car-repair": "auto-repair",
  "auto-repair-shop": "auto-repair",
  "tire-shop": "auto-repair",
  "oil-change-service": "auto-repair",
  "auto-body-shop": "auto-repair",
  "transmission-shop": "auto-repair",
  "brake-shop": "auto-repair",
  "car-dealer": "auto-repair",
  lawyer: "lawyers",
  attorney: "lawyers",
  "law-firm": "lawyers",
  "divorce-lawyer": "lawyers",
  "personal-injury-lawyer": "lawyers",
  "immigration-lawyer": "lawyers",
  "criminal-defense-lawyer": "lawyers",
  dentist: "dentists",
  "dental-clinic": "dentists",
  orthodontist: "dentists",
  "cosmetic-dentist": "dentists",
  doctor: "doctors",
  "medical-clinic": "doctors",
  "urgent-care-facility": "doctors",
  pediatrician: "doctors",
  plumber: "plumbers",
  "plumbing-supply-store": "plumbers",
  "hvac-contractor": "hvac",
  "air-conditioning": "hvac",
  "heating-contractor": "hvac",
  electrician: "electricians",
  "electrical-contractor": "electricians",
  "house-cleaning-service": "cleaning-services",
  "cleaning-service": "cleaning-services",
  "janitorial-service": "cleaning-services",
  "maid-service": "cleaning-services",
  landscaping: "landscapers",
  "landscaping-company": "landscapers",
  "lawn-care-service": "landscapers",
  gym: "gyms",
  "fitness-center": "gyms",
  "yoga-studio": "gyms",
  "pilates-studio": "gyms",
  "crossfit-gym": "gyms",
  "boxing-gym": "gyms",
  "personal-trainer": "gyms",
};

function normalizeCategorySlug(slug: string): string {
  return CATEGORY_NORMALIZATION_MAP[slug] ?? slug;
}

// Generic categories from Google Maps that should be replaced with scrape job category
const GENERIC_CATEGORIES = new Set([
  "establishment",
  "point-of-interest",
  "point_of_interest",
  "food",
  "store",
  "health",
  "finance",
  "general-contractor",
  "general_contractor",
  "local-service",
]);

// Fix businesses with generic "establishment" categories by using scrape job category
export const fixEstablishmentCategoriesBatch = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    batchSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const batchSize = args.batchSize ?? 100;

    const results = await ctx.db
      .query("businesses")
      .paginate({ numItems: batchSize, cursor: args.cursor ?? null });

    // Build a cache of scrape job categories by ID
    const jobCache = new Map<string, string>();

    let updated = 0;
    for (const business of results.page) {
      const needsCategoryFix =
        !business.categorySlug ||
        GENERIC_CATEGORIES.has(business.categorySlug);

      const needsCityFix = !business.city && business.address;

      if (!needsCategoryFix && !needsCityFix) continue;

      const updates: Record<string, string> = {};

      // Fix city if missing
      if (needsCityFix && business.address) {
        const parsed = parseAddress(business.address);
        if (parsed) {
          updates.city = toSlug(parsed.city);
          updates.cityDisplay = parsed.city;
          updates.state = parsed.state;
        }
      }

      // Fix category from scrape job
      if (needsCategoryFix && business.batchId) {
        let jobCategory = jobCache.get(business.batchId);
        if (jobCategory === undefined) {
          // batchId stores the scrapeJob document ID as a string
          const job = await ctx.db.get(
            business.batchId as unknown as import("./_generated/dataModel").Id<"scrapeJobs">
          );
          jobCategory = job?.category ?? "";
          jobCache.set(business.batchId, jobCategory as string);
        }
        if (jobCategory) {
          updates.categorySlug = normalizeCategorySlug(toSlug(jobCategory));
          // Also fix the category display field
          updates.category = jobCategory;
        }
      }

      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(business._id, updates);
        updated++;
      }
    }

    return {
      updated,
      processed: results.page.length,
      continueCursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});

export const runFixEstablishmentCategories = internalAction({
  handler: async (ctx) => {
    let cursor: string | undefined = undefined;
    let totalUpdated = 0;
    let totalProcessed = 0;

    let isDone = false;
    while (!isDone) {
      const result: {
        updated: number;
        processed: number;
        continueCursor: string;
        isDone: boolean;
      } = await ctx.runMutation(
        internal.categoryPages.fixEstablishmentCategoriesBatch,
        { cursor, batchSize: 100 }
      );

      totalUpdated += result.updated;
      totalProcessed += result.processed;

      if (result.isDone) {
        isDone = true;
      } else {
        cursor = result.continueCursor;
      }
    }

    console.log(
      `Fix categories complete: ${totalUpdated} updated out of ${totalProcessed} processed`
    );
  },
});
