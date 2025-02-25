import { defineSchema, defineTable } from "convex/server";
import { v, Validator } from "convex/values";

export const userSchema = {
    email: v.string(),
    name: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
    image: v.optional(v.string()),
};

export const sessionSchema = {
    userId: v.id("users"),
    expires: v.number(),
    sessionToken: v.string(),
};

export const accountSchema = {
    userId: v.id("users"),
    type: v.union(
        v.literal("email"),
        v.literal("oidc"),
        v.literal("oauth"),
        v.literal("webauthn"),
    ),
    provider: v.string(),
    providerAccountId: v.string(),
    refresh_token: v.optional(v.string()),
    access_token: v.optional(v.string()),
    expires_at: v.optional(v.number()),
    token_type: v.optional(v.string() as Validator<Lowercase<string>>),
    scope: v.optional(v.string()),
    id_token: v.optional(v.string()),
    session_state: v.optional(v.string()),
};

export const verificationTokenSchema = {
    identifier: v.string(),
    token: v.string(),
    expires: v.number(),
};

export const authenticatorSchema = {
    credentialID: v.string(),
    userId: v.id("users"),
    providerAccountId: v.string(),
    credentialPublicKey: v.string(),
    counter: v.number(),
    credentialDeviceType: v.string(),
    credentialBackedUp: v.boolean(),
    transports: v.optional(v.string()),
};

const authTables = {
    users: defineTable(userSchema).index("email", ["email"]),
    sessions: defineTable(sessionSchema)
        .index("sessionToken", ["sessionToken"])
        .index("userId", ["userId"]),
    accounts: defineTable(accountSchema)
        .index("providerAndAccountId", ["provider", "providerAccountId"])
        .index("userId", ["userId"]),
    verificationTokens: defineTable(verificationTokenSchema).index(
        "identifierToken",
        ["identifier", "token"],
    ),
    authenticators: defineTable(authenticatorSchema)
        .index("userId", ["userId"])
        .index("credentialID", ["credentialID"]),
};

export const reviewSchema = {
    reviewer: v.string(),
    rating: v.string(),
    text: v.string()
};


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
        content: v.string()
    }).index("by_domain_slug", ["domainId", "slug"]),

    businesses: defineTable({
        name: v.string(),
        placeId: v.string(),
        address: v.string(),
        phone: v.optional(v.string()),
        website: v.optional(v.string()),
        hours: v.array(v.string()),
        rating: v.optional(v.number()),
        reviews: v.array(v.object(reviewSchema)),
        photos: v.array(v.string()),
        description: v.optional(v.string()),
        createdAt: v.number(),
        userId: v.optional(v.id("users")),
        domainId: v.optional(v.id("domains"))
    })
        .index("by_placeId", ["placeId"])
        .index("by_userId", ["userId"])
        .index("by_domainId", ["domainId"])
        .index("by_createdAt", ["createdAt"])
});
