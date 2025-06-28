import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Track a page view
export const trackPageView = mutation({
  args: {
    businessId: v.id("businesses"),
    domainId: v.optional(v.id("domains")),
    visitorId: v.string(),
    sessionId: v.string(),
    path: v.string(),
    title: v.optional(v.string()),
    loadTime: v.optional(v.number()),
    screenWidth: v.optional(v.number()),
    screenHeight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Record the page view
    const pageViewId = await ctx.db.insert("pageViews", {
      ...args,
      timestamp: Date.now(),
      timeOnPage: undefined,
      scrollDepth: undefined,
      clicks: undefined,
    });

    // Update session
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (session) {
      await ctx.db.patch(session._id, {
        pageCount: session.pageCount + 1,
        endTime: Date.now(),
        duration: Math.floor((Date.now() - session.startTime) / 1000),
        exitPage: args.path,
      });
    }

    // Update visitor last seen
    const visitor = await ctx.db
      .query("visitors")
      .withIndex("by_visitor_id", (q) => q.eq("visitorId", args.visitorId))
      .first();

    if (visitor) {
      await ctx.db.patch(visitor._id, {
        lastSeen: Date.now(),
      });
    }

    return pageViewId;
  },
});

// Update page view with engagement data
export const updatePageView = mutation({
  args: {
    pageViewId: v.id("pageViews"),
    timeOnPage: v.optional(v.number()),
    scrollDepth: v.optional(v.number()),
    clicks: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { pageViewId, ...updates } = args;
    await ctx.db.patch(pageViewId, updates);
  },
});

// Track an event
export const trackEvent = mutation({
  args: {
    businessId: v.id("businesses"),
    visitorId: v.string(),
    sessionId: v.string(),
    eventType: v.string(),
    eventCategory: v.optional(v.string()),
    eventLabel: v.optional(v.string()),
    eventValue: v.optional(v.number()),
    path: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Record the event
    const eventId = await ctx.db.insert("events", {
      ...args,
      timestamp: Date.now(),
    });

    // Update session event count
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_session_id", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (session) {
      const updates: Partial<Doc<"sessions">> = {
        eventCount: session.eventCount + 1,
      };

      // Check for conversion events
      if (args.eventCategory === "conversion") {
        updates.hasConverted = true;
        updates.conversionType = args.eventType;
      }

      await ctx.db.patch(session._id, updates);
    }

    return eventId;
  },
});

// Create or update visitor
export const upsertVisitor = mutation({
  args: {
    visitorId: v.string(),
    userAgent: v.optional(v.string()),
    deviceType: v.optional(v.union(v.literal("desktop"), v.literal("mobile"), v.literal("tablet"))),
    browser: v.optional(v.string()),
    os: v.optional(v.string()),
    country: v.optional(v.string()),
    region: v.optional(v.string()),
    city: v.optional(v.string()),
    referrerDomain: v.optional(v.string()),
    referrerPath: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("visitors")
      .withIndex("by_visitor_id", (q) => q.eq("visitorId", args.visitorId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSeen: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("visitors", {
      ...args,
      firstSeen: Date.now(),
      lastSeen: Date.now(),
    });
  },
});

// Create a new session
export const createSession = mutation({
  args: {
    sessionId: v.string(),
    visitorId: v.string(),
    businessId: v.id("businesses"),
    entryPage: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", {
      ...args,
      startTime: Date.now(),
      pageCount: 0,
      eventCount: 0,
      hasConverted: false,
    });
  },
});

// Get analytics summary for a business
export const getBusinessAnalytics = query({
  args: {
    businessId: v.id("businesses"),
    timeRange: v.optional(v.union(
      v.literal("24h"),
      v.literal("7d"),
      v.literal("30d"),
      v.literal("90d")
    )),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const timeRanges = {
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
    };
    
    const startTime = now - (timeRanges[args.timeRange || "30d"] || timeRanges["30d"]);

    // Get page views
    const pageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_business_timestamp", (q) =>
        q.eq("businessId", args.businessId).gte("timestamp", startTime)
      )
      .collect();

    // Get unique visitors
    const uniqueVisitors = new Set(pageViews.map((pv) => pv.visitorId)).size;

    // Get sessions
    const sessions = await ctx.db
      .query("sessions")
      .withIndex("by_business_time", (q) =>
        q.eq("businessId", args.businessId).gte("startTime", startTime)
      )
      .collect();

    // Calculate metrics
    const totalPageViews = pageViews.length;
    const totalSessions = sessions.length;
    const avgSessionDuration = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length
      : 0;
    const avgPagesPerSession = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.pageCount, 0) / sessions.length
      : 0;
    const conversionRate = sessions.length > 0
      ? (sessions.filter((s) => s.hasConverted).length / sessions.length) * 100
      : 0;

    // Get top pages
    const pageCounts = pageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));

    // Get events
    const events = await ctx.db
      .query("events")
      .withIndex("by_business_timestamp", (q) =>
        q.eq("businessId", args.businessId).gte("timestamp", startTime)
      )
      .collect();

    // Get conversion events
    const conversions = events.filter((e) => e.eventCategory === "conversion");

    return {
      summary: {
        totalPageViews,
        uniqueVisitors,
        totalSessions,
        avgSessionDuration,
        avgPagesPerSession,
        conversionRate,
        totalConversions: conversions.length,
      },
      topPages,
      recentSessions: sessions.slice(-10).reverse(),
      conversionTypes: conversions.reduce((acc, c) => {
        acc[c.eventType] = (acc[c.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  },
});

// Get real-time visitors
export const getRealTimeVisitors = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    const recentPageViews = await ctx.db
      .query("pageViews")
      .withIndex("by_business_timestamp", (q) =>
        q.eq("businessId", args.businessId).gte("timestamp", fiveMinutesAgo)
      )
      .collect();

    const activeVisitorIds = new Set(recentPageViews.map((pv) => pv.visitorId));

    return {
      activeVisitors: activeVisitorIds.size,
      recentPageViews: recentPageViews.slice(-20).reverse(),
    };
  },
});