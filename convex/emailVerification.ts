import { mutation, query, action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";
import { api, internal } from "./_generated/api";
import { convexEnv } from "./lib/env";

// Generate a secure verification token
function generateVerificationToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

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
  ): Promise<{ success: boolean; message: string; email?: string }> => {
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

    // Generate verification token
    const token = generateVerificationToken();
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

    // Send verification email via Resend
    const verificationUrl = `${convexEnv.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&businessId=${args.businessId}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${convexEnv.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Locasite <noreply@locasite.xyz>",
        to: [business.email],
        subject: `Verify your ownership of ${business.name}`,
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Business Ownership</h2>
      <p>Click the link below to verify your ownership of <strong>${business.name}</strong>:</p>
      <p><a href="${verificationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none;">Verify Ownership</a></p>
      <p style="color: #666; font-size: 14px;">This link expires in 24 hours. If you did not request this, you can ignore this email.</p>
    </div>`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to send verification email: ${errorText}`);
    }

    return {
      success: true,
      message: "Verification email sent",
      email: business.email,
    };
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
export const resendVerificationEmail = mutation({
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
      throw new Error(
        "You don't have permission to resend verification for this claim",
      );
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

    // Update attempts count
    await ctx.db.patch(args.claimId, {
      verificationAttempts: attempts + 1,
      updatedAt: Date.now(),
    });

    // Send new verification email
    await ctx.scheduler.runAfter(
      0,
      api.emailVerification.sendVerificationEmail,
      {
        businessId: claim.businessId,
        claimId: args.claimId,
      },
    );

    return {
      success: true,
      message: "Verification email resent",
      attemptsRemaining: 5 - (attempts + 1),
    };
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
