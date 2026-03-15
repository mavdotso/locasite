import { mutation, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

const funnelEventValidator = v.union(
  v.literal("category_page_viewed"),
  v.literal("form_submission_started"),
  v.literal("website_created"),
  v.literal("preview_page_viewed"),
  v.literal("publish_clicked"),
  v.literal("website_published"),
  v.literal("claim_banner_shown"),
  v.literal("claim_cta_clicked"),
  v.literal("claim_page_viewed"),
  v.literal("claim_initiated"),
  v.literal("claim_completed"),
);

export const track = mutation({
  args: {
    event: funnelEventValidator,
    sessionId: v.optional(v.string()),
    businessId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("funnelEvents", {
      event: args.event,
      timestamp: Date.now(),
      sessionId: args.sessionId,
      businessId: args.businessId,
      metadata: args.metadata,
    });
  },
});

export const trackInternal = internalMutation({
  args: {
    event: funnelEventValidator,
    businessId: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("funnelEvents", {
      event: args.event,
      timestamp: Date.now(),
      businessId: args.businessId,
      metadata: args.metadata,
    });
  },
});

const FUNNEL_EVENTS = [
  "category_page_viewed",
  "form_submission_started",
  "website_created",
  "preview_page_viewed",
  "publish_clicked",
  "website_published",
] as const;

export const getFunnelCounts = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const results = await Promise.all(
      FUNNEL_EVENTS.map(async (event) => {
        const last7d = await ctx.db
          .query("funnelEvents")
          .withIndex("by_event_timestamp", (q) =>
            q.eq("event", event).gte("timestamp", sevenDaysAgo),
          )
          .collect();

        const last24hCount = last7d.filter((e) => e.timestamp >= oneDayAgo).length;
        return [event, { last24h: last24hCount, last7d: last7d.length }] as const;
      }),
    );

    return Object.fromEntries(results);
  },
});
