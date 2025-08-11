import { v } from "convex/values";
import {
  mutation,
  query,
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { getUserFromAuth } from "./lib/helpers";
import { logger } from "./lib/logger";
import { convexEnv } from "./lib/env";

// Helper to validate domain format
function isValidDomain(domain: string): boolean {
  const domainRegex =
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
  return domainRegex.test(domain);
}

// Add a custom domain to a business
export const addCustomDomain = mutation({
  args: {
    businessId: v.id("businesses"),
    domain: v.string(),
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
      throw new Error("Not authorized to manage domains for this business");
    }

    // Check subscription plan
    const stripeCustomer = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!stripeCustomer) {
      throw new Error(
        "Custom domains are not available on the Free plan. Please upgrade to Professional or Business plan.",
      );
    }

    const subscription = await ctx.db
      .query("stripeSubscriptions")
      .withIndex("by_customerId", (q) =>
        q.eq("customerId", stripeCustomer.stripeCustomerId),
      )
      .first();

    if (!subscription || subscription.planType === "FREE") {
      throw new Error(
        "Custom domains are not available on the Free plan. Please upgrade to Professional or Business plan.",
      );
    }

    // Check domain limits based on plan
    if (subscription.planType === "PROFESSIONAL") {
      // Professional plan: 1 custom domain per user
      const userBusinesses = await ctx.db
        .query("businesses")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();

      let customDomainCount = 0;
      for (const userBusiness of userBusinesses) {
        if (userBusiness.domainId) {
          const domain = await ctx.db.get(userBusiness.domainId);
          if (domain?.customDomain) {
            customDomainCount++;
          }
        }
      }

      if (customDomainCount >= 1) {
        throw new Error(
          "Professional plan allows only 1 custom domain. Please upgrade to Business plan for unlimited domains.",
        );
      }
    }

    // Check domain limits based on plan
    if (subscription.planType === "PROFESSIONAL") {
      // Professional plan: 1 custom domain
      const existingDomains = await ctx.db
        .query("domains")
        .filter((q) =>
          q.and(
            q.neq(q.field("customDomain"), undefined),
            q.eq(q.field("_id"), business.domainId || ""),
          ),
        )
        .collect();

      if (existingDomains.length >= 1) {
        throw new Error(
          "Professional plan allows only 1 custom domain. Please upgrade to Business plan for unlimited domains.",
        );
      }
    }
    // Validate domain format
    const domain = args.domain.toLowerCase().trim();
    if (!isValidDomain(domain)) {
      throw new Error("Invalid domain format");
    }

    // Check if domain is already in use
    const existingDomain = await ctx.db
      .query("domains")
      .withIndex("by_custom_domain", (q) => q.eq("customDomain", domain))
      .first();

    if (existingDomain) {
      throw new Error("This domain is already in use");
    }

    // Get or create domain record
    let domainRecord = business.domainId
      ? await ctx.db.get(business.domainId)
      : null;

    if (!domainRecord) {
      // Create new domain record
      const token = generateVerificationToken();
      const domainId = await ctx.db.insert("domains", {
        name: business.name,
        subdomain: business.name.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        customDomain: domain,
        domainType: "custom",
        isVerified: false,
        verificationToken: token,
        verificationMethod: "dns",
        verificationAttempts: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Update business with domain ID
      await ctx.db.patch(args.businessId, { domainId });

      return {
        domainId,
        domain,
        verificationToken: token,
      };
    } else {
      // Update existing domain record
      const token = generateVerificationToken();
      await ctx.db.patch(domainRecord._id, {
        customDomain: domain,
        domainType: "custom",
        isVerified: false,
        verificationToken: token,
        verificationMethod: "dns",
        verificationAttempts: 0,
        verificationError: undefined,
        updatedAt: Date.now(),
      });

      return {
        domainId: domainRecord._id,
        domain,
        verificationToken: token,
      };
    }
  },
});

// Remove custom domain
export const removeCustomDomain = mutation({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("Not authorized to manage domains for this business");
    }

    if (!business.domainId) {
      throw new Error("No domain associated with this business");
    }

    const domain = await ctx.db.get(business.domainId);
    if (!domain) {
      throw new Error("Domain not found");
    }

    // Remove custom domain but keep subdomain
    await ctx.db.patch(domain._id, {
      customDomain: undefined,
      domainType: "subdomain",
      isVerified: undefined,
      verificationToken: undefined,
      verificationMethod: undefined,
      verificationAttempts: undefined,
      verificationError: undefined,
      sslStatus: undefined,
      sslProvider: undefined,
      dnsRecords: undefined,
      verifiedAt: undefined,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// Get domain verification status
export const getDomainVerificationStatus = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("Not authorized to view domain status");
    }

    if (!business.domainId) {
      return null;
    }

    const domain = await ctx.db.get(business.domainId);
    if (!domain || !domain.customDomain) {
      return null;
    }

    return {
      domainId: domain._id,
      domain: domain.customDomain,
      isVerified: domain.isVerified || false,
      verificationMethod: domain.verificationMethod || "dns",
      verificationToken: domain.verificationToken,
      verificationError: domain.verificationError,
      verificationAttempts: domain.verificationAttempts || 0,
      lastVerificationCheck: domain.lastVerificationCheck,
      sslStatus: domain.sslStatus,
      dnsRecords:
        domain.dnsRecords ||
        getRequiredDnsRecords(
          domain.customDomain,
          domain.verificationToken || "",
        ),
    };
  },
});

