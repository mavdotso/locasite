import { v } from "convex/values";
import { query } from "./_generated/server";

export const getBusinessEditData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      return null;
    }

    let domain = null;
    if (business.domainId) {
      domain = await ctx.db.get(business.domainId);
    }

    let pages = null;
    if (domain) {
      pages = await ctx.db
        .query("pages")
        .withIndex("by_domain", (q) => q.eq("domainId", domain._id))
        .collect();
    }

    const syncStatus = {
      synced: !!domain,
      error: !domain ? "No domain found for business" : null,
    };

    return {
      business,
      domain,
      pages,
      syncStatus,
    };
  },
});
