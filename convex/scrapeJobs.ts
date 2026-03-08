import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const createJob = internalMutation({
  args: {
    query: v.string(),
    city: v.string(),
    state: v.string(),
    category: v.string(),
    minRating: v.optional(v.number()),
    minReviews: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("scrapeJobs", {
      query: args.query,
      city: args.city,
      state: args.state,
      category: args.category,
      status: "pending",
      totalFound: 0,
      totalFiltered: 0,
      totalCreated: 0,
      totalSkipped: 0,
      errors: [],
      minRating: args.minRating,
      minReviews: args.minReviews,
      startedAt: Date.now(),
    });
    return jobId;
  },
});

export const updateProgress = internalMutation({
  args: {
    jobId: v.id("scrapeJobs"),
    status: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("completed"),
        v.literal("failed"),
      ),
    ),
    totalFound: v.optional(v.number()),
    totalFiltered: v.optional(v.number()),
    totalCreated: v.optional(v.number()),
    totalSkipped: v.optional(v.number()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job) throw new Error("Job not found");

    const updates: Record<string, unknown> = {};
    if (args.status) updates.status = args.status;
    if (args.totalFound !== undefined) updates.totalFound = args.totalFound;
    if (args.totalFiltered !== undefined)
      updates.totalFiltered = args.totalFiltered;
    if (args.totalCreated !== undefined)
      updates.totalCreated = args.totalCreated;
    if (args.totalSkipped !== undefined)
      updates.totalSkipped = args.totalSkipped;
    if (args.error) updates.errors = [...job.errors, args.error];

    await ctx.db.patch(args.jobId, updates);
  },
});

export const completeJob = internalMutation({
  args: {
    jobId: v.id("scrapeJobs"),
    status: v.union(v.literal("completed"), v.literal("failed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: args.status,
      completedAt: Date.now(),
    });
  },
});

export const getJob = internalQuery({
  args: { jobId: v.id("scrapeJobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

export const listJobs = internalQuery({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("scrapeJobs")
      .withIndex("by_startedAt")
      .order("desc")
      .take(args.limit || 20);
  },
});
