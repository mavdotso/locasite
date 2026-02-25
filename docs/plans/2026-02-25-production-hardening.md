# Production Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Close all remaining production readiness gaps (excluding test coverage) to bring the score from 57/100 toward 75+.

**Architecture:** Targeted fixes across Convex backend (auth guards, token security, rate limiting), Next.js config (CSP header, CI pipeline), and content (legal pages). All changes are incremental — no rewrites.

**Tech Stack:** Convex, Next.js 15, TypeScript, GitHub Actions

---

### Task 1: Add auth guards to remaining unprotected query endpoints

**Files:**
- Modify: `convex/subscriptions.ts` (lines 90-136)
- Modify: `convex/payments.ts` (lines 71-83)
- Modify: `convex/contactMessages.ts` (lines 138-152)
- Modify: `convex/businesses.ts` (lines 882-915)
- Modify: `convex/themes.ts` (lines 138-147)

**Context:** These 5 queries accept arbitrary IDs without verifying the caller is authenticated or owns the resource. The project uses `getUserFromAuth(ctx)` from `convex/lib/helpers.ts` for auth and `verifyBusinessOwnership(ctx, businessId, userId)` for ownership checks.

**Step 1: Fix `getUserSubscriptionByUserId` in `convex/subscriptions.ts`**

This function accepts an arbitrary `userId` parameter. Change it to derive the userId from auth context instead:

```typescript
export const getUserSubscriptionByUserId = query({
  args: {},
  handler: async (ctx) => {
    const user = await getUserFromAuth(ctx);

    // Get customer record
    const customer = await ctx.db
      .query("stripeCustomers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!customer) {
      return {
        planType: "FREE" as PlanType,
        status: "active",
        cancelAtPeriodEnd: false,
      };
    }

    // Get subscription
    const subscription = await ctx.db
      .query("stripeSubscriptions")
      .withIndex("by_customerId", (q) =>
        q.eq("customerId", customer.stripeCustomerId),
      )
      .first();

    if (
      !subscription ||
      !["active", "trialing"].includes(subscription.status)
    ) {
      return {
        planType: "FREE" as PlanType,
        status: "active",
        cancelAtPeriodEnd: false,
      };
    }

    return {
      subscriptionId: subscription.subscriptionId,
      planType: subscription.planType || "FREE",
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
      paymentMethod: subscription.paymentMethod,
      plan: SUBSCRIPTION_PLANS[subscription.planType || "FREE"],
    };
  },
});
```

Then search for all callers of `getUserSubscriptionByUserId` in the frontend and remove the `userId` argument they pass. Ensure `getUserFromAuth` is imported in this file.

**Step 2: Fix `getBySessionId` in `convex/payments.ts`**

Add auth and verify the payment belongs to the authenticated user:

```typescript
export const getBySessionId = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const payment = await ctx.db
      .query("payments")
      .withIndex("stripeSessionId", (q) =>
        q.eq("stripeSessionId", args.sessionId),
      )
      .first();

    if (!payment) return null;
    if (payment.userId !== user._id) return null;

    return payment;
  },
});
```

Ensure `getUserFromAuth` is imported.

**Step 3: Fix `getUnreadCount` in `convex/contactMessages.ts`**

Add auth and verify the caller owns the business:

```typescript
export const getUnreadCount = query({
  args: {
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    const business = await ctx.db.get(args.businessId);
    if (!business || business.userId !== user._id) {
      throw new Error("Unauthorized: You don't own this business");
    }

    const unreadMessages = await ctx.db
      .query("contactMessages")
      .withIndex("by_business_status", (q) =>
        q.eq("businessId", args.businessId).eq("status", "unread")
      )
      .collect();

    return unreadMessages.length;
  },
});
```

Ensure `getUserFromAuth` is imported.

**Step 4: Fix `getByIdWithDraft` in `convex/businesses.ts`**

Add auth and ownership check:

```typescript
export const getByIdWithDraft = query({
  args: { id: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);
    const business = await ctx.db.get(args.id);
    if (!business) return null;

    // Verify ownership — drafts are private
    if (business.userId !== user._id) return null;

    // If there's draft content, merge it with the main content
    if (business.draftContent) {
      return {
        ...business,
        name: business.draftContent.name || business.name,
        description: business.draftContent.description || business.description,
        phone:
          business.draftContent.phone !== undefined
            ? business.draftContent.phone
            : business.phone,
        email:
          business.draftContent.email !== undefined
            ? business.draftContent.email
            : business.email,
        website:
          business.draftContent.website !== undefined
            ? business.draftContent.website
            : business.website,
        hours: business.draftContent.hours || business.hours,
        theme: business.draftContent.theme || business.theme,
        hasDraft: true,
      };
    }

    return { ...business, hasDraft: false };
  },
});
```

