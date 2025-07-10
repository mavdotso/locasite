import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserFromAuth } from "./lib/helpers";

// Query to check business-domain sync status
export const checkBusinessDomainSync = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return { synced: false, error: "Business not found" };

    if (!business.domainId) {
      return { synced: false, error: "Business has no domainId" };
    }

    const domain = await ctx.db.get(business.domainId);
    if (!domain) {
      return { synced: false, error: "Domain not found", domainId: business.domainId };
    }

    // Check if there are pages for this domain
    const pages = await ctx.db
      .query("pages")
      .withIndex("by_domain", q => q.eq("domainId", domain._id))
      .collect();

    return {
      synced: true,
      business: {
        id: business._id,
        name: business.name,
        domainId: business.domainId,
      },
      domain: {
        id: domain._id,
        subdomain: domain.subdomain,
        name: domain.name,
      },
      pageCount: pages.length,
    };
  },
});

// Mutation to fix business-domain sync issues
export const syncBusinessDomain = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    // Verify ownership
    if (business.userId !== user._id) {
      throw new Error("Not authorized to sync this business");
    }

    // If business already has a domainId, verify it exists
    if (business.domainId) {
      const domain = await ctx.db.get(business.domainId);
      if (domain) {
        return { success: true, message: "Business-domain sync is already correct" };
      }
      // Domain doesn't exist, we'll create a new one
    }

    // Check if a domain exists with the business name
    let domain = await ctx.db
      .query("domains")
      .filter(q => q.eq(q.field("name"), business.name))
      .first();

    if (!domain) {
      // Generate a new subdomain
      const subdomain = business.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 50);

      // Ensure unique subdomain
      let finalSubdomain = subdomain;
      let counter = 1;
      while (await ctx.db
        .query("domains")
        .withIndex("by_subdomain", q => q.eq("subdomain", finalSubdomain))
        .first()) {
        finalSubdomain = `${subdomain}-${counter}`;
        counter++;
      }

      // Create new domain
      const domainId = await ctx.db.insert("domains", {
        name: business.name,
        subdomain: finalSubdomain,
        createdAt: Date.now(),
      });

      domain = await ctx.db.get(domainId);
    }

    if (!domain) {
      throw new Error("Failed to create or find domain");
    }

    // Update business with domainId
    await ctx.db.patch(business._id, {
      domainId: domain._id,
    });

    return {
      success: true,
      message: "Business-domain sync completed",
      domain: {
        id: domain._id,
        subdomain: domain.subdomain,
      },
    };
  },
});