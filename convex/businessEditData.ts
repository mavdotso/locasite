import { v } from "convex/values";
import { query } from "./_generated/server";
import { getUserFromAuth } from "./lib/helpers";

export const getBusinessEditData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      return null;
    }

    if (business.userId !== user._id) {
      throw new Error("Not authorized to edit this business");
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

    // Strip sensitive fields from business
    const { googleBusinessAuth: _, ...safeBusiness } = business;

    return {
      business: safeBusiness,
      domain,
      pages,
      syncStatus,
    };
  },
});
