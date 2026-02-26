import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

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

        // Add to media library via internal mutation (no auth required).
        // This action is scheduled from createBusinessWithoutAuth which has
        // no auth context, so we cannot call the public uploadFile mutation.
        await ctx.runMutation(
          internal.uploadBusinessImages.internal_addToMediaLibrary,
          {
            businessId,
            storageId,
            url,
            fileType: blob.type || "image/jpeg",
            fileSize: blob.size,
            imageIndex: i,
          },
        );

        storedUrls.push(url);
      } catch (error) {
        storedUrls.push(imageUrl); // Keep original URL if any error occurs
      }
    }

    // Don't update business photos here to avoid race conditions
    // Each image component will handle its own URL

    return { success: true, storedUrls };
  },
});

// Internal mutation to add scraped image to media library (no auth required).
// Used by uploadGoogleMapsImages which runs in a scheduled action without auth context.
export const internal_addToMediaLibrary = internalMutation({
  args: {
    businessId: v.id("businesses"),
    storageId: v.id("_storage"),
    url: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    imageIndex: v.number(),
  },
  handler: async (ctx, args) => {
    // Look up the business — fail fast if it no longer exists
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error(`Business ${args.businessId} not found`);
    }
    const userId = business.userId;
    const businessName = business.name;

    await ctx.db.insert("mediaLibrary", {
      fileName: `${businessName.toLowerCase().replace(/\s+/g, "-")}-${args.imageIndex + 1}`,
      originalName: `${businessName} image ${args.imageIndex + 1}`,
      fileType: args.fileType,
      fileSize: args.fileSize,
      storageId: args.storageId,
      url: args.url,
      userId,
      businessId: args.businessId,
      folder: "scraped",
      alt: `${businessName} image ${args.imageIndex + 1}`,
      tags: ["scraped", "google-maps"],
      usageCount: 1,
      createdAt: Date.now(),
      isDeleted: false,
    });
  },
});
