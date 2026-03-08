import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { convexEnv } from "./lib/env";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

// DEPRECATED: Publishing is now free. Kept for backward compat with in-flight
// checkout sessions. Remove after April 2026.
export const createSelfServeCheckoutSession = action({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (): Promise<{ url: string | null }> => {
    throw new Error(
      "Payment is no longer required to publish. Use publishBusiness directly.",
    );
  },
});

// Internal query to get userId from auth
export const internal_getUserId = internalQuery({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId;
  },
});

// Internal query to verify business ownership
export const internal_getBusinessForCheckout = internalQuery({
  args: {
    businessId: v.id("businesses"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    // Must be owned by the requesting user
    if (business.userId !== args.userId) return null;

    return {
      businessId: business._id,
      name: business.name,
      isPublished: business.isPublished ?? false,
    };
  },
});

// Handle successful self-serve payment (called from Stripe webhook)
export const internal_handleSelfServePayment = internalMutation({
  args: {
    businessId: v.id("businesses"),
    userId: v.id("users"),
    stripeSessionId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");

    // Already published — idempotent
    if (business.isPublished) return;

    // Publish the site
    await ctx.db.patch(args.businessId, {
      canPublish: true,
      isPublished: true,
      publishedAt: Date.now(),
      claimStripeSubscriptionId: args.stripeSubscriptionId,
    });

    // Create an approved claim record for audit trail
    await ctx.db.insert("businessClaims", {
      businessId: args.businessId,
      userId: args.userId,
      status: "approved",
      verificationMethod: "manual",
      createdAt: Date.now(),
      stripeSessionId: args.stripeSessionId,
      paidAt: Date.now(),
    });
  },
});
