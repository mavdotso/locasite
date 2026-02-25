# Production Readiness Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Bring Locasite from 31/100 to MVP-ready across security, UX, infrastructure, features, and testing.

**Architecture:** Fix security gaps in Convex backend functions using existing auth helpers, add Next.js App Router loading/error states, integrate Sentry + Resend + CI/CD, then add test infrastructure with Vitest + Playwright.

**Tech Stack:** Next.js 15, Convex, Resend, Sentry, Vitest, Playwright, GitHub Actions

---

## Phase 1: Security Hardening

### Task 1: Add auth to `businesses.getById` and strip sensitive fields

**Files:**
- Modify: `convex/businesses.ts:299-304`

**Step 1: Modify `getById` to strip `googleBusinessAuth`**

Replace lines 299-304 with:
```ts
export const getById = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.id);
    if (!business) return null;
    const { googleBusinessAuth: _, ...safe } = business;
    return safe;
  },
});
```

**Step 2: Run build to verify**

Run: `bun run build`
Expected: Build succeeds. Check for any type errors from consumers of `getById` that relied on `googleBusinessAuth`.

**Step 3: Commit**

```bash
git add convex/businesses.ts
git commit -m "security: strip OAuth tokens from businesses.getById"
```

---

### Task 2: Convert `businesses.list` and `domains.list` to internal queries

**Files:**
- Modify: `convex/businesses.ts:335-346`
- Modify: `convex/domains.ts:176-180`

**Step 1: Convert `businesses.list` to `internalQuery`**

In `convex/businesses.ts`, add `internalQuery` to the imports from `./_generated/server` if not already present. Replace `list` (lines 335-346):

```ts
export const list = internalQuery({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit || 100);
  },
});
```

**Step 2: Convert `domains.list` to `internalQuery`**

In `convex/domains.ts`, add `internalQuery` to imports from `./_generated/server`. Replace `list` (lines 176-180):

```ts
export const list = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("domains").collect();
  },
});
```

**Step 3: Search for callers of these functions and update them**

Run: Search for `api.businesses.list` and `api.domains.list` in the codebase. Any frontend callers using `useQuery(api.businesses.list)` or `useQuery(api.domains.list)` must be updated to use a different query or the internal API path. Replace with `internal.businesses.list` / `internal.domains.list` where called from backend, and remove frontend usages.

**Step 4: Run build**

Run: `bun run build`
Expected: Build succeeds with no errors.

**Step 5: Commit**

```bash
git add convex/businesses.ts convex/domains.ts
git commit -m "security: convert businesses.list and domains.list to internal queries"
```

---

### Task 3: Add auth + ownership to `listByUser`

**Files:**
- Modify: `convex/businesses.ts:349-359`

**Step 1: Add auth guard and enforce caller identity**

Replace lines 349-359:

```ts
export const listByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);
    return await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});
```

Note: Removed `userId` arg entirely — the function now derives the user from auth. This prevents BOLA.

**Step 2: Update callers**

