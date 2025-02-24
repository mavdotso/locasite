import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tenants: defineTable({
        name: v.string(),
        subdomain: v.string(),
        createdAt: v.number()
    }).index("by_subdomain", ["subdomain"]),

    pages: defineTable({
        tenantId: v.id("tenants"),
        slug: v.string(),
        content: v.string()
    }).index("by_tenant_slug", ["tenantId", "slug"])
});