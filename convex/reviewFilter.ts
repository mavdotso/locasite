import { action } from "./_generated/server";
import { v } from "convex/values";
import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

interface Review {
  reviewer: string;
  rating: number;
  text: string;
}

interface FilteredReview extends Review {
  sentiment: 'positive' | 'neutral' | 'negative';
  quality: 'high' | 'medium' | 'low';
  usefulness: number; // 0-10 scale
}

export const filterAndEnhanceReviews = action({
  args: {
    reviews: v.array(v.object({
      reviewer: v.string(),
      rating: v.number(),
      text: v.string()
    })),
    businessName: v.string(),
    businessType: v.string(),
    maxReviews: v.optional(v.number()),
    onlyPositive: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    // TODO: Add rate limiting for review filtering.
    // This action is called without auth during preview flow, so IP-based
    // rate limiting (via the RateLimiter component in an httpAction wrapper)
    // should be applied to prevent abuse.
    const { reviews, businessName, businessType, maxReviews = 10, onlyPositive = true } = args;
    
    if (!reviews || reviews.length === 0) {
      return {
        filteredReviews: [],
        aiGeneratedReviews: await generateAIReviews(businessName, businessType, 5)
      };
    }

    try {
      // Analyze all reviews
      const reviewAnalysisSchema = z.object({
        reviews: z.array(z.object({
          index: z.number(),
          sentiment: z.enum(['positive', 'neutral', 'negative']),
          quality: z.enum(['high', 'medium', 'low']),
          usefulness: z.number().min(0).max(10),
          keyPoints: z.array(z.string()),
          improvedText: z.string()
        }))
      });

      const result = await generateObject({
        model: openai('gpt-4o'),
        schema: reviewAnalysisSchema,
        prompt: `Analyze these customer reviews for ${businessName} (${businessType}):

${reviews.map((r, i) => `Review ${i}: Rating: ${r.rating}/5, Text: "${r.text}" - ${r.reviewer}`).join('\n\n')}

For each review, determine:
1. Sentiment (positive/neutral/negative)
2. Quality (high/medium/low) - based on detail, specificity, and helpfulness
3. Usefulness score (0-10) - how helpful is this for potential customers
4. Key points mentioned
5. Improved version - enhance grammar, clarity while keeping the original meaning and authenticity

Focus on identifying genuinely positive experiences that would build trust with potential customers.`
      });

      // Process the analysis results
      const analyzedReviews: FilteredReview[] = result.object.reviews.map((analysis, index) => ({
        ...reviews[index],
        sentiment: analysis.sentiment,
        quality: analysis.quality,
        usefulness: analysis.usefulness,
        text: analysis.improvedText || reviews[index].text
      }));

      // Filter based on criteria
      let filteredReviews = analyzedReviews;
      
      if (onlyPositive) {
        filteredReviews = filteredReviews.filter(r => r.sentiment === 'positive');
      }
      
      // Sort by usefulness and quality
      filteredReviews.sort((a, b) => {
        if (a.quality !== b.quality) {
          const qualityOrder = { high: 3, medium: 2, low: 1 };
          return qualityOrder[b.quality] - qualityOrder[a.quality];
        }
        return b.usefulness - a.usefulness;
      });

      // Take only the best reviews
      const topReviews = filteredReviews.slice(0, maxReviews);

      // Generate complementary AI reviews if needed
      const needMoreReviews = topReviews.length < maxReviews;
      const aiReviewCount = needMoreReviews ? Math.min(5, maxReviews - topReviews.length) : 0;
      
      const aiGeneratedReviews = aiReviewCount > 0 
        ? await generateAIReviews(businessName, businessType, aiReviewCount, topReviews)
        : [];

      return {
        filteredReviews: topReviews.map(({ sentiment, quality, usefulness, ...review }) => review),
        aiGeneratedReviews,
        stats: {
          totalReviews: reviews.length,
          positiveCount: analyzedReviews.filter(r => r.sentiment === 'positive').length,
          neutralCount: analyzedReviews.filter(r => r.sentiment === 'neutral').length,
          negativeCount: analyzedReviews.filter(r => r.sentiment === 'negative').length,
          averageUsefulness: analyzedReviews.reduce((sum, r) => sum + r.usefulness, 0) / analyzedReviews.length
        }
      };
    } catch (error) {
      // Fallback to simple rating-based filtering
      const simpleFiltered = reviews
        .filter(r => r.rating >= 4)
        .slice(0, maxReviews);
      
      return {
        filteredReviews: simpleFiltered,
        aiGeneratedReviews: [],
        stats: null
      };
    }
  }
});

async function generateAIReviews(
  businessName: string, 
  businessType: string, 
  count: number,
  existingReviews?: Review[]
): Promise<Review[]> {
  try {
    const reviewSchema = z.object({
      reviews: z.array(z.object({
        reviewer: z.string(),
        rating: z.number(),
        text: z.string(),
        persona: z.string()
      }))
    });

    const existingThemes = existingReviews?.map(r => r.text).join('\n') || '';

    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: reviewSchema,
      prompt: `Generate ${count} realistic, diverse customer reviews for ${businessName} (${businessType}).

${existingThemes ? `Existing review themes to complement (don't duplicate): ${existingThemes}` : ''}

Requirements:
1. Create diverse customer personas (different ages, backgrounds, needs)
2. Include specific details about their experience
3. Mention different aspects of the business
4. Use natural, conversational language
5. Vary review length (2-5 sentences)
6. All should be positive (4-5 stars) but realistic
7. Include local references when possible
8. Make each review unique and authentic

For each review, also specify the persona type (e.g., "Young Professional", "Local Family", "First-time Customer", etc.)`
    });

    return result.object.reviews.map(r => ({
      reviewer: r.reviewer,
      rating: r.rating,
      text: r.text
    }));
  } catch (error) {
    return [];
  }
}