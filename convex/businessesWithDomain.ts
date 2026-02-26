import { query } from './_generated/server';
import { v } from 'convex/values';
import { sanitizePhotos } from './lib/helpers';

// Compound query to fetch business with domain and page data
export const getBusinessWithDomainAndPage = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    // Get domain
    const domain = business.domainId 
      ? await ctx.db.get(business.domainId)
      : null;

    // Get page if domain exists
    let page = null;
    if (domain) {
      page = await ctx.db
        .query("pages")
        .withIndex("by_domain", q => q.eq("domainId", domain._id))
        .first();
    }

    return {
      business: { ...business, photos: sanitizePhotos(business.photos) },
      domain,
      page
    };
  }
});

// Query to get business with all related data for preview
export const getBusinessPreviewData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    // Strip sensitive fields before returning
    const { googleBusinessAuth: _, ...safeBusiness } = business;

    // Get domain
    const domain = safeBusiness.domainId
      ? await ctx.db.get(safeBusiness.domainId)
      : null;

    // Get page if domain exists
    let page = null;
    if (domain) {
      page = await ctx.db
        .query("pages")
        .withIndex("by_domain", q => q.eq("domainId", domain._id))
        .first();
    }

    // Get theme if exists
    const theme = safeBusiness.themeId
      ? await ctx.db.get(safeBusiness.themeId)
      : null;

    return {
      business: { ...safeBusiness, photos: sanitizePhotos(safeBusiness.photos) },
      domain,
      page,
      theme
    };
  }
});