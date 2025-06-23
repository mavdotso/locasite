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

    // AI content generation is currently disabled (premium feature)
    // For now, return a placeholder response
    const placeholderContent: AIContentResult = {
      hero: {
        title: business.name,
        subtitle: business.description || `Welcome to ${business.name}`
      },
      about: {
        content: business.description || `${business.name} is dedicated to providing exceptional service to our customers.`
      },
      services: {
        title: "Our Services",
        items: []
      },
      whyChooseUs: {
        title: "Why Choose Us",
        points: [
          "Professional and experienced team",
          "Customer satisfaction guaranteed",
          "Competitive pricing",
          "Quality service"
        ]
      },
      callToAction: {
        primary: "Contact Us",
        secondary: "Learn More",
        urgency: "Get in touch today!"
      },
      seo: {
        metaTitle: `${business.name} - ${business.address}`,
        metaDescription: business.description || `Visit ${business.name} for quality service. Located at ${business.address}.`,
        keywords: [business.name, "local business", "quality service"]
      }
    };

    // Update the business with placeholder content
    await ctx.runMutation(api.businesses.update, {
      id: args.businessId,
      business: {
        aiGeneratedContent: placeholderContent
      }
    });

    console.log('Placeholder AI content generated for:', business.name);
    return { success: true, content: placeholderContent };
  }
});