import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

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
      userId: identity.subject as Id<"users">,
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let query = ctx.db
      .query("mediaLibrary")
      .filter((q) => q.eq(q.field("isDeleted"), false));

    // Filter by user
    query = query.filter((q) => q.eq(q.field("userId"), identity.subject));

    // Filter by business if provided
    if (args.businessId) {
      query = query.filter((q) => q.eq(q.field("businessId"), args.businessId));
    }

    // Filter by folder if provided
    if (args.folder) {
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
    const paginatedFiles = allFiles.slice(offset, offset + limit);
    return {
      files: paginatedFiles,
      total: allFiles.length,
      hasMore: offset + limit < allFiles.length,
    };
  },
});

// Get a specific media file
export const getMediaFile = query({
  args: { mediaId: v.id("mediaLibrary") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const media = await ctx.db.get(args.mediaId);
    if (!media) {
      throw new Error("Media file not found");
    }

    // Check ownership
    if (media.userId !== identity.subject) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const media = await ctx.db.get(args.mediaId);
    if (!media) {
      throw new Error("Media file not found");
    }

    // Check ownership
    if (media.userId !== identity.subject) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const media = await ctx.db.get(args.mediaId);
    if (!media) {
      throw new Error("Media file not found");
    }

    // Check ownership
    if (media.userId !== identity.subject) {
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let query = ctx.db
      .query("mediaLibrary")
      .filter((q) => q.eq(q.field("isDeleted"), false))
      .filter((q) => q.eq(q.field("userId"), identity.subject));

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

    return Array.from(folders).sort();
  },
});
