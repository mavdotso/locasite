# Refer to Owner Feature — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a "Know the owner? Send them their free website" CTA to business pages and category pages so consumers can notify business owners via email.

**Architecture:** New `ownerReferrals` Convex table tracks referrals. A public action `sendOwnerReferral` validates email, rate-limits (3/business/24h), deduplicates, records the referral, and sends a warm notification email via Resend. A `ReferToOwnerCTA` client component provides inline email input on business pages and a compact share button on category page cards.

**Tech Stack:** Convex (schema, action, mutation, query), Resend API, Next.js App Router, React client components, Tailwind CSS, shadcn/ui Button/Input

---

### Task 1: Schema — Add `ownerReferrals` table

**Files:**
- Modify: `convex/schema.ts:562` (before closing `});`)

**Step 1: Add table definition**

Add after `siteCreationJobs` table (before the closing `});`):

```typescript
// Owner referrals — consumer-initiated notifications to business owners
ownerReferrals: defineTable({
  businessId: v.id("businesses"),
  ownerEmail: v.string(),
  referrerSource: v.union(v.literal("category"), v.literal("business_page")),
  referrerPath: v.string(),
  sentAt: v.number(),
})
  .index("by_business_sentAt", ["businessId", "sentAt"])
  .index("by_ownerEmail", ["ownerEmail"]),
```

**Step 2: Verify schema compiles**

Run: `cd /Users/maver1ck/Developer/zero-human/locosite && npx convex dev --once --typecheck disable`
Expected: Schema push succeeds, new table created.

---

### Task 2: Backend — `convex/ownerReferrals.ts`

**Files:**
- Create: `convex/ownerReferrals.ts`

**Step 1: Write the Convex functions**

```typescript
import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

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
        q.eq("businessId", args.businessId).gte("sentAt", args.since)
      )
      .collect();
  },
});

// Record a referral
export const recordReferral = internalMutation({
  args: {
    businessId: v.id("businesses"),
    ownerEmail: v.string(),
    referrerSource: v.union(v.literal("category"), v.literal("business_page")),
    referrerPath: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("ownerReferrals", {
      ...args,
      sentAt: Date.now(),
    });
  },
});

// Public action: send owner referral email
export const sendOwnerReferral = action({
  args: {
    businessId: v.id("businesses"),
    ownerEmail: v.string(),
    referrerSource: v.union(v.literal("category"), v.literal("business_page")),
    referrerPath: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate email
    if (!EMAIL_REGEX.test(args.ownerEmail)) {
      return { success: false, error: "Invalid email address" };
    }

    // Rate limit: max 3 referrals per business per 24h
    const since = Date.now() - RATE_LIMIT_WINDOW_MS;
    const recent = await ctx.runQuery(
      internal.ownerReferrals.getRecentReferrals,
      { businessId: args.businessId, since }
    );

    if (recent.length >= MAX_REFERRALS_PER_WINDOW) {
      return { success: true }; // Silent — don't reveal rate limit to user
    }

    // Silent dedup: skip if this email was already referred for this business recently
    if (recent.some((r: { ownerEmail: string }) => r.ownerEmail === args.ownerEmail)) {
      return { success: true }; // Silent dedup
    }

    // Get business details for email
    const business = await ctx.runQuery(internal.ownerReferrals.getBusinessForEmail, {
      businessId: args.businessId,
    });
    if (!business) {
      return { success: false, error: "Business not found" };
    }

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // Graceful degradation — record referral but skip email
      await ctx.runMutation(internal.ownerReferrals.recordReferral, {
        businessId: args.businessId,
        ownerEmail: args.ownerEmail,
        referrerSource: args.referrerSource,
        referrerPath: args.referrerPath,
      });
      return { success: true };
    }

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${rootDomain}`;
    const siteUrl = business.subdomain
      ? `${appUrl}/${business.subdomain}`
      : appUrl;
    const claimUrl = business.claimToken
      ? `${appUrl}/claim/token/${business.claimToken}`
      : `${appUrl}/${business.subdomain}/claim/${business._id}`;

    const senderEmail = process.env.SENDER_EMAIL || "noreply@locosite.io";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Locosite <${senderEmail}>`,
        to: [args.ownerEmail],
        subject: `Someone shared your ${business.name} website with you`,
        html: `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 16px;">
  <h2 style="font-size: 22px; margin-bottom: 16px;">Good news for ${business.name}!</h2>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">Someone who knows your business thought you should see this — we built a free professional website for <strong>${business.name}</strong>, and it's already live.</p>
  <p style="margin: 24px 0;"><a href="${siteUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">See Your Website</a></p>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">Your site includes your business info, hours, reviews, and photos from Google — all set up and ready to go.</p>
  <p style="font-size: 16px; line-height: 1.6; color: #333;">Want to make it yours? <a href="${claimUrl}" style="color: #2563eb; text-decoration: underline; font-weight: 600;">Claim your website</a> to customize content, update photos, and go live on your own terms.</p>
  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
  <p style="font-size: 13px; color: #9ca3af;">This email was sent because someone shared your <a href="${siteUrl}" style="color: #6b7280;">Locosite page</a> with you. If this isn't your business, you can safely ignore this email.</p>
