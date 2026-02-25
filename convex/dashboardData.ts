import { query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";

export const getDashboardBusinessData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    if (business.userId !== user._id) {
      throw new Error("Not authorized to view this business");
    }

    // Get domain by business's domainId
    const domain = business.domainId
      ? await ctx.db.get(business.domainId)
      : null;

    // Count unread messages
    const messages = await ctx.db
      .query("contactMessages")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();

    const unreadCount = messages.filter((m) => m.status === "unread").length;

    return { business, domain, unreadCount };
  },
});

export const getUserBusinessesWithMetadata = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
          .withIndex("by_business", (q) => q.eq("businessId", business._id))
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
