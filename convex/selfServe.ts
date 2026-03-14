import { v } from "convex/values";
import {
  action,
  internalAction,
  internalMutation,
  query,
} from "./_generated/server";
import { api, components, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { RateLimiter } from "@convex-dev/rate-limiter";
import { convexEnv } from "./lib/env";

const DAY = 24 * 60 * 60 * 1000;

const rateLimiter = new RateLimiter(components.rateLimiter, {
  selfServeCreate: { kind: "fixed window", rate: 3, period: DAY },
});

function toUrlFriendlySlug(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 30)
    .replace(/-$/, "");
}

// Internal mutation: rate-limit check + business record creation
export const internal_createSelfServeBusiness = internalMutation({
  args: {
    businessName: v.string(),
    category: v.string(),
    city: v.string(),
    state: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    rateLimitKey: v.string(),
  },
  handler: async (ctx, args) => {
    const status = await rateLimiter.limit(ctx, "selfServeCreate", {
      key: args.rateLimitKey,
    });

    if (!status.ok) {
      throw new Error(
        "Rate limit exceeded. You can create up to 3 websites per day. Please try again later.",
      );
    }

    const placeId = `self-serve-${crypto.randomUUID()}`;
    const address = `${args.city}, ${args.state}`;

    const businessId = await ctx.db.insert("businesses", {
      name: args.businessName,
      placeId,
      address,
      phone: args.phone,
      email: args.email,
      hours: [],
      reviews: [],
      photos: [],
      category: args.category,
      categorySlug: toUrlFriendlySlug(args.category),
      city: args.city.toLowerCase(),
      cityDisplay: args.city,
      state: args.state,
      tier: "free",
      createdVia: "self_serve",
      createdAt: Date.now(),
    });

    return { businessId, placeId };
  },
});

// Internal mutation: save AI-generated content to a business
export const internal_saveAIContent = internalMutation({
  args: {
    businessId: v.id("businesses"),
    aiContent: v.any(),
  },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return;

    await ctx.db.patch(args.businessId, {
      aiGeneratedContent: args.aiContent,
    });
  },
});

// Internal action: generate AI content for a self-serve business (runs async after site creation)
export const generateSelfServeContent = internalAction({
  args: {
    businessId: v.id("businesses"),
    businessName: v.string(),
    category: v.string(),
    city: v.string(),
    state: v.string(),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const aiContent = await ctx.runAction(
        api.aiContentGenerator.generateBusinessContent,
        {
          businessData: {
            name: args.businessName,
            address: `${args.city}, ${args.state}`,
            phone: args.phone,
            description: `${args.category} in ${args.city}, ${args.state}`,
          },
        },
      );

      if (aiContent) {
        await ctx.runMutation(internal.selfServe.internal_saveAIContent, {
          businessId: args.businessId,
          aiContent,
        });
      }
    } catch (err) {
      // AI content generation is non-critical — site is already live without it
      console.error(
        `AI content generation failed for self-serve business ${args.businessId}:`,
        err,
      );
    }
  },
});

// Public action: create a self-serve website end-to-end
export const createSelfServeWebsite = action({
  args: {
    businessName: v.string(),
    category: v.string(),
    city: v.string(),
    state: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    clientId: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    slug: string;
    url: string;
    claimToken: string;
    businessId: string;
  }> => {
    // Validate required fields
    if (!args.businessName.trim()) {
      throw new Error("Business name is required");
    }
    if (!args.category.trim()) {
      throw new Error("Business category is required");
    }
    if (!args.city.trim() || !args.state.trim()) {
      throw new Error("City and state are required");
    }

    const rateLimitKey =
      args.clientId || args.phone || `${args.businessName}-${args.city}`;

    // 1. Rate limit + create business record
    const { businessId } = await ctx.runMutation(
      internal.selfServe.internal_createSelfServeBusiness,
      {
        businessName: args.businessName.trim(),
        category: args.category.trim(),
        city: args.city.trim(),
        state: args.state.trim(),
        phone: args.phone,
        email: args.email,
        rateLimitKey,
      },
    );

    // 2. Generate subdomain
    const { domainId, subdomain } = (await ctx.runMutation(
      internal.domains.internal_generateSubdomain,
      { businessId },
    )) as { domainId: string; subdomain: string };

    // 3. Create default pages
    await ctx.runMutation(
      internal.pagesSimple.internal_createDefaultPagesSimple,
      { domainId: domainId as Id<"domains">, businessId },
    );

    // 4. Assign theme based on category
    await ctx.runMutation(internal.themes.internal_assignTheme, {
      businessId,
      category: args.category.trim(),
    });

    // 5. Generate claim token + auto-publish
    const claimToken = crypto.randomUUID();
    await ctx.runMutation(internal.bulkSiteCreation.setClaimTokenAndPublish, {
      businessId,
      claimToken,
    });

    // 6. Schedule AI content generation (async, non-blocking)
    await ctx.scheduler.runAfter(
      0,
      internal.selfServe.generateSelfServeContent,
      {
        businessId,
        businessName: args.businessName.trim(),
        category: args.category.trim(),
        city: args.city.trim(),
        state: args.state.trim(),
        phone: args.phone,
      },
    );

    const rootDomain = convexEnv.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";

    return {
      slug: subdomain,
      url: `https://${rootDomain}/${subdomain}`,
      claimToken,
      businessId: businessId as string,
    };
  },
});

// Public query: get a self-serve business by claim token (for claim/edit flow)
export const getByClaimToken = query({
  args: { claimToken: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_claimToken", (q) => q.eq("claimToken", args.claimToken))
      .first();

    if (!business) return null;

    let subdomain: string | null = null;
    if (business.domainId) {
      const domain = await ctx.db.get(business.domainId);
      subdomain = domain?.subdomain ?? null;
    }

    return {
      id: business._id,
      name: business.name,
      category: business.category,
      city: business.cityDisplay || business.city,
      state: business.state,
      tier: business.tier || "free",
      subdomain,
      isPublished: business.isPublished,
      createdAt: business.createdAt,
    };
  },
});
