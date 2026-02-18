import { query, mutation } from './_generated/server';
import { v } from 'convex/values';
import { getUserFromAuth } from './lib/helpers';

export const checkBusinessDomainSync = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return { synced: false, error: "Business not found" };
    
    if (!business.domainId) {
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
    
    const domain = await ctx.db.get(business.domainId);
    if (!domain) {
      return { synced: false, error: "Domain not found" };
    }
    
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
    
    if (!domainId) {
      const domains = await ctx.db.query("domains").collect();
      const domain = domains.find(d =>
        d.name === business.name ||
        d.subdomain === business.name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      );
      
      if (!domain) {
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
    
    await ctx.db.patch(args.businessId, { domainId });
    
    const existingPage = await ctx.db
      .query("pages")
      .withIndex("by_domain", q => q.eq("domainId", domainId))
      .first();
      
    if (!existingPage) {
    }
    
    return { domainId, synced: true, success: true };
  }
});