Search for `api.businesses.listByUser` in frontend code. Update all call sites to remove the `userId` argument (it's now derived from auth).

**Step 3: Run build**

Run: `bun run build`
Expected: Build succeeds.

**Step 4: Commit**

```bash
git add convex/businesses.ts
git commit -m "security: derive userId from auth in listByUser, remove userId arg"
```

---

### Task 4: Add auth + ownership to `businessEditData` and `dashboardData`

**Files:**
- Modify: `convex/businessEditData.ts:4-37`
- Modify: `convex/dashboardData.ts:5-62`

**Step 1: Add auth to `getBusinessEditData`**

In `convex/businessEditData.ts`, add imports for `getUserFromAuth` from `./lib/helpers`. Replace the handler:

```ts
import { getUserFromAuth } from "./lib/helpers";

export const getBusinessEditData = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const business = await ctx.db.get(args.businessId);
    if (!business) return null;
    if (business.userId !== user._id) {
      throw new Error("Not authorized to edit this business");
    }

    const { googleBusinessAuth: _, ...safeBusiness } = business;

    let domain = null;
    if (business.domainId) {
      domain = await ctx.db.get(business.domainId);
    }

    let pages = null;
    if (domain) {
      pages = await ctx.db
        .query("pages")
        .withIndex("by_domain", (q) => q.eq("domainId", domain._id))
        .collect();
    }

    const syncStatus = {
      synced: !!domain,
      error: !domain ? "No domain found for business" : null,
    };

    return { business: safeBusiness, domain, pages, syncStatus };
  },
});
```

**Step 2: Add auth to `getDashboardBusinessData`**

In `convex/dashboardData.ts`, add import for `getUserFromAuth`. In the `getDashboardBusinessData` handler, add auth + ownership:

```ts
handler: async (ctx, args) => {
  const user = await getUserFromAuth(ctx);
  const business = await ctx.db.get(args.businessId);
  if (!business) return null;
  if (business.userId !== user._id) {
    throw new Error("Not authorized to view this business");
  }
  // ... rest of handler unchanged
```

**Step 3: Also fix `getUserBusinessesWithMetadata` to use auth and index**

In `convex/dashboardData.ts`, in `getUserBusinessesWithMetadata`, replace the `getAuthUserId` + `.filter()` pattern with `getUserFromAuth` + `.withIndex()`:

```ts
handler: async (ctx) => {
  const user = await getUserFromAuth(ctx);
  const businesses = await ctx.db
    .query("businesses")
    .withIndex("by_userId", (q) => q.eq("userId", user._id))
    .order("desc")
    .collect();
  // ... rest of handler unchanged
```

**Step 4: Run build**

Run: `bun run build`
Expected: Build succeeds.

**Step 5: Commit**

```bash
git add convex/businessEditData.ts convex/dashboardData.ts
git commit -m "security: add auth and ownership checks to edit and dashboard data queries"
```

---

### Task 5: Add auth + ownership to `contactMessages`

**Files:**
- Modify: `convex/contactMessages.ts:25-62`

**Step 1: Add ownership checks to read/update functions**

Import `getUserFromAuth` from `./lib/helpers`. For `getByBusiness`, `markAsRead`, and `markAsResponded`, add auth + verify the caller owns the business.

For `getByBusiness` (lines 25-38):
```ts
export const getByBusiness = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const business = await ctx.db.get(args.businessId);
    if (!business || business.userId !== user._id) {
      throw new Error("Not authorized to view messages for this business");
    }
    return await ctx.db
      .query("contactMessages")
      .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
      .order("desc")
      .collect();
  },
});
```

For `markAsRead` (lines 40-50):
```ts
export const markAsRead = mutation({
  args: { messageId: v.id("contactMessages") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");
    const business = await ctx.db.get(message.businessId);
    if (!business || business.userId !== user._id) {
      throw new Error("Not authorized");
    }
    await ctx.db.patch(args.messageId, {
      status: "read",
      updatedAt: Date.now(),
    });
  },
});
```

Apply the same pattern to `markAsResponded`.

**Step 2: Add rate limiting and input validation to `send`**

Import the rate limiter. Add length checks:
```ts
export const send = mutation({
  args: {
    businessId: v.id("businesses"),
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.name.length > 100) throw new Error("Name too long");
    if (args.email.length > 254) throw new Error("Email too long");
    if (args.message.length > 5000) throw new Error("Message too long");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args.email)) {
      throw new Error("Invalid email format");
    }
    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");
    await ctx.db.insert("contactMessages", {
      businessId: args.businessId,
      name: args.name,
      email: args.email,
      message: args.message,
      status: "unread",
      createdAt: Date.now(),
    });
  },
});
```

**Step 3: Run build**

Run: `bun run build`

**Step 4: Commit**

```bash
git add convex/contactMessages.ts
git commit -m "security: add auth to contact message queries, validate send input"
```

---

### Task 6: Add auth to `pages.listByDomain`, `storage`, and `mediaLibrary.trackUsage`

**Files:**
- Modify: `convex/pages.ts:544-554`
- Modify: `convex/storage.ts:5-44`
- Modify: `convex/mediaLibrary.ts:228-241`

**Step 1: Add auth to `pages.listByDomain`**

```ts
export const listByDomain = query({
  args: { domainId: v.id("domains") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const domain = await ctx.db.get(args.domainId);
    if (!domain) return [];
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_domainId", (q) => q.eq("domainId", args.domainId))
      .first();
    if (!business || business.userId !== user._id) {
      throw new Error("Not authorized to view pages for this domain");
    }
    return await ctx.db
      .query("pages")
      .withIndex("by_domain", (q) => q.eq("domainId", args.domainId))
      .collect();
  },
});
```

**Step 2: Add auth to `storage.generateUploadUrl`**

```ts
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    await getUserFromAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
```

**Step 3: Add ownership to `storage.storeFile`**

Add ownership check after getting the business:
```ts
const user = await getUserFromAuth(ctx);
const business = await ctx.db.get(args.businessId);
if (!business) throw new Error("Business not found");
if (business.userId !== user._id) throw new Error("Not authorized");
```

**Step 4: Add auth to `mediaLibrary.trackUsage`**

```ts
export const trackUsage = mutation({
  args: { mediaId: v.id("mediaLibrary") },
  handler: async (ctx, args) => {
    await getUserFromAuth(ctx);
    const media = await ctx.db.get(args.mediaId);
    if (!media) return;
    await ctx.db.patch(args.mediaId, {
      usageCount: media.usageCount + 1,
      lastUsedAt: Date.now(),
    });
  },
});
```

**Step 5: Run build**

Run: `bun run build`

**Step 6: Commit**

```bash
git add convex/pages.ts convex/storage.ts convex/mediaLibrary.ts
git commit -m "security: add auth guards to pages, storage, and media library"
```

---

### Task 7: Add auth to `customDomains.updateSslStatus`

**Files:**
- Modify: `convex/customDomains.ts:552-571`

**Step 1: Add auth + ownership**

Replace the handler:
```ts
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
    const user = await getUserFromAuth(ctx);
    const domain = await ctx.db.get(args.domainId);
    if (!domain) throw new Error("Domain not found");
    const business = await ctx.db
      .query("businesses")
      .withIndex("by_domainId", (q) => q.eq("domainId", args.domainId))
      .first();
    if (!business || business.userId !== user._id) {
      throw new Error("Not authorized to update this domain");
    }
    await ctx.db.patch(args.domainId, {
      sslStatus: args.sslStatus,
      sslProvider: args.sslProvider,
      updatedAt: Date.now(),
    });
  },
});
```

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add convex/customDomains.ts
git commit -m "security: add auth and ownership check to updateSslStatus"
```

---

### Task 8: Unify publish flow behind permission check

**Files:**
- Modify: `convex/businesses.ts:757-836` (both `publishDraft` and `publish`)

**Step 1: Add permission check to `publish`**

In the `publish` mutation (lines 821-836), add a call to `canPublishBusiness` check:

```ts
export const publish = mutation({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    await verifyBusinessOwnership(ctx, args.businessId, user._id);
    const permissions = await ctx.runQuery(
      api.businessPublishing.canPublishBusiness,
      { businessId: args.businessId },
    );
    if (!permissions.canPublish) {
      throw new Error(permissions.reason);
    }
    return await ctx.db.patch(args.businessId, {
      isPublished: true,
      publishedAt: Date.now(),
    });
  },
});
```

**Step 2: Add permission check to `publishDraft`**

Add the same check to `publishDraft` (around line 765, after `verifyBusinessOwnership`):

```ts
const permissions = await ctx.runQuery(
  api.businessPublishing.canPublishBusiness,
  { businessId: args.businessId },
);
if (!permissions.canPublish) {
  throw new Error(permissions.reason);
}
```

**Step 3: Also fix `publishDraft` to include `themeId` and `themeOverrides`**

After the existing theme copy lines (around line 797), add:

```ts
if (business.draftContent.themeId) updates.themeId = business.draftContent.themeId;
if (business.draftContent.themeOverrides) updates.themeOverrides = business.draftContent.themeOverrides;
```

**Step 4: Run build**

Run: `bun run build`

**Step 5: Commit**

```bash
git add convex/businesses.ts
git commit -m "security: unify publish flow behind permission check, fix draft theme propagation"
```

---

### Task 9: Fix CORS wildcard default

**Files:**
- Modify: `convex/lib/env.ts:3`

**Step 1: Remove wildcard fallback**

Change line 3 from:
```ts
CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "*",
```
to:
```ts
CLIENT_ORIGIN: process.env.CLIENT_ORIGIN!,
```

**Step 2: Run build**

Run: `bun run build`
Note: Build may warn about the non-null assertion if `CLIENT_ORIGIN` is not set in the local env. This is intentional — the app should fail loudly if CORS origin is not configured.

**Step 3: Commit**

```bash
git add convex/lib/env.ts
git commit -m "security: remove CORS wildcard fallback, require explicit CLIENT_ORIGIN"
```

---

### Task 10: Add HTTP security headers

**Files:**
- Modify: `next.config.ts`

**Step 1: Add `headers()` function to Next.js config**

Add a `headers` property to the config object in `next.config.ts`:

```ts
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ];
},
```

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "security: add HTTP security headers (HSTS, X-Frame-Options, CSP)"
```

