import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";

// Upload a file to the media library
export const uploadFile = mutation({
  args: {
    fileName: v.string(),
    originalName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    businessId: v.optional(v.id("businesses")),
    folder: v.optional(v.string()),
    alt: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    dimensions: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Get the public URL for the file
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get file URL");
    }

    // Create media library entry
    const mediaId = await ctx.db.insert("mediaLibrary", {
      fileName: args.fileName,
      originalName: args.originalName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      storageId: args.storageId,
      url,
      userId: user._id,
      businessId: args.businessId,
      folder: args.folder,
      alt: args.alt,
      tags: args.tags || [],
      dimensions: args.dimensions,
      usageCount: 0,
      createdAt: Date.now(),
      isDeleted: false,
    });

    return { mediaId, url };
  },
});

// Get media files for a user/business
export const getMediaFiles = query({
  args: {
    businessId: v.optional(v.id("businesses")),
    folder: v.optional(v.string()),
    fileType: v.optional(v.string()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    let query = ctx.db
      .query("mediaLibrary")
      .filter((q) => q.eq(q.field("isDeleted"), false));

    // Filter by user
    query = query.filter((q) => q.eq(q.field("userId"), user._id));

    // Filter by business if provided
    if (args.businessId) {
      query = query.filter((q) => q.eq(q.field("businessId"), args.businessId));
    }

    // Filter by folder if provided
    if (args.folder && args.folder !== "google-business") {
      query = query.filter((q) => q.eq(q.field("folder"), args.folder));
    }

    // Filter by file type if provided
    if (args.fileType) {
      query = query.filter((q) => q.eq(q.field("fileType"), args.fileType));
    }

    // Apply pagination and ordering
    const limit = args.limit || 50;
    const offset = args.offset || 0;

    const allFiles = await query.order("desc").collect();
    let combinedFiles = [...allFiles];

    // If businessId is provided and folder is "all" or "google-business", include scraped Google Business images
    if (args.businessId && (!args.folder || args.folder === "all" || args.folder === "google-business")) {
      const business = await ctx.db.get(args.businessId);
      if (business) {
        // Add scraped Google Business photos as virtual media library entries
        const googlePhotos = business.photos
          .filter((photo) => photo && photo.trim() !== "")
          .map((photo, index) => ({
            _id: `google-${args.businessId}-${index}` as Id<"mediaLibrary">,
            _creationTime: business.createdAt,
            fileName: `${business.name} - Image ${index + 1}`,
            originalName: `${business.name} - Image ${index + 1}`,
            fileType: "image/jpeg",
            fileSize: 0, // Unknown size for scraped images
            storageId: "" as Id<"_storage">,
            url: photo,
            userId: user._id,
            businessId: args.businessId,
            folder: "google-business",
            alt: `${business.name} - Google Business Image ${index + 1}`,
            tags: ["google-business", "scraped"],
            dimensions: undefined,
            usageCount: 0,
            createdAt: business.createdAt,
            isDeleted: false,
            updatedAt: undefined,
            lastUsedAt: undefined,
          }));

        // If showing only google-business folder, show only Google photos
        if (args.folder === "google-business") {
          combinedFiles = googlePhotos;
        } else {
          // Otherwise, combine both sources
          combinedFiles = [...googlePhotos, ...allFiles];
        }
      }
    }

    const paginatedFiles = combinedFiles.slice(offset, offset + limit);
    return {
      files: paginatedFiles,
      total: combinedFiles.length,
      hasMore: offset + limit < combinedFiles.length,
    };
  },
});

// Get a specific media file
export const getMediaFile = query({
  args: { mediaId: v.id("mediaLibrary") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const media = await ctx.db.get(args.mediaId);
    if (!media) {
      throw new Error("Media file not found");
    }

    // Check ownership
    if (media.userId !== user._id) {
      throw new Error("Not authorized to access this file");
    }

    return media;
  },
});

// Update media file metadata
export const updateMediaFile = mutation({
  args: {
    mediaId: v.id("mediaLibrary"),
    fileName: v.optional(v.string()),
    folder: v.optional(v.string()),
    alt: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const media = await ctx.db.get(args.mediaId);
    if (!media) {
      throw new Error("Media file not found");
    }

    // Check ownership
    if (media.userId !== user._id) {
      throw new Error("Not authorized to update this file");
    }

    // Update the media file
    await ctx.db.patch(args.mediaId, {
      fileName: args.fileName || media.fileName,
      folder: args.folder !== undefined ? args.folder : media.folder,
      alt: args.alt !== undefined ? args.alt : media.alt,
      tags: args.tags || media.tags,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.mediaId);
  },
});

// Delete a media file (soft delete)
export const deleteMediaFile = mutation({
  args: { mediaId: v.id("mediaLibrary") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const media = await ctx.db.get(args.mediaId);
    if (!media) {
      throw new Error("Media file not found");
    }

    // Check ownership
    if (media.userId !== user._id) {
      throw new Error("Not authorized to delete this file");
    }

    // Soft delete
    await ctx.db.patch(args.mediaId, {
      isDeleted: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Track usage of a media file
export const trackUsage = mutation({
  args: { mediaId: v.id("mediaLibrary") },
  handler: async (ctx, args) => {
    const media = await ctx.db.get(args.mediaId);
    if (!media) {
      return; // Silently fail if media not found
    }

    await ctx.db.patch(args.mediaId, {
      usageCount: media.usageCount + 1,
      lastUsedAt: Date.now(),
    });
  },
});

// Get folders for organization
export const getFolders = query({
  args: { businessId: v.optional(v.id("businesses")) },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    let query = ctx.db
      .query("mediaLibrary")
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .filter((q) => q.eq(q.field("userId"), user._id));

    if (args.businessId) {
      query = query.filter((q) => q.eq(q.field("businessId"), args.businessId));
    }

    const files = await query.collect();
    const folders = new Set<string>();

    files.forEach((file) => {
      if (file.folder) {
        folders.add(file.folder);
      }
    });

    // If businessId is provided, check if there are Google Business photos
    if (args.businessId) {
      const business = await ctx.db.get(args.businessId);
      if (business && business.photos && business.photos.length > 0) {
        folders.add("google-business");
      }
    }

    return Array.from(folders).sort();
  },
});
