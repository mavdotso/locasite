import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const storeFile = mutation({
  args: {
    storageId: v.id("_storage"),
    businessId: v.id("businesses"),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);

    if (!business) {
      throw new Error("Business not found");
    }

    const url = await ctx.storage.getUrl(args.storageId);

    if (!url) {
      throw new Error("Failed to get file URL");
    }

    const theme = business.theme || {};
    theme.logoUrl = url;

    await ctx.db.patch(args.businessId, {
      theme,
    });

    return url;
  },
});

export const getUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
