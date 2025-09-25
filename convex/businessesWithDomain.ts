import { query } from './_generated/server';
import { v } from 'convex/values';
import { api } from './_generated/api';

export const getBusinessWithDomainAndPage = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    const domain = business.domainId 
      ? await ctx.db.get(business.domainId)
      : null;

    let page = null;
    if (domain) {
      page = await ctx.db
        .query("pages")
        .withIndex("by_domain", q => q.eq("domainId", domain._id))
        .first();
    }

    return {
      business,
      domain,
      page
    };
  }
});

export const getBusinessPreviewData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    const domain = business.domainId 
      ? await ctx.db.get(business.domainId)
      : null;

    let page = null;
    if (domain) {
      page = await ctx.db
        .query("pages")
        .withIndex("by_domain", q => q.eq("domainId", domain._id))
        .first();
    }

    const theme = business.themeId 
      ? await ctx.db.get(business.themeId)
      : null;

    return {
      business,
      domain,
      page,
      theme
    };
  }
});