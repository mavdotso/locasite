import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { convexEnv } from "./lib/env";

// Get a page of published businesses with email addresses that haven't been notified
export const getBusinessesForNotification = internalQuery({
  args: {
    cursor: v.optional(v.string()),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const pageSize = args.pageSize ?? 100;
    const result = await ctx.db
      .query("businesses")
      .withIndex("by_isPublished", (q) => q.eq("isPublished", true))
      .paginate({
        numItems: pageSize,
        cursor: args.cursor ?? null,
      });

    const eligible: {
      _id: Id<"businesses">;
      name: string;
      email: string;
      subdomain: string | null;
      claimToken: string | null;
    }[] = [];

    for (const biz of result.page) {
      // Must have email, not yet notified, and not yet claimed by a user
      if (!biz.email || biz.notificationEmailSentAt || biz.userId) continue;

      let subdomain: string | null = null;
      if (biz.domainId) {
        const domain = await ctx.db.get(biz.domainId);
        subdomain = domain?.subdomain ?? null;
      }

      eligible.push({
        _id: biz._id,
        name: biz.name,
        email: biz.email,
        subdomain,
        claimToken: biz.claimToken ?? null,
      });
    }

    return {
      businesses: eligible,
      cursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

// Mark a business as having been sent a notification email
export const markNotificationSent = internalMutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.businessId, {
      notificationEmailSentAt: Date.now(),
    });
  },
});

// Send a single notification email to a business owner
export const sendNotificationEmail = internalAction({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    subdomain: v.optional(v.string()),
    claimToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const rootDomain =
      process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";
    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || `https://${rootDomain}`;

    const siteUrl = args.subdomain
      ? `${appUrl}/${args.subdomain}`
      : appUrl;
    const claimUrl = args.claimToken
      ? `${appUrl}/claim/token/${args.claimToken}`
      : null;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${convexEnv.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Locosite <${convexEnv.SENDER_EMAIL}>`,
        to: [args.email],
        subject: `We created a free website for ${args.name}`,
        html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px;">
  <h2 style="font-size: 22px; margin-bottom: 16px;">Hi there!</h2>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">We noticed <strong>${args.name}</strong> doesn't have a website yet, so we built one for you — completely free.</p>
  <p style="margin: 24px 0;"><a href="${siteUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">See Your Website</a></p>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">Your site is already live with your business info, hours, reviews, and photos from Google.</p>
  ${claimUrl ? `<p style="font-size: 16px; line-height: 1.6; color: #333;">Want to customize it? <a href="${claimUrl}" style="color: #2563eb; text-decoration: underline;">Claim your website</a> to edit content, change colors, and make it yours.</p>` : ""}
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
  <p style="font-size: 13px; color: #9ca3af;">This email was sent by <a href="https://${rootDomain}" style="color: #6b7280;">Locosite</a>. If this isn't your business, you can ignore this email.</p>
</div>`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Notification email failed for ${args.name} (${args.email}): ${errorText}`,
      );
      return { success: false, error: errorText };
    }

    // Mark as sent
    await ctx.runMutation(
      internal.notificationEmails.markNotificationSent,
      { businessId: args.businessId },
    );

    return { success: true };
  },
});

// Bulk send notification emails — processes one page at a time with staggered scheduling
export const bulkSendNotificationEmails = internalAction({
  args: {
    cursor: v.optional(v.string()),
    delayMs: v.optional(v.number()),
    maxEmails: v.optional(v.number()),
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const delayMs = args.delayMs ?? 1000; // 1s between emails (Resend free tier: 100/day)
    const maxEmails = args.maxEmails ?? 50;
    const dryRun = args.dryRun ?? false;

    const page = (await ctx.runQuery(
      internal.notificationEmails.getBusinessesForNotification,
      { cursor: args.cursor, pageSize: maxEmails },
    )) as {
      businesses: {
        _id: Id<"businesses">;
        name: string;
        email: string;
        subdomain: string | null;
        claimToken: string | null;
      }[];
      cursor: string;
      isDone: boolean;
    };

    let sent = 0;
    const failed = 0;
    const errors: string[] = [];

    for (const biz of page.businesses) {
      if (dryRun) {
        console.log(`[DRY RUN] Would email ${biz.email} for ${biz.name}`);
        sent++;
        continue;
      }

      // Schedule each email with staggered delay
      await ctx.scheduler.runAfter(
        sent * delayMs,
        internal.notificationEmails.sendNotificationEmail,
        {
          businessId: biz._id,
          name: biz.name,
          email: biz.email,
          subdomain: biz.subdomain ?? undefined,
          claimToken: biz.claimToken ?? undefined,
        },
      );
      sent++;
    }

    // If there are more pages and we haven't hit the limit, schedule next batch
    if (!page.isDone && sent >= maxEmails) {
      // Schedule next batch after current batch finishes
      await ctx.scheduler.runAfter(
        (sent + 1) * delayMs,
        internal.notificationEmails.bulkSendNotificationEmails,
        {
          cursor: page.cursor,
          delayMs,
          maxEmails,
          dryRun,
        },
      );
    }

    return {
      sent,
      failed,
      errors,
      hasMore: !page.isDone,
      nextCursor: page.isDone ? null : page.cursor,
    };
  },
});
