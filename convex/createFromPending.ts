import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { getUserFromAuth } from './helpers';

export const createBusinessFromPendingData = mutation({
  args: {
    businessData: v.object({
      name: v.string(),
      placeId: v.string(),
      address: v.string(),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      hours: v.array(v.string()),
      rating: v.optional(v.number()),
      reviews: v.array(v.object({
        reviewer: v.string(),
        rating: v.string(),
        text: v.string()
      })),
      photos: v.array(v.string()),
      description: v.optional(v.string())
    }),
    aiContent: v.optional(v.union(v.null(), v.object({
      hero: v.optional(v.object({
        title: v.string(),
        subtitle: v.string()
      })),
      about: v.optional(v.object({
        content: v.string()
      })),
      services: v.optional(v.object({
        title: v.string(),
        items: v.array(v.object({
          title: v.string(),
          description: v.string()
        }))
      })),
      whyChooseUs: v.optional(v.object({
        title: v.string(),
        points: v.array(v.string())
      })),
      callToAction: v.optional(v.object({
        primary: v.string(),
        secondary: v.string(),
        urgency: v.string()
      })),
      seo: v.optional(v.object({
        metaTitle: v.string(),
        metaDescription: v.string(),
        keywords: v.array(v.string())
      }))
    })))
  },
  handler: async (ctx, args): Promise<{ businessId: any; domainId: any }> => {
    const user = await getUserFromAuth(ctx);
    
    // Create the business as a draft (unpublished)
    const businessId = await ctx.db.insert("businesses", {
      ...args.businessData,
      ...(args.aiContent && args.aiContent !== null && { aiGeneratedContent: args.aiContent }),
      createdAt: Date.now(),
      userId: user._id,
      domainId: undefined, // Will be set when domain is created
      isPublished: false, // Keep as draft until user publishes
      publishedAt: undefined
    });

    // Automatically generate domain and create pages
    const { domainId }: any = await ctx.runMutation(api.domains.generateSubdomain, {
      businessId
    });

    // Update business with domainId
    await ctx.db.patch(businessId, { domainId });

    // Create default pages as drafts
    await ctx.runMutation(api.pages.createDefaultPages, {
      domainId,
      businessId
    });

    return { businessId, domainId };
  }
});