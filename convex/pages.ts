import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

// Create default pages for a business
export const createDefaultPages = mutation({
    args: {
        domainId: v.id("domains"),
        businessId: v.id("businesses"),
    },
    handler: async (ctx, args) => {
        const business = await ctx.db.get(args.businessId);
        if (!business) {
            throw new Error("Business not found");
        }

        const domain = await ctx.db.get(args.domainId);
        if (!domain) {
            throw new Error("Domain not found");
        }

        // Generate homepage content
        const homePageContent = JSON.stringify({
            title: business.name,
            sections: [
                {
                    type: "hero",
                    title: business.name,
                    subtitle: business.description || `Welcome to ${business.name}`,
                    image: business.photos[0] || "",
                },
                {
                    type: "info",
                    address: business.address,
                    phone: business.phone || "",
                    website: business.website || "",
                    hours: business.hours,
                },
                {
                    type: "about",
                    content: business.description || `About ${business.name}`,
                },
                {
                    type: "gallery",
                    images: business.photos,
                },
                {
                    type: "reviews",
                    items: business.reviews,
                },
                {
                    type: "contact",
                    title: "Contact Us",
                    subtitle: "Get in touch with us",
                },
            ],
        });

        // Create home page
        const homePageId = await ctx.db.insert("pages", {
            domainId: args.domainId,
            slug: "home",
            content: homePageContent,
        });

        // Create about page
        const aboutPageContent = JSON.stringify({
            title: `About ${business.name}`,
            sections: [
                {
                    type: "header",
                    title: `About ${business.name}`,
                },
                {
                    type: "content",
                    text: business.description || `Learn more about ${business.name}`,
                },
                {
                    type: "gallery",
                    images: business.photos,
                },
            ],
        });

        const aboutPageId = await ctx.db.insert("pages", {
            domainId: args.domainId,
            slug: "about",
            content: aboutPageContent,
        });

        // Create contact page
        const contactPageContent = JSON.stringify({
            title: "Contact Us",
            sections: [
                {
                    type: "header",
                    title: "Contact Us",
                },
                {
                    type: "map",
                    address: business.address,
                },
                {
                    type: "contactInfo",
                    address: business.address,
                    phone: business.phone || "",
                    hours: business.hours,
                },
                {
                    type: "contactForm",
                    title: "Send us a message",
                },
            ],
        });

        const contactPageId = await ctx.db.insert("pages", {
            domainId: args.domainId,
            slug: "contact",
            content: contactPageContent,
        });

        return {
            homePageId,
            aboutPageId,
            contactPageId,
        };
    },
});

// Get all pages for a domain
export const listByDomain = query({
    args: {
        domainId: v.id("domains"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("pages")
            .withIndex("by_domain_slug", q => q.eq("domainId", args.domainId))
            .collect();
    },
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