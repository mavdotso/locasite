import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";
import { api } from "./_generated/api";

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
        requiresVerification: false,
      };
    }

    return {
      canPublish: true,
      reason: "Business can publish",
      requiresVerification: false,
    };

  },
});

export const updatePublishingStatus = mutation({
  args: {
    businessId: v.id("businesses"),
    canPublish: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

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

export const publishBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    await getUserFromAuth(ctx); // Verify user is authenticated

    const permissions = await ctx.runQuery(
      api.businessPublishing.canPublishBusiness,
      {
        businessId: args.businessId,
      },
    );

    if (!permissions.canPublish) {
      throw new Error(permissions.reason);
    }

    await ctx.db.patch(args.businessId, {
      isPublished: true,
      publishedAt: Date.now(),
    });

    return {
      success: true,
      message: "Business successfully published",
    };
  },
});

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
