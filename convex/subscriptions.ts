import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { SUBSCRIPTION_PLANS, type PlanType } from "./lib/plans";
import { getAuthUserId } from "@convex-dev/auth/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Get available subscription plans
export const getSubscriptionPlans = query({
  args: {},
  handler: async () => {
    return SUBSCRIPTION_PLANS;
  },
});

// Start subscription checkout
export const subscribe = action({
  args: {
    planType: v.union(v.literal("PROFESSIONAL"), v.literal("BUSINESS")),
  },
  handler: async (ctx, args): Promise<string | null> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const plan = SUBSCRIPTION_PLANS[args.planType];
    if (!plan) {
      throw new Error("Invalid plan type");
    }

    // Get user data
    const user = await ctx.runQuery(api.auth.currentUser);
    if (!user?.email) {
      throw new Error("User email not found");
    }

    // Get or create Stripe customer
    let stripeCustomerId: string | null = await ctx.runQuery(
      internal.stripe.getStripeCustomerId,
      { userId },
    );

    if (!stripeCustomerId) {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });

      await ctx.runMutation(internal.stripe.storeStripeCustomerId, {
        userId,
        stripeCustomerId: newCustomer.id,
      });

      stripeCustomerId = newCustomer.id;
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${BASE_URL}/dashboard?subscription=success`,
      cancel_url: `${BASE_URL}/dashboard?subscription=cancel`,
      metadata: {
        userId,
        planType: args.planType,
      },
    });

    // Create payment record
    await ctx.runMutation(api.payments.create, {
      amount: plan.price,
      stripeSessionId: checkoutSession.id,
    });

    return checkoutSession.url;
  },
});

// Get user's current subscription
export const getUserSubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Get customer record
    const customer = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!customer) {
      return {
        planType: "FREE" as PlanType,
        status: "active",
        cancelAtPeriodEnd: false,
      };
    }

    // Get subscription
    const subscription = await ctx.db
      .query("stripeSubscriptions")
      .withIndex("by_customerId", (q) =>
        q.eq("customerId", customer.stripeCustomerId),
      )
      .first();

    if (
      !subscription ||
      !["active", "trialing"].includes(subscription.status)
    ) {
      return {
        planType: "FREE" as PlanType,
        status: "active",
        cancelAtPeriodEnd: false,
      };
    }

    return {
      subscriptionId: subscription.subscriptionId,
      planType: subscription.planType || "FREE",
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
      paymentMethod: subscription.paymentMethod,
      plan: SUBSCRIPTION_PLANS[subscription.planType || "FREE"],
    };
  },
});

// Cancel subscription
export const cancelSubscription = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get customer ID
    const stripeCustomerId = await ctx.runQuery(
      internal.stripe.getStripeCustomerId,
      { userId },
    );
    if (!stripeCustomerId) {
      throw new Error("No subscription found");
    }

    // Get subscription
    const subscription = await ctx.runQuery(
      api.subscriptions.getUserSubscription,
    );
    if (!subscription || !subscription.subscriptionId) {
      throw new Error("No active subscription found");
    }

    // Cancel at period end
    await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: true,
    });

    // Sync data
    await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
      customerId: stripeCustomerId,
    });

    return { success: true };
  },
});

// Reactivate canceled subscription
export const reactivateSubscription = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get customer ID
    const stripeCustomerId = await ctx.runQuery(
      internal.stripe.getStripeCustomerId,
      { userId },
    );
    if (!stripeCustomerId) {
      throw new Error("No subscription found");
    }

    // Get subscription
    const subscription = await ctx.runQuery(
      api.subscriptions.getUserSubscription,
    );
    if (!subscription || !subscription.subscriptionId) {
      throw new Error("No subscription to reactivate");
    }

    if (!subscription.cancelAtPeriodEnd) {
      throw new Error("Subscription is not scheduled for cancellation");
    }

    // Remove cancellation
    await stripe.subscriptions.update(subscription.subscriptionId, {
      cancel_at_period_end: false,
    });

    // Sync data
    await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
      customerId: stripeCustomerId,
    });

    return { success: true };
  },
});

// Create customer portal session
export const createCustomerPortalSession = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get customer ID
    const stripeCustomerId = await ctx.runQuery(
      internal.stripe.getStripeCustomerId,
      { userId },
    );
    if (!stripeCustomerId) {
      return null;
    }

    try {
      // Create portal session
      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${BASE_URL}/dashboard/settings`,
      });

      return session.url;
    } catch (error) {
      console.error("Error creating customer portal session:", error);
      throw new Error("Failed to create customer portal session");
    }
  },
});

// Check if user can create more businesses
export const canCreateBusiness = query({
  args: {},
  handler: async (ctx): Promise<boolean> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    // Get user's subscription
    const userSubscription = await ctx.runQuery(
      api.subscriptions.getUserSubscription,
    );
    const userPlanType: PlanType = userSubscription?.planType || "FREE";

    // Get current business count
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const planConfig = SUBSCRIPTION_PLANS[userPlanType];
    if (planConfig.limits.businesses === -1) return true; // unlimited

    return businesses.length < planConfig.limits.businesses;
  },
});
