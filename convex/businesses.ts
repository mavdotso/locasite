import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export interface BusinessData {
    name: string;
    placeId: string;
    address: string;
    phone?: string;
    website?: string;
    hours: string[];
    rating: number | null;
    reviews: Array<{
        reviewer: string;
        rating: string;
        text: string;
    }>;
    photos: string[];
    description?: string;
}

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
            reviews: v.array(v.object({
                reviewer: v.string(),
                rating: v.string(),
                text: v.string()
            })),
            photos: v.array(v.string()),
            description: v.optional(v.string())
        }),
        userId: v.optional(v.id("users"))
    },
    handler: async (ctx, args) => {
        // Check if business with this placeId already exists
        const existingBusiness = await ctx.db
            .query("businesses")
            .withIndex("by_placeId", q => q.eq("placeId", args.business.placeId))
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
            userId: args.userId
        });

        return businessId;
    }
});

// Get business by ID
export const getById = query({
    args: { id: v.id("businesses") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
});

// Get business by Google Place ID
export const getByPlaceId = query({
    args: { placeId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("businesses")
            .withIndex("by_placeId", q => q.eq("placeId", args.placeId))
            .first();
    }
});

// List all businesses
export const list = query({
    args: {
        limit: v.optional(v.number())
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("businesses")
            .withIndex("by_createdAt")
            .order("desc")
            .take(args.limit || 100);
    }
});

// List businesses for a user
export const listByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("businesses")
            .withIndex("by_userId", q => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    }
});

// Associate business with a domain
export const associateWithDomain = mutation({
    args: {
        businessId: v.id("businesses"),
        domainId: v.id("domains")
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.businessId, {
            domainId: args.domainId
        });
    }
});

// Delete a business
export const remove = mutation({
    args: { id: v.id("businesses") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const listByDomain = query({
    args: { domain: v.id("domains") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("businesses")
            .withIndex("by_domainId", q => q.eq("domainId", args.domain))
            .collect();
    }
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
        }),
    },
    handler: async (ctx, args) => {
        const business = await ctx.db.get(args.id);
        if (!business) {
            throw new Error("Business not found");
        }
        const updates = { ...args.business };

        Object.keys(updates).forEach(key => {
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
        const business = await ctx.db.get(args.id);

        if (!business) {
            throw new Error("Business not found");
        }

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
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const business = await ctx.db.get(args.businessId);
        if (!business) {
            throw new Error("Business not found");
        }

        if (business.userId !== identity.subject) {
            throw new Error("Not authorized to edit this business");
        }

        return await ctx.db.patch(args.businessId, {
            description: args.description,
        });
    },
});