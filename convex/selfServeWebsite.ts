import { v, ConvexError } from "convex/values";
import { action, internalMutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";
import { convexEnv } from "./lib/env";

const DAY = 24 * 60 * 60 * 1000;

const rateLimiter = new RateLimiter(components.rateLimiter, {
  selfServeCreate: { kind: "fixed window", rate: 3, period: DAY },
});

// Rate limit check (must run in mutation context for RateLimiter)
export const internal_checkSelfServeRateLimit = internalMutation({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    await rateLimiter.limit(ctx, "selfServeCreate", { key: args.key });
  },
});

// Create a business record for self-serve (no auth required)
export const internal_createSelfServeBusiness = internalMutation({
  args: {
    name: v.string(),
    placeId: v.string(),
    address: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    category: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const businessId = await ctx.db.insert("businesses", {
      name: args.name,
      placeId: args.placeId,
      address: args.address,
      phone: args.phone,
      email: args.email,
      category: args.category,
      city: args.city,
      state: args.state,
      hours: [],
      reviews: [],
      photos: [],
      createdAt: Date.now(),
      tier: "free",
    });
    return businessId;
  },
});

// Main public action: create a self-serve website
export const createSelfServeWebsite = action({
  args: {
    businessName: v.string(),
    category: v.string(),
    city: v.string(),
    state: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    clientIp: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    businessId: Id<"businesses">;
    slug: string;
    claimToken: string;
    url: string;
  }> => {
    // 1. Rate limit by IP
    const rateLimitKey = args.clientIp || "unknown";
    try {
      await ctx.runMutation(
        internal.selfServeWebsite.internal_checkSelfServeRateLimit,
        { key: rateLimitKey },
      );
    } catch {
      throw new ConvexError(
        "Rate limit exceeded. You can create up to 3 websites per day.",
      );
    }

    // 2. Generate synthetic placeId
    const placeId = `self-serve-${crypto.randomUUID()}`;

    // 3. Create business record
    const businessId: Id<"businesses"> = await ctx.runMutation(
      internal.selfServeWebsite.internal_createSelfServeBusiness,
      {
        name: args.businessName,
        placeId,
        address: `${args.city}, ${args.state}`,
        phone: args.phone,
        email: args.email,
        category: args.category,
        city: args.city,
        state: args.state,
      },
    );

    // 4. Generate subdomain (depends on business existing)
    const { domainId, subdomain }: { domainId: Id<"domains">; subdomain: string } =
      await ctx.runMutation(
        internal.domains.internal_generateSubdomain,
        { businessId },
      );

    // 5. Create pages + assign theme concurrently (independent of each other)
    await Promise.all([
      ctx.runMutation(
        internal.pagesSimple.internal_createDefaultPagesSimple,
        { domainId, businessId },
      ),
      ctx.runMutation(internal.themes.internal_assignTheme, {
        businessId,
        category: args.category,
      }),
    ]);

    // 6. Generate claim token + auto-publish
    const claimToken = crypto.randomUUID();
    await ctx.runMutation(
      internal.bulkSiteCreation.setClaimTokenAndPublish,
      { businessId, claimToken },
    );

    const rootDomain = convexEnv.NEXT_PUBLIC_ROOT_DOMAIN;
    return {
      businessId,
      slug: subdomain,
      claimToken,
      url: `https://${subdomain}.${rootDomain}`,
    };
  },
});

// Public query: get a self-serve website by claim token
export const getSelfServeWebsite = query({
  args: { claimToken: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_claimToken", (q) => q.eq("claimToken", args.claimToken))
      .first();

    if (!business) return null;

    const domain = business.domainId
      ? await ctx.db.get(business.domainId)
      : null;

    const rootDomain = convexEnv.NEXT_PUBLIC_ROOT_DOMAIN;
    return {
      businessId: business._id,
      name: business.name,
      category: business.category,
      city: business.city,
      state: business.state,
      tier: business.tier,
      slug: domain?.subdomain,
      url: domain ? `https://${domain.subdomain}.${rootDomain}` : null,
      isPublished: business.isPublished,
    };
  },
});
