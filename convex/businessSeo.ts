import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";

export const updateSeoSettings = mutation({
  args: {
    businessId: v.id("businesses"),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    favicon: v.optional(v.string()),
    faviconStorageId: v.optional(v.id("_storage")),
    ogImage: v.optional(v.string()),
    ogImageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { businessId, ...seoData } = args;

    // Get authenticated user
    const user = await getUserFromAuth(ctx);

    // Check if user owns this business
    const business = await ctx.db.get(businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Update SEO settings
    await ctx.db.patch(businessId, seoData);

    return { success: true };
  },
});
export const uploadFavicon = mutation({
  args: {
    businessId: v.id("businesses"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { businessId, storageId } = args;

    // Get authenticated user
    const user = await getUserFromAuth(ctx);

    // Check if user owns this business
    const business = await ctx.db.get(businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Get the storage URL
    const url = await ctx.storage.getUrl(storageId);
    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    // Delete old favicon from storage if exists
    if (business.faviconStorageId) {
      await ctx.storage.delete(business.faviconStorageId);
    }

    // Update business with new favicon
    await ctx.db.patch(businessId, {
      favicon: url,
      faviconStorageId: storageId,
    });

    return { url };
  },
});
export const uploadOgImage = mutation({
  args: {
    businessId: v.id("businesses"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const { businessId, storageId } = args;

    // Get authenticated user
    const user = await getUserFromAuth(ctx);

    // Check if user owns this business
    const business = await ctx.db.get(businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Get the storage URL
    const url = await ctx.storage.getUrl(storageId);
    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    // Delete old OG image from storage if exists
    if (business.ogImageStorageId) {
      await ctx.storage.delete(business.ogImageStorageId);
    }

    // Update business with new OG image
    await ctx.db.patch(businessId, {
      ogImage: url,
      ogImageStorageId: storageId,
    });

    return { url };
  },
});
export const getSeoSettings = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      return null;
    }

    return {
      seoTitle: business.seoTitle,
      seoDescription: business.seoDescription,
      seoKeywords: business.seoKeywords,
      ogTitle: business.ogTitle,
      ogDescription: business.ogDescription,
      favicon: business.favicon,
      ogImage: business.ogImage,
    };
  },
});
