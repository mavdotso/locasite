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
        
        // Create components array for visual editor format
        const components: Array<{
            id: string;
            type: string;
            props: Record<string, unknown>;
        }> = [];
        
        let componentIndex = 0;
        
        // Hero Section
        components.push({
            id: `component-${componentIndex++}`,
            type: "HeroSectionBlock",
            props: {
                title: aiContent?.hero?.title || business.name,
                subtitle: aiContent?.hero?.subtitle || business.description || `Welcome to ${business.name}`,
                backgroundImage: business.photos[0] || "",
                overlayOpacity: 0.5,
                height: "large",
                buttons: [
                    {
                        text: aiContent?.callToAction?.primary || "Contact Us",
                        link: "#contact",
                        variant: "default"
                    },
                    {
                        text: aiContent?.callToAction?.secondary || "Learn More",
                        link: "#about",
                        variant: "outline"
                    }
                ]
            }
        });
        
        // About Section
        components.push({
            id: `component-${componentIndex++}`,
            type: "AboutSectionBlock",
            props: {
                title: "About Us",
                content: aiContent?.about?.content || business.description || `${business.name} is dedicated to providing exceptional service to our customers. We take pride in our work and strive to exceed expectations.`,
                image: business.photos[1] || "",
                imagePosition: "right",
                backgroundColor: "default"
            }
        });
        
        // Services Section (if AI generated)
        if (aiContent?.services && aiContent.services.items.length > 0) {
            components.push({
                id: `component-${componentIndex++}`,
                type: "ServicesSectionBlock",
                props: {
                    title: aiContent.services.title || "Our Services",
                    subtitle: "What we offer",
                    layout: "grid3",
                    services: aiContent.services.items.map((service: any) => ({
                        icon: "briefcase",
                        title: service.name,
                        description: service.description,
                        price: service.price || ""
                    }))
                }
            });
        }
        
        // Gallery Section (if photos available)
        if (business.photos && business.photos.length > 0) {
            components.push({
                id: `component-${componentIndex++}`,
                type: "GallerySectionBlock",
                props: {
                    title: "Photo Gallery",
                    layout: "grid",
                    columns: 3,
                    images: business.photos.map((photo: string) => ({
                        url: photo,
                        caption: ""
                    }))
                }
            });
        }
        
        // Testimonials/Reviews Section (if reviews available)
        if (business.reviews && business.reviews.length > 0) {
            components.push({
                id: `component-${componentIndex++}`,
                type: "TestimonialsSectionBlock",
                props: {
                    title: "What Our Customers Say",
                    layout: business.reviews.length > 3 ? "carousel" : "grid",
                    testimonials: business.reviews.map((review: any) => ({
                        name: review.reviewer,
                        role: "",
                        content: review.text,
                        rating: review.rating,
                        image: ""
                    }))
                }
            });
        }
        
        // Contact Section
        components.push({
            id: `component-${componentIndex++}`,
            type: "ContactSectionBlock",
            props: {
                title: "Get in Touch",
                subtitle: aiContent?.callToAction?.urgency || "We'd love to hear from you",
                showPhone: "yes",
                showEmail: "yes",
                showAddress: "yes",
                showHours: "yes",
                showMap: "no"
            }
        });
        
        // CTA Section
        components.push({
            id: `component-${componentIndex++}`,
            type: "CTASectionBlock",
            props: {
                title: "Ready to Get Started?",
                description: aiContent?.callToAction?.urgency || "Contact us today to learn more about our services",
                backgroundType: "gradient",
                buttons: [
                    {
                        text: aiContent?.callToAction?.primary || "Contact Us Now",
                        link: "#contact",
                        variant: "secondary"
                    }
                ]
            }
        });
        
        const homePageContent = JSON.stringify({
            title: aiContent?.seo?.metaTitle || business.name,
            components: components
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
        const aboutComponents: Array<{
            id: string;
            type: string;
            props: Record<string, unknown>;
        }> = [];
        
        let aboutComponentIndex = 0;
        
        // Hero section for about page
        aboutComponents.push({
            id: `component-${aboutComponentIndex++}`,
            type: "HeroSectionBlock",
            props: {
                title: `About ${business.name}`,
                subtitle: "Learn more about our story",
                backgroundImage: business.photos[0] || "",
                overlayOpacity: 0.7,
                height: "medium",
                buttons: []
            }
        });
        
        // Detailed about section
        aboutComponents.push({
            id: `component-${aboutComponentIndex++}`,
            type: "AboutSectionBlock",
            props: {
                title: "Our Story",
                content: aiContent?.about?.content || business.description || `${business.name} has been serving our community with dedication and excellence. We believe in quality, integrity, and customer satisfaction.`,
                image: business.photos[2] || business.photos[1] || "",
                imagePosition: "left",
                backgroundColor: "muted"
            }
        });
        
        // Team section (placeholder for future)
        if (aiContent?.whyChooseUs) {
            aboutComponents.push({
                id: `component-${aboutComponentIndex++}`,
                type: "ServicesSectionBlock",
                props: {
                    title: aiContent.whyChooseUs.title || "Why Choose Us",
                    subtitle: "",
                    layout: "grid2",
                    services: aiContent.whyChooseUs.points.map((point: string, index: number) => ({
                        icon: ["shield", "award", "heart", "star"][index % 4],
                        title: point,
                        description: "",
                        price: ""
                    }))
                }
            });
        }
        
        const aboutPageContent = JSON.stringify({
            title: `About ${business.name}`,
            components: aboutComponents
        });

        const aboutPageId = await ctx.db.insert("pages", {
            domainId: args.domainId,
            slug: "about",
            content: aboutPageContent,
            isPublished: false,
            lastEditedAt: Date.now()
        });

        // Create contact page
        const contactComponents: Array<{
            id: string;
            type: string;
            props: Record<string, unknown>;
        }> = [];
        
        let contactComponentIndex = 0;
        
        // Hero section for contact page
        contactComponents.push({
            id: `component-${contactComponentIndex++}`,
            type: "HeroSectionBlock",
            props: {
                title: "Contact Us",
                subtitle: "Get in touch with our team",
                backgroundImage: business.photos[business.photos.length - 1] || "",
                overlayOpacity: 0.8,
                height: "small",
                buttons: []
            }
        });
        
        // Main contact section with all info
        contactComponents.push({
            id: `component-${contactComponentIndex++}`,
            type: "ContactSectionBlock",
            props: {
                title: "We're Here to Help",
                subtitle: "Reach out to us through any of the following methods",
                showPhone: "yes",
                showEmail: "yes",
                showAddress: "yes",
                showHours: "yes",
                showMap: "yes"
            }
        });
        
        // CTA section
        contactComponents.push({
            id: `component-${contactComponentIndex++}`,
            type: "CTASectionBlock",
            props: {
                title: "Visit Us Today",
                description: "We look forward to serving you",
                backgroundType: "solid",
                buttons: [
                    {
                        text: "Get Directions",
                        link: `https://maps.google.com/?q=${encodeURIComponent(business.address)}`,
                        variant: "default"
                    },
                    {
                        text: `Call ${business.phone || 'Us'}`,
                        link: `tel:${business.phone || ''}`,
                        variant: "outline"
                    }
                ]
            }
        });
        
        const contactPageContent = JSON.stringify({
            title: "Contact Us",
            components: contactComponents
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