// Verify domain ownership (action that can make external calls)
export const verifyDomain = action({
  args: {
    domainId: v.id("domains"),
  },
  handler: async (ctx, args) => {
    const domain = await ctx.runQuery(
      internal.customDomains.internal_getDomainById,
      {
        domainId: args.domainId,
      },
    );

    if (!domain || !domain.customDomain) {
      throw new Error("Domain not found");
    }

    if (domain.isVerified) {
      return { verified: true, message: "Domain is already verified" };
    }

    // Increment verification attempts
    await ctx.runMutation(
      internal.customDomains.internal_updateVerificationAttempts,
      {
        domainId: args.domainId,
        attempts: (domain.verificationAttempts || 0) + 1,
      },
    );

    try {
      // Perform DNS lookup for verification
      const verified = await verifyDnsRecords(
        domain.customDomain,
        domain.verificationToken || "",
      );

      if (verified) {
        await ctx.runMutation(
          internal.customDomains.internal_markDomainVerified,
          {
            domainId: args.domainId,
          },
        );

        return { verified: true, message: "Domain verified successfully" };
      } else {
        await ctx.runMutation(
          internal.customDomains.internal_updateVerificationError,
          {
            domainId: args.domainId,
            error: "DNS records not found or incorrect",
          },
        );

        return {
          verified: false,
          message: "DNS records not found or incorrect",
        };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Verification failed";

      await ctx.runMutation(
        internal.customDomains.internal_updateVerificationError,
        {
          domainId: args.domainId,
          error: errorMessage,
        },
      );

      return { verified: false, message: errorMessage };
    }
  },
});

// Get domain by ID (public for API routes)
export const getDomainById = query({
  args: { domainId: v.id("domains") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.domainId);
  },
});

// Internal mutations for domain verification
export const internal_getDomainById = internalQuery({
  args: { domainId: v.id("domains") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.domainId);
  },
});

export const internal_updateVerificationAttempts = internalMutation({
  args: {
    domainId: v.id("domains"),
    attempts: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.domainId, {
      verificationAttempts: args.attempts,
      lastVerificationCheck: Date.now(),
    });
  },
});

export const internal_markDomainVerified = internalMutation({
  args: {
    domainId: v.id("domains"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.domainId, {
      isVerified: true,
      verifiedAt: Date.now(),
      verificationError: undefined,
      sslStatus: "pending", // Start SSL provisioning
    });
  },
});

export const internal_updateVerificationError = internalMutation({
  args: {
    domainId: v.id("domains"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.domainId, {
      verificationError: args.error,
      lastVerificationCheck: Date.now(),
    });
  },
});

export const internal_updateSslStatus = internalMutation({
  args: {
    domainId: v.id("domains"),
    sslStatus: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("failed"),
    ),
    sslProvider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.domainId, {
      sslStatus: args.sslStatus,
      sslProvider: args.sslProvider,
      updatedAt: Date.now(),
    });
  },
});

// Helper functions
function generateVerificationToken(): string {
  // Generate cryptographically secure token
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `locasite-verify-${hex}`;
}

