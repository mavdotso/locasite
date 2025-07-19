import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a payment record
export const create = mutation({
  args: {
    amount: v.number(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("payments", {
      userId,
      amount: args.amount,
      status: "created",
      stripeSessionId: args.stripeSessionId,
      createdAt: Date.now(),
    });
  },
});

// Internal mutation to fulfill payment by session ID
export const fulfillBySessionId = internalMutation({
  args: {
    sessionId: v.string(),
    stripeId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.sessionId),
      )
      .first();

    if (!payment) {
      console.error(`Payment not found for session: ${args.sessionId}`);
      return;
    }

    await ctx.db.patch(payment._id, {
      status: "completed",
      completedAt: Date.now(),
      stripeId: args.stripeId,
    });
  },
});

// Get user's payment history
export const listByUser = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const limit = args.limit || 10;

    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

// Get payment by session ID
export const getBySessionId = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("payments")
      .withIndex("stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.sessionId),
      )
      .first();
  },
});

// Update payment status
export const updateStatus = internalMutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(
      v.literal("created"),
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.paymentId, {
      status: args.status,
    });
  },
});