**Step 5: Fix `getBusinessThemes` in `convex/themes.ts`**

Add auth and ownership check:

```typescript
export const getBusinessThemes = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const user = await getUserFromAuth(ctx);

    // Verify ownership
    const business = await ctx.db.get(args.businessId);
    if (!business || business.userId !== user._id) {
      throw new Error("Unauthorized: You don't own this business");
    }

    return await ctx.db
      .query("themes")
      .withIndex("by_business")
      .filter((q) => q.eq(q.field("businessId"), args.businessId))
      .collect();
  },
});
```

Ensure `getUserFromAuth` is imported in `convex/themes.ts`.

**Step 6: Verify the build passes**

Run: `bun run build`
Expected: Build succeeds. If any frontend code passes `userId` to `getUserSubscriptionByUserId`, it will fail — find and fix those callers.

**Step 7: Commit**

```bash
git add convex/subscriptions.ts convex/payments.ts convex/contactMessages.ts convex/businesses.ts convex/themes.ts
# Also add any frontend files that were updated to remove userId args
git commit -m "security: add auth guards to remaining unprotected query endpoints"
```

---

### Task 2: Secure DELETE /domains/vercel HTTP endpoint

**Files:**
- Modify: `convex/http.ts` (lines 1297-1378)

**Context:** The DELETE handler for `/domains/vercel` accepts a domain name and deletes it from Vercel with zero ownership validation. Anyone who knows a domain name can remove it. We need to require a `businessId` parameter, look up the business in DB, verify the caller owns it via auth, then proceed.

**Note:** HTTP actions in Convex use `httpAction` which receives `(ctx, request)`. Auth in HTTP actions requires extracting the token from the Authorization header and validating it. Check how other authenticated HTTP endpoints in this file handle auth. If there's no pattern for auth in HTTP actions, an alternative approach is to require a `businessId` query param and verify the domain belongs to that business — but without auth, this is still weak. The best approach: require the frontend to call a Convex mutation instead of this HTTP endpoint directly. If that's not feasible, add a shared secret or session token validation.

**Step 1: Add ownership validation to the DELETE handler**

The simplest secure approach: convert this to a **mutation** that the frontend calls via the Convex client (which handles auth automatically). But if the HTTP endpoint must stay, add a businessId check:

In the DELETE handler, after validating `domain` is present, add:

```typescript
const businessId = url.searchParams.get("businessId");
if (!businessId) {
  return new Response(
    JSON.stringify({ error: "businessId is required" }),
    { status: 400, headers: { "Content-Type": "application/json" } },
  );
}

// Verify the domain belongs to this business
const business = await ctx.runQuery(
  internal.businesses.internal_getBusinessById,
  { id: businessId as Id<"businesses"> }
);
if (!business || !business.domainId) {
  return new Response(
    JSON.stringify({ error: "Business not found" }),
    { status: 404, headers: { "Content-Type": "application/json" } },
  );
}

const domainRecord = await ctx.runQuery(
  internal.domains.internal_getDomainById,
  { id: business.domainId }
);
if (!domainRecord || (domainRecord.customDomain !== domain && domainRecord.subdomain !== domain)) {
  return new Response(
    JSON.stringify({ error: "Domain does not belong to this business" }),
    { status: 403, headers: { "Content-Type": "application/json" } },
  );
}
```

**Important:** Check if `internal.domains.internal_getDomainById` exists. If not, you'll need to create it in `convex/domains.ts`:

