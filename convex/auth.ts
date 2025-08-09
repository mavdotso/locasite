import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { SUBSCRIPTION_PLANS, type PlanType } from "./lib/plans";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async redirect({ redirectTo }) {
      // Only allow relative paths to prevent open redirect attacks
      if (!redirectTo || typeof redirectTo !== "string") {
        return "/";
      }
      
      // Ensure it's a relative path (starts with /)
      if (!redirectTo.startsWith("/")) {
        return "/";
      }
      
      // Prevent protocol-relative URLs like //evil.com
      if (redirectTo.startsWith("//")) {
        return "/";
      }
      
      // Allow redirects to business editor pages
      if (redirectTo.startsWith("/business/") && redirectTo.includes("/edit")) {
        return redirectTo;
      }
      
      // Allow other safe internal paths
      if (redirectTo.startsWith("/dashboard") || 
          redirectTo.startsWith("/settings") ||
          redirectTo === "/") {
        return redirectTo;
      }
      
      // Default to home page for any other paths
      return "/";
    }
  }
});

export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const currentUserWithSubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (userId === null) {
      return null;
    }
    
    const user = await ctx.db.get(userId);
    if (!user) return null;
    
    // Get customer record
    const customer = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    type SubscriptionInfo = {
      subscriptionId?: string;
      planType: PlanType;
      status: string;
      currentPeriodEnd?: number;
      cancelAtPeriodEnd: boolean;
      paymentMethod?: {
        brand?: string;
        last4?: string;
      };
      plan?: typeof SUBSCRIPTION_PLANS[PlanType];
    };
    
    let subscription: SubscriptionInfo = {
      planType: "FREE" as PlanType,
      status: "active",
      cancelAtPeriodEnd: false,
    };

    if (customer) {
      // Get subscription
      const stripeSubscription = await ctx.db
        .query("stripeSubscriptions")
        .withIndex("by_customerId", (q) =>
          q.eq("customerId", customer.stripeCustomerId),
        )
        .first();

      if (
        stripeSubscription &&
        ["active", "trialing"].includes(stripeSubscription.status)
      ) {
        subscription = {
          subscriptionId: stripeSubscription.subscriptionId,
          planType: stripeSubscription.planType || "FREE",
          status: stripeSubscription.status,
          currentPeriodEnd: stripeSubscription.currentPeriodEnd,
          cancelAtPeriodEnd: stripeSubscription.cancelAtPeriodEnd || false,
          paymentMethod: stripeSubscription.paymentMethod,
          plan: SUBSCRIPTION_PLANS[stripeSubscription.planType || "FREE"],
        };
      }
    }

    return {
      user,
      subscription,
    };
  },
});