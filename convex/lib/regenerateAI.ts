import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Doc } from "../_generated/dataModel";
import { AIContentResult } from "./types";

export const regenerateAIContentForBusiness = action({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args): Promise<{ success: boolean; content: AIContentResult }> => {
    // Get the business
    const business: Doc<"businesses"> | null = await ctx.runQuery(api.businesses.getById, { id: args.businessId });
    if (!business) {
      throw new Error("Business not found");
    }

    // Generate AI content
    try {
      console.log('Regenerating AI content for:', business.name);
      const aiResult = await ctx.runAction(api.aiContentGenerator.generateBusinessContent, {
        businessData: {
          name: business.name,
          address: business.address,
          phone: business.phone,
          website: business.website,
          description: business.description,
          reviews: business.reviews,
          rating: business.rating
        }
      });

      // Update the business with AI content
      await ctx.runMutation(api.businesses.update, {
        id: args.businessId,
        business: {
          aiGeneratedContent: aiResult.content
        }
      });

      console.log('AI content regeneration successful for:', business.name);
      return { success: true, content: aiResult.content };
    } catch (error) {
      console.error('AI content regeneration failed:', error);
      throw error;
    }
  }
});