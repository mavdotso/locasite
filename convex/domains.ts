import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getUserFromAuth } from './lib/helpers';

// Internal mutation to create a domain
export const internal_createDomain = internalMutation({
    args: {
        name: v.string(),
        subdomain: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("domains", {
            name: args.name,
            subdomain: args.subdomain,
            createdAt: Date.now()
        });
    }
});

// Generate a subdomain from business name
export const generateSubdomain = mutation({
    args: {
        businessId: v.id("businesses"),
        customSubdomain: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const user = await getUserFromAuth(ctx);

        const business = await ctx.db.get(args.businessId);
        if (!business) {
            throw new Error("Business not found");
        }

        // Verify business ownership
        if (business.userId !== user._id) {
            throw new Error("Not authorized to create domain for this business");
        }

        // Use custom subdomain if provided, otherwise generate from business name
        let subdomain = args.customSubdomain;
        if (!subdomain) {
            // Generate subdomain from business name
            subdomain = business.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "") // Remove non-alphanumeric characters
                .replace(/\s+/g, "-"); // Replace spaces with hyphens
        }

        // Ensure it's not too short
        if (!subdomain || subdomain.length < 3) {
            subdomain = `business-${Math.floor(Math.random() * 10000)}`;
        }

        // Ensure it's not too long (DNS label max length is 63 characters)
        if (subdomain.length > 63) {
            subdomain = subdomain.substring(0, 60) + Math.floor(Math.random() * 1000);
        }

        // Check if subdomain already exists
        const existingDomain = await ctx.db
            .query("domains")
            .withIndex("by_subdomain", q => q.eq("subdomain", subdomain as string))
            .first();

        if (existingDomain) {
            // Append a number if the subdomain is taken
            let counter = 1;
            let newSubdomain = `${subdomain}-${counter}`;

            // Keep trying until we find an available subdomain
            // TODO: Move it to frontend
            const MAX_ATTEMPTS = 100;
            let attempts = 0;
            while (await ctx.db
                .query("domains")
                .withIndex("by_subdomain", q => q.eq("subdomain", newSubdomain))
                .first()) {
                counter++;
                attempts++;
                if (attempts >= MAX_ATTEMPTS) {
                    throw new Error("Could not generate a unique subdomain after multiple attempts");
                }
                newSubdomain = `${subdomain}-${counter}`;
            }

            subdomain = newSubdomain;
        }

        // Create the domain
        const domainId = await ctx.db.insert("domains", {
            name: business.name,
            subdomain,
            createdAt: Date.now()
        });

        // Associate the domain with the business
        await ctx.db.patch(args.businessId, {
            domainId
        });

        return { domainId, subdomain };
    }
});

// Get domain by ID
export const getById = query({
    args: { id: v.id("domains") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
});

// Get domain by subdomain
export const getBySubdomain = query({
    args: { subdomain: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("domains")
            .withIndex("by_subdomain", q => q.eq("subdomain", args.subdomain))
            .first();
    }
});

// Get domain by business ID
export const getByBusinessId = query({
    args: { businessId: v.id("businesses") },
    handler: async (ctx, args) => {
        const business = await ctx.db.get(args.businessId);
        if (!business?.domainId) return null;
        return await ctx.db.get(business.domainId);
    }
});

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query('domains').collect();
    }
});

