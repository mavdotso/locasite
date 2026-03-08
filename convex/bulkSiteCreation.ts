import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { convexEnv } from "./lib/env";

// Create a site for a single business (domain + pages + theme + claim token)
export const createSiteForBusiness = internalAction({
  args: {
    businessId: v.id("businesses"),
    generateAI: v.optional(v.boolean()),
    siteJobId: v.optional(v.id("siteCreationJobs")),
  },
  handler: async (ctx, args): Promise<{ businessId: string; domainId?: string; claimToken?: string; skipped: boolean }> => {
    const business = await ctx.runQuery(
      internal.businesses.internal_getBusinessById,
      { id: args.businessId },
    );
    if (!business) throw new Error("Business not found");

    // Skip if already has a domain (site already created)
    if (business.domainId) {
      if (args.siteJobId) {
        await ctx.runMutation(internal.bulkSiteCreation.updateSiteJobProgress, {
          jobId: args.siteJobId,
          sitesSkipped: 1,
        });
      }
      return { businessId: args.businessId, skipped: true };
    }

    try {
      // 1. Generate subdomain
      const { domainId } = await ctx.runMutation(
        internal.domains.internal_generateSubdomain,
        { businessId: args.businessId },
      );

      // 2. Create default pages
      await ctx.runMutation(
        internal.pagesSimple.internal_createDefaultPagesSimple,
        { domainId, businessId: args.businessId },
      );

      // 3. Assign theme based on category
      await ctx.runMutation(internal.themes.internal_assignTheme, {
        businessId: args.businessId,
        category: business.category,
      });

      // 4. Schedule image upload if photos exist
      if (business.photos && business.photos.length > 0) {
        await ctx.scheduler.runAfter(
          0,
          internal.bulkSiteCreation.scheduleImageUpload,
          {
            businessId: args.businessId,
            imageUrls: business.photos,
          },
        );
      }

      // 5. Generate claim token
      const claimToken = crypto.randomUUID();
      await ctx.runMutation(internal.bulkSiteCreation.setClaimToken, {
        businessId: args.businessId,
        claimToken,
      });

      // Update job progress
      if (args.siteJobId) {
        await ctx.runMutation(internal.bulkSiteCreation.updateSiteJobProgress, {
          jobId: args.siteJobId,
          sitesCreated: 1,
        });
      }

      return { businessId: args.businessId, domainId, claimToken, skipped: false };
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (args.siteJobId) {
        await ctx.runMutation(internal.bulkSiteCreation.updateSiteJobProgress, {
          jobId: args.siteJobId,
          sitesFailed: 1,
          error: `${business.name}: ${errMsg}`,
        });
      }
      throw err;
    }
  },
});

// Batch create sites for multiple businesses
export const bulkCreateSites = internalAction({
  args: {
    businessIds: v.array(v.id("businesses")),
    generateAI: v.optional(v.boolean()),
    scrapeJobId: v.optional(v.id("scrapeJobs")),
  },
  handler: async (ctx, args): Promise<{ siteJobId: string; totalQueued: number }> => {
    // Create site creation job
    const siteJobId = await ctx.runMutation(
      internal.bulkSiteCreation.createSiteJob,
      {
        scrapeJobId: args.scrapeJobId,
        totalBusinesses: args.businessIds.length,
        generateAI: args.generateAI ?? false,
      },
    );

    // Schedule each site creation with staggered delays (2s apart)
    for (let i = 0; i < args.businessIds.length; i++) {
      await ctx.scheduler.runAfter(
        i * 2000,
        internal.bulkSiteCreation.createSiteForBusiness,
        {
          businessId: args.businessIds[i],
          generateAI: args.generateAI,
          siteJobId,
        },
      );
    }

    return { siteJobId, totalQueued: args.businessIds.length };
  },
});

// Set claim token on a business
export const setClaimToken = internalMutation({
  args: {
    businessId: v.id("businesses"),
    claimToken: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.businessId, {
      claimToken: args.claimToken,
      claimTokenCreatedAt: Date.now(),
    });
  },
});

