import { action } from "./_generated/server";
import { v } from "convex/values";
import { openai } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { PartialBusinessData } from "./lib/types";

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
      
      const businessCategory = await inferBusinessCategory(businessData);
      
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
            description: z.string(),
            icon: z.optional(z.string()),
            features: z.optional(z.array(z.string()))
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
        }),
        testimonials: z.object({
          title: z.string(),
          items: z.array(z.object({
            name: z.string(),
            text: z.string(),
            rating: z.number(),
            role: z.optional(z.string()),
            location: z.optional(z.string()),
            date: z.optional(z.string())
          }))
        }),
        features: z.optional(z.object({
          title: z.string(),
          subtitle: z.string(),
          items: z.array(z.object({
            title: z.string(),
            description: z.string(),
            icon: z.string()
          }))
        })),
        process: z.optional(z.object({
          title: z.string(),
          subtitle: z.string(),
          steps: z.array(z.object({
            number: z.string(),
            title: z.string(),
            description: z.string()
          }))
        })),
        faq: z.optional(z.object({
          title: z.string(),
          items: z.array(z.object({
            question: z.string(),
            answer: z.string()
          }))
        })),
        team: z.optional(z.object({
          title: z.string(),
          subtitle: z.string(),
          members: z.array(z.object({
            name: z.string(),
            role: z.string(),
            bio: z.string(),
            expertise: z.array(z.string())
          }))
        })),
        stats: z.optional(z.object({
          title: z.string(),
          items: z.array(z.object({
            number: z.string(),
            label: z.string(),
            suffix: z.optional(z.string())
          }))
        })),
        specialOffers: z.optional(z.object({
          title: z.string(),
          offers: z.array(z.object({
            title: z.string(),
            description: z.string(),
            validUntil: z.string(),
            code: z.optional(z.string())
          }))
        }))
      });

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

Generate ALL content sections including optional ones. Make them highly relevant to the ${businessCategory} industry:

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
        "title": "Service name specific to ${businessCategory}",
        "description": "Detailed description",
        "icon": "icon-name",
        "features": ["feature1", "feature2", "feature3"]
      }
    ]
  },
  "whyChooseUs": {
    "title": "Why Choose ${businessData.name}",
    "points": ["Specific benefit 1", "Specific benefit 2", "Specific benefit 3", "Specific benefit 4"]
  },
  "callToAction": {
    "primary": "Industry-specific CTA",
    "secondary": "Secondary action",
    "urgency": "Time-sensitive message"
  },
  "seo": {
    "metaTitle": "${businessData.name} - ${businessCategory} in [City]",
    "metaDescription": "Compelling meta description",
    "keywords": ["relevant", "local", "keywords"]
  },
  "testimonials": {
    "title": "What Our Customers Say",
    "items": [Generate 5-6 testimonials]
  },
  "features": {
    "title": "Why We Stand Out",
    "subtitle": "Key advantages specific to ${businessCategory}",
    "items": [Generate 4-6 features with icons like "shield", "clock", "star", "check", "users", "award"]
  },
  "process": {
    "title": "Our Process",
    "subtitle": "How we deliver exceptional results",
    "steps": [Generate 4-5 process steps numbered "01", "02", etc.]
  },
  "faq": {
    "title": "Frequently Asked Questions",
    "items": [Generate 6-8 FAQs specific to ${businessCategory}]
  },
  "team": {
    "title": "Meet Our Team",
    "subtitle": "Experienced professionals dedicated to your success",
    "members": [Generate 3-4 team members with realistic names, roles, bios, and expertise areas]
  },
  "stats": {
    "title": "Our Impact",
    "items": [
      {"number": "500+", "label": "Happy Customers", "suffix": ""},
      {"number": "10", "label": "Years Experience", "suffix": "+"},
      {"number": "98", "label": "Customer Satisfaction", "suffix": "%"},
      {"number": "24/7", "label": "Support Available", "suffix": ""}
    ]
  },
  "specialOffers": {
    "title": "Special Offers",
    "offers": [Generate 2-3 compelling offers with realistic validity periods]
  }
}

Requirements:
- Make ALL content specific to ${businessCategory} - no generic placeholders
- Use professional language appropriate for the industry
- Include local references based on the address
- Create diverse, realistic testimonials
- Generate believable team members with industry-appropriate roles
- Make FAQs address real concerns for this business type
- Stats should be realistic for the business size/type
- Process steps should reflect actual ${businessCategory} workflows
- Features should highlight competitive advantages
- Special offers should be compelling but realistic
- Services must include specific features relevant to each service

For icons, use appropriate ones like: shield, clock, star, check, users, award, heart, globe, phone, mail, map, tool, chart, lock, zap, etc.`
      });

      const generatedContent = result.object;

      return {
        success: true,
        content: generatedContent,
        businessCategory
      };

    } catch (error) {
      throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : error}`);
    }
  }
});

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
    return 'Local Business';
  }
}