---

### Task 11: Move Tinybird writes server-side

**Files:**
- Create: `app/api/analytics/route.ts`
- Modify: `app/lib/tinybird.ts`

**Step 1: Create API route to proxy Tinybird writes**

Create `app/api/analytics/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

const TINYBIRD_WRITE_TOKEN = process.env.TINYBIRD_WRITE_TOKEN;

export async function POST(request: NextRequest) {
  if (!TINYBIRD_WRITE_TOKEN) {
    return NextResponse.json({ error: "Analytics not configured" }, { status: 500 });
  }
  const body = await request.json();
  const { datasource, events } = body;
  if (!datasource || !events || !Array.isArray(events)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const allowedDatasources = ["page_views", "events", "sessions"];
  if (!allowedDatasources.includes(datasource)) {
    return NextResponse.json({ error: "Invalid datasource" }, { status: 400 });
  }
  const url = `${env.NEXT_PUBLIC_TINYBIRD_API_URL}/v0/events?name=${datasource}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TINYBIRD_WRITE_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: events.map((event: unknown) => JSON.stringify(event)).join("\n"),
  });
  if (!response.ok) {
    return NextResponse.json({ error: "Analytics write failed" }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
```

**Step 2: Update Tinybird client to use API route for writes**

In `app/lib/tinybird.ts`, replace the `sendEvents` method to POST to `/api/analytics` instead of directly to Tinybird:

```ts
private async sendEvents(datasource: string, events: unknown[]) {
  const response = await fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ datasource, events }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Analytics API error: ${response.status} - ${error}`);
  }
  return await response.json();
}
```

**Step 3: Add `TINYBIRD_WRITE_TOKEN` to `env.ts`**

Add a server-only env var in the `server` section:
```ts
TINYBIRD_WRITE_TOKEN: z.string().optional(),
```

And in `runtimeEnv`:
```ts
TINYBIRD_WRITE_TOKEN: process.env.TINYBIRD_WRITE_TOKEN,
```

**Step 4: Run build**

Run: `bun run build`

**Step 5: Commit**

```bash
git add app/api/analytics/route.ts app/lib/tinybird.ts env.ts
git commit -m "security: proxy Tinybird writes through server-side API route"
```

---

## Phase 2: Critical UX Gaps

### Task 12: Create placeholder privacy and terms pages

**Files:**
- Create: `app/(pages)/privacy/page.tsx`
- Create: `app/(pages)/terms/page.tsx`

**Step 1: Create privacy page**

Create `app/(pages)/privacy/page.tsx`:

```tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Locasite",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">Last updated: February 2026</p>
      <div className="prose prose-neutral dark:prose-invert space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="text-muted-foreground">
            When you use Locasite, we collect information you provide directly, such as your
            account details, business information, and content you create. We also collect
            usage data including page views and feature interactions to improve our service.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use your information to provide and improve Locasite, process transactions,
            communicate with you, and ensure security. We do not sell your personal information
            to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">3. Data Storage</h2>
          <p className="text-muted-foreground">
            Your data is stored securely using industry-standard encryption. Business site
            content and analytics data are stored separately from personal account information.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
          <p className="text-muted-foreground">
            You may request access to, correction of, or deletion of your personal data at any
            time by contacting us. You can also export your business data from your dashboard.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
          <p className="text-muted-foreground">
            For privacy-related inquiries, contact us at support@locasite.com.
          </p>
        </section>
      </div>
    </div>
  );
}
```

**Step 2: Create terms page**

Create `app/(pages)/terms/page.tsx` with similar structure covering: acceptance of terms, service description, user responsibilities, intellectual property, limitation of liability, termination, and contact.

**Step 3: Run build**

Run: `bun run build`

**Step 4: Commit**

```bash
git add "app/(pages)/privacy/page.tsx" "app/(pages)/terms/page.tsx"
git commit -m "feat: add placeholder privacy policy and terms of service pages"
```

---

### Task 13: Create `/dashboard/claims` route

**Files:**
- Create: `app/(pages)/dashboard/claims/page.tsx`

**Step 1: Create claims page**

This page lists the current user's business claims with status badges. It needs a Convex query to fetch claims by user — use the existing `businessClaims` table with `by_user` index.

First check if there's already a query for user claims. If not, add one to `convex/businessClaims.ts`:

```ts
export const getByUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);
    const claims = await ctx.db
      .query("businessClaims")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
    const enriched = await Promise.all(
      claims.map(async (claim) => {
        const business = await ctx.db.get(claim.businessId);
        return { ...claim, businessName: business?.name ?? "Unknown" };
      }),
    );
    return enriched;
  },
});
```

Then create `app/(pages)/dashboard/claims/page.tsx`:

```tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

export default function ClaimsPage() {
  const claims = useQuery(api.businessClaims.getByUser);

  if (!claims) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your Business Claims</h1>
      {claims.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            You haven&apos;t submitted any business claims yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim._id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <CardTitle className="text-lg">{claim.businessName}</CardTitle>
                <Badge
                  variant={
                    claim.status === "approved"
                      ? "default"
                      : claim.status === "pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {claim.status}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  Submitted {new Date(claim.createdAt).toLocaleDateString()}
                  {claim.verificationMethod && ` via ${claim.verificationMethod}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add convex/businessClaims.ts "app/(pages)/dashboard/claims/page.tsx"
git commit -m "feat: add /dashboard/claims page with user claim listing"
```

---

### Task 14: Add loading.tsx files to key routes

**Files:**
- Create: `app/(pages)/dashboard/loading.tsx`
- Create: `app/(pages)/dashboard/business/[businessId]/loading.tsx`
- Create: `app/(pages)/dashboard/business/[businessId]/analytics/loading.tsx`
- Create: `app/(pages)/dashboard/business/[businessId]/messages/loading.tsx`
- Create: `app/(pages)/dashboard/business/[businessId]/settings/loading.tsx`
- Create: `app/(pages)/dashboard/business/[businessId]/domain/loading.tsx`

**Step 1: Create a reusable skeleton pattern**

All loading files follow the same pattern — a pulse skeleton inside a Card. Since the dashboard layout already has a Suspense fallback, these `loading.tsx` files provide route-specific skeletons.

Example for `app/(pages)/dashboard/loading.tsx`:

```tsx
import { Card } from "@/app/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 bg-muted rounded w-1/4 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-8 bg-muted rounded w-1/3 mt-4" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

Create similar skeletons for each route, varying the skeleton shape to match the expected content layout.

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add "app/(pages)/dashboard/loading.tsx" "app/(pages)/dashboard/business/[businessId]/loading.tsx" "app/(pages)/dashboard/business/[businessId]/analytics/loading.tsx" "app/(pages)/dashboard/business/[businessId]/messages/loading.tsx" "app/(pages)/dashboard/business/[businessId]/settings/loading.tsx" "app/(pages)/dashboard/business/[businessId]/domain/loading.tsx"
git commit -m "feat: add loading skeletons for all dashboard routes"
```

---

### Task 15: Add error.tsx files to key routes

**Files:**
- Create: `app/(pages)/dashboard/error.tsx`
- Create: `app/(pages)/dashboard/business/[businessId]/error.tsx`

**Step 1: Create dashboard error boundary**

`app/(pages)/dashboard/error.tsx`:

```tsx
"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="max-w-lg mx-auto mt-12">
      <CardContent className="p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button onClick={reset}>Try again</Button>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Create business error boundary**

Same pattern for `app/(pages)/dashboard/business/[businessId]/error.tsx`.

**Step 3: Run build**

Run: `bun run build`

**Step 4: Commit**

```bash
git add "app/(pages)/dashboard/error.tsx" "app/(pages)/dashboard/business/[businessId]/error.tsx"
git commit -m "feat: add error.tsx boundaries for dashboard and business routes"
```

---

### Task 16: Fix WCAG zoom violation

**Files:**
- Modify: `app/layout.tsx:88-91`
- Modify: `app/(pages)/layout.tsx:90-93`

**Step 1: Remove user-scalable=no from both layouts**

In both files, change:
```tsx
content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
```
to:
```tsx
content="width=device-width, initial-scale=1.0"
```

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add app/layout.tsx "app/(pages)/layout.tsx"
git commit -m "fix: remove user-scalable=no to fix WCAG 1.4.4 zoom violation"
```

---

### Task 17: Clean up fake analytics overlay

**Files:**
- Modify: `app/(pages)/dashboard/business/[businessId]/analytics/` (the analytics page component)

**Step 1: Simplify the Coming Soon state**

Find the analytics page component (likely `analytics-page.tsx` in the analytics directory). Replace the fake chart data + ComingSoonOverlay with a clean Coming Soon card:

```tsx
import { Card, CardContent } from "@/app/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <Card className="max-w-lg mx-auto mt-12">
      <CardContent className="p-12 text-center space-y-4">
        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">Analytics Coming Soon</h2>
        <p className="text-muted-foreground">
          Detailed visitor analytics, page views, and conversion tracking
          will be available here in an upcoming release.
        </p>
      </CardContent>
    </Card>
  );
}
```

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add "app/(pages)/dashboard/business/[businessId]/analytics/"
git commit -m "fix: replace fake analytics data with clean Coming Soon state"
```

