import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";
import { convexEnv } from "./lib/env";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_REFERRALS_PER_WINDOW = 3;

// Check recent referrals for rate limiting
export const getRecentReferrals = internalQuery({
  args: {
    businessId: v.id("businesses"),
    since: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("ownerReferrals")
      .withIndex("by_business_sentAt", (q) =>
        q.eq("businessId", args.businessId).gte("sentAt", args.since),
      )
      .collect();
  },
});

// Record a referral
export const recordReferral = internalMutation({
  args: {
    businessId: v.id("businesses"),
    ownerEmail: v.string(),
    referrerSource: v.union(
      v.literal("category"),
      v.literal("business_page"),
    ),
    referrerPath: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ownerReferrals", {
      ...args,
      sentAt: Date.now(),
    });
  },
});

// Internal query: get business details for email template
export const getBusinessForEmail = internalQuery({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;

    let subdomain: string | null = null;
    if (business.domainId) {
      const domain = await ctx.db.get(business.domainId);
      subdomain = domain?.subdomain ?? null;
    }

    return {
      _id: business._id,
      name: business.name,
      subdomain,
      claimToken: business.claimToken ?? null,
    };
  },
});

// Public action: send owner referral email
export const sendOwnerReferral = action({
  args: {
    businessId: v.id("businesses"),
    ownerEmail: v.string(),
    referrerSource: v.union(
      v.literal("category"),
      v.literal("business_page"),
    ),
    referrerPath: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate email
    if (!EMAIL_REGEX.test(args.ownerEmail)) {
      return { success: false, error: "Invalid email address" };
    }

    // Rate limit via query (not @convex-dev/rate-limiter — actions can't use components)
    const since = Date.now() - RATE_LIMIT_WINDOW_MS;
    const recent = await ctx.runQuery(
      internal.ownerReferrals.getRecentReferrals,
      { businessId: args.businessId, since },
    );

    if (recent.length >= MAX_REFERRALS_PER_WINDOW) {
      return { success: true }; // Silent — don't reveal rate limit
    }

    // Silent dedup: skip if this email was already referred for this business
    if (
      recent.some(
        (r: { ownerEmail: string }) => r.ownerEmail === args.ownerEmail,
      )
    ) {
      return { success: true };
    }

    // Get business details for email
    const business = await ctx.runQuery(
      internal.ownerReferrals.getBusinessForEmail,
      { businessId: args.businessId },
    );
    if (!business) {
      return { success: false, error: "Business not found" };
    }

    // Send email via Resend (use process.env directly for graceful degradation)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // No API key — record referral but skip email (MAV-831 dependency)
      await ctx.runMutation(internal.ownerReferrals.recordReferral, {
        businessId: args.businessId,
        ownerEmail: args.ownerEmail,
        referrerSource: args.referrerSource,
        referrerPath: args.referrerPath,
      });
      return { success: true };
    }

    const rootDomain = convexEnv.NEXT_PUBLIC_ROOT_DOMAIN;
    const appUrl = convexEnv.NEXT_PUBLIC_APP_URL;
    const siteUrl = business.subdomain
      ? `${appUrl}/${business.subdomain}`
      : appUrl;
    const claimUrl = business.claimToken
      ? `${appUrl}/claim/token/${business.claimToken}`
      : business.subdomain
        ? `${appUrl}/${business.subdomain}/claim/${business._id}`
        : `${appUrl}/claim/${business._id}`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Locosite <${convexEnv.SENDER_EMAIL}>`,
        to: [args.ownerEmail],
        subject: `Someone shared your ${business.name} website with you`,
        html: buildReferralEmailHtml({
          businessName: business.name,
          siteUrl,
          claimUrl,
        }),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Referral email failed for ${business.name} (${args.ownerEmail}): ${errorText}`,
      );
    }

    // Record referral regardless of email success
    await ctx.runMutation(internal.ownerReferrals.recordReferral, {
      businessId: args.businessId,
      ownerEmail: args.ownerEmail,
      referrerSource: args.referrerSource,
      referrerPath: args.referrerPath,
    });

    return { success: true };
  },
});

function buildReferralEmailHtml({
  businessName,
  siteUrl,
  claimUrl,
}: {
  businessName: string;
  siteUrl: string;
  claimUrl: string;
}) {
  return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px;">
  <h2 style="font-size: 22px; margin-bottom: 16px;">Good news for ${businessName}!</h2>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">Someone who knows your business thought you should see this &mdash; we built a free professional website for <strong>${businessName}</strong>, and it's already live.</p>
  <p style="margin: 24px 0;"><a href="${siteUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">See Your Website</a></p>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">Your site includes your business info, hours, reviews, and photos from Google &mdash; all set up and ready to go.</p>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">Want to make it yours? <a href="${claimUrl}" style="color: #2563eb; text-decoration: underline; font-weight: 600;">Claim your website</a> to customize content, update photos, and go live on your own terms.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
  <p style="font-size: 13px; color: #9ca3af;">This email was sent because someone shared your <a href="${siteUrl}" style="color: #6b7280;">Locosite page</a> with you. If this isn't your business, you can safely ignore this email.</p>
</div>`;
}
