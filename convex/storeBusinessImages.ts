import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";

export const storeBusinessImages = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Get the business
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
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

        // Generate upload URL
        const uploadUrl = await ctx.storage.generateUploadUrl();

        // Upload to Convex storage
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": blob.type || "image/jpeg",
          },
          body: blob,
        });

        if (!uploadResponse.ok) {
          console.error(`Failed to upload image: ${uploadResponse.statusText}`);
          storedUrls.push(photoUrl); // Keep original URL if upload fails
          continue;
        }

        const { storageId } = await uploadResponse.json();

        // Get the public URL
        const url = await ctx.storage.getUrl(storageId);
        if (!url) {
          storedUrls.push(photoUrl); // Keep original URL if we can't get storage URL
          continue;
        }

        // Add to media library
        await ctx.db.insert("mediaLibrary", {
          fileName: `${business.name.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`,
          originalName: `${business.name} image ${i + 1}`,
          fileType: blob.type || "image/jpeg",
          fileSize: blob.size,
          storageId,
          url,
          userId: user._id,
          businessId: args.businessId,
          folder: "scraped",
          alt: `${business.name} image ${i + 1}`,
          tags: ["scraped", "google-maps"],
          usageCount: 1,
          createdAt: Date.now(),
          isDeleted: false,
        });

        storedUrls.push(url);
      } catch (error) {
        console.error(`Error storing image ${i + 1}:`, error);
        storedUrls.push(photoUrl); // Keep original URL if any error occurs
      }
    }

    // Update business with new URLs
    await ctx.db.patch(args.businessId, {
      photos: storedUrls,
    });

    return { success: true, storedUrls };
  },
});
