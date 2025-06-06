import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Function to generate a signed URL for uploading a file
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Function to store a file in Convex storage
export const storeFile = mutation({
  args: {
    storageId: v.id("_storage"),
    businessId: v.id("businesses"),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the business
    const business = await ctx.db.get(args.businessId);

    if (!business) {
      throw new Error("Business not found");
    }

    // Create a URL for the stored file
    const url = await ctx.storage.getUrl(args.storageId);

    if (!url) {
      throw new Error("Failed to get file URL");
    }

    // Update the business theme with the logo URL
    const theme = business.theme || {};
    theme.logoUrl = url;

    await ctx.db.patch(args.businessId, {
      theme,
    });

    return url;
  },
});