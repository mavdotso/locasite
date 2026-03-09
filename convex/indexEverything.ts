import { v } from "convex/values";
import { internalAction, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

// Check if all scrape jobs are finished
export const areJobsComplete = internalQuery({
  args: { jobIds: v.array(v.id("scrapeJobs")) },
  handler: async (ctx, args): Promise<boolean> => {
    for (const jobId of args.jobIds) {
      const job = await ctx.db.get(jobId);
      if (!job) continue;
      if (job.status !== "completed" && job.status !== "failed") return false;
    }
    return true;
  },
});

// Get unpublished businesses that have a domain but no claim token
export const getUnpublishedWithDomain = internalQuery({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", false))
      .filter((q) => q.neq(q.field("domainId"), undefined))
      .take(args.limit ?? 500);
    return businesses.map((b) => b._id);
  },
});

interface PipelineResult {
  jobIds: string[];
  totalScraped: number;
  totalPublished: number;
  message: string;
}

// Count published businesses (paginated to avoid byte limits)
export const countPublished = internalQuery({
  args: {},
  handler: async (ctx) => {
    let count = 0;
    let cursor = null;
    let done = false;
    while (!done) {
      const page = await ctx.db
        .query("businesses")
        .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
        .paginate({ numItems: 100, cursor: cursor ?? null });
      count += page.page.length;
      if (page.isDone || page.page.length === 0) {
        done = true;
      } else {
        cursor = page.continueCursor;
      }
    }
    return { count };
  },
});

// End-to-end pipeline: scrape → wait → publish
// Note: createBusinessWithoutAuth already creates domains, pages, and themes.
// This pipeline just needs to scrape + publish (add claim tokens).
export const runPipeline = internalAction({
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
  handler: async (ctx, args): Promise<PipelineResult> => {
    // Step 1: Start bulk scraping (creates businesses with domains+pages+themes)
    const scrapeResult = await ctx.runAction(internal.bulkScraper.startBulkScrape, {
      targets: args.targets,
      minRating: args.minRating,
      minReviews: args.minReviews,
    }) as { jobIds: string[]; totalTargets: number };

    const typedJobIds = scrapeResult.jobIds as Id<"scrapeJobs">[];

    // Step 2: Poll until all scrape jobs are done (check every 30s, max 30min)
    const maxWait = 30 * 60 * 1000;
    const pollInterval = 30 * 1000;
    const start = Date.now();

    while (Date.now() - start < maxWait) {
      const complete = await ctx.runQuery(internal.indexEverything.areJobsComplete, {
        jobIds: typedJobIds,
      });
      if (complete) break;
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    // Step 3: Publish all unpublished businesses that have domains
    let totalPublished = 0;
    const unpublishedIds = await ctx.runQuery(
      internal.indexEverything.getUnpublishedWithDomain,
      { limit: 500 },
    ) as Id<"businesses">[];

    for (const bizId of unpublishedIds) {
      const claimToken = crypto.randomUUID();
      await ctx.runMutation(internal.bulkSiteCreation.setClaimTokenAndPublish, {
        businessId: bizId,
        claimToken,
      });
      totalPublished++;
    }

    // Step 4: Get final scrape stats
    let totalCreated = 0;
    for (const jobId of typedJobIds) {
      const job = await ctx.runQuery(internal.scrapeJobs.getJob, { jobId });
      if (job) totalCreated += job.totalCreated;
    }

    return {
      jobIds: scrapeResult.jobIds,
      totalScraped: totalCreated,
      totalPublished,
      message: `Pipeline complete: ${totalCreated} businesses scraped, ${totalPublished} published with claim tokens.`,
    };
  },
});