```typescript
export const internal_getDomainById = internalQuery({
  args: { id: v.id("domains") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

Also verify `internal.businesses.internal_getBusinessById` exists in `convex/businesses.ts`. The audit found it does.

**Step 2: Update frontend callers**

Search the frontend for calls to the DELETE `/domains/vercel` endpoint and add the `businessId` query parameter.

**Step 3: Commit**

```bash
git add convex/http.ts convex/domains.ts
# Add any frontend files updated
git commit -m "security: add ownership validation to DELETE /domains/vercel endpoint"
```

---

### Task 3: Add Content-Security-Policy header

**Files:**
- Modify: `next.config.ts` (lines 69-88)

**Context:** All security headers are present except CSP. The app uses: Convex (careful-emu-235.convex.cloud), Sentry, Google APIs, Tinybird, Unsplash images, and inline styles (Radix UI/Tailwind).

**Step 1: Add CSP to the headers array**

Add this entry to the headers array in `next.config.ts`, inside the existing headers list:

```typescript
{
  key: "Content-Security-Policy",
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.sentry-cdn.com https://maps.googleapis.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https: http:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud https://api.sentry.io https://*.ingest.sentry.io https://api.tinybird.co https://maps.googleapis.com https://places.googleapis.com",
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ].join("; "),
},
```

**Notes:**
- `'unsafe-inline'` for scripts is needed due to Next.js inline scripts and Sentry. `'unsafe-eval'` may be needed for Next.js dev mode; test in production build.
- `img-src` allows https: broadly because business sites display Google Maps photos from various Google CDN domains and user-uploaded images from Convex storage.
- `frame-src` allows Stripe checkout iframe.
- If the build or runtime breaks, check the browser console for CSP violations and add the offending domain.

**Step 2: Test locally**

Run: `bun run build && bun run start`
Open browser dev tools console, navigate through the app. Check for CSP violation errors. Adjust the policy if needed.

**Step 3: Commit**

```bash
git add next.config.ts
git commit -m "security: add Content-Security-Policy header"
```

---

### Task 4: Replace Math.random() with crypto.getRandomValues() for token generation

**Files:**
- Modify: `convex/emailVerification.ts` (lines 7-16)

**Context:** `generateVerificationToken()` uses `Math.random()` which is not cryptographically secure. This function is used in `emailVerification.ts` and also referenced in `customDomains.ts`. Convex server runtime supports the Web Crypto API.

**Step 1: Replace the function**

Replace the `generateVerificationToken` function (lines 7-16) with:

```typescript
function generateVerificationToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = new Uint8Array(32);
  crypto.getRandomValues(randomValues);
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(randomValues[i] % chars.length);
  }
  return token;
}
```

**Step 2: Check if customDomains.ts has its own copy**

Search `convex/customDomains.ts` for token generation. If it has a duplicate `generateVerificationToken` or inline `Math.random()` usage, fix those too. Consider extracting to a shared utility in `convex/lib/crypto.ts` if used in multiple files.

**Step 3: Commit**

```bash
git add convex/emailVerification.ts convex/customDomains.ts
# Add convex/lib/crypto.ts if extracted
git commit -m "security: use crypto.getRandomValues() for verification tokens"
```

---

### Task 5: Remove placeholder disclaimers from privacy and terms pages

**Files:**
- Modify: `app/(pages)/privacy/page.tsx` (lines 89-95)
- Modify: `app/(pages)/terms/page.tsx` (lines 114-119)

**Context:** Both pages end with an explicit disclaimer: "This privacy policy is a placeholder and will be updated with complete legal terms before the general availability release of Locasite." This undermines user trust. The content itself is reasonable for an MVP — remove just the disclaimer.

**Step 1: Remove the placeholder disclaimer from privacy page**

Delete lines 89-95 in `app/(pages)/privacy/page.tsx`:
```tsx
          <div className="border-t border-border pt-8 mt-12">
            <p className="text-sm text-muted-foreground">
              This privacy policy is a placeholder and will be updated with
              complete legal terms before the general availability release of
              Locasite.
            </p>
          </div>
```

**Step 2: Remove the placeholder disclaimer from terms page**

Delete lines 114-119 in `app/(pages)/terms/page.tsx`:
```tsx
          <div className="border-t border-border pt-8 mt-12">
            <p className="text-sm text-muted-foreground">
              These terms of service are a placeholder and will be updated with
              complete legal terms before the general availability release of
              Locasite.
            </p>
          </div>
```

**Step 3: Commit**

```bash
git add "app/(pages)/privacy/page.tsx" "app/(pages)/terms/page.tsx"
git commit -m "content: remove placeholder disclaimers from legal pages"
```

---

### Task 6: Add Vitest and Playwright to CI pipeline

**Files:**
- Modify: `.github/workflows/ci.yml`

**Context:** CI currently runs lint + typecheck + build but NOT the existing 22 tests. Adding them ensures regressions are caught.

**Step 1: Add test steps to the workflow**

Add a test step after the lint step. The Playwright E2E tests require a running server, so only add Vitest (unit tests) to CI for now:

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
        run: bunx tsc --noEmit
        env:
          SKIP_ENV_VALIDATION: "true"

      - name: Unit tests
        run: bunx vitest run
        env:
          SKIP_ENV_VALIDATION: "true"

      - name: Build
        run: bun run build
        env:
          SKIP_ENV_VALIDATION: "true"
          NEXT_PUBLIC_CONVEX_URL: https://placeholder.convex.cloud
          NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID: placeholder
          NEXT_PUBLIC_TINYBIRD_TOKEN: placeholder
```

**Step 2: Verify locally**

Run: `bunx vitest run`
Expected: All 22 tests pass.

**Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add unit tests to CI pipeline"
```

---

### Task 7: Add rate limiting to AI content generation

**Files:**
- Modify: `convex/aiContentGenerator.ts` (around line 25)
- Reference: `convex/lib/scrape.ts` for existing rate limiter pattern using `@convex-dev/rate-limiter`

**Context:** The `generateBusinessContent` action has a TODO comment about rate limiting. The project already uses `@convex-dev/rate-limiter` (registered in `convex/convex.config.ts`). Follow the pattern from `convex/lib/scrape.ts`.

**Step 1: Check how rate limiting works in scrape.ts**

Read `convex/lib/scrape.ts` to see the existing rate limiter setup. It likely uses the `RateLimiter` component from `@convex-dev/rate-limiter`. Copy that pattern.

**Step 2: Add rate limiting to generateBusinessContent**

At the top of the action handler, before the OpenAI call, add rate limiting. Since this action can be called without auth (during preview flow), use IP-based or business-data-based rate limiting. If auth is available, use userId.

The implementation depends on how `@convex-dev/rate-limiter` is configured in the project. Follow the existing pattern from scrape.ts exactly.

Remove the TODO comment after implementing.

**Step 3: Commit**

```bash
git add convex/aiContentGenerator.ts
# Add any rate limiter config files if modified
git commit -m "security: add rate limiting to AI content generation"
```

---

### Task 8: Add Stripe record cleanup on business deletion

**Files:**
- Modify: `convex/businesses.ts` (lines 1080-1163, `deleteBusiness` function)

**Context:** When a business is deleted, associated stripe records (stripeCustomers, stripeSubscriptions) are NOT cleaned up. The `deleteBusiness` function already cascades to pages, messages, media, and claims. Add stripe cleanup.

**Note:** Stripe records are per-user, not per-business. A user might have one stripe customer record shared across businesses. Only clean up if the user has no remaining businesses after this deletion.

**Step 1: Add stripe cleanup logic to deleteBusiness**

After the existing cascade deletes (after the claims cleanup around line 1147), add:

```typescript
    // Clean up Stripe records if user has no remaining businesses
    const remainingBusinesses = await ctx.db
      .query("businesses")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.neq(q.field("_id"), args.businessId))
      .first();

    if (!remainingBusinesses) {
      // No other businesses — clean up Stripe records
      const stripeCustomer = await ctx.db
        .query("stripeCustomers")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .first();

      if (stripeCustomer) {
        // Delete subscriptions for this customer
        const subscriptions = await ctx.db
          .query("stripeSubscriptions")
          .withIndex("by_customerId", (q) =>
            q.eq("customerId", stripeCustomer.stripeCustomerId),
          )
          .collect();

        for (const sub of subscriptions) {
          await ctx.db.delete(sub._id);
        }

        await ctx.db.delete(stripeCustomer._id);
      }
    }
```

**Step 2: Commit**

```bash
git add convex/businesses.ts
git commit -m "fix: clean up orphaned Stripe records when last business is deleted"
```

---

### Task 9: Move hardcoded sender email to environment config

**Files:**
- Modify: `convex/emailVerification.ts` (line ~92, the "noreply@locasite.xyz" string)
- Modify: `convex/lib/env.ts` (add new env var)
- Modify: `.env.example` (document the new var)

**Step 1: Add env var to convex/lib/env.ts**

Add to the `convexEnv` object:

```typescript
  // Email
  SENDER_EMAIL: process.env.SENDER_EMAIL || "noreply@locasite.xyz",
```

**Step 2: Use env var in emailVerification.ts**

Replace the hardcoded `"noreply@locasite.xyz"` with `convexEnv.SENDER_EMAIL`.

**Step 3: Document in .env.example**

Add under the Resend section:
```
# Sender email address for verification emails (optional, defaults to noreply@locasite.xyz)
SENDER_EMAIL=noreply@locasite.xyz
```

**Step 4: Commit**

```bash
git add convex/emailVerification.ts convex/lib/env.ts .env.example
git commit -m "config: move sender email to environment variable"
```

---

### Summary of Tasks

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1 | Auth guards on 5 unprotected endpoints | subscriptions.ts, payments.ts, contactMessages.ts, businesses.ts, themes.ts + frontend callers | M |
| 2 | Secure DELETE /domains/vercel | http.ts, domains.ts, frontend | S |
| 3 | Add CSP header | next.config.ts | S |
| 4 | Crypto token generation | emailVerification.ts, possibly customDomains.ts | S |
| 5 | Remove legal page disclaimers | privacy/page.tsx, terms/page.tsx | S |
| 6 | Add tests to CI | ci.yml | S |
| 7 | AI rate limiting | aiContentGenerator.ts | S |
| 8 | Stripe orphan cleanup | businesses.ts | S |
| 9 | Sender email to env | emailVerification.ts, env.ts, .env.example | S |
