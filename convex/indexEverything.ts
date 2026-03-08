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

interface PipelineResult {
  jobIds: string[];
  siteJobId?: string;
  totalScraped: number;
  totalSitesQueued: number;
  message: string;
}

// End-to-end pipeline: scrape → wait → create sites
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
    // Step 1: Start bulk scraping
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

    // Step 3: Get unclaimed businesses without sites
    const businessIds = await ctx.runQuery(
      internal.bulkSiteCreation.getUnclaimedBusinessesWithoutSites,
      { limit: 500 },
    ) as Id<"businesses">[];

    if (businessIds.length === 0) {
      return {
        jobIds: scrapeResult.jobIds,
        totalScraped: scrapeResult.jobIds.length,
        totalSitesQueued: 0,
        message: "Scraping complete but no new businesses to create sites for.",
      };
    }

    // Step 4: Bulk create sites (includes auto-publish)
    const siteResult = await ctx.runAction(
      internal.bulkSiteCreation.bulkCreateSites,
      { businessIds },
    ) as { siteJobId: string; totalQueued: number };

    return {
      jobIds: scrapeResult.jobIds,
      siteJobId: siteResult.siteJobId,
      totalScraped: scrapeResult.jobIds.length,
      totalSitesQueued: siteResult.totalQueued,
      message: `Pipeline started: ${scrapeResult.jobIds.length} scrape jobs, ${siteResult.totalQueued} sites queued for creation.`,
    };
  },
});
