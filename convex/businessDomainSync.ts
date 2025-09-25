import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getUserFromAuth } from './lib/helpers';

// Check if business and domain are properly synced
export const checkBusinessDomainSync = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return { synced: false, error: "Business not found" };
    
    // Check if business has a domain
    if (!business.domainId) {
      // Try to find a domain that should belong to this business
      const domains = await ctx.db.query("domains").collect();
      const possibleDomain = domains.find(d => 
        d.name === business.name || 
        d.subdomain === business.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      );
      
      return {
        synced: false,
        error: "Business has no domain linked",
        possibleDomainId: possibleDomain?._id
      };
    }
    
    // Check if the domain exists
    const domain = await ctx.db.get(business.domainId);
    if (!domain) {
      return { synced: false, error: "Domain not found" };
    }
    
    // Check if there's a page for this domain
    const page = await ctx.db
      .query("pages")
      .withIndex("by_domain", q => q.eq("domainId", domain._id))
      .first();
      
    return {
      synced: true,
      domain,
      hasPage: !!page
    };
  }
});

// Fix business-domain sync issues
export const syncBusinessDomain = mutation({
  args: { 
    businessId: v.id("businesses"),
    domainId: v.optional(v.id("domains"))
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    
    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }
    
    if (business.userId !== user._id) {
      throw new Error("Not authorized to modify this business");
    }
    
    let domainId = args.domainId;
    
    // If no domainId provided, try to find or create one
    if (!domainId) {
      // Look for existing domain
      const domains = await ctx.db.query("domains").collect();
      const domain = domains.find(d =>
        d.name === business.name ||
        d.subdomain === business.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      );
      
      if (!domain) {
        // Create a new domain
        const subdomain = business.name
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 63);
          
        domainId = await ctx.db.insert("domains", {
          name: business.name,
          subdomain,
          createdAt: Date.now()
        });
      } else {
        domainId = domain._id;
      }
    }
    
    // Update business with domainId
    await ctx.db.patch(args.businessId, { domainId });
    
    // Ensure there's a page for this domain
    const existingPage = await ctx.db
      .query("pages")
      .withIndex("by_domain", q => q.eq("domainId", domainId))
      .first();
      
    if (!existingPage) {
      // Don't create a page here - let the normal flow handle it
    }
    
    return { domainId, synced: true, success: true };
  }
});