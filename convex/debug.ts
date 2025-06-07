import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBusinessWithAI = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.id);
    return {
      business,
      hasAIContent: !!business?.aiGeneratedContent,
      aiContentKeys: business?.aiGeneratedContent ? Object.keys(business.aiGeneratedContent) : []
    };
  }
});

export const listRecentBusinesses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_createdAt")
      .order("desc")
      .take(5);
  }
});