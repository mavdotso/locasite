import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";

// Check if a business can be published (freemium: any owner can publish)
export const canPublishBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    const user = await getUserFromAuth(ctx);
    const isOwner = business.userId === user._id;

    if (!isOwner) {
      return {
        canPublish: false,
        reason: "You don't own this business",
      };
    }

    // Safety valve: admin can block publishing
    if (business.publishingBlocked === true) {
      return {
        canPublish: false,
        reason:
          business.publishingBlockReason || "Publishing is temporarily blocked",
      };
    }

    // Freemium: any owner can publish for free
    return {
      canPublish: true,
      reason: "Ready to publish",
    };
  },
});

// Update publishing status
export const updatePublishingStatus = mutation({
  args: {
    businessId: v.id("businesses"),
    canPublish: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Check if user is admin (you'll need to implement this check)
    // For now, we'll just check if they own the business
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("You don't have permission to update this business");
    }

    await ctx.db.patch(args.businessId, {
      canPublish: args.canPublish,
      publishingBlockReason: args.reason,
      publishingBlocked: !args.canPublish && args.reason ? true : false,
    });

    return { success: true };
  },
});

// Publish a business (make it live — free for all owners)
export const publishBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("You don't own this business");
    }

    if (business.publishingBlocked === true) {
      throw new Error(
        business.publishingBlockReason || "Publishing is temporarily blocked",
      );
    }

    // Already published — idempotent
    if (business.isPublished) {
      return { success: true, message: "Business is already published" };
    }

    await ctx.db.patch(args.businessId, {
      isPublished: true,
      publishedAt: Date.now(),
      canPublish: true,
    });

    return { success: true, message: "Business successfully published" };
  },
});

// Unpublish a business
export const unpublishBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("You don't have permission to unpublish this business");
    }

    await ctx.db.patch(args.businessId, {
      isPublished: false,
    });

    return {
      success: true,
      message: "Business successfully unpublished",
    };
  },
});

// Get publishing status for dashboard
export const getPublishingStatus = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    const user = await getUserFromAuth(ctx);
    const isOwner = business.userId === user._id;

    if (!isOwner) {
      throw new Error("You don't have permission to view this business");
    }

    // Get verification status
    const claim = await ctx.db
      .query("businessClaims")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .filter((q) => q.eq(q.field("userId"), user._id))
      .order("desc")
      .first();

    return {
      isPublished: business.isPublished || false,
      publishedAt: business.publishedAt,
      canPublish: business.canPublish || false,
      verificationRequired: business.verificationRequired !== false,
      verificationMethod: business.verificationMethod,
      verificationCompletedAt: business.verificationCompletedAt,
      publishingBlocked: business.publishingBlocked || false,
      publishingBlockReason: business.publishingBlockReason,
      claim: claim
        ? {
            id: claim._id,
            status: claim.status,
            verificationMethod: claim.verificationMethod,
            createdAt: claim.createdAt,
            updatedAt: claim.updatedAt,
          }
        : null,
    };
  },
});