function getRequiredDnsRecords(domain: string, verificationToken: string) {
  return [
    {
      type: "CNAME",
      name: domain,
      value: "cname.vercel-dns.com", // This will be updated based on hosting provider
      required: true,
    },
    {
      type: "TXT",
      name: `_locasite-verify.${domain}`,
      value: verificationToken,
      required: true,
    },
  ];
}

// Real DNS verification using DNS lookups
async function verifyDnsRecords(
  domain: string,
  verificationToken: string,
): Promise<boolean> {
  try {
    // We'll make HTTP calls to a DNS lookup service since Convex actions can't use Node.js dns module directly
    const dnsApiUrl = "https://dns.google/resolve";

    // Check TXT record for verification
    const txtRecordName = `_locasite-verify.${domain}`;
    const txtResponse = await fetch(
      `${dnsApiUrl}?name=${txtRecordName}&type=TXT`,
    );
    const txtData = await txtResponse.json();

    let txtVerified = false;
    if (txtData.Answer) {
      for (const record of txtData.Answer) {
        // TXT records are wrapped in quotes, so we need to remove them
        const value = record.data.replace(/"/g, "");
        if (value === verificationToken) {
          txtVerified = true;
          break;
        }
      }
    }

    if (!txtVerified) {
      logger.domainOperation('dns_verification', domain, false, { 
        reason: 'TXT record verification failed' 
      });
      return false;
    }

    // Check CNAME or A record pointing to our service
    const cnameResponse = await fetch(`${dnsApiUrl}?name=${domain}&type=CNAME`);
    const cnameData = await cnameResponse.json();

    let cnameVerified = false;
    const expectedCname = convexEnv.CUSTOM_DOMAIN_CNAME;

    if (cnameData.Answer) {
      for (const record of cnameData.Answer) {
        if (record.data.toLowerCase().includes(expectedCname.toLowerCase())) {
          cnameVerified = true;
          break;
        }
      }
    }

    // If no CNAME, check for A records (for apex domains)
    if (!cnameVerified) {
      const aResponse = await fetch(`${dnsApiUrl}?name=${domain}&type=A`);
      const aData = await aResponse.json();

      // Vercel's anycast IPs
      const vercelIPs = ["76.76.21.21", "76.223.126.88"];

      if (aData.Answer) {
        for (const record of aData.Answer) {
          if (vercelIPs.includes(record.data)) {
            cnameVerified = true;
            break;
          }
        }
      }
    }

    logger.domainOperation('dns_verification', domain, txtVerified && cnameVerified, {
      txtVerified,
      cnameVerified
    });
    return txtVerified && cnameVerified;
  } catch (error) {
    logger.domainOperation('dns_verification', domain, false, { error: String(error) });
    return false;
  }
}

// Update domain configuration from Vercel
export const updateDomainConfiguration = mutation({
  args: {
    businessId: v.id("businesses"),
    vercelDomainId: v.optional(v.string()),
    apexName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    const business = await ctx.db.get(args.businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    if (business.userId !== user._id) {
      throw new Error("Not authorized");
    }

    if (!business.domainId) {
      throw new Error("No domain associated with this business");
    }

    // Update domain with Vercel configuration
    await ctx.db.patch(business.domainId, {
      vercelDomainId: args.vercelDomainId,
      apexName: args.apexName,
      updatedAt: Date.now(),
    });
  },
});

// Update SSL status (public mutation for API route)
export const updateSslStatus = mutation({
  args: {
    domainId: v.id("domains"),
    sslStatus: v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("failed"),
    ),
    sslProvider: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // In production, you'd want to verify the caller is authorized
    // For now, we'll just update the status
    await ctx.db.patch(args.domainId, {
      sslStatus: args.sslStatus,
      sslProvider: args.sslProvider,
      updatedAt: Date.now(),
    });
  },
});

// Get all custom domains for a user
export const getUserCustomDomains = query({
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    // Get all businesses for the user
    const businesses = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Get domains for each business
    const domainsPromises = businesses.map(async (business) => {
      if (!business.domainId) return null;

      const domain = await ctx.db.get(business.domainId);
      if (!domain || !domain.customDomain) return null;

      return {
        businessId: business._id,
        businessName: business.name,
        domain: domain.customDomain,
        isVerified: domain.isVerified || false,
        sslStatus: domain.sslStatus,
        createdAt: domain.createdAt,
      };
    });

    const domains = await Promise.all(domainsPromises);
    return domains.filter((d) => d !== null);
  },
});
