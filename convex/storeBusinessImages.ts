import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

export const storeBusinessImages = action({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    // Get the business and user info via query
    const business = await ctx.runQuery(api.businesses.getById, {
      id: args.businessId,
    });
    if (!business) {
      throw new Error("Business not found");
    }

    const user = await ctx.runQuery(api.auth.currentUser);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    if (business.userId !== user._id) {
      throw new Error("Not authorized to update this business");
    }

    // Store each image in the media library
    const storedUrls: string[] = [];

    for (let i = 0; i < business.photos.length; i++) {
      const photoUrl = business.photos[i];

      // Skip if already a Convex storage URL
      if (photoUrl.includes("convex.cloud")) {
        storedUrls.push(photoUrl);
        continue;
      }

      try {
        // Download the image
        const response = await fetch(photoUrl);
        if (!response.ok) {
          console.error(`Failed to download image: ${photoUrl}`);
          storedUrls.push(photoUrl); // Keep original URL if download fails
          continue;
        }

        const blob = await response.blob();

        // Store the image directly in the action
        const storageId = await ctx.storage.store(blob);

        // Get the public URL
        const url = await ctx.storage.getUrl(storageId);
        if (!url) {
          storedUrls.push(photoUrl); // Keep original URL if storage fails
          continue;
        }

        // Add to media library via mutation
        await ctx.runMutation(internal.storeBusinessImages.addToMediaLibrary, {
          businessId: args.businessId,
          userId: user._id,
          businessName: business.name,
          storageId,
          url,
          fileType: blob.type || "image/jpeg",
          fileSize: blob.size,
          imageIndex: i,
        });

        storedUrls.push(url);
      } catch (error) {
        console.error(`Error storing image ${i + 1}:`, error);
        storedUrls.push(photoUrl); // Keep original URL if any error occurs
      }
    }

    // Update business with new URLs via mutation
    await ctx.runMutation(internal.storeBusinessImages.updateBusinessPhotos, {
      businessId: args.businessId,
      photos: storedUrls,
    });

    return { success: true, storedUrls };
  },
});

// Internal mutation to add image to media library
export const addToMediaLibrary = internalMutation({
  args: {
    businessId: v.id("businesses"),
    userId: v.id("users"),
    businessName: v.string(),
    storageId: v.id("_storage"),
    url: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    imageIndex: v.number(),
  },
  handler: async (ctx, args) => {
    // Add to media library
    await ctx.db.insert("mediaLibrary", {
      fileName: `${args.businessName.toLowerCase().replace(/\s+/g, "-")}-${args.imageIndex + 1}`,
      originalName: `${args.businessName} image ${args.imageIndex + 1}`,
      fileType: args.fileType,
      fileSize: args.fileSize,
      storageId: args.storageId,
      url: args.url,
      userId: args.userId,
      businessId: args.businessId,
      folder: "scraped",
      alt: `${args.businessName} image ${args.imageIndex + 1}`,
      tags: ["scraped", "google-maps"],
      usageCount: 1,
      createdAt: Date.now(),
      isDeleted: false,
    });
  },
});

// Internal mutation to update business photos
export const updateBusinessPhotos = internalMutation({
  args: {
    businessId: v.id("businesses"),
    photos: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.businessId, {
      photos: args.photos,
    });
  },
});
