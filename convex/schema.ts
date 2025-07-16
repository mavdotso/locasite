import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  advancedThemeSchemaV,
  simpleThemeSchemaV,
  partialAdvancedThemeSchemaV,
} from "./lib/themeSchema";

export default defineSchema({
  ...authTables,

  // Themes table for storing theme configurations
  themes: defineTable({
    // Theme info
    name: v.string(),
    description: v.optional(v.string()),
    isPreset: v.boolean(), // true for built-in themes, false for custom
    presetId: v.optional(v.string()), // ID of the preset this was based on

    // Theme configuration
    config: advancedThemeSchemaV,

    // Ownership
    userId: v.optional(v.id("users")), // null for preset themes
    businessId: v.optional(v.id("businesses")), // if theme is business-specific

    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    isPublic: v.boolean(), // whether other users can use this theme
    tags: v.array(v.string()),
    industry: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_business", ["businessId"])
    .index("by_preset", ["isPreset"])
    .index("by_public", ["isPublic"]),

  domains: defineTable({
    name: v.string(),
    subdomain: v.string(),
    customDomain: v.optional(v.string()),
    domainType: v.optional(
      v.union(v.literal("subdomain"), v.literal("custom")),
    ),
    isVerified: v.optional(v.boolean()),
    verificationToken: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_subdomain", ["subdomain"])
    .index("by_custom_domain", ["customDomain"]),

  pages: defineTable({
    domainId: v.id("domains"),
    content: v.string(),
    // Draft content for unpublished changes
    draftContent: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    lastEditedAt: v.optional(v.number()),
  }).index("by_domain", ["domainId"]),

  businesses: defineTable({
    name: v.string(),
    placeId: v.string(),
    address: v.string(),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
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
    createdAt: v.number(),
    userId: v.optional(v.id("users")),
    domainId: v.optional(v.id("domains")),

    // Legacy theme support (for backward compatibility)
    theme: v.optional(simpleThemeSchemaV),

    // New advanced theme system
    themeId: v.optional(v.id("themes")), // Reference to themes table
    themeOverrides: v.optional(partialAdvancedThemeSchemaV), // Business-specific overrides
    // Publishing state
    isPublished: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),

    // Publishing permissions
    canPublish: v.optional(v.boolean()), // Can this business publish their site
    verificationRequired: v.optional(v.boolean()), // Does this business need verification (default: true)
    publishingBlocked: v.optional(v.boolean()), // Is publishing temporarily blocked
    publishingBlockReason: v.optional(v.string()), // Reason for blocking
    lastVerificationCheck: v.optional(v.number()), // Last verification timestamp
    verificationMethod: v.optional(
      v.union(v.literal("google"), v.literal("email"), v.literal("manual")),
    ),
    verificationCompletedAt: v.optional(v.number()),

    // SEO and branding
    favicon: v.optional(v.string()), // URL to custom favicon
    faviconStorageId: v.optional(v.id("_storage")), // Convex storage ID for favicon
    seoTitle: v.optional(v.string()), // Custom SEO title
    seoDescription: v.optional(v.string()), // Custom SEO description
    seoKeywords: v.optional(v.array(v.string())), // Custom SEO keywords
    ogImage: v.optional(v.string()), // Custom OG image URL
    ogImageStorageId: v.optional(v.id("_storage")), // Convex storage ID for OG image

    // Draft content - stores unsaved changes
    draftContent: v.optional(
      v.object({
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        phone: v.optional(v.string()),
        email: v.optional(v.string()),
        website: v.optional(v.string()),
        hours: v.optional(v.array(v.string())),
        theme: v.optional(simpleThemeSchemaV),
        themeId: v.optional(v.id("themes")),
        themeOverrides: v.optional(partialAdvancedThemeSchemaV),
      }),
    ),
    lastEditedAt: v.optional(v.number()),
    // AI-generated content for website sections
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
                icon: v.optional(v.string()),
                features: v.optional(v.array(v.string())),
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
        features: v.optional(
          v.object({
            title: v.string(),
            subtitle: v.string(),
            items: v.array(
              v.object({
                title: v.string(),
                description: v.string(),
                icon: v.string(),
              }),
            ),
          }),
        ),
        process: v.optional(
          v.object({
            title: v.string(),
            subtitle: v.string(),
            steps: v.array(
              v.object({
                number: v.string(),
                title: v.string(),
                description: v.string(),
              }),
            ),
          }),
        ),
        faq: v.optional(
          v.object({
            title: v.string(),
            items: v.array(
              v.object({
                question: v.string(),
                answer: v.string(),
              }),
            ),
          }),
        ),
        team: v.optional(
          v.object({
            title: v.string(),
            subtitle: v.string(),
            members: v.array(
              v.object({
                name: v.string(),
                role: v.string(),
                bio: v.string(),
                expertise: v.array(v.string()),
              }),
            ),
          }),
        ),
        stats: v.optional(
          v.object({
            title: v.string(),
            items: v.array(
              v.object({
                number: v.string(),
                label: v.string(),
                suffix: v.optional(v.string()),
              }),
            ),
          }),
        ),
        specialOffers: v.optional(
          v.object({
            title: v.string(),
            offers: v.array(
              v.object({
                title: v.string(),
                description: v.string(),
                validUntil: v.string(),
                code: v.optional(v.string()),
              }),
            ),
          }),
        ),
      }),
    ),
    // Google Business Profile integration
    googleBusinessAuth: v.optional(
      v.object({
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
        selectedAccountId: v.optional(v.string()),
        selectedLocationId: v.optional(v.string()),
        verificationStatus: v.optional(
          v.union(
            v.literal("unverified"),
            v.literal("pending"),
            v.literal("verified"),
            v.literal("failed"),
          ),
        ),
      }),
    ),
  })
    .index("by_placeId", ["placeId"])
    .index("by_userId", ["userId"])
    .index("by_domainId", ["domainId"])
    .index("by_createdAt", ["createdAt"]),

  businessClaims: defineTable({
    businessId: v.id("businesses"),
    userId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
    ),
    verificationMethod: v.optional(
      v.union(v.literal("google"), v.literal("email"), v.literal("phone")),
    ),
    googleVerificationStatus: v.optional(
      v.union(v.literal("pending"), v.literal("verified"), v.literal("failed")),
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    notes: v.optional(v.string()),

    // Email verification fields
    emailVerificationToken: v.optional(v.string()),
    emailVerificationExpiry: v.optional(v.number()),
    magicLinkSent: v.optional(v.boolean()),
    verificationAttempts: v.optional(v.number()),

    // Admin review fields
    adminNotes: v.optional(v.string()),
    documentsUploaded: v.optional(v.array(v.string())),
  })
    .index("by_business", ["businessId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_business_status", ["businessId", "status"]),

  contactMessages: defineTable({
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    status: v.union(
      v.literal("unread"),
      v.literal("read"),
      v.literal("responded"),
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_business", ["businessId"])
    .index("by_business_status", ["businessId", "status"])
    .index("by_createdAt", ["createdAt"]),

  // Media library for storing user-uploaded files
  mediaLibrary: defineTable({
    // File metadata
    fileName: v.string(),
    originalName: v.string(),
    fileType: v.string(), // MIME type
    fileSize: v.number(), // in bytes
    storageId: v.id("_storage"), // Convex storage ID
    url: v.string(), // Public URL

    // Ownership
    userId: v.optional(v.id("users")), // User who uploaded
    businessId: v.optional(v.id("businesses")), // Business context

    // Organization
    tags: v.array(v.string()), // User-defined tags
    folder: v.optional(v.string()), // Folder organization
    alt: v.optional(v.string()), // Alt text for images

    // Usage tracking
    usageCount: v.number(), // How many times used
    lastUsedAt: v.optional(v.number()),

    // Metadata
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),

    // Image-specific metadata
    dimensions: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
      }),
    ),

    // Status
    isDeleted: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_business", ["businessId"])
    .index("by_user_business", ["userId", "businessId"])
    .index("by_folder", ["folder"])
    .index("by_file_type", ["fileType"])
    .index("by_created_at", ["createdAt"])
    .index("by_not_deleted", ["isDeleted"]),
});
