import { action } from "../_generated/server";
import { v } from "convex/values";
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { PartialBusinessData } from "./types";

export const generateBusinessContent = action({
  args: {
    businessData: v.object({
      name: v.string(),
      address: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      description: v.optional(v.string()),
      reviews: v.optional(v.array(v.object({
        reviewer: v.string(),
        rating: v.string(),
        text: v.string()
      }))),
      rating: v.optional(v.number()),
    })
  },
  handler: async (ctx, args) => {
    const { businessData } = args;

    try {
      console.log('AI content generation starting for:', businessData.name);
      
      // Determine business category/industry from name and description
      const businessCategory = await inferBusinessCategory(businessData);
      console.log('Business category inferred:', businessCategory);
      
      // Define the schema for the content structure
      const contentSchema = z.object({
        hero: z.object({
          title: z.string(),
          subtitle: z.string()
        }),
        about: z.object({
          content: z.string()
        }),
        services: z.object({
          title: z.string(),
          items: z.array(z.object({
            title: z.string(),
            description: z.string()
          }))
        }),
        whyChooseUs: z.object({
          title: z.string(),
          points: z.array(z.string())
        }),
        callToAction: z.object({
          primary: z.string(),
          secondary: z.string(),
          urgency: z.string()
        }),
        seo: z.object({
          metaTitle: z.string(),
          metaDescription: z.string(),
          keywords: z.array(z.string())
        })
      });

      // Generate comprehensive content using structured output
      const result = await generateObject({
        model: openai('gpt-4o'),
        schema: contentSchema,
        prompt: `Create comprehensive website content for this business:

Business Name: ${businessData.name}
Address: ${businessData.address || 'Not provided'}
Phone: ${businessData.phone || 'Not provided'}
Website: ${businessData.website || 'Not provided'}
Description: ${businessData.description || 'No description provided - please infer from business name and category'}
Category: ${businessCategory}
Rating: ${businessData.rating ? `${businessData.rating} stars` : 'Not available'}
Number of Reviews: ${businessData.reviews?.length || 0}

Sample Reviews: ${businessData.reviews?.slice(0, 3).map(r => `"${r.text}" - ${r.reviewer}`).join('\n\n') || 'No reviews available'}

IMPORTANT: You must respond with ONLY valid JSON. Do not include any other text, explanations, or markdown formatting. Start with { and end with }.

Generate the following content sections in this exact JSON structure:

{
  "hero": {
    "title": "Compelling headline (max 60 chars)",
    "subtitle": "Engaging tagline that highlights value proposition (max 120 chars)"
  },
  "about": {
    "content": "Detailed 3-4 paragraph about section that tells the business story, highlights expertise, and builds trust. Focus on what makes them unique and why customers should choose them."
  },
  "services": {
    "title": "Our Services",
    "items": [
      {
        "title": "Service 1",
        "description": "Brief description"
      },
      {
        "title": "Service 2", 
        "description": "Brief description"
      },
      {
        "title": "Service 3",
        "description": "Brief description"
      }
    ]
  },
  "whyChooseUs": {
    "title": "Why Choose Us",
    "points": [
      "Unique selling point 1",
      "Unique selling point 2", 
      "Unique selling point 3",
      "Unique selling point 4"
    ]
  },
  "callToAction": {
    "primary": "Main CTA button text",
    "secondary": "Secondary CTA text",
    "urgency": "Create urgency phrase"
  },
  "seo": {
    "metaTitle": "SEO optimized title (max 60 chars)",
    "metaDescription": "SEO meta description (max 160 chars)",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}

Make the content:
- Professional yet conversational
- Locally focused (mention the area/city if possible)
- Action-oriented with clear value propositions
- Trustworthy and credible
- SEO-friendly with natural keyword integration
- Specific to the business type/industry

Do not use generic placeholder text. Create specific, compelling content based on the business information provided.`
      });

      // The result is already a parsed object from generateObject
      const generatedContent = result.object;
      console.log('AI content generation completed successfully for:', businessData.name);

      return {
        success: true,
        content: generatedContent,
        businessCategory
      };

    } catch (error) {
      console.error('AI content generation error for', businessData.name, ':', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : error}`);
    }
  }
});

// Helper function to infer business category
async function inferBusinessCategory(businessData: Pick<PartialBusinessData, 'name' | 'address' | 'description'>): Promise<string> {
  try {
    const categoryResult = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are a business categorization expert. Classify businesses into specific industry categories.'
        },
        {
          role: 'user',
          content: `Based on this business information, return ONLY the most specific business category (e.g., "Italian Restaurant", "Hair Salon", "Auto Repair Shop", "Dental Practice", "Law Firm", etc.):

Business Name: ${businessData.name}
Description: ${businessData.description || 'Not provided'}
Address: ${businessData.address || 'Not provided'}

Return only the category name, nothing else.`
        }
      ]
    });

    return categoryResult.text.trim();
  } catch (error) {
    console.error('Category inference error:', error);
    return 'Local Business';
  }
}