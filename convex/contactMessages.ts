import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getUserFromAuth } from "./lib/helpers";

export const send = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // Input validation
    if (args.name.length > 100) {
      throw new Error("Name must be 100 characters or less");
    }
    if (args.email.length > 254) {
      throw new Error("Email must be 254 characters or less");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
      throw new Error("Invalid email format");
    }
    if (args.message.length > 5000) {
      throw new Error("Message must be 5000 characters or less");
    }

    // Verify business exists
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

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
    const user = await getUserFromAuth(ctx);

    // Verify the caller owns the business
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }
    if (business.userId !== user._id) {
      throw new Error("Not authorized to view messages for this business");
    }

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
    const user = await getUserFromAuth(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Verify the caller owns the business associated with the message
    const business = await ctx.db.get(message.businessId);
    if (!business) {
      throw new Error("Business not found");
    }
    if (business.userId !== user._id) {
      throw new Error("Not authorized to update this message");
    }

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
    const user = await getUserFromAuth(ctx);

    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Verify the caller owns the business associated with the message
    const business = await ctx.db.get(message.businessId);
    if (!business) {
      throw new Error("Business not found");
    }
    if (business.userId !== user._id) {
      throw new Error("Not authorized to update this message");
    }

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

export const getTotalUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    // Get all unread messages across all businesses for the current user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return 0;
    }

    // Get all businesses owned by this user
    const userBusinesses = await ctx.db
      .query("businesses")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .collect();

    // Count unread messages for all user's businesses
    let totalUnread = 0;
    for (const business of userBusinesses) {
      const unreadMessages = await ctx.db
        .query("contactMessages")
        .withIndex("by_business_status", (q) =>
          q.eq("businessId", business._id).eq("status", "unread")
        )
        .collect();
      totalUnread += unreadMessages.length;
    }

    return totalUnread;
  },
});

export const getAllUserMessages = query({
  args: {},
  handler: async (ctx) => {
    // Get all messages across all businesses for the current user
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get all businesses owned by this user
    const userBusinesses = await ctx.db
      .query("businesses")
      .withIndex("by_userId", q => q.eq("userId", userId))
      .collect();

    // Get all messages for all user's businesses
    const allMessages = [];
    for (const business of userBusinesses) {
      const businessMessages = await ctx.db
        .query("contactMessages")
        .withIndex("by_business", (q) => q.eq("businessId", business._id))
        .order("desc")
        .collect();
      
      // Add business info to each message
      for (const message of businessMessages) {
        allMessages.push({
          ...message,
          business: {
            name: business.name,
            _id: business._id
          }
        });
      }
    }

    // Sort by creation date (newest first)
    allMessages.sort((a, b) => b.createdAt - a.createdAt);

    return allMessages;
  },
});