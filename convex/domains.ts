import { v } from "convex/values";
import { query, mutation } from "./_generated/server";


// Generate a subdomain from business name
export const generateSubdomain = mutation({
    args: {
        businessId: v.id("businesses"),
        customSubdomain: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const business = await ctx.db.get(args.businessId);
        if (!business) {
            throw new Error("Business not found");
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
            while (await ctx.db
                .query("domains")
                .withIndex("by_subdomain", q => q.eq("subdomain", newSubdomain))
                .first()) {
                counter++;
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

export const list = query({
    handler: async (ctx) => {
        return await ctx.db.query('domains').collect();
    }
});

export const getBySlug = query({
    args: {
        domain: v.string(),
        slug: v.string()
    },
    handler: async (ctx, args) => {
        const domain = await ctx.db
            .query('domains')
            .withIndex('by_subdomain', q => q.eq('subdomain', args.domain))
            .first();

        if (!domain) return null;

        return await ctx.db
            .query('pages')
            .withIndex('by_domain_slug', q =>
                q.eq('domainId', domain._id)
                    .eq('slug', args.slug)
            )
            .first();
    }
});