import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { downloadAndStoreAllImages } from "./lib/imageStorage";

export const downloadAndStoreBusinessImages = action({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    // Get the business
    const business = await ctx.runQuery(api.businesses.getById, {
      id: args.businessId,
    });
    if (!business) {
      throw new Error("Business not found");
    }

    // Download and store all images
    const storedImageUrls = await downloadAndStoreAllImages(
      ctx,
      business.photos,
      args.businessId,
      business.name,
    );

    // Update the business with the new image URLs
    await ctx.runMutation(api.businesses.updatePhotos, {
      id: args.businessId,
      photos: storedImageUrls,
    });

    return { success: true, storedImageUrls };
  },
});