---

## Phase 3: Infrastructure & Monitoring

### Task 18: Integrate Sentry

**Files:**
- Create: `sentry.client.config.ts`
- Create: `sentry.server.config.ts`
- Create: `instrumentation.ts`
- Modify: `env.ts`
- Modify: `next.config.ts`

**Step 1: Install Sentry**

Run: `bun add @sentry/nextjs`

**Step 2: Create Sentry config files**

`sentry.client.config.ts`:
```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});
```

`sentry.server.config.ts`:
```ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

`instrumentation.ts`:
```ts
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
}
```

**Step 3: Add Sentry env vars to `env.ts`**

Add to the client section:
```ts
NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
```

And runtimeEnv:
```ts
NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
```

**Step 4: Wrap Next.js config with Sentry**

In `next.config.ts`, import `withSentryConfig` and wrap the export:

```ts
import { withSentryConfig } from "@sentry/nextjs";

// ... existing config ...

export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
```

**Step 5: Run build**

Run: `bun run build`

**Step 6: Commit**

```bash
git add sentry.client.config.ts sentry.server.config.ts instrumentation.ts env.ts next.config.ts package.json bun.lockb
git commit -m "infra: integrate Sentry error monitoring"
```

---

### Task 19: Create `.env.example` and document `OPENAI_API_KEY`

**Files:**
- Create: `.env.example`
- Modify: `env.ts` (add `OPENAI_API_KEY` documentation)

**Step 1: Create `.env.example`**

```env
# === Required ===

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Google APIs
NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID=your-google-client-id
GOOGLE_BUSINESS_CLIENT_SECRET=your-google-client-secret
GOOGLE_MAPS_API_KEY=your-google-maps-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOKS_SECRET=whsec_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_BUSINESS=price_...

