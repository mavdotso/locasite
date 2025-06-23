import { query, mutation, internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { getUserFromAuth } from './lib/helpers';
import { PageSection } from './lib/types';
import { api } from './_generated/api';

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

        // Check if pages already exist to avoid duplicates
        const existingPage = await ctx.db
            .query("pages")
            .withIndex("by_domain", q => q.eq("domainId", args.domainId))
            .first();

        if (existingPage) {
            console.log("Pages already exist for this domain");
            return { pageId: existingPage._id };
        }

        // Use AI-generated content if available, otherwise fall back to basic content
        const aiContent = business.aiGeneratedContent;
        
        console.log(`Creating default pages for business: ${business.name}, domain: ${domain.subdomain}`);
        
        // Create components array for visual editor format with new 6-section structure
        const components: Array<{
            id: string;
            type: string;
            props: Record<string, unknown>;
            metadata?: Record<string, unknown>;
            children?: Array<{
                id: string;
                type: string;
                props: Record<string, unknown>;
                metadata?: Record<string, unknown>;
                children?: any[];
            }>;
        }> = [];
        
        let componentIndex = 0;
        
        // 1. Header Section - Navigation header
        components.push({
            id: `component-${componentIndex++}`,
            type: "HeaderSection",
            props: {
                logoText: business.name,
                logoUrl: "",
                menuItems: [
                    "Home|#",
                    "About|#about",
                    "Gallery|#gallery", 
                    "Reviews|#reviews",
                    "Contact|#contact"
                ],
                showCtaButton: "yes",
                ctaButtonLabel: "Call Now",
                ctaButtonHref: business.phone ? `tel:${business.phone}` : "tel:"
            }
        });
        
        // 2. Hero Section - Main banner with background image
        components.push({
            id: `component-${componentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "full",
                verticalPadding: "none"
            },
            children: [
                {
                    id: `component-${componentIndex++}`,
                    type: "DividerBlock",
                    props: {
                        height: "xlarge",
                        backgroundImage: business.photos?.[0] || "",
                        backgroundColor: "#000000",
                        overlayOpacity: 0.5
                    },
                    children: [
                        {
                            id: `component-${componentIndex++}`,
                            type: "SectionBlock",
                            props: {
                                width: "container",
                                verticalPadding: "xlarge"
                            },
                            children: [
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: aiContent?.hero?.title || business.name,
                                        variant: "h1",
                                        align: "center",
                                        color: "#ffffff"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "medium"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: aiContent?.hero?.subtitle || business.description || `Welcome to ${business.name}`,
                                        variant: "lead",
                                        align: "center",
                                        color: "#ffffff"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "large"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "ColumnsBlock",
                                    props: {
                                        columns: "2",
                                        gap: "small",
                                        stackOnMobile: "yes"
                                    },
                                    children: [
                                        {
                                            id: `component-${componentIndex++}`,
                                            type: "ButtonBlock",
                                            props: {
                                                text: aiContent?.callToAction?.primary || "Contact Us",
                                                link: "#contact",
                                                variant: "default",
                                                size: "large",
                                                align: "right"
                                            },
                                            metadata: { columnIndex: 0 }
                                        },
                                        {
                                            id: `component-${componentIndex++}`,
                                            type: "ButtonBlock",
                                            props: {
                                                text: aiContent?.callToAction?.secondary || "Learn More",
                                                link: "#about",
                                                variant: "outline",
                                                size: "large",
                                                align: "left"
                                            },
                                            metadata: { columnIndex: 1 }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        
        // 3. About Section - About the business
        components.push({
            id: `component-${componentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "container",
                verticalPadding: "large"
            },
            children: [
                {
                    id: `component-${componentIndex++}`,
                    type: "ColumnsBlock",
                    props: {
                        columns: "2",
                        gap: "large",
                        stackOnMobile: "yes"
                    },
                    children: [
                        {
                            id: `component-${componentIndex++}`,
                            type: "SectionBlock",
                            props: {
                                width: "full",
                                verticalPadding: "none"
                            },
                            metadata: { columnIndex: 0 },
                            children: [
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "About Us",
                                        variant: "h2",
                                        align: "left"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "medium"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: aiContent?.about?.content || business.description || `${business.name} is dedicated to providing exceptional service to our customers. We take pride in our work and strive to exceed expectations.`,
                                        variant: "paragraph",
                                        align: "left"
                                    }
                                }
                            ]
                        },
                        business.photos?.[1] ? {
                            id: `component-${componentIndex++}`,
                            type: "ImageBlock",
                            props: {
                                src: business.photos[1],
                                alt: `About ${business.name}`,
                                aspectRatio: "auto",
                                objectFit: "cover"
                            },
                            metadata: { columnIndex: 1 }
                        } : null
                    ].filter(Boolean)
                }
            ]
        });
        
        // 4. Gallery Section - Photo gallery using the GalleryGridBlock
        if (business.photos && business.photos.length > 0) {
            components.push({
                id: `component-${componentIndex++}`,
                type: "SectionBlock",
                props: {
                    width: "container",
                    verticalPadding: "large"
                },
                children: [
                    {
                        id: `component-${componentIndex++}`,
                        type: "TextBlock",
                        props: {
                            content: "Gallery",
                            variant: "h2",
                            align: "center"
                        }
                    },
                    {
                        id: `component-${componentIndex++}`,
                        type: "SpacerBlock",
                        props: {
                            size: "large"
                        }
                    },
                    {
                        id: `component-${componentIndex++}`,
                        type: "GalleryGridBlock",
                        props: {
                            images: business.photos.slice(0, 12),
                            columns: "3",
                            gap: "small",
                            aspectRatio: "square"
                        }
                    }
                ]
            });
        }
        
        // 5. Reviews Section - Google Reviews using GoogleReviewsSection
        if (business.reviews && business.reviews.length > 0) {
            components.push({
                id: `component-${componentIndex++}`,
                type: "GoogleReviewsSection",
                props: {
                    title: "What Our Customers Say",
                    maxReviews: 6,
                    showRatingBadge: "yes",
                    businessName: business.name
                }
            });
        }
        
        // 6. Contact Section - Contact information and location
        components.push({
            id: `component-${componentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "container",
                verticalPadding: "large"
            },
            children: [
                {
                    id: `component-${componentIndex++}`,
                    type: "TextBlock",
                    props: {
                        content: "Contact Us",
                        variant: "h2",
                        align: "center"
                    }
                },
                {
                    id: `component-${componentIndex++}`,
                    type: "SpacerBlock",
                    props: {
                        size: "large"
                    }
                },
                {
                    id: `component-${componentIndex++}`,
                    type: "ColumnsBlock",
                    props: {
                        columns: "3",
                        gap: "medium",
                        stackOnMobile: "yes"
                    },
                    children: [
                        // Phone card
                        {
                            id: `component-${componentIndex++}`,
                            type: "CardBlock",
                            props: {
                                title: "",
                                description: "",
                                variant: "default",
                                padding: "medium"
                            },
                            children: [
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "IconBlock",
                                    props: {
                                        icon: "phone",
                                        size: "large",
                                        color: "",
                                        align: "center"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "small"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Phone",
                                        variant: "h4",
                                        align: "center"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: business.phone || "Contact us for phone number",
                                        variant: "paragraph",
                                        align: "center"
                                    }
                                }
                            ],
                            metadata: { columnIndex: 0 }
                        },
                        // Address card
                        {
                            id: `component-${componentIndex++}`,
                            type: "CardBlock",
                            props: {
                                title: "",
                                description: "",
                                variant: "default",
                                padding: "medium"
                            },
                            metadata: { columnIndex: 1 },
                            children: [
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "IconBlock",
                                    props: {
                                        icon: "mapPin",
                                        size: "large",
                                        color: "",
                                        align: "center"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "small"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Address",
                                        variant: "h4",
                                        align: "center"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: business.address || "Visit us at our location",
                                        variant: "paragraph",
                                        align: "center"
                                    }
                                }
                            ]
                        },
                        // Hours card
                        {
                            id: `component-${componentIndex++}`,
                            type: "CardBlock",
                            props: {
                                title: "",
                                description: "",
                                variant: "default",
                                padding: "medium"
                            },
                            metadata: { columnIndex: 2 },
                            children: [
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "IconBlock",
                                    props: {
                                        icon: "clock",
                                        size: "large",
                                        color: "",
                                        align: "center"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "small"
                                    }
                                },
                                {
                                    id: `component-${componentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Hours",
                                        variant: "h4",
                                        align: "center"
                                    }
                                },
                                ...(business.hours && business.hours.length > 0 ? 
                                    business.hours.map((hour: string, index: number) => ({
                                        id: `component-${componentIndex++}-hour-${index}`,
                                        type: "TextBlock",
                                        props: {
                                            content: hour,
                                            variant: "small",
                                            align: "center"
                                        }
                                    })) : [{
                                        id: `component-${componentIndex++}`,
                                        type: "TextBlock",
                                        props: {
                                            content: "Contact us for hours",
                                            variant: "paragraph",
                                            align: "center"
                                        }
                                    }]
                                )
                            ]
                        }
                    ]
                }
            ]
        });
        
        const pageContent = JSON.stringify({
            title: aiContent?.seo?.metaTitle || business.name,
            components: components
        });

        // Create single page as draft
        const pageId = await ctx.db.insert("pages", {
            domainId: args.domainId,
            content: pageContent,
            isPublished: false,
            lastEditedAt: Date.now()
        });

        return {
            pageId,
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
            .withIndex("by_domain", q => q.eq("domainId", args.domainId))
            .collect();
    },
});

// Get homepage by domain
export const getHomepageByDomain = query({
    args: { domainId: v.id("domains") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("pages")
            .withIndex("by_domain", q => q.eq("domainId", args.domainId))
            .first();
    }
});

export const getByDomain = query({
    args: {
        domain: v.string(),
    },
    handler: async (ctx, args) => {
        const domain = await ctx.db
            .query('domains')
            .withIndex('by_subdomain', q => q.eq('subdomain', args.domain))
            .first();

        if (!domain) return null;

        return await ctx.db
            .query('pages')
            .withIndex('by_domain', q => q.eq('domainId', domain._id))
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