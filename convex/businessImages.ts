import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";

// Helper to verify business ownership
async function verifyBusinessOwnership(
  ctx: any,
  businessId: Id<"businesses">,
  userId: Id<"users">
) {
  const business = await ctx.db.get(businessId);
  if (!business) {
    throw new Error("Business not found");
  }
  if (business.userId !== userId) {
    throw new Error("Not authorized to modify this business");
  }
  return business;
}

// Get all images for a business
export const getBusinessImages = query({
  args: {
    businessId: v.id("businesses"),
    type: v.optional(v.union(
      v.literal("photo"),
      v.literal("gallery"),
      v.literal("hero"),
      v.literal("logo")
    )),
    onlyActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("businessImages")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId));

    if (args.type) {
      query = ctx.db
        .query("businessImages")
        .withIndex("by_business_type", (q) =>
          q.eq("businessId", args.businessId).eq("type", args.type!)
        );
    }

    if (args.onlyActive) {
      query = ctx.db
        .query("businessImages")
        .withIndex("by_business_active", (q) =>
          q.eq("businessId", args.businessId).eq("isActive", true)
        );
    }

    const images = await query.collect();

    // Sort by order
    return images.sort((a, b) => a.order - b.order);
  },
});

// Add new image to a business
export const addBusinessImage = mutation({
  args: {
    businessId: v.id("businesses"),
    url: v.string(),
    type: v.union(
      v.literal("photo"),
      v.literal("gallery"),
      v.literal("hero"),
      v.literal("logo")
    ),
    caption: v.optional(v.string()),
    source: v.union(
      v.literal("google"),
      v.literal("upload"),
      v.literal("ai")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    // Get the next order number
    const existingImages = await ctx.db
      .query("businessImages")
      .withIndex("by_business_type", (q) =>
        q.eq("businessId", args.businessId).eq("type", args.type)
      )
      .collect();

    const maxOrder = existingImages.reduce((max, img) => Math.max(max, img.order), -1);

    const imageId = await ctx.db.insert("businessImages", {
      businessId: args.businessId,
      url: args.url,
      type: args.type,
      order: maxOrder + 1,
      caption: args.caption,
      isActive: true,
      source: args.source,
      createdAt: Date.now(),
    });

    return imageId;
  },
});

// Update image details
export const updateBusinessImage = mutation({
  args: {
    imageId: v.id("businessImages"),
    caption: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error("Image not found");
    }

    await verifyBusinessOwnership(ctx, image.businessId, user._id);

    const updates: Partial<Doc<"businessImages">> = {
      updatedAt: Date.now(),
    };

    if (args.caption !== undefined) updates.caption = args.caption;
    if (args.isActive !== undefined) updates.isActive = args.isActive;
    if (args.order !== undefined) updates.order = args.order;

    await ctx.db.patch(args.imageId, updates);

    return { success: true };
  },
});

// Delete an image
export const deleteBusinessImage = mutation({
  args: {
    imageId: v.id("businessImages"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const image = await ctx.db.get(args.imageId);
    if (!image) {
      throw new Error("Image not found");
    }

    await verifyBusinessOwnership(ctx, image.businessId, user._id);

    // Delete from storage if exists
    if (image.storageId) {
      await ctx.storage.delete(image.storageId);
    }

    await ctx.db.delete(args.imageId);

    return { success: true };
  },
});

// Reorder images
export const reorderBusinessImages = mutation({
  args: {
    businessId: v.id("businesses"),
    imageIds: v.array(v.id("businessImages")),
    type: v.optional(v.union(
      v.literal("photo"),
      v.literal("gallery"),
      v.literal("hero"),
      v.literal("logo")
    )),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    // Update the order of each image
    for (let i = 0; i < args.imageIds.length; i++) {
      const imageId = args.imageIds[i];
      const image = await ctx.db.get(imageId);

      if (!image || image.businessId !== args.businessId) {
        throw new Error(`Invalid image ID: ${imageId}`);
      }

      if (args.type && image.type !== args.type) {
        continue; // Skip images of different types
      }

      await ctx.db.patch(imageId, {
        order: i,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Set primary image for a type
export const setPrimaryImage = mutation({
  args: {
    businessId: v.id("businesses"),
    imageId: v.id("businessImages"),
    type: v.union(
      v.literal("hero"),
      v.literal("logo")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    const image = await ctx.db.get(args.imageId);
    if (!image || image.businessId !== args.businessId) {
      throw new Error("Invalid image");
    }

    // Deactivate all other images of the same type
    const otherImages = await ctx.db
      .query("businessImages")
      .withIndex("by_business_type", (q) =>
        q.eq("businessId", args.businessId).eq("type", args.type)
      )
      .collect();

    for (const otherImage of otherImages) {
      if (otherImage._id !== args.imageId) {
        await ctx.db.patch(otherImage._id, {
          isActive: false,
          updatedAt: Date.now(),
        });
      }
    }

    // Activate the selected image and set it as first in order
    await ctx.db.patch(args.imageId, {
      isActive: true,
      order: 0,
      type: args.type,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Bulk add images (for migrations)
export const bulkAddImages = mutation({
  args: {
    businessId: v.id("businesses"),
    images: v.array(v.object({
      url: v.string(),
      type: v.union(
        v.literal("photo"),
        v.literal("gallery"),
        v.literal("hero"),
        v.literal("logo")
      ),
      caption: v.optional(v.string()),
      source: v.union(
        v.literal("google"),
        v.literal("upload"),
        v.literal("ai")
      ),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    const imageIds = [];

    for (let i = 0; i < args.images.length; i++) {
      const image = args.images[i];

      const imageId = await ctx.db.insert("businessImages", {
        businessId: args.businessId,
        url: image.url,
        type: image.type,
        order: i,
        caption: image.caption,
        isActive: true,
        source: image.source,
        createdAt: Date.now(),
      });

      imageIds.push(imageId);
    }

    return { imageIds, count: imageIds.length };
  },
});