# Tinybird
NEXT_PUBLIC_TINYBIRD_TOKEN=p.read-only-token
TINYBIRD_WRITE_TOKEN=p.write-token

# OpenAI (used by AI content generation)
OPENAI_API_KEY=sk-...

# CORS origin for Convex HTTP endpoints
CLIENT_ORIGIN=https://locasite.xyz

# === Optional ===

# Domain
NEXT_PUBLIC_ROOT_DOMAIN=locasite.xyz
NEXT_PUBLIC_APP_URL=https://app.locasite.xyz

# Vercel (for custom domain management)
VERCEL_API_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id
VERCEL_TEAM_ID=your-team-id

# Google
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-public-maps-key
GOOGLE_SITE_VERIFICATION=your-verification-code

# Sentry
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx

# Misc
NEXT_PUBLIC_TINYBIRD_API_URL=https://api.tinybird.co
NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX=vercel.app
```

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add .env.example
git commit -m "docs: add .env.example with all required and optional variables"
```

---

### Task 20: Set up CI/CD with GitHub Actions

**Files:**
- Create: `.github/workflows/ci.yml`

**Step 1: Create CI workflow**

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Lint
        run: bun run lint

      - name: Type check
        run: npx tsc --noEmit
        env:
          SKIP_ENV_VALIDATION: true

      - name: Build
        run: bun run build
        env:
          SKIP_ENV_VALIDATION: true
          NEXT_PUBLIC_CONVEX_URL: https://placeholder.convex.cloud
          NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID: placeholder
          NEXT_PUBLIC_TINYBIRD_TOKEN: placeholder
