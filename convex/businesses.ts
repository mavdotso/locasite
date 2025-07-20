import {
  mutation,
  query,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { getUserFromAuth } from "./lib/helpers";
import { partialAdvancedThemeSchemaV } from "./lib/themeSchema";
import { getThemeSuggestions } from "./lib/themeSuggestions";
import { themePresets } from "./lib/themePresets";
import { api } from "./_generated/api";

// Interface for business update operations
interface BusinessUpdateFields {
  isPublished?: boolean;
  publishedAt?: number;
  lastEditedAt?: number;
  draftContent?: Doc<"businesses">["draftContent"];
  name?: string;
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string[];
  photos?: string[];
  theme?: Doc<"businesses">["theme"];
  themeOverrides?: Doc<"businesses">["themeOverrides"];
  domainId?: Id<"domains">;
}

export interface BusinessData {
  name: string;
  placeId: string;
  address: string;
  phone?: string;
  website?: string;
  hours: string[];
  rating?: number;
  reviews: Array<{
    reviewer: string;
    rating: string;
    text: string;
  }>;
  photos: string[];
  description?: string;
}

// Helper function to verify business ownership
async function verifyBusinessOwnership(
  ctx: {
    db: { get: (id: Id<"businesses">) => Promise<Doc<"businesses"> | null> };
  },
  businessId: Id<"businesses">,
  userId: Id<"users">,
) {
  const business = await ctx.db.get(businessId);
  if (!business) {
    throw new Error("Business not found");
  }

  if (business.userId !== userId) {
    throw new Error("Not authorized to modify this business");
  }

  return business;
}

// ==================== INTERNAL FUNCTIONS ====================

// Internal mutation to create a business
export const internal_createBusiness = internalMutation({
  args: {
    business: v.object({
      name: v.string(),
      placeId: v.string(),
      address: v.string(),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      hours: v.array(v.string()),
      rating: v.optional(v.number()),
      reviews: v.array(
        v.object({
          reviewer: v.string(),
          rating: v.string(),
          text: v.string(),
        }),
      ),
      photos: v.array(v.string()),
      description: v.optional(v.string()),
    }),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if business with this placeId already exists
    const existingBusiness = await ctx.db
      .query("businesses")
      .withIndex("by_placeId", (q) => q.eq("placeId", args.business.placeId))
      .first();

    if (existingBusiness) {
      // Update existing business instead of creating a duplicate
      return await ctx.db.patch(existingBusiness._id, {
        ...args.business,
      });
    }

    // Create new business
    const businessId = await ctx.db.insert("businesses", {
      ...args.business,
      createdAt: Date.now(),
      userId: args.userId,
    });

    return businessId;
  },
});

// Internal mutation to update a business
export const internal_updateBusiness = internalMutation({
  args: {
    id: v.id("businesses"),
    business: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      address: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      hours: v.optional(v.array(v.string())),
      theme: v.optional(
        v.object({
          colorScheme: v.optional(v.string()),
          primaryColor: v.optional(v.string()),
          secondaryColor: v.optional(v.string()),
          accentColor: v.optional(v.string()),
          fontFamily: v.optional(v.string()),
          logoUrl: v.optional(v.string()),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const updates = { ...args.business };

    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof typeof updates] === undefined) {
        delete updates[key as keyof typeof updates];
      }
    });

    return await ctx.db.patch(args.id, updates);
  },
});

// Internal mutation to delete a business
export const internal_deleteBusiness = internalMutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Internal mutation to update business photos
export const internal_updateBusinessPhotos = internalMutation({
  args: {
    id: v.id("businesses"),
    photos: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      photos: args.photos,
    });
  },
});

// Internal mutation to update business description
export const internal_updateBusinessDescription = internalMutation({
  args: {
    id: v.id("businesses"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      description: args.description,
    });
  },
});

