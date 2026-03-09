import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

const eventTypes = v.union(
  v.literal("page_view"),
  v.literal("phone_click"),
  v.literal("email_click"),
  v.literal("directions_click"),
);

type CounterField = "pageViews" | "phoneClicks" | "emailClicks" | "directionsClicks";

const fieldMap: Record<string, CounterField> = {
  page_view: "pageViews",
  phone_click: "phoneClicks",
  email_click: "emailClicks",
  directions_click: "directionsClicks",
};

export const trackEvent = mutation({
  args: {
    businessId: v.id("businesses"),
    eventType: eventTypes,
  },
  handler: async (ctx, args) => {
    const month = getCurrentMonth();

    const existing = await ctx.db
      .query("businessEngagement")
      .withIndex("by_business_month", (q) =>
        q.eq("businessId", args.businessId).eq("month", month),
      )
      .first();

    const field = fieldMap[args.eventType];

    if (existing) {
      const currentValue = existing[field] || 0;
      await ctx.db.patch(existing._id, { [field]: currentValue + 1 });
    } else {
      await ctx.db.insert("businessEngagement", {
        businessId: args.businessId,
        month,
        pageViews: args.eventType === "page_view" ? 1 : 0,
        phoneClicks: args.eventType === "phone_click" ? 1 : 0,
        emailClicks: args.eventType === "email_click" ? 1 : 0,
        directionsClicks: args.eventType === "directions_click" ? 1 : 0,
      });
    }
  },
});

export const getMonthlyStats = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const month = getCurrentMonth();

    const stats = await ctx.db
      .query("businessEngagement")
      .withIndex("by_business_month", (q) =>
        q.eq("businessId", args.businessId).eq("month", month),
      )
      .first();

    if (!stats) return null;

    return {
      pageViews: stats.pageViews,
      phoneClicks: stats.phoneClicks,
      emailClicks: stats.emailClicks,
      directionsClicks: stats.directionsClicks,
    };
  },
});
