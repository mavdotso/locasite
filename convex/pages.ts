import { query, mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { getUserFromAuth } from './lib/helpers';
import { PageSection } from './lib/types';

// Internal mutation to update a page
export const internal_updatePage = internalMutation({
    args: {
        pageId: v.id("pages"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.pageId, {
            content: args.content,
        });
    },
});

// Create default pages for a business
export const createDefaultPages = mutation({
    args: {
        domainId: v.id("domains"),
        businessId: v.id("businesses"),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromAuth(ctx);

        const business = await ctx.db.get(args.businessId);
        if (!business) {
            throw new Error("Business not found");
        }

        // Verify business ownership
        if (business.userId !== user._id) {
            throw new Error("Not authorized to create pages for this business");
        }

        const domain = await ctx.db.get(args.domainId);
        if (!domain) {
            throw new Error("Domain not found");
        }

        // Use AI-generated content if available, otherwise fall back to basic content
        const aiContent = business.aiGeneratedContent;
        
        
        const sections: Array<PageSection | Record<string, unknown>> = [
            {
                type: "hero",
                title: aiContent?.hero?.title || business.name,
                subtitle: aiContent?.hero?.subtitle || business.description || `Welcome to ${business.name}`,
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
                content: aiContent?.about?.content || business.description || `About ${business.name}`,
            }
        ];

        // Add services section if AI generated services content
        if (aiContent?.services) {
            sections.push({
                type: "services",
                title: aiContent.services.title,
                items: aiContent.services.items,
            });
        }

        // Add why choose us section if AI generated content
        if (aiContent?.whyChooseUs) {
            sections.push({
                type: "whyChooseUs",
                title: aiContent.whyChooseUs.title,
                points: aiContent.whyChooseUs.points,
            });
        }

        // Add gallery section
        sections.push({
            type: "gallery",
            images: business.photos,
        });

        // Add reviews section
        sections.push({
            type: "reviews",
            items: business.reviews,
        });

        // Add contact section with AI-generated CTA if available
        sections.push({
            type: "contact",
            title: "Contact Us",
            subtitle: aiContent?.callToAction?.urgency || "Get in touch with us",
            primaryCTA: aiContent?.callToAction?.primary || "Contact Us",
            secondaryCTA: aiContent?.callToAction?.secondary || "Learn More",
        });

        const homePageContent = JSON.stringify({
            title: aiContent?.seo?.metaTitle || business.name,
            metaDescription: aiContent?.seo?.metaDescription || business.description,
            keywords: aiContent?.seo?.keywords || [],
            sections: sections,
        });

        // Create home page as draft
        const homePageId = await ctx.db.insert("pages", {
            domainId: args.domainId,
            slug: "home",
            content: homePageContent,
            isPublished: false,
            lastEditedAt: Date.now()
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
            isPublished: false,
            lastEditedAt: Date.now()
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
            isPublished: false,
            lastEditedAt: Date.now()
        });

        return {
            homePageId,
            aboutPageId,
            contactPageId,
        };
    },
});

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

export const updatePage = mutation({
    args: {
        pageId: v.id("pages"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromAuth(ctx);

        const page = await ctx.db.get(args.pageId);
        if (!page) {
            throw new Error("Page not found");
        }

        const domain = await ctx.db.get(page.domainId);
        if (!domain) {
            throw new Error("Domain not found");
        }

        const business = await ctx.db
            .query("businesses")
            .withIndex("by_domainId", q => q.eq("domainId", domain._id))
            .first();

        if (!business || business.userId !== user._id) {
            throw new Error("Not authorized to edit this page");
        }

        return await ctx.db.patch(args.pageId, {
            content: args.content
        });
    },
});