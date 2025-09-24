import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { auth } from "./auth";
import { Id, Doc } from "./_generated/dataModel";

export const getDashboardBusinessData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    // Parallel fetch domain and check for unread messages
    const [domain, hasUnread] = await Promise.all([
      // Get domain by business's domainId
      business.domainId ? ctx.db.get(business.domainId) : Promise.resolve(null),
      // Use compound index for fastest lookup
      ctx.db
        .query("contactMessages")
        .withIndex("by_business_status", (q) =>
          q.eq("businessId", args.businessId).eq("status", "unread")
        )
        .first()
        .then(msg => msg !== null),
    ]);

    const unreadCount = hasUnread ? 1 : 0;

    return { business, domain, unreadCount };
  },
});

export const getUserBusinessesWithMetadata = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const businessesWithMetadata = await Promise.all(
      businesses.map(async (business) => {
        // Parallel fetch domain and check for unread messages
        const [domain, hasUnread] = await Promise.all([
          // Get domain by business's domainId
          business.domainId ? ctx.db.get(business.domainId) : Promise.resolve(null),
          // Use compound index for fastest lookup
          ctx.db
            .query("contactMessages")
            .withIndex("by_business_status", (q) =>
              q.eq("businessId", business._id).eq("status", "unread")
            )
            .first()
            .then(msg => msg !== null),
        ]);

        const unreadCount = hasUnread ? 1 : 0;

        return { ...business, domain, unreadCount };
      }),
    );

    return businessesWithMetadata;
  },
});

export const getUserBusinessesPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    // Get user ID once
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return {
        page: [],
        continueCursor: "",
        isDone: true,
      };
    }

    const results = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(paginationOpts);

    // Batch fetch all domains at once
    const domainIds = results.page
      .map(b => b.domainId)
      .filter((id): id is Id<"domains"> => id !== null && id !== undefined);

    const domains = await Promise.all(
      domainIds.map(id => ctx.db.get(id))
    );

    const domainMap = new Map<Id<"domains">, Doc<"domains">>();
    domains.forEach(d => {
      if (d) domainMap.set(d._id, d);
    });

    // Batch check for unread messages
    const businessIds = results.page.map(b => b._id);
    const unreadChecks = await Promise.all(
      businessIds.map(businessId =>
        ctx.db
          .query("contactMessages")
          .withIndex("by_business_status", (q) =>
            q.eq("businessId", businessId).eq("status", "unread")
          )
          .first()
      )
    );

    // Combine results
    const businessesWithMetadata = results.page.map((business, index) => {
      const domain = business.domainId ? domainMap.get(business.domainId) || null : null;
      const hasUnread = unreadChecks[index] !== null;
      const unreadCount = hasUnread ? 1 : 0;

      return { ...business, domain, unreadCount };
    });

    return {
      page: businessesWithMetadata,
      continueCursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});
