# Production Readiness — Full Roadmap Design

**Date:** 2026-02-25
**Scope:** All 6 phases from production readiness audit (31/100 → MVP-ready)
**Decisions:** Placeholder legal pages, Resend for email verification

---

## Phase 1: Security Hardening

### Auth Guard Strategy

Use existing `getUserFromAuth(ctx)` and `verifyBusinessOwnership(ctx, businessId, userId)` helpers consistently. Two categories:

**Make internal (no public access needed):**
- `businesses.list` → `internalQuery`
- `domains.list` → `internalQuery`

**Add auth + ownership checks:**
- `businesses.getById` → strip `googleBusinessAuth` from return value
- `businesses.listByUser` → add auth, enforce `userId === caller`
- `businessEditData.getBusinessEditData` → add auth + ownership
- `dashboardData.getDashboardBusinessData` → add auth + ownership
- `contactMessages.getByBusiness` → add auth + business ownership
- `contactMessages.markAsRead` → add auth + business ownership
- `contactMessages.markAsResponded` → add auth + business ownership
- `pages.listByDomain` → add auth + verify caller owns domain's business
- `customDomains.updateSslStatus` → add auth + domain ownership
- `storage.generateUploadUrl` → add auth
- `storage.storeFile` → add ownership check
- `mediaLibrary.trackUsage` → add auth

### Publish Flow Unification

Route `businesses.publish` and `businesses.publishDraft` through the `businessPublishing.canPublishBusiness` permission check so verification cannot be bypassed.

### CORS Fix

Change `convex/lib/env.ts` to throw if `CLIENT_ORIGIN` is unset instead of defaulting to `"*"`.

### Security Headers

Add `headers()` function to `next.config.ts`:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Tinybird Token

Move analytics event ingestion server-side. Create a Next.js API route or Convex action that proxies writes to Tinybird, so the client-side token only needs read permissions on specific pipes.

---

## Phase 2: Critical UX Gaps

### Missing Pages
- `/app/(pages)/privacy/page.tsx` — placeholder privacy policy
- `/app/(pages)/terms/page.tsx` — placeholder terms of service
- `/app/(pages)/dashboard/claims/page.tsx` — list user's business claims with status badges

### Loading States
Add `loading.tsx` with pulse skeleton to:
- `/dashboard`
- `/dashboard/business/[businessId]`
- `/dashboard/business/[businessId]/analytics`
- `/dashboard/business/[businessId]/messages`
- `/dashboard/business/[businessId]/settings`
- `/dashboard/business/[businessId]/domain`
- `/business/[businessId]/edit`

### Error Boundaries
Add `error.tsx` (Next.js App Router file-based) to:
- `/dashboard`
- `/business/[businessId]/edit`

### WCAG Fix
Remove `maximum-scale=1.0, user-scalable=no` from viewport meta in both `app/layout.tsx` and `app/(pages)/layout.tsx`.

### Cleanup
- Strip fake analytics data from `analytics-overview.tsx` — keep Coming Soon overlay, remove hardcoded percentages and random chart data
- Fix `publishDraft` to include `themeId` and `themeOverrides` when applying draft content

---

## Phase 3: Infrastructure & Monitoring

### Sentry
- Install `@sentry/nextjs`
- Create `sentry.client.config.ts`, `sentry.server.config.ts`, `instrumentation.ts`
- Add `SENTRY_DSN` and `SENTRY_AUTH_TOKEN` to env validation
- Wire existing ErrorBoundary to report errors to Sentry

### Environment Documentation
- Create `.env.example` with all 15+ variables and descriptions
- Add `OPENAI_API_KEY` to `env.ts` validation

### README
- Setup instructions, architecture overview, dev workflow, deployment notes

### CI/CD
- `.github/workflows/ci.yml`: on PR → `bun install` → `bun run lint` → `npx tsc --noEmit` → `bun run build`

### Health Check
- `app/api/health/route.ts` returning `{ status: "ok", timestamp }`

---

## Phase 4: Feature Completion

### Email Verification (Resend)
- Install `resend`
- Create Convex action to send magic link via Resend API
- Wire into `emailVerification.ts:sendVerificationEmail`
- Add `RESEND_API_KEY` to env validation

### Rate Limiting
- `contactMessages.send`: 10/min per IP
- `aiContentGenerator.generateBusinessContent`: 5/hour per user
- `reviewFilter.filterAndEnhanceReviews`: 5/hour per user
- Use `@convex-dev/rate-limiter` (already installed)

### Input Validation
- `contactMessages.send`: name 100 chars, email 254 chars validated, message 5000 chars

### Stripe Fixes
- Remove silent fallbacks for price IDs — throw if unset
- Log webhook failures in `convex/router.ts` instead of silently discarding

### Orphan Cleanup
- In `deleteBusiness`: cascade delete `businessClaims`, `stripeCustomers`, `stripeSubscriptions`

### Missing Indexes
- `businesses`: add `by_themeId` index
- `businessClaims`: add index on `emailVerificationToken`
- Fix `businessDomainSync` to use `by_subdomain` index
- Fix `dashboardData` to use `withIndex("by_userId")` instead of `.filter()`
- Fix `pages.updatePage` to remove full-table scan fallback

---

## Phase 5: Quality & Testing

### Test Infrastructure
- Install `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom`
- Create `vitest.config.ts`
- Add `"test": "vitest"` to package.json

### Unit Tests
- Auth guard enforcement tests
- Stripe webhook / subscription lifecycle
- Middleware routing (subdomain, custom domain, auth redirect)
- URL utility tests

### E2E
- Install Playwright
- Smoke test: landing → sign in → create business → edit → publish → view

### Dead Code Removal
- Remove `applyBusinessTemplate.ts` stub
- Remove `/app` subdomain rewrite from middleware
- Fix rate limiter to use `@convex-dev/rate-limiter` instead of claims table proxy

---

## Phase 6: Post-Launch Backlog

- Wire Tinybird to real analytics UI
- Undo/redo in Simple Builder
- Custom domain SSL automation
- Team management / user roles
- Data export (CSV/JSON)
- Performance: virtual scrolling, remaining index optimizations
