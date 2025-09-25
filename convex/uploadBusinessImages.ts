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

    const business = await ctx.runQuery(api.businesses.getById, {
      id: businessId,
    });
    if (!business) {
      throw new Error("Business not found");
    }

    const storedUrls: string[] = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];

      if (imageUrl.includes("convex.cloud")) {
        storedUrls.push(imageUrl);
        continue;
      }

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          storedUrls.push(imageUrl);
          continue;
        }

        const blob = await response.blob();

        const storageId = await ctx.storage.store(blob);

        const url = await ctx.storage.getUrl(storageId);
        if (!url) {
          storedUrls.push(imageUrl);
          continue;
        }

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
        storedUrls.push(imageUrl);
      }
    }

    return { success: true, storedUrls };
  },
});
