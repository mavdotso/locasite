import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const regenerateAIContentForBusiness = action({
  args: { 
    businessId: v.id("businesses"),
    includeReviews: v.optional(v.boolean())
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    content: any;
    businessCategory?: string;
    reviewsFiltered?: boolean;
    error?: string;
  }> => {
    // Get the business
    const business: Doc<"businesses"> | null = await ctx.runQuery(api.businesses.getById, { id: args.businessId });
    if (!business) {
      throw new Error("Business not found");
    }

    try {
      // Prepare business data for AI generation
      const businessData: {
        name: string;
        address: string;
        phone?: string;
        website?: string;
        description?: string;
        reviews: Array<{ reviewer: string; rating: string; text: string }>;
        rating?: number;
      } = {
        name: business.name,
        address: business.address,
        phone: business.phone,
        website: business.website,
        description: business.description,
        reviews: business.reviews,
        rating: business.rating
      };

      // Generate comprehensive AI content
      const contentResult: any = await ctx.runAction(api.aiContentGenerator.generateBusinessContent, {
        businessData
      });

      if (!contentResult.success) {
        throw new Error("Failed to generate AI content");
      }

      // If includeReviews is true, also filter and enhance reviews
      let filteredReviews = business.reviews;
      // TODO: Implement review filtering once the API endpoint is properly set up
      // For now, just use the existing reviews

      // Update the business with the new content
      await ctx.runMutation(api.businesses.update, {
        id: args.businessId,
        business: {
          aiGeneratedContent: contentResult.content
        }
      });

      console.log('AI content regenerated successfully for:', business.name);
      return { 
        success: true, 
        content: contentResult.content,
        businessCategory: contentResult.businessCategory,
        reviewsFiltered: args.includeReviews || false
      };
    } catch (error) {
      console.error('Error regenerating AI content:', error);
      
      // Fallback to basic content if AI generation fails
      const fallbackContent = {
        hero: {
          title: business.name,
          subtitle: business.description || `Welcome to ${business.name}`
        },
        about: {
          content: business.description || `${business.name} is dedicated to providing exceptional service to our customers.`
        },
        services: {
          title: "Our Services",
          items: [{
            title: "Quality Service",
            description: "We provide top-notch service to all our customers.",
            icon: "star"
          }]
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

      await ctx.runMutation(api.businesses.update, {
        id: args.businessId,
        business: {
          aiGeneratedContent: fallbackContent
        }
      });

      return { 
        success: false, 
        content: fallbackContent,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
});