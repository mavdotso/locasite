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

  themes: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    isPreset: v.boolean(),
    presetId: v.optional(v.string()),

    config: advancedThemeSchemaV,

    userId: v.optional(v.id("users")),
    businessId: v.optional(v.id("businesses")),

    createdAt: v.number(),
    updatedAt: v.number(),
    isPublic: v.boolean(),
    tags: v.array(v.string()),
    industry: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_business", ["businessId"])
    .index("by_preset", ["isPreset"])
    .index("by_public", ["isPublic"])
    .index("by_preset_name", ["isPreset", "name"])
    .index("by_preset_presetId", ["isPreset", "presetId"]),

  // Subdomain reservations table to enforce uniqueness at DB level
  // This acts as a unique constraint on subdomains
  subdomainReservations: defineTable({
    subdomain: v.string(),
    domainId: v.optional(v.id("domains")), // Links to actual domain once created
    createdAt: v.number(),
    expiresAt: v.optional(v.number()), // For temporary reservations during creation
    status: v.union(
      v.literal("reserved"), // Temporary reservation during domain creation
      v.literal("active"), // Permanently linked to a domain
    ),
  })
    .index("by_subdomain", ["subdomain"]) // Primary lookup index
    .index("by_domain", ["domainId"])
    .index("by_status", ["status"])
    .index("by_expires", ["expiresAt", "status"]),

  domains: defineTable({
    name: v.string(),
    subdomain: v.string(),
    customDomain: v.optional(v.string()),
    domainType: v.optional(
      v.union(v.literal("subdomain"), v.literal("custom")),
    ),
    isVerified: v.optional(v.boolean()),
    verificationToken: v.optional(v.string()),

    sslStatus: v.optional(
      v.union(v.literal("pending"), v.literal("active"), v.literal("failed")),
    ),
    sslProvider: v.optional(v.string()),
    dnsRecords: v.optional(
      v.array(
        v.object({
          type: v.string(),
          name: v.string(),
          value: v.string(),
          required: v.boolean(),
        }),
      ),
    ),
    verificationMethod: v.optional(
      v.union(v.literal("dns"), v.literal("file")),
    ),
    verificationAttempts: v.optional(v.number()),
    lastVerificationCheck: v.optional(v.number()),
    verificationError: v.optional(v.string()),

    vercelDomainId: v.optional(v.string()),
    apexName: v.optional(v.string()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
    verifiedAt: v.optional(v.number()),
  })
    .index("by_subdomain", ["subdomain"])
    .index("by_custom_domain", ["customDomain"]),

  pages: defineTable({
    domainId: v.id("domains"),
    content: v.string(),
    draftContent: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),
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

    theme: v.optional(simpleThemeSchemaV),

    themeId: v.optional(v.id("themes")),
    themeOverrides: v.optional(partialAdvancedThemeSchemaV),
    isPublished: v.optional(v.boolean()),
    publishedAt: v.optional(v.number()),

    canPublish: v.optional(v.boolean()),
    verificationRequired: v.optional(v.boolean()),
    publishingBlocked: v.optional(v.boolean()),
    publishingBlockReason: v.optional(v.string()),
    lastVerificationCheck: v.optional(v.number()),
    verificationMethod: v.optional(
      v.union(v.literal("google"), v.literal("email"), v.literal("manual")),
    ),
    verificationCompletedAt: v.optional(v.number()),

    favicon: v.optional(v.string()),
    faviconStorageId: v.optional(v.id("_storage")),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    seoKeywords: v.optional(v.array(v.string())),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    ogImage: v.optional(v.string()),
    ogImageStorageId: v.optional(v.id("_storage")),

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
    .index("by_createdAt", ["createdAt"])
    .index("by_placeId_userId", ["placeId", "userId"])
    .index("by_themeId", ["themeId"]),

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

    emailVerificationToken: v.optional(v.string()),
    emailVerificationExpiry: v.optional(v.number()),
    magicLinkSent: v.optional(v.boolean()),
    verificationAttempts: v.optional(v.number()),

    adminNotes: v.optional(v.string()),
    documentsUploaded: v.optional(v.array(v.string())),
  })
    .index("by_business", ["businessId"])
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_business_status", ["businessId", "status"])
    .index("by_business_status_user", ["businessId", "status", "userId"])
    .index("by_business_status_verification", ["businessId", "status", "verificationMethod", "googleVerificationStatus"]),

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

  mediaLibrary: defineTable({
    fileName: v.string(),
    originalName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.id("_storage"),
    url: v.string(),

    userId: v.optional(v.id("users")),
    businessId: v.optional(v.id("businesses")),

    tags: v.array(v.string()),
    folder: v.optional(v.string()),
    alt: v.optional(v.string()),

    usageCount: v.number(),
    lastUsedAt: v.optional(v.number()),

    createdAt: v.number(),
    updatedAt: v.optional(v.number()),

    dimensions: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
      }),
    ),

    isDeleted: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_business", ["businessId"])
    .index("by_user_business", ["userId", "businessId"])
    .index("by_folder", ["folder"])
    .index("by_file_type", ["fileType"])
    .index("by_created_at", ["createdAt"])
    .index("by_not_deleted", ["isDeleted"]),

  businessImages: defineTable({
    businessId: v.id("businesses"),
    url: v.string(),
    storageId: v.optional(v.id("_storage")),
    type: v.union(
      v.literal("photo"),
      v.literal("gallery"),
      v.literal("hero"),
      v.literal("logo"),
    ),
    order: v.number(),
    caption: v.optional(v.string()),
    isActive: v.boolean(),
    source: v.union(
      v.literal("google"),
      v.literal("unsplash"),
      v.literal("upload"),
      v.literal("ai"),
    ),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
    .index("by_business", ["businessId"])
    .index("by_business_type", ["businessId", "type"])
    .index("by_business_active", ["businessId", "isActive"])
    .index("by_business_order", ["businessId", "order"]),

  stripeCustomers: defineTable({
    userId: v.id("users"),
    stripeCustomerId: v.string(),
  }).index("by_user", ["userId"]),

  stripeSubscriptions: defineTable({
    customerId: v.string(),
    subscriptionId: v.optional(v.string()),
    status: v.string(),
    priceId: v.optional(v.string()),
    planType: v.optional(
      v.union(
        v.literal("FREE"),
        v.literal("PROFESSIONAL"),
        v.literal("BUSINESS"),
      ),
    ),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    cancelAtPeriodEnd: v.optional(v.boolean()),
    paymentMethod: v.optional(
      v.object({
        brand: v.optional(v.string()),
        last4: v.optional(v.string()),
      }),
    ),
  }).index("by_customerId", ["customerId"]),

  payments: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    status: v.union(
      v.literal("created"),
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
    ),
    stripeSessionId: v.string(),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    stripeId: v.optional(v.string()),
  })
    .index("stripeSessionId", ["stripeSessionId"])
    .index("stripeId", ["stripeId"])
    .index("by_user", ["userId"]),
});