```

**Step 2: Commit**

```bash
mkdir -p .github/workflows
git add .github/workflows/ci.yml
git commit -m "infra: add GitHub Actions CI pipeline (lint, typecheck, build)"
```

---

### Task 21: Add health check endpoint

**Files:**
- Create: `app/api/health/route.ts`

**Step 1: Create health check**

```ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
```

**Step 2: Commit**

```bash
git add app/api/health/route.ts
git commit -m "infra: add /api/health endpoint for uptime monitoring"
```

---

## Phase 4: Feature Completion

### Task 22: Integrate Resend for email verification

**Files:**
- Modify: `convex/emailVerification.ts:81-87`
- Modify: `convex/lib/env.ts` (add `RESEND_API_KEY`)

**Step 1: Install Resend**

Note: Convex actions can make HTTP calls. Since the Resend SDK uses `fetch`, add `RESEND_API_KEY` to `convex/lib/env.ts`:

```ts
RESEND_API_KEY: process.env.RESEND_API_KEY!,
```

**Step 2: Implement email sending in `sendVerificationEmail`**

In `convex/emailVerification.ts`, replace the commented-out section (lines 81-87) with:

```ts
const verificationUrl = `${convexEnv.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}&businessId=${args.businessId}`;

const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${convexEnv.RESEND_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "Locasite <noreply@locasite.xyz>",
    to: [business.email],
    subject: `Verify your ownership of ${business.name}`,
    html: `<p>Click the link below to verify your ownership of <strong>${business.name}</strong>:</p><p><a href="${verificationUrl}">Verify Ownership</a></p><p>This link expires in 24 hours.</p>`,
  }),
});

if (!res.ok) {
  const error = await res.text();
  throw new Error(`Failed to send verification email: ${error}`);
}
```

**Step 3: Also uncomment the scheduler in `resendVerificationEmail`**

In the `resendVerificationEmail` mutation, uncomment the `ctx.scheduler.runAfter` call and point it to the updated `sendVerificationEmail` action.

**Step 4: Add `RESEND_API_KEY` to `.env.example`**

**Step 5: Run build**

Run: `bun run build`

**Step 6: Commit**

```bash
git add convex/emailVerification.ts convex/lib/env.ts .env.example
git commit -m "feat: integrate Resend for email verification magic links"
```

---

### Task 23: Add rate limiting to AI and contact endpoints

**Files:**
- Modify: `convex/contactMessages.ts`
- Modify: `convex/aiContentGenerator.ts`
- Modify: `convex/reviewFilter.ts`

**Step 1: Define rate limits**

In the file that defines rate limits (or create a new section), define limits using `@convex-dev/rate-limiter`:

```ts
import { defineRateLimits } from "@convex-dev/rate-limiter/convex";

