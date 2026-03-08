import { v } from "convex/values";
import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { convexEnv } from "./lib/env";
import { getAuthUserId } from "@convex-dev/auth/server";

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

// Create Stripe checkout session for claiming a business
export const createClaimCheckoutSession = action({
  args: {
    businessId: v.id("businesses"),
    claimToken: v.string(),
  },
  handler: async (ctx, args): Promise<{ url: string | null }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Authentication required");

    // Get the user ID from the identity token
    // In Convex actions, we need to look up the user from the auth tables
    const userId = await ctx.runQuery(internal.claimCheckout.internal_getUserIdFromIdentity, {
      tokenIdentifier: identity.tokenIdentifier,
    });
    if (!userId) throw new Error("User not found");

    // Verify claim token matches business
    const business = await ctx.runQuery(
      internal.claimCheckout.internal_getBusinessByClaimToken,
      { claimToken: args.claimToken, businessId: args.businessId, userId },
    );

    if (!business) {
      throw new Error("Invalid claim token or business not found");
    }

    if (business.isClaimed) {
      throw new Error("This business has already been claimed");
    }
    let stripeCustomerId = await ctx.runQuery(
      internal.stripe.getStripeCustomerId,
      { userId },
    );

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
    const lineItems: Array<{
      price: string;
      quantity: number;
    }> = [];

    const setupPriceId = convexEnv.STRIPE_PRICE_CLAIM_SETUP;
    const maintenancePriceId = convexEnv.STRIPE_PRICE_CLAIM_MAINTENANCE;

    if (!setupPriceId || !maintenancePriceId) {
      throw new Error(
        "Stripe claim prices not configured. Set STRIPE_PRICE_CLAIM_SETUP and STRIPE_PRICE_CLAIM_MAINTENANCE.",
      );
    }

    // $149 one-time + $9/mo recurring in a single subscription checkout
    lineItems.push(
      { price: setupPriceId, quantity: 1 },
      { price: maintenancePriceId, quantity: 1 },
    );

    const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      line_items: lineItems,
      metadata: {
        claimType: "business_claim",
        businessId: args.businessId,
        claimToken: args.claimToken,
        userId,
      },
      success_url: `${appUrl}/claim/success?session_id={CHECKOUT_SESSION_ID}&business_id=${args.businessId}`,
      cancel_url: `${appUrl}/claim/${args.claimToken}`,
    });

    // Record payment attempt (public mutation, auth is passed through)
    await ctx.runMutation(api.payments.create, {
      amount: 14900, // $149 setup (first payment)
      stripeSessionId: session.id,
    });

    return { url: session.url };
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
    const userId = args.userId as any; // Trust the ID from our own metadata

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

// Unpublish business when claim subscription lapses
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
      if (business.isPublished) {
        await ctx.db.patch(business._id, {
          isPublished: false,
          publishingBlocked: true,
          publishingBlockReason: "Subscription payment failed or cancelled",
        });
      }
    }
  },
});
