import { v } from "convex/values";
import { action, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { stripe } from "./lib/stripe";
import { SUBSCRIPTION_PLANS, type PlanType } from "./lib/plans";
import { getAuthUserId } from "@convex-dev/auth/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const getSubscriptionPlans = query({
	args: {},
	handler: async () => {
		return SUBSCRIPTION_PLANS;
	},
});

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

		const user = await ctx.runQuery(api.auth.currentUser);
		if (!user?.email) {
			throw new Error("User email not found");
		}

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

		await ctx.runMutation(api.payments.create, {
			amount: plan.price,
			stripeSessionId: checkoutSession.id,
		});

		return checkoutSession.url;
	},
});

export const getUserSubscriptionByUserId = query({
	args: { userId: v.id("users") },
	handler: async (ctx, args) => {
		const customer = await ctx.db
			.query("stripeCustomers")
			.withIndex("by_user", (q) => q.eq("userId", args.userId))
			.first();

		if (!customer) {
			return {
				planType: "FREE" as PlanType,
				status: "active",
				cancelAtPeriodEnd: false,
			};
		}

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

export const getUserSubscription = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return null;

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

export const cancelSubscription = action({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const stripeCustomerId = await ctx.runQuery(
			internal.stripe.getStripeCustomerId,
			{ userId },
		);
		if (!stripeCustomerId) {
			throw new Error("No subscription found");
		}

		const subscription = await ctx.runQuery(
			api.subscriptions.getUserSubscription,
		);
		if (!subscription || !subscription.subscriptionId) {
			throw new Error("No active subscription found");
		}

		await stripe.subscriptions.update(subscription.subscriptionId, {
			cancel_at_period_end: true,
		});

		await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
			customerId: stripeCustomerId,
		});

		return { success: true };
	},
});

export const reactivateSubscription = action({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const stripeCustomerId = await ctx.runQuery(
			internal.stripe.getStripeCustomerId,
			{ userId },
		);
		if (!stripeCustomerId) {
			throw new Error("No subscription found");
		}

		const subscription = await ctx.runQuery(
			api.subscriptions.getUserSubscription,
		);
		if (!subscription || !subscription.subscriptionId) {
			throw new Error("No subscription to reactivate");
		}

		if (!subscription.cancelAtPeriodEnd) {
			throw new Error("Subscription is not scheduled for cancellation");
		}

		await stripe.subscriptions.update(subscription.subscriptionId, {
			cancel_at_period_end: false,
		});

		await ctx.runAction(internal.stripe.syncStripeDataToConvex, {
			customerId: stripeCustomerId,
		});

		return { success: true };
	},
});

export const createCustomerPortalSession = action({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const stripeCustomerId = await ctx.runQuery(
			internal.stripe.getStripeCustomerId,
			{ userId },
		);
		if (!stripeCustomerId) {
			return null;
		}

		try {
			const session = await stripe.billingPortal.sessions.create({
				customer: stripeCustomerId,
				return_url: `${BASE_URL}/dashboard/settings`,
			});

			return session.url;
		} catch {
			throw new Error("Failed to create customer portal session");
		}
	},
});

export const canCreateBusiness = query({
	args: {},
	handler: async (ctx): Promise<boolean> => {
		const userId = await getAuthUserId(ctx);
		if (!userId) return false;

		const userSubscription = await ctx.runQuery(
			api.subscriptions.getUserSubscription,
		);
		const userPlanType: PlanType = userSubscription?.planType || "FREE";

		const businesses = await ctx.db
			.query("businesses")
			.withIndex("by_userId", (q) => q.eq("userId", userId))
			.collect();

		const planConfig = SUBSCRIPTION_PLANS[userPlanType];
		if (planConfig.limits.businesses === -1) return true;

		return businesses.length < planConfig.limits.businesses;
	},
});
