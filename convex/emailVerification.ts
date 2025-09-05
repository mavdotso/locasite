import { mutation, query, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";
import { internal, api } from "./_generated/api";
import { logger } from "./lib/logger";
import { convexEnv } from "./lib/env";


// Internal mutation to update claim with token
export const internal_updateClaimWithToken = internalMutation({
  args: {
    claimId: v.id("businessClaims"),
    token: v.string(),
    expiry: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.claimId, {
      emailVerificationToken: args.token,
      emailVerificationExpiry: args.expiry,
      magicLinkSent: true,
      updatedAt: Date.now(),
    });
  },
});

// Send verification email
export const sendVerificationEmail = action({
  args: {
    businessId: v.id("businesses"),
    claimId: v.id("businessClaims"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; message: string; email?: string; emailSent?: boolean }> => {
    // Get the business and claim details
    const business = await ctx.runQuery(
      internal.businesses.internal_getBusinessById,
      {
        id: args.businessId,
      },
    );

    if (!business) {
      throw new Error("Business not found");
    }

    const claim = await ctx.runQuery(
      internal.businessClaims.internal_getClaimById,
      {
        claimId: args.claimId,
      },
    );

    if (!claim) {
      throw new Error("Claim not found");
    }

    // Generate verification token using the action  
    const token = await ctx.runAction(internal.emailActions.internal_generateToken, {});
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Update claim with token
    await ctx.runMutation(
      internal.emailVerification.internal_updateClaimWithToken,
      {
        claimId: args.claimId,
        token,
        expiry,
      },
    );

    // Send verification email
    const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;
    const verificationUrl = `${appUrl}/verify-email?token=${token}&businessId=${args.businessId}`;
    
    // Check if business has email
    if (!business.email) {
      throw new Error("No email address available for verification");
    }
    const recipientEmail = business.email;
    
    const emailResult = await ctx.runAction(internal.emailActions.internal_sendVerificationEmail, {
      businessName: business.name,
      businessEmail: recipientEmail,
      verificationUrl,
    });
    
    if (emailResult.success) {
      return {
        success: true,
        message: "Verification email sent successfully",
        email: recipientEmail,
        emailSent: true,
      };
    } else {
      return {
        success: false,
        message:
          emailResult.error ||
          "Verification token generated. If you don't receive an email, please check your spam folder or request a new one.",
        email: recipientEmail,
        emailSent: false,
      };
    }
  },
});

// Verify email token
export const verifyEmailToken = mutation({
  args: {
    token: v.string(),
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    // Find claim with this token
    const claims = await ctx.db
      .query("businessClaims")
      .filter((q) =>
        q.and(
          q.eq(q.field("businessId"), args.businessId),
          q.eq(q.field("emailVerificationToken"), args.token),
        ),
      )
      .collect();

    if (claims.length === 0) {
      throw new Error("Invalid or expired verification token");
    }

    const claim = claims[0];

    // Check if token is expired
    if (
      claim.emailVerificationExpiry &&
      claim.emailVerificationExpiry < Date.now()
    ) {
      throw new Error("Verification token has expired");
    }

    // Check if claim is still pending
    if (claim.status !== "pending") {
      throw new Error("This claim has already been processed");
    }

    // Approve the claim
    await ctx.db.patch(claim._id, {
      status: "approved",
      updatedAt: Date.now(),
      notes: "Approved via email verification",
      emailVerificationToken: undefined, // Clear the token
      emailVerificationExpiry: undefined,
    });

    // Update business ownership and publishing permissions
    await ctx.db.patch(args.businessId, {
      userId: claim.userId,
      canPublish: true,
      verificationMethod: "email",
      verificationCompletedAt: Date.now(),
    });

    return {
      success: true,
      message:
        "Email verification successful. You can now publish your business site.",
    };
  },
});

// Resend verification email
export const resendVerificationEmail = action({
  args: {
    claimId: v.id("businessClaims"),
  },
  handler: async (ctx, args): Promise<{ success: boolean; message: string; attemptsRemaining: number }> => {
    // Get the claim details
    const claim = await ctx.runQuery(
      internal.businessClaims.internal_getClaimById,
      {
        claimId: args.claimId,
      },
    );

    if (!claim) {
      throw new Error("Claim not found");
    }

    if (claim.status !== "pending") {
      throw new Error("Can only resend verification for pending claims");
    }

    // Check rate limiting
    const attempts = claim.verificationAttempts || 0;
    if (attempts >= 5) {
      throw new Error(
        "Maximum verification attempts reached. Please contact support.",
      );
    }

    // Generate a new verification token using the action
    const token = await ctx.runAction(internal.emailActions.internal_generateToken, {});
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Update claim with new token (attempts incremented atomically)
    const updateResult = await ctx.runMutation(
      internal.businessClaims.internal_updateClaimForResend,
      {
        claimId: args.claimId,
        token,
        expiry,
      },
    );
    
    const newAttempts = updateResult.attempts;

    // Get business details
    const business = await ctx.runQuery(
      internal.businesses.internal_getBusinessById,
      {
        id: claim.businessId,
      },
    );

    if (!business) {
      throw new Error("Business not found");
    }

    // Send verification email with new token
    const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;
    const verificationUrl = `${appUrl}/verify-email?token=${token}&businessId=${claim.businessId}`;
    
    // Check if business has email
    if (!business.email) {
      throw new Error("No email address available for verification");
    }
    const recipientEmail = business.email;
    
    const emailResult = await ctx.runAction(internal.emailActions.internal_sendVerificationEmail, {
      businessName: business.name,
      businessEmail: recipientEmail,
      verificationUrl,
    });
    
    if (emailResult.success) {
      logger.emailOperation('resend_verification', recipientEmail, true);
      return {
        success: true,
        message: "Verification email resent successfully",
        attemptsRemaining: 5 - newAttempts,
      };
    } else {
      logger.emailOperation('resend_verification', recipientEmail, false, new Error(emailResult.error || 'Unknown error'));
      return {
        success: false,
        message: emailResult.error || "Failed to resend verification email. Please try again.",
        attemptsRemaining: 5 - newAttempts,
      };
    }
  },
});

// Check verification status
export const checkVerificationStatus = query({
  args: {
    claimId: v.id("businessClaims"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const claim = await ctx.db.get(args.claimId);
    if (!claim) {
      throw new Error("Claim not found");
    }

    if (claim.userId !== user._id) {
      throw new Error("You don't have permission to view this claim");
    }

    const business = await ctx.db.get(claim.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    return {
      claimId: claim._id,
      businessId: claim.businessId,
      businessName: business.name,
      status: claim.status,
      verificationMethod: claim.verificationMethod,
      magicLinkSent: claim.magicLinkSent || false,
      emailVerificationExpiry: claim.emailVerificationExpiry,
      verificationAttempts: claim.verificationAttempts || 0,
      createdAt: claim.createdAt,
      updatedAt: claim.updatedAt,
    };
  },
});
