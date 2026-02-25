import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { getPlanByPriceId } from "./lib/plans";
import { convexEnv } from "./lib/env";
import type Stripe from "stripe";

// Webhook handler for Stripe events
export const fulfill = internalAction({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async (ctx, args) => {
    const webhookSecret = convexEnv.STRIPE_WEBHOOKS_SECRET;
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOKS_SECRET is not set");
    }

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        args.payload,
        args.signature,
        webhookSecret,
      );
    } catch (err) {
      return { success: false, error: "Invalid webhook signature" };
    }


    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.id) {
            // Mark payment as completed
            await ctx.runMutation(internal.payments.fulfillBySessionId, {
              sessionId: session.id,
              stripeId: session.payment_intent as string,
            });
          }

          // Sync subscription data if customer exists
          if (session.customer && typeof session.customer === "string") {
            await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
              customerId: session.customer,
            });
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;
          if (customerId) {
            await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
              customerId,
            });
          }
          break;
        }

        case "invoice.payment_succeeded":
        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          if (customerId) {
            await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
              customerId,
            });
          }
          break;
        }

        default:
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  },
});

// Sync Stripe data to Convex database
export const syncStripeDataToConvex = internalAction({
  args: { customerId: v.string() },
  handler: async (ctx, args) => {
    try {
      // Fetch latest subscription data from Stripe
      const subscriptions = await stripe.subscriptions.list({
        customer: args.customerId,
        limit: 1,
        status: "all",
        expand: ["data.default_payment_method"],
      });

      // Handle case with no subscription
      if (subscriptions.data.length === 0) {
        await ctx.runMutation(internal.stripe.storeSubscriptionData, {
          customerId: args.customerId,
          subscriptionData: {
            status: "canceled",
            planType: "FREE",
          },
        });
        return;
      }

      // Extract subscription data
      const subscription = subscriptions.data[0];
      const priceId = subscription.items.data[0]?.price.id;
      const planType = priceId ? getPlanByPriceId(priceId) : "FREE";

      // Extract payment method details
      let paymentMethod = undefined;
      if (
        subscription.default_payment_method &&
        typeof subscription.default_payment_method === "object"
      ) {
        const pm = subscription.default_payment_method as Stripe.PaymentMethod;
        if (pm.card) {
          paymentMethod = {
            brand: pm.card.brand,
            last4: pm.card.last4,
          };
        }
      }

      // Store subscription data
      await ctx.runMutation(internal.stripe.storeSubscriptionData, {
        customerId: args.customerId,
        subscriptionData: {
          subscriptionId: subscription.id,
          status: subscription.status,
          priceId,
          planType: planType || "FREE",
          currentPeriodStart: (subscription as any).current_period_start,
          currentPeriodEnd: (subscription as any).current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          paymentMethod,
        },
      });
    } catch (error) {
      throw new Error(`Failed to sync Stripe data: ${error instanceof Error ? error.message : String(error)}`);
    }
  },
});

// Store subscription data in database
export const storeSubscriptionData = internalMutation({
  args: {
    customerId: v.string(),
    subscriptionData: v.object({
      subscriptionId: v.optional(v.string()),
      status: v.string(),
      priceId: v.optional(v.string()),
      planType: v.union(
        v.literal("FREE"),
        v.literal("PROFESSIONAL"),
        v.literal("BUSINESS"),
      ),
      currentPeriodStart: v.optional(v.number()),
      currentPeriodEnd: v.optional(v.number()),
      cancelAtPeriodEnd: v.optional(v.boolean()),
      paymentMethod: v.optional(
        v.object({
          brand: v.optional(v.string()),
          last4: v.optional(v.string()),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeSubscriptions")
      .withIndex("by_customerId", (q) => q.eq("customerId", args.customerId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args.subscriptionData);
    } else {
      await ctx.db.insert("stripeSubscriptions", {
        customerId: args.customerId,
        ...args.subscriptionData,
      });
    }
  },
});

// Get Stripe customer ID for a user
export const getStripeCustomerId = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const customer = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return customer?.stripeCustomerId || null;
  },
});

// Store Stripe customer ID for a user
export const storeStripeCustomerId = internalMutation({
  args: {
    userId: v.id("users"),
    stripeCustomerId: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        stripeCustomerId: args.stripeCustomerId,
      });
    } else {
      await ctx.db.insert("stripeCustomers", args);
    }
  },
});
