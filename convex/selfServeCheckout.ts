import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { convexEnv } from "./lib/env";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Id } from "./_generated/dataModel";

// Create Stripe checkout session for self-serve publish
export const createSelfServeCheckoutSession = action({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args): Promise<{ url: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Authentication required");

    // Get the user ID
    const userId = await ctx.runQuery(
      internal.selfServeCheckout.internal_getUserId,
      {},
    );
    if (!userId) throw new Error("User not found");

    // Verify business ownership and get Stripe customer in parallel
    const [business, stripeCustomerIdResult] = await Promise.all([
      ctx.runQuery(
        internal.selfServeCheckout.internal_getBusinessForCheckout,
        { businessId: args.businessId, userId },
      ),
      ctx.runQuery(internal.stripe.getStripeCustomerId, { userId }),
    ]);

    if (!business) {
      throw new Error("Business not found or you don't own it");
    }

    if (business.isPublished) {
      throw new Error("This site is already published");
    }

    // Create Stripe customer if needed
    let stripeCustomerId = stripeCustomerIdResult;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: identity.email || undefined,
        name: identity.name || undefined,
        metadata: { convexUserId: userId },
      });
      stripeCustomerId = customer.id;
      await ctx.runMutation(internal.stripe.storeStripeCustomerId, {
        userId,
        stripeCustomerId,
      });
    }

    // Build line items
    const setupPriceId = convexEnv.STRIPE_PRICE_CLAIM_SETUP;
    const maintenancePriceId = convexEnv.STRIPE_PRICE_CLAIM_MAINTENANCE;

    if (!setupPriceId || !maintenancePriceId) {
      throw new Error(
        "Stripe prices not configured. Set STRIPE_PRICE_CLAIM_SETUP and STRIPE_PRICE_CLAIM_MAINTENANCE.",
      );
    }

    const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;

    // $149 one-time + $9/mo recurring in a single subscription checkout
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: [
        { price: setupPriceId, quantity: 1 },
        { price: maintenancePriceId, quantity: 1 },
      ],
      metadata: {
        claimType: "self_serve_publish",
        businessId: args.businessId,
        userId,
      },
      success_url: `${appUrl}/live/${args.businessId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/preview/${args.businessId}`,
    });

    // Record payment attempt
    await ctx.runMutation(api.payments.create, {
      amount: 14900,
      stripeSessionId: session.id,
    });

    return { url: session.url };
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
