import { mutation, query, internalMutation, internalQuery, action } from './_generated/server';
import { v } from 'convex/values';
import { checkUserAuth, getUserFromIdentity } from './helpers';
import { internal } from "./_generated/api";

// Internal mutation to create a business claim
export const internal_createBusinessClaim = internalMutation({
  args: {
    businessId: v.id("businesses"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if there's already a pending claim for this business by this user
    const existingClaim = await ctx.db
      .query("businessClaims")
      .withIndex("by_business_status", q =>
        q.eq("businessId", args.businessId)
          .eq("status", "pending")
      )
      .filter(q => q.eq(q.field("userId"), args.userId))
      .first();

    if (existingClaim) {
      return existingClaim._id;
    }

    // Create the claim
    const claimId = await ctx.db.insert("businessClaims", {
      businessId: args.businessId,
      userId: args.userId,
      status: "pending",
      googleVerificationStatus: "pending",
      createdAt: Date.now(),
    });

    return claimId;
  }
});

// Internal mutation to approve a claim
export const internal_approveClaim = internalMutation({
  args: {
    claimId: v.id("businessClaims"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Get the claim
    const claim = await ctx.db.get(args.claimId);
    if (!claim) {
      throw new Error("Claim not found");
    }

    // Update the claim status
    await ctx.db.patch(args.claimId, {
      status: "approved",
      googleVerificationStatus: "verified",
      updatedAt: Date.now(),
      notes: args.notes,
    });

    // Update the business ownership
    await ctx.db.patch(claim.businessId, {
      userId: claim.userId,
    });

    return true;
  }
});

// Request to claim a business with Google verification
export const claimBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const identity = await checkUserAuth(ctx);
    const user = await getUserFromIdentity(ctx, identity);

    // Check if the business exists
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    // Check if the business is already claimed by this user
    if (business.userId === user._id) {
      throw new Error("You already own this business");
    }

    // Check if the business is already claimed by another user
    if (business.userId) {
      throw new Error("This business is already claimed by another user");
    }

    // Create the claim
    const claimId = await ctx.db.insert("businessClaims", {
      businessId: args.businessId,
      userId: user._id,
      status: "pending",
      googleVerificationStatus: "pending",
      createdAt: Date.now(),
    });


    return {
      claimId,
      message: "Please complete Google Business Profile verification to claim this business.",
      requiresGoogleAuth: true
    };
  }
});

// Get claim by ID
export const getClaimById = query({
  args: {
    claimId: v.id("businessClaims"),
  },
  handler: async (ctx, args) => {
    const identity = await checkUserAuth(ctx);
    const user = await getUserFromIdentity(ctx, identity);

    const claim = await ctx.db.get(args.claimId);
    if (!claim) {
      throw new Error("Claim not found");
    }

    // Only allow the user who made the claim to view it
    if (claim.userId !== user._id) {
      throw new Error("You don't have permission to view this claim");
    }

    return claim;
  }
});

// Internal query to get a claim by ID
export const internal_getClaimById = internalQuery({
  args: {
    claimId: v.id("businessClaims"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.claimId);
  }
});

// Internal query to get business by ID
export const internal_getBusinessById = internalQuery({
  args: {
    id: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

// Action to verify Google Business Profile ownership
export const verifyGoogleBusinessOwnership = action({
  args: {
    claimId: v.id("businessClaims"),
    googleAccessToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the claim details
    const claim = await ctx.runQuery(internal.businessClaims.internal_getClaimById, {
      claimId: args.claimId
    });

    if (!claim) {
      throw new Error("Claim not found");
    }

    // Get the business details
    const business = await ctx.runQuery(internal.businesses.internal_getBusinessById, {
      id: claim.businessId
    });

    if (!business) {
      throw new Error("Business not found");
    }

    // Use the Google Business Profile API to verify ownership
    try {
      // Make a request to the Google Business Profile API
      const response = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/*/locations/${business.placeId}`,
        {
          headers: {
            Authorization: `Bearer ${args.googleAccessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // If the response is not OK, the user doesn't have access to this business
        await ctx.runMutation(internal.businessClaims.internal_updateClaimStatus, {
          claimId: args.claimId,
          status: "rejected",
          googleVerificationStatus: "failed",
          notes: "Google verification failed: User does not have access to this business"
        });

        return {
          success: false,
          message: "Could not verify ownership with Google. You don't appear to have access to this business listing."
        };
      }

      // If we got a successful response, the user has access to this business in Google
      // Approve the claim automatically
      await ctx.runMutation(internal.businessClaims.internal_approveClaim, {
        claimId: args.claimId,
        notes: "Automatically approved via Google Business Profile verification",
      });

      return {
        success: true,
        message: "Google Business Profile ownership verified. Your claim has been approved!"
      };
    } catch (error) {
      console.error("Error verifying Google Business ownership:", error);

      await ctx.runMutation(internal.businessClaims.internal_updateClaimStatus, {
        claimId: args.claimId,
        status: "pending",
        googleVerificationStatus: "failed",
        notes: `Google verification error: ${error}`
      });

      return {
        success: false,
        message: "Error verifying ownership with Google. Please try again later."
      };
    }
  }
});

// Internal mutation to update claim status
export const internal_updateClaimStatus = internalMutation({
  args: {
    claimId: v.id("businessClaims"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    googleVerificationStatus: v.union(
      v.literal("pending"),
      v.literal("verified"),
      v.literal("failed")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.claimId, {
      status: args.status,
      googleVerificationStatus: args.googleVerificationStatus,
      updatedAt: Date.now(),
      notes: args.notes,
    });

    return true;
  }
});

// Get all claims by a user
export const getClaimsByUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await checkUserAuth(ctx);
    const user = await getUserFromIdentity(ctx, identity);

    return await ctx.db
      .query("businessClaims")
      .withIndex("by_user", q => q.eq("userId", user._id))
      .collect();
  }
});

// Check if a business is claimable
export const isBusinessClaimable = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    // A business is claimable if it has no owner
    const isClaimable = !business.userId;

    // Check if there are any pending claims
    const pendingClaims = await ctx.db
      .query("businessClaims")
      .withIndex("by_business_status", q =>
        q.eq("businessId", args.businessId)
          .eq("status", "pending")
      )
      .collect();

    return {
      isClaimable,
      hasPendingClaims: pendingClaims.length > 0,
      pendingClaimsCount: pendingClaims.length
    };
  }
});