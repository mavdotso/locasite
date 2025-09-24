import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";
import { api } from "./_generated/api";

// Check if a business can be published
export const canPublishBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    // Check if user owns the business
    const user = await getUserFromAuth(ctx);
    const isOwner = business.userId === user._id;

    if (!isOwner) {
      return {
        canPublish: false,
        reason: "You don't own this business",
        requiresVerification: false,
      };
    }

    // TEMPORARILY DISABLED VERIFICATION REQUIREMENTS
    // Allow all owned businesses to publish without verification
    return {
      canPublish: true,
      reason: "Business can publish",
      requiresVerification: false,
    };

    /* ORIGINAL VERIFICATION LOGIC - COMMENTED OUT FOR NOW
    // Check if business is already verified
    if (business.canPublish === true) {
      return {
        canPublish: true,
        reason: "Business is verified and can publish",
        requiresVerification: false,
        verificationMethod: business.verificationMethod,
        verificationCompletedAt: business.verificationCompletedAt,
      };
    }

    // Check if publishing is blocked
    if (business.publishingBlocked === true) {
      return {
        canPublish: false,
        reason:
          business.publishingBlockReason || "Publishing is temporarily blocked",
        requiresVerification: false,
      };
    }

    // Check if verification is required
    if (business.verificationRequired !== false) {
      // Check for approved claims
      const approvedClaim = await ctx.db
        .query("businessClaims")
        .withIndex("by_business_status", (q) =>
          q.eq("businessId", args.businessId).eq("status", "approved"),
        )
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();

      if (approvedClaim) {
        return {
          canPublish: true,
          reason: "Business verification completed",
          requiresVerification: false,
          verificationMethod: approvedClaim.verificationMethod,
          needsUpdate: true, // Flag to indicate business record needs updating
        };
      }

      // Check for pending claims
      const pendingClaim = await ctx.db
        .query("businessClaims")
        .withIndex("by_business_status", (q) =>
          q.eq("businessId", args.businessId).eq("status", "pending"),
        )
        .filter((q) => q.eq(q.field("userId"), user._id))
        .first();

      if (pendingClaim) {
        return {
          canPublish: false,
          reason: "Verification is pending approval",
          requiresVerification: true,
          pendingClaimId: pendingClaim._id,
          verificationMethod: pendingClaim.verificationMethod,
        };
      }

      return {
        canPublish: false,
        reason: "Business verification required before publishing",
        requiresVerification: true,
      };
    }

    // If verification is not required, allow publishing
    return {
      canPublish: true,
      reason: "Business can publish without verification",
      requiresVerification: false,
    };
    END OF ORIGINAL VERIFICATION LOGIC */
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

// Publish a business (make it live)
export const publishBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    await getUserFromAuth(ctx); // Verify user is authenticated

    // Check publishing permissions
    const permissions = await ctx.runQuery(
      api.businessPublishing.canPublishBusiness,
      {
        businessId: args.businessId,
      },
    );

    if (!permissions.canPublish) {
      throw new Error(permissions.reason);
    }

    // Update business to published state
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
