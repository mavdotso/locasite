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

        // Use AI-generated content if available, otherwise fall back to basic content
        const aiContent = business.aiGeneratedContent;
        
        // Create components array for visual editor format
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
        
        // Hero Section - using primitive blocks
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
                        backgroundImage: business.photos[0] || "",
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
        
        // About Section - using primitive blocks
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
                        business.photos[1] ? {
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
        
        // Services Section (if AI generated) - using primitive blocks
        if (aiContent?.services && aiContent.services.items.length > 0) {
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
                            content: aiContent.services.title || "Our Services",
                            variant: "h2",
                            align: "center"
                        }
                    },
                    {
                        id: `component-${componentIndex++}`,
                        type: "TextBlock",
                        props: {
                            content: "What we offer",
                            variant: "lead",
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
                        children: aiContent.services.items.map((service: any, index: number) => ({
                            id: `component-${componentIndex++}-service-${index}`,
                            type: "CardBlock",
                            props: {
                                title: service.title || service.name,
                                description: "",
                                variant: "default",
                                padding: "medium"
                            },
                            metadata: { columnIndex: index % 3 },
                            children: [
                                {
                                    id: `component-${componentIndex++}-service-desc-${index}`,
                                    type: "TextBlock",
                                    props: {
                                        content: service.description,
                                        variant: "paragraph",
                                        align: "left"
                                    }
                                },
                                service.price ? {
                                    id: `component-${componentIndex++}-service-price-${index}`,
                                    type: "TextBlock",
                                    props: {
                                        content: service.price,
                                        variant: "muted",
                                        align: "left"
                                    }
                                } : null
                            ].filter(Boolean)
                        }))
                    }
                ]
            });
        }
        
        // Gallery Section (if photos available) - using primitive blocks
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
                            content: "Photo Gallery",
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
                            gap: "small",
                            stackOnMobile: "yes"
                        },
                        children: business.photos.map((photo: string, index: number) => ({
                            id: `component-${componentIndex++}-photo-${index}`,
                            type: "ImageBlock",
                            props: {
                                src: photo,
                                alt: `${business.name} gallery image ${index + 1}`,
                                aspectRatio: "square",
                                objectFit: "cover"
                            },
                            metadata: { columnIndex: index % 3 }
                        }))
                    }
                ]
            });
        }
        
        // Testimonials/Reviews Section (if reviews available) - using primitive blocks
        if (business.reviews && business.reviews.length > 0) {
            // Main testimonials section container
            components.push({
                id: `component-${componentIndex++}`,
                type: "SectionBlock",
                props: {
                    width: "container",
                    verticalPadding: "large"
                },
                children: [
                    // Section title
                    {
                        id: `component-${componentIndex++}`,
                        type: "TextBlock",
                        props: {
                            content: "What Our Customers Say",
                            variant: "h2",
                            align: "center"
                        }
                    },
                    // Spacer
                    {
                        id: `component-${componentIndex++}`,
                        type: "SpacerBlock",
                        props: {
                            size: "medium"
                        }
                    },
                    // Reviews in columns
                    {
                        id: `component-${componentIndex++}`,
                        type: "ColumnsBlock",
                        props: {
                            columns: business.reviews.length > 2 ? "3" : "2",
                            gap: "medium",
                            stackOnMobile: "yes"
                        },
                        children: business.reviews.slice(0, 6).map((review: any, index: number) => ({
                            id: `component-${componentIndex++}-review-${index}`,
                            type: "CardBlock",
                            props: {
                                title: review.reviewer,
                                description: review.rating,
                                variant: "default",
                                padding: "medium"
                            },
                            metadata: { columnIndex: index % (business.reviews.length > 2 ? 3 : 2) },
                            children: [
                                {
                                    id: `component-${componentIndex++}-review-text-${index}`,
                                    type: "TextBlock",
                                    props: {
                                        content: review.text,
                                        variant: "paragraph",
                                        align: "left"
                                    }
                                }
                            ]
                        }))
                    }
                ]
            });
        }
        
        // Contact Section - using primitive blocks
        components.push({
            id: `component-${componentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "container",
                verticalPadding: "large"
            },
            children: [
                // Section title
                {
                    id: `component-${componentIndex++}`,
                    type: "TextBlock",
                    props: {
                        content: "Get in Touch",
                        variant: "h2",
                        align: "center"
                    }
                },
                {
                    id: `component-${componentIndex++}`,
                    type: "TextBlock",
                    props: {
                        content: aiContent?.callToAction?.urgency || "We'd love to hear from you",
                        variant: "lead",
                        align: "center"
                    }
                },
                // Spacer
                {
                    id: `component-${componentIndex++}`,
                    type: "SpacerBlock",
                    props: {
                        size: "large"
                    }
                },
                // Contact info in columns
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
                                    })) : [
                                        {
                                            id: `component-${componentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: "Contact us for hours",
                                                variant: "paragraph",
                                                align: "center"
                                            }
                                        }
                                    ]
                                )
                            ]
                        }
                    ]
                }
            ]
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
            metadata?: Record<string, unknown>;
            children?: Array<{
                id: string;
                type: string;
                props: Record<string, unknown>;
                metadata?: Record<string, unknown>;
                children?: any[];
            }>;
        }> = [];
        
        let aboutComponentIndex = 0;
        
        // Hero section for about page - using primitive blocks
        aboutComponents.push({
            id: `component-${aboutComponentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "full",
                verticalPadding: "none"
            },
            children: [
                {
                    id: `component-${aboutComponentIndex++}`,
                    type: "DividerBlock",
                    props: {
                        height: "large",
                        backgroundImage: business.photos[0] || "",
                        backgroundColor: "#000000",
                        overlayOpacity: 0.7
                    },
                    children: [
                        {
                            id: `component-${aboutComponentIndex++}`,
                            type: "SectionBlock",
                            props: {
                                width: "container",
                                verticalPadding: "large"
                            },
                            children: [
                                {
                                    id: `component-${aboutComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: `About ${business.name}`,
                                        variant: "h1",
                                        align: "center",
                                        color: "#ffffff"
                                    }
                                },
                                {
                                    id: `component-${aboutComponentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "small"
                                    }
                                },
                                {
                                    id: `component-${aboutComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Learn more about our story",
                                        variant: "lead",
                                        align: "center",
                                        color: "#ffffff"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        
        // Detailed about section - using primitive blocks
        aboutComponents.push({
            id: `component-${aboutComponentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "container",
                verticalPadding: "large"
            },
            children: [
                {
                    id: `component-${aboutComponentIndex++}`,
                    type: "ColumnsBlock",
                    props: {
                        columns: "2",
                        gap: "large",
                        stackOnMobile: "yes"
                    },
                    children: [
                        business.photos[2] || business.photos[1] ? {
                            id: `component-${aboutComponentIndex++}`,
                            type: "ImageBlock",
                            props: {
                                src: business.photos[2] || business.photos[1],
                                alt: `${business.name} story image`,
                                aspectRatio: "auto",
                                objectFit: "cover"
                            },
                            metadata: { columnIndex: 0 }
                        } : null,
                        {
                            id: `component-${aboutComponentIndex++}`,
                            type: "SectionBlock",
                            props: {
                                width: "full",
                                verticalPadding: "none"
                            },
                            metadata: { columnIndex: 1 },
                            children: [
                                {
                                    id: `component-${aboutComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Our Story",
                                        variant: "h2",
                                        align: "left"
                                    }
                                },
                                {
                                    id: `component-${aboutComponentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "medium"
                                    }
                                },
                                {
                                    id: `component-${aboutComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: aiContent?.about?.content || business.description || `${business.name} has been serving our community with dedication and excellence. We believe in quality, integrity, and customer satisfaction.`,
                                        variant: "paragraph",
                                        align: "left"
                                    }
                                }
                            ]
                        }
                    ].filter(Boolean)
                }
            ]
        });
        
        // Why Choose Us section - using primitive blocks
        if (aiContent?.whyChooseUs) {
            aboutComponents.push({
                id: `component-${aboutComponentIndex++}`,
                type: "SectionBlock",
                props: {
                    width: "container",
                    verticalPadding: "large"
                },
                children: [
                    {
                        id: `component-${aboutComponentIndex++}`,
                        type: "TextBlock",
                        props: {
                            content: aiContent.whyChooseUs.title || "Why Choose Us",
                            variant: "h2",
                            align: "center"
                        }
                    },
                    {
                        id: `component-${aboutComponentIndex++}`,
                        type: "SpacerBlock",
                        props: {
                            size: "large"
                        }
                    },
                    {
                        id: `component-${aboutComponentIndex++}`,
                        type: "ColumnsBlock",
                        props: {
                            columns: "2",
                            gap: "medium",
                            stackOnMobile: "yes"
                        },
                        children: aiContent.whyChooseUs.points.map((point: string, index: number) => ({
                            id: `component-${aboutComponentIndex++}-point-${index}`,
                            type: "CardBlock",
                            props: {
                                title: "",
                                description: "",
                                variant: "default",
                                padding: "medium"
                            },
                            metadata: { columnIndex: index % 2 },
                            children: [
                                {
                                    id: `component-${aboutComponentIndex++}-point-text-${index}`,
                                    type: "TextBlock",
                                    props: {
                                        content: point,
                                        variant: "paragraph",
                                        align: "center"
                                    }
                                }
                            ]
                        }))
                    }
                ]
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
            metadata?: Record<string, unknown>;
            children?: Array<{
                id: string;
                type: string;
                props: Record<string, unknown>;
                metadata?: Record<string, unknown>;
                children?: any[];
            }>;
        }> = [];
        
        let contactComponentIndex = 0;
        
        // Hero section for contact page - using primitive blocks
        contactComponents.push({
            id: `component-${contactComponentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "full",
                verticalPadding: "none"
            },
            children: [
                {
                    id: `component-${contactComponentIndex++}`,
                    type: "DividerBlock",
                    props: {
                        height: "medium",
                        backgroundImage: business.photos[business.photos.length - 1] || "",
                        backgroundColor: "#000000",
                        overlayOpacity: 0.8
                    },
                    children: [
                        {
                            id: `component-${contactComponentIndex++}`,
                            type: "SectionBlock",
                            props: {
                                width: "container",
                                verticalPadding: "medium"
                            },
                            children: [
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Contact Us",
                                        variant: "h1",
                                        align: "center",
                                        color: "#ffffff"
                                    }
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "small"
                                    }
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Get in touch with our team",
                                        variant: "lead",
                                        align: "center",
                                        color: "#ffffff"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        
        // Main contact section with all info - using primitive blocks
        contactComponents.push({
            id: `component-${contactComponentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "container",
                verticalPadding: "large"
            },
            children: [
                {
                    id: `component-${contactComponentIndex++}`,
                    type: "TextBlock",
                    props: {
                        content: "We're Here to Help",
                        variant: "h2",
                        align: "center"
                    }
                },
                {
                    id: `component-${contactComponentIndex++}`,
                    type: "TextBlock",
                    props: {
                        content: "Reach out to us through any of the following methods",
                        variant: "lead",
                        align: "center"
                    }
                },
                {
                    id: `component-${contactComponentIndex++}`,
                    type: "SpacerBlock",
                    props: {
                        size: "large"
                    }
                },
                {
                    id: `component-${contactComponentIndex++}`,
                    type: "ColumnsBlock",
                    props: {
                        columns: "2",
                        gap: "large",
                        stackOnMobile: "yes"
                    },
                    children: [
                        // Contact info column
                        {
                            id: `component-${contactComponentIndex++}`,
                            type: "SectionBlock",
                            props: {
                                width: "full",
                                verticalPadding: "none"
                            },
                            metadata: { columnIndex: 0 },
                            children: [
                                business.phone && {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "CardBlock",
                                    props: {
                                        title: "",
                                        description: "",
                                        variant: "default",
                                        padding: "medium"
                                    },
                                    children: [
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "IconBlock",
                                            props: {
                                                icon: "phone",
                                                size: "medium",
                                                color: "",
                                                align: "left"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "SpacerBlock",
                                            props: {
                                                size: "small"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: "Phone",
                                                variant: "h4",
                                                align: "left"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: business.phone,
                                                variant: "paragraph",
                                                align: "left"
                                            }
                                        }
                                    ]
                                },
                                business.email && {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "CardBlock",
                                    props: {
                                        title: "",
                                        description: "",
                                        variant: "default",
                                        padding: "medium"
                                    },
                                    children: [
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "IconBlock",
                                            props: {
                                                icon: "mail",
                                                size: "medium",
                                                color: "",
                                                align: "left"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "SpacerBlock",
                                            props: {
                                                size: "small"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: "Email",
                                                variant: "h4",
                                                align: "left"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: business.email,
                                                variant: "paragraph",
                                                align: "left"
                                            }
                                        }
                                    ]
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "CardBlock",
                                    props: {
                                        title: "",
                                        description: "",
                                        variant: "default",
                                        padding: "medium"
                                    },
                                    children: [
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "IconBlock",
                                            props: {
                                                icon: "mapPin",
                                                size: "medium",
                                                color: "",
                                                align: "left"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "SpacerBlock",
                                            props: {
                                                size: "small"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: "Address",
                                                variant: "h4",
                                                align: "left"
                                            }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: business.address,
                                                variant: "paragraph",
                                                align: "left"
                                            }
                                        }
                                    ]
                                }
                            ].filter(Boolean)
                        },
                        // Hours column
                        {
                            id: `component-${contactComponentIndex++}`,
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
                                    id: `component-${contactComponentIndex++}`,
                                    type: "IconBlock",
                                    props: {
                                        icon: "clock",
                                        size: "medium",
                                        color: "",
                                        align: "left"
                                    }
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "small"
                                    }
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Business Hours",
                                        variant: "h4",
                                        align: "left"
                                    }
                                },
                                ...(business.hours && business.hours.length > 0 ?
                                    business.hours.map((hour: string, index: number) => ({
                                        id: `component-${contactComponentIndex++}-hour-${index}`,
                                        type: "TextBlock",
                                        props: {
                                            content: hour,
                                            variant: "small",
                                            align: "left"
                                        }
                                    })) : [
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "TextBlock",
                                            props: {
                                                content: "Contact us for business hours",
                                                variant: "paragraph",
                                                align: "left"
                                            }
                                        }
                                    ]
                                )
                            ]
                        }
                    ]
                }
            ]
        });
        
        // CTA section - using primitive blocks
        contactComponents.push({
            id: `component-${contactComponentIndex++}`,
            type: "SectionBlock",
            props: {
                width: "full",
                verticalPadding: "large"
            },
            children: [
                {
                    id: `component-${contactComponentIndex++}`,
                    type: "DividerBlock",
                    props: {
                        height: "medium",
                        backgroundColor: "#f3f4f6"
                    },
                    children: [
                        {
                            id: `component-${contactComponentIndex++}`,
                            type: "SectionBlock",
                            props: {
                                width: "container",
                                verticalPadding: "medium"
                            },
                            children: [
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "Visit Us Today",
                                        variant: "h3",
                                        align: "center"
                                    }
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "TextBlock",
                                    props: {
                                        content: "We look forward to serving you",
                                        variant: "paragraph",
                                        align: "center"
                                    }
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "SpacerBlock",
                                    props: {
                                        size: "medium"
                                    }
                                },
                                {
                                    id: `component-${contactComponentIndex++}`,
                                    type: "ColumnsBlock",
                                    props: {
                                        columns: "2",
                                        gap: "small",
                                        stackOnMobile: "yes"
                                    },
                                    children: [
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "ButtonBlock",
                                            props: {
                                                text: "Get Directions",
                                                link: `https://maps.google.com/?q=${encodeURIComponent(business.address)}`,
                                                variant: "default",
                                                size: "medium",
                                                align: "right"
                                            },
                                            metadata: { columnIndex: 0 }
                                        },
                                        {
                                            id: `component-${contactComponentIndex++}`,
                                            type: "ButtonBlock",
                                            props: {
                                                text: `Call ${business.phone || 'Us'}`,
                                                link: `tel:${business.phone || ''}`,
                                                variant: "outline",
                                                size: "medium",
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

// Regenerate default pages with proper component structure
// Temporarily disabled due to circular dependency issue
/*
export const regenerateDefaultPages = mutation({
    args: {
        businessId: v.id("businesses"),
    },
    handler: async (ctx, args) => {
        const user = await getUserFromAuth(ctx);
        
        // Get the business
        const business = await ctx.db.get(args.businessId);
        if (!business) {
            throw new Error("Business not found");
        }
        
        // Verify ownership
        if (business.userId !== user._id) {
            throw new Error("Not authorized to regenerate pages for this business");
        }
        
        // Get the domain directly by ID
        if (!business.domainId) {
            throw new Error("Business has no domain");
        }
        
        const domain = await ctx.db.get(business.domainId);
        if (!domain) {
            throw new Error("Domain not found for business");
        }
        
        // Delete existing pages
        const existingPages = await ctx.db
            .query("pages")
            .withIndex("by_domain_slug", q => q.eq("domainId", domain._id))
            .collect();
            
        for (const page of existingPages) {
            await ctx.db.delete(page._id);
        }
        
        // Create new pages with proper structure
        // Call createDefaultPages directly instead of through api
        const homePageData = generateHomePage(business);
        const aboutPageData = generateAboutPage(business);
        const contactPageData = generateContactPage(business);
        
        // Create home page
        const homePageId = await ctx.db.insert("pages", {
            domainId: domain._id,
            slug: "home",
            title: homePageData.title,
            content: JSON.stringify(homePageData),
            updatedAt: Date.now(),
        });
        
        // Create about page
        const aboutPageId = await ctx.db.insert("pages", {
            domainId: domain._id,
            slug: "about",
            title: aboutPageData.title,
            content: JSON.stringify(aboutPageData),
            updatedAt: Date.now(),
        });
        
        // Create contact page
        const contactPageId = await ctx.db.insert("pages", {
            domainId: domain._id,
            slug: "contact",
            title: contactPageData.title,
            content: JSON.stringify(contactPageData),
            updatedAt: Date.now(),
        });
        
        return {
            homePageId,
            aboutPageId,
            contactPageId,
        };
    },
});
*/

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