</div>`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Referral email failed for ${business.name} (${args.ownerEmail}): ${errorText}`);
      // Still record the referral attempt
    }

    // Record referral
    await ctx.runMutation(internal.ownerReferrals.recordReferral, {
      businessId: args.businessId,
      ownerEmail: args.ownerEmail,
      referrerSource: args.referrerSource,
      referrerPath: args.referrerPath,
    });

    return { success: true };
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
```

**Step 2: Verify it compiles and deploys**

Run: `cd /Users/maver1ck/Developer/zero-human/locosite && npx convex dev --once --typecheck disable`
Expected: Functions deployed, no errors.

---

### Task 3: Frontend — `ReferToOwnerCTA` component

**Files:**
- Create: `app/components/refer-to-owner-cta.tsx`

**Step 1: Build the client component**

```tsx
"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Send, Check, Loader2 } from "lucide-react";

interface ReferToOwnerCTAProps {
  businessId: Id<"businesses">;
  businessName: string;
  referrerSource: "category" | "business_page";
  referrerPath: string;
  compact?: boolean; // compact mode for category page cards
}

export function ReferToOwnerCTA({
  businessId,
  businessName,
  referrerSource,
  referrerPath,
  compact = false,
}: ReferToOwnerCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showInput, setShowInput] = useState(false);
  const sendReferral = useAction(api.ownerReferrals.sendOwnerReferral);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("sending");
    try {
      await sendReferral({
        businessId,
        ownerEmail: trimmed,
        referrerSource,
        referrerPath,
      });
      setStatus("sent");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  // Compact mode: icon button that expands into input
  if (compact) {
    if (status === "sent") {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-green-600">
          <Check className="h-3.5 w-3.5" /> Sent
        </span>
      );
    }

    if (!showInput) {
      return (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowInput(true); }}
          className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
          title={`Know the owner of ${businessName}? Send them their website`}
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Share with owner</span>
        </button>
      );
    }

    return (
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Owner's email"
          className="w-36 px-2 py-1 text-xs border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
          required
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "sending" ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send"}
        </button>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowInput(false); }}
          className="text-xs text-neutral-400 hover:text-neutral-600"
        >
          x
        </button>
      </form>
    );
  }

  // Full mode: inline section for business page
  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-700">
          <Check className="h-5 w-5" />
          <p className="font-medium">Email sent! The owner will receive their website link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm font-medium text-blue-900 mb-2">
        Know the owner of {businessName}? Send them their free website.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Owner's email address"
          className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
        >
          {status === "sending" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send
        </button>
      </form>
      {status === "error" && (
        <p className="text-xs text-red-600 mt-1">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
```

---

### Task 4: Place CTA on business page

**Files:**
- Modify: `app/(pages)/[domain]/page.tsx:304-324`

**Step 1: Add import and ReferToOwnerCTA below the claim banner**

After the existing claim banner block (line 304-324), add the referral CTA for unclaimed businesses. The component needs to be wrapped in a Convex provider since the page is a server component.

Create a thin client wrapper: `app/components/refer-to-owner-wrapper.tsx`

```tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReferToOwnerCTA } from "./refer-to-owner-cta";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ReferToOwnerSection({
  businessId,
  businessName,
  referrerPath,
}: {
  businessId: Id<"businesses">;
  businessName: string;
  referrerPath: string;
}) {
  return (
    <ConvexProvider client={convex}>
      <div className="container mx-auto px-4 py-3">
        <ReferToOwnerCTA
          businessId={businessId}
          businessName={businessName}
          referrerSource="business_page"
          referrerPath={referrerPath}
        />
      </div>
    </ConvexProvider>
  );
}
```

Then in `[domain]/page.tsx`, add after the claim banner (line 324):

```tsx
import { ReferToOwnerSection } from "@/app/components/refer-to-owner-wrapper";

// After the existing claim banner closing </div> (line 324):
{!businessData.userId && (
  <ReferToOwnerSection
    businessId={businessData._id}
    businessName={businessData.name}
    referrerPath={`/${businessDomain}`}
  />
)}
```

---

### Task 5: Place share button on category page cards

**Files:**
- Modify: `app/(pages)/[domain]/[category]/page.tsx:256-331`

**Step 1: Make category page a client boundary for the share button**

Since the category page is a server component and `BusinessCard` needs interactive share functionality, we wrap just the share button. Create a lightweight category-specific wrapper.

Add to `app/(pages)/[domain]/[category]/page.tsx`:

1. Import at top:
```tsx
import { ReferToOwnerCategoryCard } from "@/app/components/refer-to-owner-category";
```

2. Add share button slot to BusinessCard — after the address div (line 317), before closing `</div>` of `.p-4`:
```tsx
{business.referralSlot}
```

3. When mapping businesses (line 211-217), pass the referral component:
```tsx
businessesWithLinks.map((business) => (
  <BusinessCard
    key={business._id}
    business={{
      ...business,
      referralSlot: (
        <ReferToOwnerCategoryCard
          businessId={business._id}
          businessName={business.name}
          referrerPath={`/${citySlug}/${categorySlug}`}
        />
      ),
    }}
    rootDomain={rootDomain}
  />
))
```

Create `app/components/refer-to-owner-category.tsx`:
```tsx
"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReferToOwnerCTA } from "./refer-to-owner-cta";
import { Id } from "@/convex/_generated/dataModel";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ReferToOwnerCategoryCard({
  businessId,
  businessName,
  referrerPath,
}: {
  businessId: string;
  businessName: string;
  referrerPath: string;
}) {
  return (
    <ConvexProvider client={convex}>
      <ReferToOwnerCTA
        businessId={businessId as Id<"businesses">}
        businessName={businessName}
        referrerSource="category"
        referrerPath={referrerPath}
        compact
      />
    </ConvexProvider>
  );
}
```

---

### Task 6: Deploy and verify

**Step 1: Push Convex schema and functions**
Run: `cd /Users/maver1ck/Developer/zero-human/locosite && npx convex dev --once`
Expected: All functions deployed, `ownerReferrals` table created.

**Step 2: Build Next.js to check for compilation errors**
Run: `cd /Users/maver1ck/Developer/zero-human/locosite && npx next build`
Expected: Build succeeds.

---

### Task 7: Commit and PR

**Step 1: Commit**
```bash
git add convex/schema.ts convex/ownerReferrals.ts app/components/refer-to-owner-cta.tsx app/components/refer-to-owner-wrapper.tsx app/components/refer-to-owner-category.tsx app/(pages)/[domain]/page.tsx app/(pages)/[domain]/[category]/page.tsx
git commit -m "feat: refer to owner — consumer-driven email notifications"
```

**Step 2: Push and create PR**
```bash
git push -u origin feat/refer-to-owner
gh pr create --title "feat: refer to owner notifications" --body "..."
```