// Schedule image upload (wraps the existing uploadGoogleMapsImages)
export const scheduleImageUpload = internalAction({
  args: {
    businessId: v.id("businesses"),
    imageUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // Use the existing image upload action
    try {
      await ctx.scheduler.runAfter(
        0,
        api.uploadBusinessImages.uploadGoogleMapsImages,
        {
          businessId: args.businessId,
          imageUrls: args.imageUrls,
        },
      );
    } catch {
      // Image upload is non-critical, don't fail site creation
      console.error(`Image upload scheduling failed for ${args.businessId}`);
    }
  },
});

// Site creation job CRUD
export const createSiteJob = internalMutation({
  args: {
    scrapeJobId: v.optional(v.id("scrapeJobs")),
    totalBusinesses: v.number(),
    generateAI: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("siteCreationJobs", {
      scrapeJobId: args.scrapeJobId,
      status: "running",
      totalBusinesses: args.totalBusinesses,
      sitesCreated: 0,
      sitesSkipped: 0,
      sitesFailed: 0,
      generateAI: args.generateAI,
      errors: [],
      startedAt: Date.now(),
    });
  },
});

export const updateSiteJobProgress = internalMutation({
  args: {
    jobId: v.id("siteCreationJobs"),
    sitesCreated: v.optional(v.number()),
    sitesSkipped: v.optional(v.number()),
    sitesFailed: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) return;

    const updates: Record<string, unknown> = {};
    if (args.sitesCreated)
      updates.sitesCreated = job.sitesCreated + args.sitesCreated;
    if (args.sitesSkipped)
      updates.sitesSkipped = job.sitesSkipped + args.sitesSkipped;
    if (args.sitesFailed)
      updates.sitesFailed = job.sitesFailed + args.sitesFailed;
    if (args.error) updates.errors = [...job.errors, args.error];

    // Auto-complete when all businesses processed
    const totalProcessed =
      (updates.sitesCreated as number ?? job.sitesCreated) +
      (updates.sitesSkipped as number ?? job.sitesSkipped) +
      (updates.sitesFailed as number ?? job.sitesFailed);

    if (totalProcessed >= job.totalBusinesses) {
      updates.status = "completed";
      updates.completedAt = Date.now();
    }

    await ctx.db.patch(args.jobId, updates);
  },
});

export const getSiteJob = internalQuery({
  args: { jobId: v.id("siteCreationJobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

// Export claim links for outreach — CSV-ready data
export const exportClaimLinks = internalQuery({
  args: {
    batchId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const rootDomain = convexEnv.NEXT_PUBLIC_ROOT_DOMAIN;
    const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;

    let businesses;
    if (args.batchId) {
      businesses = await ctx.db
        .query("businesses")
        .withIndex("by_batchId", (q) => q.eq("batchId", args.batchId))
        .take(args.limit || 500);
    } else {
      // Get all unclaimed businesses with claim tokens
      businesses = await ctx.db
        .query("businesses")
        .filter((q) =>
          q.and(
            q.neq(q.field("claimToken"), undefined),
            q.eq(q.field("userId"), undefined),
          ),
        )
        .take(args.limit || 500);
    }

    return businesses.map((b) => {
      // Get subdomain for preview URL
      const claimUrl = `${appUrl}/claim/${b.claimToken}`;
      return {
        businessName: b.name,
        address: b.address,
        phone: b.phone || "",
        category: b.category || "",
        rating: b.rating || 0,
        reviewCount: b.reviewCount || b.reviews?.length || 0,
        claimUrl,
        domainId: b.domainId,
      };
    });
  },
});

// Get unclaimed businesses without sites (for creating sites after scraping)
export const getUnclaimedBusinessesWithoutSites = internalQuery({
  args: {
    batchId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("businesses");

    if (args.batchId) {
      const businesses = await query
        .withIndex("by_batchId", (q) => q.eq("batchId", args.batchId))
        .filter((q) =>
          q.and(
            q.eq(q.field("userId"), undefined),
            q.eq(q.field("domainId"), undefined),
          ),
        )
        .take(args.limit || 500);
      return businesses.map((b) => b._id);
    }

    const businesses = await query
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), undefined),
          q.eq(q.field("domainId"), undefined),
        ),
      )
      .take(args.limit || 500);
    return businesses.map((b) => b._id);
  },
});
