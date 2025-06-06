import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const send = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const contactMessageId = await ctx.db.insert("contactMessages", {
      ...args,
      status: "unread",
      createdAt: Date.now(),
    });

    return contactMessageId;
  },
});

export const getByBusiness = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("contactMessages")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .order("desc")
      .collect();

    return messages;
  },
});

export const markAsRead = mutation({
  args: {
    messageId: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      status: "read",
      updatedAt: Date.now(),
    });
  },
});

export const markAsResponded = mutation({
  args: {
    messageId: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      status: "responded",
      updatedAt: Date.now(),
    });
  },
});

export const getUnreadCount = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("contactMessages")
      .withIndex("by_business_status", (q) =>
        q.eq("businessId", args.businessId).eq("status", "unread")
      )
      .collect();

    return unreadMessages.length;
  },
});