import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const join = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();

    // Check for duplicate
    const existing = await ctx.db
      .query("managedWaitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      return { success: true, alreadyJoined: true };
    }

    await ctx.db.insert("managedWaitlist", {
      email,
      createdAt: Date.now(),
    });

    return { success: true, alreadyJoined: false };
  },
});

export const count = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("managedWaitlist").collect();
    return entries.length;
  },
});
