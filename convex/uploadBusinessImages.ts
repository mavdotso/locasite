import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const uploadGoogleMapsImages = action({
  args: {
    businessId: v.id("businesses"),
    imageUrls: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { businessId, imageUrls } = args;

    // Get the business to verify it exists
    const business = await ctx.runQuery(api.businesses.getById, {
      id: businessId,
    });
    if (!business) {
      throw new Error("Business not found");
    }

    // Store each image in Convex storage
    const storedUrls: string[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];

      // Skip if already a Convex storage URL
      if (imageUrl.includes("convex.cloud")) {
        storedUrls.push(imageUrl);
        continue;
      }

      try {
        // Download the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
          storedUrls.push(imageUrl); // Keep original URL if download fails
          continue;
        }

        const blob = await response.blob();

        // Store the image directly in the action
        const storageId = await ctx.storage.store(blob);

        // Get the public URL
        const url = await ctx.storage.getUrl(storageId);
        if (!url) {
          storedUrls.push(imageUrl); // Keep original URL if storage fails
          continue;
        }

        // Add to media library
        await ctx.runMutation(api.mediaLibrary.uploadFile, {
          fileName: `${business.name.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
          originalName: `${business.name} image ${i + 1}`,
          fileType: blob.type || "image/jpeg",
          fileSize: blob.size,
          storageId,
          businessId,
          folder: "scraped",
          alt: `${business.name} image ${i + 1}`,
          tags: ["scraped", "google-maps"],
        });

        storedUrls.push(url);
      } catch (error) {
        storedUrls.push(imageUrl); // Keep original URL if any error occurs
      }
    }

    // Update business with new URLs
    await ctx.runMutation(api.businesses.updatePhotos, {
      id: businessId,
      photos: storedUrls,
    });

    return { success: true, storedUrls };
  },
});
