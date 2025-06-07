import { action } from "./_generated/server";
import { v } from "convex/values";
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

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
      // Determine business category/industry from name and description
      const businessCategory = await inferBusinessCategory(businessData);
      
      // Generate comprehensive content
      const content = await generateText({
        model: openai('gpt-4o'),
        messages: [
          {
            role: 'system',
            content: `You are a professional copywriter specializing in creating compelling website content for local businesses. Generate engaging, professional content that converts visitors into customers.`
          },
          {
            role: 'user',
            content: `Create comprehensive website content for this business:

Business Name: ${businessData.name}
Address: ${businessData.address || 'Not provided'}
Phone: ${businessData.phone || 'Not provided'}
Website: ${businessData.website || 'Not provided'}
Description: ${businessData.description || 'Not provided'}
Category: ${businessCategory}
Rating: ${businessData.rating ? `${businessData.rating} stars` : 'Not available'}
Number of Reviews: ${businessData.reviews?.length || 0}

Sample Reviews: ${businessData.reviews?.slice(0, 3).map(r => `"${r.text}" - ${r.reviewer}`).join('\n') || 'No reviews available'}

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
          }
        ]
      });

      // Parse the generated JSON content
      let generatedContent;
      try {
        // Try to extract JSON from the response if it's wrapped in other text
        let jsonText = content.text.trim();
        
        // Look for JSON block if wrapped in markdown code blocks
        const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1].trim();
        }
        
        // Try to find JSON object start/end if mixed with other text
        const jsonStart = jsonText.indexOf('{');
        const jsonEnd = jsonText.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
        }
        
        generatedContent = JSON.parse(jsonText);
      } catch (e) {
        console.error('Failed to parse AI response as JSON:', e);
        console.error('AI response was:', content.text);
        
        // Create fallback content based on business data
        generatedContent = {
          hero: {
            title: businessData.name,
            subtitle: businessData.description || `Welcome to ${businessData.name} - your trusted local business`
          },
          about: {
            content: businessData.description || `${businessData.name} is committed to providing excellent service to our customers. Located at ${businessData.address}, we pride ourselves on quality and customer satisfaction.`
          },
          services: {
            title: "Our Services",
            items: [
              {
                title: "Professional Service",
                description: "We provide professional, high-quality service to meet your needs."
              },
              {
                title: "Customer Support", 
                description: "Our dedicated team is here to help you every step of the way."
              },
              {
                title: "Quality Guarantee",
                description: "We stand behind our work with a commitment to excellence."
              }
            ]
          },
          whyChooseUs: {
            title: "Why Choose Us",
            points: [
              "Experienced and professional team",
              "Commitment to quality and excellence", 
              "Customer satisfaction guaranteed",
              "Competitive pricing and value"
            ]
          },
          callToAction: {
            primary: "Contact Us Today",
            secondary: "Learn More",
            urgency: "Get in touch today for exceptional service"
          },
          seo: {
            metaTitle: businessData.name,
            metaDescription: businessData.description || `${businessData.name} - your trusted local business`,
            keywords: [businessData.name.toLowerCase(), "local business", "professional service"]
          }
        };
      }

      return {
        success: true,
        content: generatedContent,
        businessCategory
      };

    } catch (error) {
      console.error('AI content generation error:', error);
      throw new Error(`Failed to generate content: ${error}`);
    }
  }
});

// Helper function to infer business category
async function inferBusinessCategory(businessData: any): Promise<string> {
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