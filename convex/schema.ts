import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    domains: defineTable({
        name: v.string(),
        subdomain: v.string(),
        createdAt: v.number()
    }).index("by_subdomain", ["subdomain"]),

    pages: defineTable({
        domainId: v.id("domains"),
        slug: v.string(),
        content: v.string(),
        // Draft content for unpublished changes
        draftContent: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
        lastEditedAt: v.optional(v.number())
    }).index("by_domain_slug", ["domainId", "slug"]),

    businesses: defineTable({
        name: v.string(),
        placeId: v.string(),
        address: v.string(),
        phone: v.optional(v.string()),
        email: v.optional(v.string()),
        website: v.optional(v.string()),
        hours: v.array(v.string()),
        rating: v.optional(v.number()),
        reviews: v.array(v.object({
            reviewer: v.string(),
            rating: v.string(),
            text: v.string()
        })),
        photos: v.array(v.string()),
        description: v.optional(v.string()),
        createdAt: v.number(),
        userId: v.optional(v.id("users")),
        domainId: v.optional(v.id("domains")),
        theme: v.optional(v.object({
            colorScheme: v.optional(v.string()),
            primaryColor: v.optional(v.string()),
            secondaryColor: v.optional(v.string()),
            accentColor: v.optional(v.string()),
            fontFamily: v.optional(v.string()),
            logoUrl: v.optional(v.string())
        })),
        // Publishing state
        isPublished: v.optional(v.boolean()),
        publishedAt: v.optional(v.number()),
        // Draft content - stores unsaved changes
        draftContent: v.optional(v.object({
            name: v.optional(v.string()),
            description: v.optional(v.string()),
            phone: v.optional(v.string()),
            email: v.optional(v.string()),
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
        })),
        lastEditedAt: v.optional(v.number())
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
            v.literal("rejected")
        ),
        verificationMethod: v.optional(v.union(
            v.literal("google"),
            v.literal("email"),
            v.literal("phone")
        )),
        googleVerificationStatus: v.optional(v.union(
            v.literal("pending"),
            v.literal("verified"),
            v.literal("failed")
        )),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
        notes: v.optional(v.string())
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
            v.literal("responded")
        ),
        createdAt: v.number(),
        updatedAt: v.optional(v.number())
    })
        .index("by_business", ["businessId"])
        .index("by_business_status", ["businessId", "status"])
        .index("by_createdAt", ["createdAt"])
});
