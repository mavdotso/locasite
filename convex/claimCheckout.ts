import { v } from "convex/values";
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { convexEnv } from "./lib/env";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

// Get business info by claim token (public, no auth required)
export const getByClaimToken = query({
  args: { claimToken: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_claimToken", (q) => q.eq("claimToken", args.claimToken))
      .first();

    if (!business) return null;

    // Get domain for preview URL
    let previewUrl = null;
    if (business.domainId) {
      const domain = await ctx.db.get(business.domainId);
      if (domain) {
        const rootDomain = convexEnv.NEXT_PUBLIC_ROOT_DOMAIN;
        previewUrl = `https://${domain.subdomain}.${rootDomain}`;
      }
    }

    // Return safe public data only
    return {
      businessId: business._id,
      name: business.name,
      address: business.address,
      phone: business.phone,
      rating: business.rating,
      reviewCount: business.reviewCount || business.reviews?.length || 0,
      category: business.category,
      description: business.description,
      photos: business.photos?.slice(0, 3) || [],
      previewUrl,
      isClaimed: !!business.userId,
    };
  },
});

// DEPRECATED: Payment is no longer required to claim a business.
// Use claimBusinessAfterAuth directly instead.
export const createClaimCheckoutSession = action({
  args: {
    businessId: v.id("businesses"),
    claimToken: v.string(),
  },
  handler: async (): Promise<{ url: string | null }> => {
    throw new Error(
      "Payment is no longer required to claim a business. Use claimBusinessAfterAuth directly.",
    );
  },
});

// Internal query to get business by claim token
export const internal_getBusinessByClaimToken = internalQuery({
  args: {
    claimToken: v.string(),
    businessId: v.id("businesses"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_claimToken", (q) => q.eq("claimToken", args.claimToken))
      .first();

    if (!business || business._id !== args.businessId) return null;

    return {
      businessId: business._id,
      name: business.name,
      isClaimed: !!business.userId,
      userId_for_auth: args.userId,
    };
  },
});

// Handle successful claim payment (called from webhook)
export const internal_handleClaimPayment = internalMutation({
  args: {
    businessId: v.id("businesses"),
    userId: v.string(),
    stripeSessionId: v.string(),
    stripeSubscriptionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");

    // Already claimed
    if (business.userId) return;

    // Find the user by their string ID
    // The userId from Stripe metadata is the Convex user ID
    const userId = args.userId as Id<"users">;

    // Transfer ownership
    await ctx.db.patch(args.businessId, {
      userId,
      canPublish: true,
      verificationRequired: false,
      isPublished: true,
      publishedAt: Date.now(),
      claimStripeSubscriptionId: args.stripeSubscriptionId,
    });

    // Create an approved claim record
    await ctx.db.insert("businessClaims", {
      businessId: args.businessId,
      userId,
      status: "approved",
      verificationMethod: "manual",
      createdAt: Date.now(),
      stripeSessionId: args.stripeSessionId,
      paidAt: Date.now(),
    });
  },
});

// Look up user ID from auth context (used by actions via ctx.runQuery)
export const internal_getUserIdFromIdentity = internalQuery({
  args: { tokenIdentifier: v.string() },
  handler: async (ctx, _args) => {
    // Auth context propagates from the calling action
    const userId = await getAuthUserId(ctx);
    return userId;
  },
});

// Handle lapsed subscription: clear subscription link but keep site published.
// Under the freemium model, sites stay live regardless of subscription status.
export const internal_unpublishForLapsedSubscription = internalMutation({
  args: {
    subscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find business with this subscription
    const businesses = await ctx.db
      .query("businesses")
      .filter((q) =>
        q.eq(q.field("claimStripeSubscriptionId"), args.subscriptionId),
      )
      .collect();

    for (const business of businesses) {
      // Clear the subscription link but keep the site published.
      // Free-tier sites remain live; only paid features are removed.
      await ctx.db.patch(business._id, {
        claimStripeSubscriptionId: undefined,
      });
    }
  },
});
