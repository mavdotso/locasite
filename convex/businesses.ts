import { mutation, query, internalMutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { checkUserAuth, getUserFromIdentity } from './helpers';

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
    ctx: { db: { get: (id: Id<"businesses">) => Promise<Doc<"businesses"> | null> } },
    businessId: Id<"businesses">,
    userId: Id<"users">
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
            reviews: v.array(v.object({
                reviewer: v.string(),
                rating: v.string(),
                text: v.string()
            })),
            photos: v.array(v.string()),
            description: v.optional(v.string())
        }),
        userId: v.id("users")
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
            theme: v.optional(v.object({
                colorScheme: v.optional(v.string()),
                primaryColor: v.optional(v.string()),
                secondaryColor: v.optional(v.string()),
                accentColor: v.optional(v.string()),
                fontFamily: v.optional(v.string()),
                logoUrl: v.optional(v.string())
            }))
        }),
    },
    handler: async (ctx, args) => {
        const updates = { ...args.business };

        Object.keys(updates).forEach(key => {
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
    }
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
    }
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
            reviews: v.array(v.object({
                reviewer: v.string(),
                rating: v.string(),
                text: v.string()
            })),
            photos: v.array(v.string()),
            description: v.optional(v.string())
        }),
    },
    handler: async (ctx, args) => {
        const identity = await checkUserAuth(ctx);

        // Get the user ID from the identity
        const user = await getUserFromIdentity(ctx, identity);

        // Create the business using the internal mutation
        const businessId = await ctx.db.insert("businesses", {
            ...args.business,
            createdAt: Date.now(),
            userId: user._id
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
        // Optional: Add auth check if you want to restrict who can view a user's businesses
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
        const identity = await checkUserAuth(ctx);

        // Get the user ID from the identity
        const user = await getUserFromIdentity(ctx, identity);

        // Verify ownership
        await verifyBusinessOwnership(ctx, args.businessId, user._id);

        return await ctx.db.patch(args.businessId, {
            domainId: args.domainId
        });
    }
});

// Delete a business
export const remove = mutation({
    args: { id: v.id("businesses") },
    handler: async (ctx, args) => {
        const identity = await checkUserAuth(ctx);

        // Get the user ID from the identity
        const user = await getUserFromIdentity(ctx, identity);

        // Verify ownership
        await verifyBusinessOwnership(ctx, args.id, user._id);

        // Use the internal mutation directly
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
            theme: v.optional(v.object({
                colorScheme: v.optional(v.string()),
                primaryColor: v.optional(v.string()),
                secondaryColor: v.optional(v.string()),
                accentColor: v.optional(v.string()),
                fontFamily: v.optional(v.string()),
                logoUrl: v.optional(v.string())
            }))
        }),
    },
    handler: async (ctx, args) => {
        const identity = await checkUserAuth(ctx);

        // Get the user ID from the identity
        const user = await getUserFromIdentity(ctx, identity);

        // Verify ownership
        await verifyBusinessOwnership(ctx, args.id, user._id);

        // Use the internal mutation directly
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
        const identity = await checkUserAuth(ctx);

        // Get the user ID from the identity
        const user = await getUserFromIdentity(ctx, identity);

        // Verify ownership
        await verifyBusinessOwnership(ctx, args.id, user._id);

        // Use the internal mutation directly
        return await ctx.db.patch(args.id, {
            photos: args.photos
        });
    },
});

export const updateBusinessDescription = mutation({
    args: {
        businessId: v.id("businesses"),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await checkUserAuth(ctx);

        // Get the user ID from the identity
        const user = await getUserFromIdentity(ctx, identity);

        // Verify ownership
        await verifyBusinessOwnership(ctx, args.businessId, user._id);

        // Use the internal mutation directly
        return await ctx.db.patch(args.businessId, {
            description: args.description
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
            reviews: v.array(v.object({
                reviewer: v.string(),
                rating: v.string(),
                text: v.string()
            })),
            photos: v.array(v.string()),
            description: v.optional(v.string())
        }),
    },
    handler: async (ctx, args) => {
        // Check if user is authenticated using the current approach
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized: You must be logged in");
        }

        // Extract user ID from subject (format: "userId|sessionId")
        const userIdString = identity.subject.split('|')[0];
        const userId = userIdString as Id<"users">;
        
        // Get the user record directly by ID
        const user = await ctx.db.get(userId);
        
        if (!user) {
            console.log("User not found with ID:", userId);
            throw new Error("User not found. Please try signing in again.");
        }

        console.log("Found user:", user);

        // Check if business with this placeId already exists for this user
        const existingBusiness = await ctx.db
            .query("businesses")
            .withIndex("by_placeId", q => q.eq("placeId", args.businessData.placeId))
            .filter(q => q.eq(q.field("userId"), userId))
            .first();

        if (existingBusiness) {
            // Return the existing business ID
            return existingBusiness._id;
        }

        // Create the business
        const businessId = await ctx.db.insert("businesses", {
            ...args.businessData,
            createdAt: Date.now(),
            userId: userId
        });

        return businessId;
    }
});