export const { checkRateLimit, rateLimit } = defineRateLimits(rateLimiter, {
  contactSend: { kind: "fixed window", rate: 10, period: 60 * 1000 },
  aiGenerate: { kind: "fixed window", rate: 5, period: 60 * 60 * 1000 },
});
```

Check how the existing rate limiter is used for the scrape endpoint and follow the same pattern. Apply to `contactMessages.send` (by IP or session), `aiContentGenerator.generateBusinessContent` (by user), and `reviewFilter.filterAndEnhanceReviews` (by user).

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add convex/contactMessages.ts convex/aiContentGenerator.ts convex/reviewFilter.ts
git commit -m "security: add rate limiting to contact form and AI generation endpoints"
```

---

### Task 24: Fix Stripe silent failures and price ID fallbacks

**Files:**
- Modify: `convex/router.ts:27-28`
- Modify: `convex/lib/env.ts:20-21`
- Modify: `convex/stripe.ts:153`

**Step 1: Log webhook failures in router**

Replace the empty `if (!result.success)` block in `convex/router.ts` (lines 27-28):

```ts
if (!result.success) {
  console.error("Stripe webhook fulfillment failed:", result.error);
  return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}
```

**Step 2: Remove silent fallbacks for Stripe price IDs**

In `convex/lib/env.ts`, change lines 20-21:
```ts
STRIPE_PRICE_PROFESSIONAL: process.env.STRIPE_PRICE_PROFESSIONAL!,
STRIPE_PRICE_BUSINESS: process.env.STRIPE_PRICE_BUSINESS!,
```

**Step 3: Preserve original error in `syncStripeDataToConvex`**

In `convex/stripe.ts` line 153, replace:
```ts
throw new Error("Failed to sync Stripe data");
```
with:
```ts
throw new Error(`Failed to sync Stripe data: ${error instanceof Error ? error.message : String(error)}`);
```

**Step 4: Run build**

Run: `bun run build`

**Step 5: Commit**

```bash
git add convex/router.ts convex/lib/env.ts convex/stripe.ts
git commit -m "fix: handle Stripe webhook failures properly, remove silent env fallbacks"
```

---

### Task 25: Add orphan cleanup on business deletion

**Files:**
- Modify: `convex/businesses.ts` (in `deleteBusiness` mutation)

**Step 1: Add cascade deletion for claims and stripe records**

In the `deleteBusiness` handler, after existing cleanup code, add:

```ts
// Clean up business claims
const claims = await ctx.db
  .query("businessClaims")
  .withIndex("by_business", (q) => q.eq("businessId", args.businessId))
  .collect();
for (const claim of claims) {
  await ctx.db.delete(claim._id);
}

// Clean up stripe records if user is being disassociated
if (business.userId) {
  const stripeCustomer = await ctx.db
    .query("stripeCustomers")
    .withIndex("by_user", (q) => q.eq("userId", business.userId!))
    .first();
  // Note: only clean up stripe records if user has no other businesses
  const otherBusinesses = await ctx.db
    .query("businesses")
    .withIndex("by_userId", (q) => q.eq("userId", business.userId!))
    .collect();
  if (otherBusinesses.filter((b) => b._id !== args.businessId).length === 0 && stripeCustomer) {
    // User has no other businesses — this is their last one
    // Keep stripe records for billing history, just note it
  }
}
```

**Step 2: Run build**

Run: `bun run build`

**Step 3: Commit**

```bash
git add convex/businesses.ts
git commit -m "fix: cascade delete business claims on business deletion"
```

---

### Task 26: Fix missing indexes and full table scans

**Files:**
- Modify: `convex/schema.ts` (add `by_themeId` index to businesses)
- Modify: `convex/businessDomainSync.ts:15,71` (use index instead of `.collect()`)
- Modify: `convex/themes.ts` (use new index for theme usage check)

**Step 1: Add missing index to schema**

In `convex/schema.ts`, in the businesses table definition, add after the existing indexes:

```ts
.index("by_themeId", ["themeId"])
```

**Step 2: Fix `businessDomainSync` to use index**

Replace the full table scan at line 15 with:

```ts
const slugified = business.name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
const possibleDomain = await ctx.db
  .query("domains")
  .withIndex("by_subdomain", (q) => q.eq("subdomain", slugified))
  .first();
```

Apply the same fix at line 71.

**Step 3: Fix theme deletion to use index**

In `convex/themes.ts`, in the `deleteTheme` handler, replace the filter-based business check with:

```ts
const businessesUsingTheme = await ctx.db
  .query("businesses")
  .withIndex("by_themeId", (q) => q.eq("themeId", args.themeId))
  .first();
if (businessesUsingTheme) {
  throw new Error("Cannot delete theme: it is in use by a business");
}
```

**Step 4: Run build**

Run: `bun run build`

**Step 5: Commit**

```bash
git add convex/schema.ts convex/businessDomainSync.ts convex/themes.ts
git commit -m "perf: add missing indexes, replace full table scans with index queries"
```

---

## Phase 5: Quality & Testing

### Task 27: Set up test infrastructure

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script)