// Internal query to get business by ID
export const internal_getBusinessById = internalQuery({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// ==================== PUBLIC FUNCTIONS ====================
// Create a new business entry
export const create = mutation({
  args: {
    business: v.object({
      name: v.string(),
      placeId: v.string(),
      address: v.string(),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      hours: v.array(v.string()),
      rating: v.optional(v.number()),
      reviews: v.array(
        v.object({
          reviewer: v.string(),
          rating: v.string(),
          text: v.string(),
        }),
      ),
      photos: v.array(v.string()),
      description: v.optional(v.string()),
      aiGeneratedContent: v.optional(
        v.object({
          hero: v.optional(
            v.object({
              title: v.string(),
              subtitle: v.string(),
            }),
          ),
          about: v.optional(
            v.object({
              content: v.string(),
            }),
          ),
          services: v.optional(
            v.object({
              title: v.string(),
              items: v.array(
                v.object({
                  title: v.string(),
                  description: v.string(),
                }),
              ),
            }),
          ),
          whyChooseUs: v.optional(
            v.object({
              title: v.string(),
              points: v.array(v.string()),
            }),
          ),
          callToAction: v.optional(
            v.object({
              primary: v.string(),
              secondary: v.string(),
              urgency: v.string(),
            }),
          ),
          seo: v.optional(
            v.object({
              metaTitle: v.string(),
              metaDescription: v.string(),
              keywords: v.array(v.string()),
            }),
          ),
          testimonials: v.optional(
            v.object({
              title: v.string(),
              items: v.array(
                v.object({
                  name: v.string(),
                  text: v.string(),
                  rating: v.number(),
                  role: v.optional(v.string()),
                  location: v.optional(v.string()),
                  date: v.optional(v.string()),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Create the business using the internal mutation
    const businessId = await ctx.db.insert("businesses", {
      ...args.business,
      createdAt: Date.now(),
      userId: user._id,
      isPublished: false, // Default to unpublished
    });

    return businessId;
  },
});

// Get business by ID
export const getById = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Public query for getting business (no auth required)
export const getBusinessPublic = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.businessId);
  },
});

// Get business by Google Place ID
export const getByPlaceId = query({
  args: { placeId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_placeId", (q) => q.eq("placeId", args.placeId))
      .first();
  },
});

// List all businesses
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit || 100);
  },
});

// List businesses for a user
export const listByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Optional: Add auth check if you want to restrict who can view a user's businesses
    return await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Associate business with a domain
export const associateWithDomain = mutation({
  args: {
    businessId: v.id("businesses"),
    domainId: v.id("domains"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    return await ctx.db.patch(args.businessId, {
      domainId: args.domainId,
    });
  },
});

// Delete a business
export const remove = mutation({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.id, user._id);

    // Use the internal mutation directly
    await ctx.db.delete(args.id);
  },
});

export const listByDomain = query({
  args: { domain: v.id("domains") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_domainId", (q) => q.eq("domainId", args.domain))
      .collect();
  },
});

export const getByDomainId = query({
  args: { domainId: v.id("domains") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_domainId", (q) => q.eq("domainId", args.domainId))
      .first();
  },
});

// Update Google Business auth data
export const updateGoogleBusinessAuth = mutation({
  args: {
    businessId: v.id("businesses"),
    googleBusinessAuth: v.object({
      accessToken: v.string(),
      refreshToken: v.string(),
      expiresAt: v.number(),
      accounts: v.array(
        v.object({
          accountId: v.string(),
          accountName: v.string(),
          type: v.string(),
          verificationState: v.optional(v.string()),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    // Update business with Google auth data
    return await ctx.db.patch(args.businessId, {
      googleBusinessAuth: {
        ...args.googleBusinessAuth,
        verificationStatus: "unverified",
      },
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("businesses"),
    business: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      address: v.optional(v.string()),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      hours: v.optional(v.array(v.string())),
      theme: v.optional(
        v.object({
          colorScheme: v.optional(v.string()),
          primaryColor: v.optional(v.string()),
          secondaryColor: v.optional(v.string()),
          accentColor: v.optional(v.string()),
          fontFamily: v.optional(v.string()),
          logoUrl: v.optional(v.string()),
        }),
      ),
      themeOverrides: v.optional(partialAdvancedThemeSchemaV),
      lastEditedAt: v.optional(v.number()),
      aiGeneratedContent: v.optional(
        v.object({
          hero: v.optional(
            v.object({
              title: v.string(),
              subtitle: v.string(),
            }),
          ),
          about: v.optional(
            v.object({
              content: v.string(),
            }),
          ),
          services: v.optional(
            v.object({
              title: v.string(),
              items: v.array(
                v.object({
                  title: v.string(),
                  description: v.string(),
                }),
              ),
            }),
          ),
          whyChooseUs: v.optional(
            v.object({
              title: v.string(),
              points: v.array(v.string()),
            }),
          ),
          callToAction: v.optional(
            v.object({
              primary: v.string(),
              secondary: v.string(),
              urgency: v.string(),
            }),
          ),
          seo: v.optional(
            v.object({
              metaTitle: v.string(),
              metaDescription: v.string(),
              keywords: v.array(v.string()),
            }),
          ),
          testimonials: v.optional(
            v.object({
              title: v.string(),
              items: v.array(
                v.object({
                  name: v.string(),
                  text: v.string(),
                  rating: v.number(),
                  role: v.optional(v.string()),
                  location: v.optional(v.string()),
                  date: v.optional(v.string()),
                }),
              ),
            }),
          ),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.id, user._id);

    // Use the internal mutation directly
    const updates = { ...args.business };
    Object.keys(updates).forEach((key) => {
      if (updates[key as keyof typeof updates] === undefined) {
        delete updates[key as keyof typeof updates];
      }
    });
    return await ctx.db.patch(args.id, updates);
  },
});

// Update business photos
export const updatePhotos = mutation({
  args: {
    id: v.id("businesses"),
    photos: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.id, user._id);

    // Use the internal mutation directly
    return await ctx.db.patch(args.id, {
      photos: args.photos,
    });
  },
});

export const updateBusinessDescription = mutation({
  args: {
    businessId: v.id("businesses"),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    // Use the internal mutation directly
    return await ctx.db.patch(args.businessId, {
      description: args.description,
    });
  },
});

// Create business from preview data (for authenticated users after sign-up)
export const createFromPreview = mutation({
  args: {
    businessData: v.object({
      name: v.string(),
      placeId: v.string(),
      address: v.string(),
      phone: v.optional(v.string()),
      website: v.optional(v.string()),
      hours: v.array(v.string()),
      rating: v.optional(v.number()),
      reviews: v.array(
        v.object({
          reviewer: v.string(),
          rating: v.string(),
          text: v.string(),
        }),
      ),
      photos: v.array(v.string()),
      description: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Check if business with this placeId already exists for this user
    const existingBusiness = await ctx.db
      .query("businesses")
      .withIndex("by_placeId", (q) =>
        q.eq("placeId", args.businessData.placeId),
      )
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    if (existingBusiness) {
      // Return the existing business ID
      return existingBusiness._id;
    }

    // Create the business
    const businessId = await ctx.db.insert("businesses", {
      ...args.businessData,
      createdAt: Date.now(),
      userId: user._id,
      isPublished: false, // Start as unpublished
    });

    return businessId;
  },
});

// Save draft changes without publishing
export const saveDraft = mutation({
  args: {
    businessId: v.id("businesses"),
    draftContent: v.object({
      name: v.optional(v.string()),
      description: v.optional(v.string()),
      phone: v.optional(v.string()),
      email: v.optional(v.string()),
      website: v.optional(v.string()),
      hours: v.optional(v.array(v.string())),
      theme: v.optional(
        v.object({
          colorScheme: v.optional(v.string()),
          primaryColor: v.optional(v.string()),
          secondaryColor: v.optional(v.string()),
          accentColor: v.optional(v.string()),
          fontFamily: v.optional(v.string()),
          logoUrl: v.optional(v.string()),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    // Update draft content
    return await ctx.db.patch(args.businessId, {
      draftContent: args.draftContent,
      lastEditedAt: Date.now(),
    });
  },
});

// Publish draft changes
export const publishDraft = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    const business = await verifyBusinessOwnership(
      ctx,
      args.businessId,
      user._id,
    );

    if (!business.draftContent) {
      throw new Error("No draft content to publish");
    }

    // Apply draft content to main fields
    const updates: BusinessUpdateFields = {
      isPublished: true,
      publishedAt: Date.now(),
      lastEditedAt: Date.now(),
      draftContent: undefined, // Clear draft after publishing
    };

    // Copy draft fields to main fields
    if (business.draftContent.name) updates.name = business.draftContent.name;
    if (business.draftContent.description)
      updates.description = business.draftContent.description;
    if (business.draftContent.phone)
      updates.phone = business.draftContent.phone;
    if (business.draftContent.email)
      updates.email = business.draftContent.email;
    if (business.draftContent.website)
      updates.website = business.draftContent.website;
    if (business.draftContent.hours)
      updates.hours = business.draftContent.hours;
    if (business.draftContent.theme)
      updates.theme = business.draftContent.theme;

    return await ctx.db.patch(args.businessId, updates);
  },
});

// Discard draft changes
export const discardDraft = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    // Clear draft content
    return await ctx.db.patch(args.businessId, {
      draftContent: undefined,
    });
  },
});

// Simple publish toggle (without draft content)
export const publish = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    return await ctx.db.patch(args.businessId, {
      isPublished: true,
      publishedAt: Date.now(),
    });
  },
});

// Unpublish a business
export const unpublish = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    await verifyBusinessOwnership(ctx, args.businessId, user._id);

    return await ctx.db.patch(args.businessId, {
      isPublished: false,
    });
  },
});

// Get business with draft content merged (for editing)
export const getByIdWithDraft = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.id);
    if (!business) return null;

    // If there's draft content, merge it with the main content
    if (business.draftContent) {
      return {
        ...business,
        // Override main fields with draft fields if they exist
        name: business.draftContent.name || business.name,
        description: business.draftContent.description || business.description,
        phone:
          business.draftContent.phone !== undefined
            ? business.draftContent.phone
            : business.phone,
        email:
          business.draftContent.email !== undefined
            ? business.draftContent.email
            : business.email,
        website:
          business.draftContent.website !== undefined
            ? business.draftContent.website
            : business.website,
        hours: business.draftContent.hours || business.hours,
        theme: business.draftContent.theme || business.theme,
        hasDraft: true,
      };
    }

    return { ...business, hasDraft: false };
  },
});

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
      reviews: v.array(
        v.object({
          reviewer: v.string(),
          rating: v.string(),
          text: v.string(),
        }),
      ),
      photos: v.array(v.string()),
      description: v.optional(v.string()),
      category: v.optional(v.string()),
    }),
    aiContent: v.optional(
      v.union(
        v.null(),
        v.object({
          hero: v.optional(
            v.object({
              title: v.string(),
              subtitle: v.string(),
            }),
          ),
          about: v.optional(
            v.object({
              content: v.string(),
            }),
          ),
          services: v.optional(
            v.object({
              title: v.string(),
              items: v.array(
                v.object({
                  title: v.string(),
                  description: v.string(),
                }),
              ),
            }),
          ),
          whyChooseUs: v.optional(
            v.object({
              title: v.string(),
              points: v.array(v.string()),
            }),
          ),
          callToAction: v.optional(
            v.object({
              primary: v.string(),
              secondary: v.string(),
              urgency: v.string(),
            }),
          ),
          seo: v.optional(
            v.object({
              metaTitle: v.string(),
              metaDescription: v.string(),
              keywords: v.array(v.string()),
            }),
          ),
        }),
      ),
    ),
    generateAIContent: v.optional(v.boolean()),
    applyTemplate: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ businessId: Id<"businesses">; domainId: Id<"domains"> }> => {
    const user = await getUserFromAuth(ctx);

    // Extract category for theme selection before creating business
    const { category, ...businessDataWithoutCategory } = args.businessData;

    // Create the business as a draft (unpublished)
    const businessId = await ctx.db.insert("businesses", {
      ...businessDataWithoutCategory,
      ...(args.aiContent &&
        args.aiContent !== null && { aiGeneratedContent: args.aiContent }),
      createdAt: Date.now(),
      userId: user._id,
      domainId: undefined, // Will be set when domain is created
      isPublished: false, // Keep as draft until user publishes
      publishedAt: undefined,
    });

    // Automatically generate domain and create pages
    // Note: generateSubdomain will also update the business with domainId
    const { domainId } = await ctx.runMutation(api.domains.generateSubdomain, {
      businessId,
    });

    // Verify the business has domainId set
    const businessWithDomain = await ctx.db.get(businessId);
    if (!businessWithDomain?.domainId) {
      await ctx.db.patch(businessId, { domainId });
    }

    const { pageId } = await ctx.runMutation(
      api.pagesSimple.createDefaultPagesSimple,
      {
        domainId,
        businessId,
      },
    );

    // Assign a theme based on business category
    const themeSuggestions = getThemeSuggestions(category, 1);
    const selectedThemeId = themeSuggestions[0] || "modern-minimal";

    // Check if theme preset exists
    const themePreset = themePresets.find(
      (preset) => preset.id === selectedThemeId,
    );
    if (themePreset) {
      // Create a custom theme based on the preset
      const themeId = await ctx.db.insert("themes", {
        name: `${args.businessData.name} Theme`,
        description: `Theme for ${args.businessData.name}`,
        isPreset: false,
        presetId: selectedThemeId,
        // @ts-expect-error Theme types have minor differences that are handled at runtime
        config: themePreset.theme,
        userId: user._id,
        businessId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isPublic: false,
        tags: themePreset.tags || [],
        industry: category || themePreset.industry,
      });

      // Update business with theme
      await ctx.db.patch(businessId, {
        themeId,
      });
    }

    // Schedule image upload to Convex storage
    if (args.businessData.photos && args.businessData.photos.length > 0) {
      await ctx.scheduler.runAfter(
        0,
        api.uploadBusinessImages.uploadGoogleMapsImages,
        {
          businessId,
          imageUrls: args.businessData.photos,
        },
      );
    }

    return { businessId, domainId };
  },
});

