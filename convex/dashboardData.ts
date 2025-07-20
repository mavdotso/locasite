import { query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getDashboardBusinessData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    // Get domain by business's domainId
    const domain = business.domainId
      ? await ctx.db.get(business.domainId)
      : null;

    // Count unread messages
    const messages = await ctx.db
      .query("contactMessages")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();

    const unreadCount = messages.filter((m) => m.status === "unread").length;

    return { business, domain, unreadCount };
  },
});

export const getUserBusinessesWithMetadata = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const businesses = await ctx.db
      .query("businesses")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    const businessesWithMetadata = await Promise.all(
      businesses.map(async (business) => {
        // Get domain by business's domainId
        const domain = business.domainId
          ? await ctx.db.get(business.domainId)
          : null;

        // Count unread messages
        const messages = await ctx.db
          .query("contactMessages")
          .filter((q) => q.eq(q.field("businessId"), business._id))
          .collect();

        const unreadCount = messages.filter(
          (m) => m.status === "unread",
        ).length;

        return { ...business, domain, unreadCount };
      }),
    );

    return businessesWithMetadata;
  },
});