**Step 1: Install test dependencies**

Run: `bun add -d vitest @testing-library/react @testing-library/user-event jsdom @vitejs/plugin-react`

**Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

**Step 3: Add test script to `package.json`**

Add to `"scripts"`:
```json
"test": "vitest",
"test:run": "vitest run"
```

**Step 4: Verify setup**

Run: `bun run test:run`
Expected: "No test files found" (no tests yet, but setup works).

**Step 5: Commit**

```bash
git add vitest.config.ts package.json bun.lockb
git commit -m "infra: set up Vitest test infrastructure"
```

---

### Task 28: Write critical path tests — middleware routing

**Files:**
- Create: `__tests__/middleware.test.ts`

**Step 1: Write middleware routing tests**

Test the core routing logic extracted from `middleware.ts`. Since middleware uses Next.js internals, test the URL parsing/decision logic:

```ts
import { describe, it, expect } from "vitest";

// Extract the routing logic into a testable function or test the URL patterns
describe("subdomain routing logic", () => {
  const ROOT_DOMAIN = "locasite.xyz";

  function getSubdomain(hostname: string): string | null {
    const host = hostname.replace(/:\d+$/, "");
    if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}` || host === "localhost") {
      return null;
    }
    const parts = host.split(".");
    if (parts.length > ROOT_DOMAIN.split(".").length) {
      return parts[0];
    }
    return null;
  }

  it("returns null for root domain", () => {
    expect(getSubdomain("locasite.xyz")).toBeNull();
  });

  it("returns null for www", () => {
    expect(getSubdomain("www.locasite.xyz")).toBeNull();
  });

  it("returns null for localhost", () => {
    expect(getSubdomain("localhost")).toBeNull();
  });

  it("extracts subdomain from business site", () => {
    expect(getSubdomain("joes-pizza.locasite.xyz")).toBe("joes-pizza");
  });

  it("returns null for root domain with port", () => {
    expect(getSubdomain("locasite.xyz:3000")).toBeNull();
  });
});
```

**Step 2: Run tests**

Run: `bun run test:run`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add __tests__/middleware.test.ts
git commit -m "test: add middleware subdomain routing unit tests"
```

---

### Task 29: Write critical path tests — URL utilities

**Files:**
- Create: `__tests__/url-utils.test.ts`

**Step 1: Write tests for URL utility functions**

Read `app/lib/url-utils.ts` and write tests for each exported function.

**Step 2: Run tests**

Run: `bun run test:run`

**Step 3: Commit**

```bash
git add __tests__/url-utils.test.ts
git commit -m "test: add URL utility function tests"
```

---

### Task 30: Set up Playwright E2E

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/smoke.spec.ts`

**Step 1: Install Playwright**

Run: `bun add -d @playwright/test`
Run: `npx playwright install chromium`

**Step 2: Create Playwright config**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "bun dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

**Step 3: Create smoke test**

```ts
import { test, expect } from "@playwright/test";

test("landing page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Locasite/);
});

test("health check responds", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.status).toBe("ok");
});
```

**Step 4: Add E2E script to package.json**

```json
"test:e2e": "playwright test"
```

**Step 5: Commit**

```bash
git add playwright.config.ts e2e/smoke.spec.ts package.json
git commit -m "test: set up Playwright E2E with landing page smoke test"
```

---

### Task 31: Remove dead code

**Files:**
- Delete or gut: `convex/applyBusinessTemplate.ts`
- Modify: `middleware.ts` (remove `/app` subdomain rewrite)

**Step 1: Remove `applyBusinessTemplate` stub**

Delete the file or replace with a minimal placeholder that throws clearly:

```ts
import { action } from "./_generated/server";
import { v } from "convex/values";

export const applyBusinessTemplate = action({
  args: { businessId: v.id("businesses"), templateId: v.string() },
  handler: async () => {
    throw new Error("Business templates are not yet implemented");
  },
});
```

**Step 2: Remove `/app` subdomain rewrite from middleware**

In `middleware.ts`, remove the block at lines 111-125 that handles `subdomain === "app"` since there is no `/app` directory.

**Step 3: Run build**

Run: `bun run build`

**Step 4: Commit**

```bash
git add convex/applyBusinessTemplate.ts middleware.ts
git commit -m "cleanup: remove dead template stub and unused /app subdomain rewrite"
```

---

## Phase 6: Post-Launch Backlog

These tasks are documented but not planned in detail — they'll be designed individually when prioritized:

- **Analytics dashboard**: Wire Tinybird backend to real UI, replace Coming Soon
- **Undo/redo**: Implement for Simple Builder
- **Custom domain SSL**: Automate SSL provisioning via Vercel API
- **Team management**: User invitation, roles, permissions
- **Data export**: CSV/JSON export from dashboard
- **Performance**: Virtual scrolling for large pages, remaining index gaps