// Delete a business
export const deleteBusiness = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    const business = await verifyBusinessOwnership(
      ctx,
      args.businessId,
      user._id,
    );

    // Delete associated domain
    if (business.domainId) {
      await ctx.db.delete(business.domainId);
    }

    // Delete associated theme if it's custom
    if (business.themeId) {
      const theme = await ctx.db.get(business.themeId);
      if (theme && !theme.isPreset) {
        await ctx.db.delete(business.themeId);
      }
    }

    // Delete associated pages
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_domain", (q) => q.eq("domainId", business.domainId!))
      .collect();

    for (const page of pages) {
      await ctx.db.delete(page._id);
    }

    // Delete associated contact messages
    const messages = await ctx.db
      .query("contactMessages")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete associated media library items
    const mediaItems = await ctx.db
      .query("mediaLibrary")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .collect();
    for (const item of mediaItems) {
      // Delete from storage
      if (item.storageId) {
        await ctx.storage.delete(item.storageId);
      }
      await ctx.db.delete(item._id);
    }

    // Delete favicon from storage if exists
    if (business.faviconStorageId) {
      await ctx.storage.delete(business.faviconStorageId);
    }

    // Delete OG image from storage if exists
    if (business.ogImageStorageId) {
      await ctx.storage.delete(business.ogImageStorageId);
    }

    // Finally, delete the business
    await ctx.db.delete(args.businessId);

    return { success: true };
  },
});
