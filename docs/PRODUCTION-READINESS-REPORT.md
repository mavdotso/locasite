# PRODUCTION READINESS REPORT — Locasite

**Date:** 2026-02-25
**Score:** 31/100

## Executive Summary

Locasite scores **31/100** on production readiness. The application has a solid frontend architecture and well-structured Convex schema, but suffers from **critical security vulnerabilities** (13+ unauthenticated/unauthorized endpoints exposing all business data), **zero test coverage** (0 tests across 216 source files), and **no CI/CD, monitoring, or error tracking**. The Stripe integration is nearly complete but several core features (email verification, analytics, business templates) are stubbed out. Estimated effort to a defensible MVP: **4–6 weeks** of focused work.

---

## Readiness Score Breakdown

| Dimension | Score | Status | Notes |
|-----------|-------|--------|-------|
| Data Model | 10/20 | 🟡 | 10 tables well-structured, but 28 issues: missing indexes, orphan refs, no migration strategy, OAuth tokens leaked via queries |
| Backend Logic | 5/20 | 🔴 | 4 critical auth/authz gaps, 13+ unauthenticated endpoints, 3 stubbed features, CORS defaults to `"*"` |
| Frontend UX | 12/20 | 🟡 | 19 of 22 routes complete, but 0 `loading.tsx`/`error.tsx` files, 3 dead links, fake analytics UI, WCAG zoom violation |
| Testing & QA | 1/20 | 🔴 | 0 test files, no test runner installed, no CI/CD, no `.env.example`, TypeScript strict mode is the only quality gate |
| Infrastructure | 3/20 | 🔴 | No security headers, no monitoring/Sentry, no health checks, no README, Tinybird write token possibly exposed client-side |
| **TOTAL** | **31/100** | | |

**Status legend:** 🟢 Production-ready | 🟡 Needs work | 🔴 Blocker

---

## Feature Inventory

| Feature | Status | Completeness | MVP Critical? | Notes |
|---------|--------|-------------|---------------|-------|
| Auth (GitHub OAuth) | Built | 90% | Yes | Works, but redirect to `/app` subdomain is dead code |
| Business creation (scrape) | Built | 85% | Yes | Rate-limited, functional, but `placeId` uniqueness has race condition |
| Simple Builder (editor) | Built | 85% | Yes | Solid section-based editor, missing undo/redo |
| Visual Editor (Pro) | Built | 100% | No | Complete but reserved for future; excluded from knip analysis |
| Business site rendering | Built | 90% | Yes | Subdomain + custom domain routing works |
| Custom domains | Built | 70% | No | DNS verification code exists but Vercel IPs hardcoded, SSL mutation has no auth |
| Business claiming | Partial | 40% | Yes | Google OAuth works; email verification sends no email; phone is "Coming Soon" |
| Analytics dashboard | Stub | 5% | No | "Coming Soon" overlay on fake hardcoded data |
| Tinybird analytics backend | Built | 80% | No | Schema + endpoints ready, token security concern |
| Stripe billing | Built | 80% | Yes | Full lifecycle, but silent webhook failures, price ID fallback issue |
| Contact messages | Built | 60% | No | Works but no auth on read/mark, no rate limiting on send |
| AI content generation | Built | 70% | No | GPT-4o integration works, `OPENAI_API_KEY` undocumented, no rate limiting |
| Business templates | Stub | 0% | No | `applyBusinessTemplate.ts` returns `{ success: false }` always |
| Email verification | Stub | 15% | Yes | Token generation works but `// TODO: Integrate with email service` |
| Privacy/Terms pages | Missing | 0% | Yes | Footer and sign-in link to `/privacy` and `/terms` — 404s |
| `/dashboard/claims` route | Missing | 0% | Yes | 5 redirects point to this nonexistent page |

---

## Critical Blockers (MUST fix before launch)

1. **Unauthenticated data exposure** — `businesses.list`, `businesses.listByUser`, `businesses.getById`, `businessEditData.getBusinessEditData`, `dashboardData.getDashboardBusinessData`, `pages.listByDomain`, `domains.list` all return full records (including drafts, user IDs, OAuth tokens) with zero auth checks. Any client can enumerate every business in the system. **Files:** `convex/businesses.ts:299-358`, `convex/businessEditData.ts:4`, `convex/dashboardData.ts:5`, `convex/pages.ts:544`, `convex/domains.ts:176`. **Effort: M**

2. **OAuth token leakage** — `getById` returns `googleBusinessAuth` (access + refresh tokens) to any caller. The `getBusinessPublic` query correctly strips this, but `getById` does not. **File:** `convex/businesses.ts:299-304`. **Effort: S**

3. **`updateSslStatus` mutation has no auth** — Any user can set any domain's SSL status to any value. Acknowledged in a code comment but unfixed. **File:** `convex/customDomains.ts:551-570`. **Effort: S**

4. **CORS defaults to wildcard `"*"`** — `CLIENT_ORIGIN` falls back to `"*"` if unset, making the `/scrape` endpoint open to cross-origin abuse. **File:** `convex/lib/env.ts:3`. **Effort: S**

5. **Missing pages that are actively linked** — `/privacy`, `/terms`, and `/dashboard/claims` are 404s referenced from sign-in ToS, footer, and 5 claim-flow redirects. Users hit dead ends during critical flows. **Effort: S**

6. **No security headers** — No HSTS, X-Frame-Options, X-Content-Type-Options, CSP, or Referrer-Policy configured anywhere. The app is vulnerable to clickjacking and MIME-type sniffing. **File:** `next.config.ts` (needs `headers()` function). **Effort: S**

7. **Tinybird write token exposed client-side** — `NEXT_PUBLIC_TINYBIRD_TOKEN` is used for both reading AND writing analytics data. If this is a write-capable token, anyone can inject fake analytics. **File:** `app/lib/tinybird.ts`. **Effort: S**

---

## High Priority (SHOULD fix before launch)

8. **Contact messages: no auth on read/update, no rate limit on send** — Anyone can read all messages for any business and mark them as read. Public send endpoint has no rate limiting or input length validation. **File:** `convex/contactMessages.ts:6-52`. **Effort: M**

9. **`storage.ts:generateUploadUrl` has no auth** — Anyone can generate upload URLs and consume storage quota without authentication. **File:** `convex/storage.ts:5`. **Effort: S**

10. **`storage.ts:storeFile` has no ownership check** — Any authenticated user can overwrite any business's logo. **File:** `convex/storage.ts:12-44`. **Effort: S**

11. **`businesses.publish` bypasses verification** — Three separate publish mutations exist (`publish`, `publishDraft`, `publishBusiness`), but only `publishBusiness` checks permissions. A user can call `publish` directly and skip verification. **File:** `convex/businesses.ts` + `convex/businessPublishing.ts`. **Effort: M**

12. **Zero `loading.tsx` / `error.tsx` files** — No Next.js App Router loading skeletons or error boundaries. Dashboard pages show blank flashes while data loads. **Effort: M**

13. **Email verification is non-functional** — `sendVerificationEmail` generates tokens but has `// TODO: Integrate with email service`. Users who choose email verification receive nothing. **File:** `convex/emailVerification.ts:81`. **Effort: M**

14. **`publishDraft` drops theme changes** — When publishing a draft, `themeId` and `themeOverrides` are silently discarded. Theme changes saved as draft are lost. **File:** `convex/businesses.ts:776-798`. **Effort: S**

15. **WCAG zoom violation** — Both layouts set `user-scalable=no`, preventing mobile zoom for low-vision users. **Files:** `app/layout.tsx`, `app/(pages)/layout.tsx`. **Effort: S**

16. **No error monitoring (Sentry)** — 43 `console.error` calls go to browser consoles with no aggregation, alerting, or tracking. **Effort: M**

---

## Nice to Have (CAN defer post-launch)

17. **Missing indexes causing full table scans** — 5 queries scan entire tables: theme deletion check, email token verification, domain sync, dashboard user businesses, rate limiting. **Effort: M**

18. **Subdomain uniqueness race condition** — Polling loop (up to 100 iterations) with no atomicity guarantee. **File:** `convex/domains.ts:88-106`. **Effort: M**

19. **Stripe price ID silent fallbacks** — `STRIPE_PRICE_PROFESSIONAL` falls back to literal `"price_professional_monthly"` instead of failing. **File:** `convex/lib/env.ts`. **Effort: S**

20. **Orphan cleanup on business deletion** — `businessClaims`, `stripeCustomers`, `stripeSubscriptions`, and potentially themes are never cleaned up. **Effort: M**

21. **Analytics feature** — Currently a "Coming Soon" overlay on fake data. Real Tinybird backend exists. **Effort: L**

22. **Undo/redo in Simple Builder** — Missing for the primary editing experience. **Effort: L**

23. **`OPENAI_API_KEY` undocumented** — Works but invisible to env validation. No rate limiting on AI endpoints. **Effort: S**

---

## What's Working Well

- **Convex schema is well-structured** — 10 tables with proper `v.*` validators, good index coverage on primary access patterns, clear domain separation
- **Simple Builder architecture** — Section-based editing with variation presets per business type is solid and user-friendly
- **Subdomain routing** — The middleware handles subdomain detection, custom domains, auth redirects, and sitemap proxying comprehensively
- **Stripe integration** — Near-complete lifecycle: checkout session creation, webhook handling with signature verification, subscription management, customer portal
- **Tinybird analytics schema** — Well-partitioned data sources with 90-day TTL, proper endpoint parameterization, and fixture data for testing
- **Rate limiting on scrape endpoint** — Uses `@convex-dev/rate-limiter` component correctly (3 preview / 5 creation per minute)
- **TypeScript strictness** — `strict: true` in tsconfig, only 3 type suppressions in the entire codebase (2 `as any`, 1 `@ts-expect-error`)
- **Code quality conventions** — Semantic color system, dash-dir naming, Radix-based UI components, proper `@t3-oss/env` validation on the frontend
- **Auth flow** — Convex Auth with GitHub OAuth, session management, and proper redirect sanitization
- **Business site rendering** — Complete end-to-end: scrape Google Maps → generate site → serve on subdomain

---

## Recommended MVP Scope

| Priority | Feature | Current State | Work Remaining | Effort |
|----------|---------|---------------|----------------|--------|
| P0 | Auth/authz on all endpoints | 13+ endpoints exposed | Add auth guards + ownership checks to all queries/mutations | M |
| P0 | Security hardening | CORS `"*"`, no headers, token leak | Fix CORS default, add security headers, scope Tinybird token | S |
| P0 | Missing legal/claims pages | 404s on active links | Create `/privacy`, `/terms`, `/dashboard/claims` pages | S |
| P0 | Publish flow unification | 3 conflicting mutations | Consolidate into single publish path with permission checks | M |
| P1 | Error monitoring | None | Integrate Sentry for frontend + backend | M |
| P1 | Loading/error states | 0 files | Add `loading.tsx` and `error.tsx` to key routes | M |
| P1 | Email verification | Token-only, no email sent | Integrate Resend/SendGrid for magic link emails | M |
| P1 | `.env.example` + README | Missing | Document all 15+ required/optional env vars | S |
| P1 | CI/CD pipeline | None | GitHub Actions: lint + typecheck + build on PR | M |
| P2 | Contact form hardening | No auth, no rate limit | Add ownership auth on read, rate limit on send | S |
| P2 | Draft publishing fix | Theme changes dropped | Include `themeId`/`themeOverrides` in `publishDraft` | S |
| P2 | Basic test suite | 0 tests | Vitest + critical path tests (auth, billing, publish) | L |

---

## Suggested Roadmap

```
Phase 1: Fix Security Blockers (~1 week)
  - Add auth guards to all 13+ unprotected endpoints
  - Strip OAuth tokens from getById / make internal
  - Add auth to updateSslStatus, generateUploadUrl, storeFile
  - Fix CORS wildcard default
  - Add HTTP security headers (HSTS, CSP, X-Frame-Options)
  - Scope Tinybird token to read-only or proxy through API route
  - Unify publish mutations behind permission check

Phase 2: Critical UX Gaps (~1 week)
  - Create /privacy, /terms pages (even if placeholder legal text)
  - Create /dashboard/claims route
  - Add loading.tsx to dashboard, business, and edit routes
  - Add error.tsx to dashboard and editor routes
  - Fix WCAG zoom violation (remove user-scalable=no)
  - Remove fake analytics data / clean up Coming Soon overlay
  - Fix publishDraft to preserve theme changes

Phase 3: Infrastructure & Monitoring (~1 week)
  - Integrate Sentry (frontend error boundary + Convex action wrapper)
  - Create .env.example documenting all env vars
  - Write README with setup instructions
  - Set up GitHub Actions (lint + typecheck + build)
  - Add /api/health endpoint
  - Document OPENAI_API_KEY requirement

Phase 4: Feature Completion (~1-2 weeks)
  - Integrate email service (Resend) for verification magic links
  - Add rate limiting to contact form + AI generation endpoints
  - Add input length validation to contact messages
  - Fix Stripe price ID fallbacks (fail loudly)
  - Add ownership cleanup on business deletion (claims, stripe records)
  - Fix missing index queries (5 full table scans)

Phase 5: Quality & Testing (~1-2 weeks)
  - Set up Vitest + React Testing Library
  - Write tests for: auth flow, Stripe webhooks, publish flow, middleware routing
  - Add E2E smoke test (Playwright): create business → edit → publish → view
  - Fix rate limiter to use proper rate-limiter component instead of claims table proxy
  - Remove dead code: applyBusinessTemplate stub, /app subdomain rewrite

Phase 6: Post-Launch (backlog)
  - Analytics dashboard (connect Tinybird backend to real UI)
  - Undo/redo in Simple Builder
  - Custom domain SSL automation
  - Team management / user roles
  - Data export functionality
  - Performance optimization (missing indexes, virtual scrolling)
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Data breach via unauthenticated endpoints | **High** | **High** | Phase 1: Add auth to all endpoints immediately |
| OAuth token theft via `getById` | **High** | **High** | Phase 1: Strip `googleBusinessAuth` or make internal |
| Spam flood on contact forms | **High** | **Medium** | Phase 4: Add rate limiting + length validation |
| Stripe webhook failures go undetected | **Medium** | **High** | Phase 3: Add Sentry + fix silent error swallowing |
| Fake analytics injection via exposed Tinybird token | **Medium** | **Medium** | Phase 1: Scope token to read-only pipe token |
| Duplicate businesses from placeId race condition | **Medium** | **Medium** | Phase 5: Add server-side dedup or unique constraint workaround |
| AI cost runaway (no rate limit on GPT-4o calls) | **Medium** | **Medium** | Phase 4: Add per-user rate limiting on AI endpoints |
| Environment misconfiguration in production | **Medium** | **High** | Phase 3: `.env.example` + fail-loud on missing required vars |
| User trust loss from 404s on legal pages | **High** | **Medium** | Phase 2: Create privacy/terms pages before launch |
| Silent data loss on business deletion (orphan records) | **Low** | **Medium** | Phase 4: Add cascade cleanup |

---

## Detailed Audit Data

### Schema & Data Model (28 issues found)

#### Tables: 10 application + auth tables

1. `themes` — 4 indexes, well-structured
2. `domains` — 2 indexes, 17 fields
3. `pages` — 1 index, uses JSON blob for content
4. `businesses` — 4 indexes, 30+ fields (largest table)
5. `businessClaims` — 4 indexes, claim lifecycle tracking
6. `contactMessages` — 3 indexes, message lifecycle
7. `mediaLibrary` — 7 indexes (most indexed table), soft-delete pattern
8. `stripeCustomers` — 1 index, user-to-Stripe mapping
9. `stripeSubscriptions` — 1 index, subscription lifecycle
10. `payments` — 3 indexes, payment records

#### Missing Indexes
- `businesses.themeId` — no index, full table scan on theme deletion check
- `businessClaims.emailVerificationToken` — no index, full scan on token verification
- `domains` in `businessDomainSync` — uses `.collect()` instead of `by_subdomain` index
- `dashboardData` — uses `.filter()` bypassing available `by_userId` index
- No composite `[userId, createdAt]` index for rate limiting

#### Orphan References
- Deleting a domain doesn't atomically cascade to pages
- Themes with `businessId` linger after business deletion
- `stripeCustomers`/`stripeSubscriptions` never cleaned up on user deletion
- `businessClaims` not cleaned up on business deletion
- `mediaLibrary.userId` optional but required for ownership

#### Schema Issues
- `stripeSubscriptions.status` is `v.string()` not a union of known Stripe statuses
- `businesses.reviews[].rating` typed as `string` instead of `number`
- `businesses.userId` optional but ownership logic treats as required
- `domains.updatedAt` optional but should be required
- `pages.isPublished` optional, reads as `undefined` not `false`
- `googleBusinessAuth` stores OAuth tokens inline in business document
- No migration strategy, no schema versioning

### Backend Functions (27 files, 10 TODOs)

#### Unauthenticated Endpoints (Full List)
- `businesses.getById` — returns full record including OAuth tokens
- `businesses.list` — returns all businesses, no limit enforcement
- `businesses.listByUser` — BOLA: enumerate any user's businesses
- `businessEditData.getBusinessEditData` — full business + pages + domain
- `dashboardData.getDashboardBusinessData` — business + domain + message count
- `contactMessages.getByBusiness` — read all contact messages for any business
- `contactMessages.markAsRead` — mark any message as read
- `contactMessages.markAsResponded` — mark any message as responded
- `pages.listByDomain` — all pages including drafts
- `domains.list` — all domains including verification tokens
- `customDomains.updateSslStatus` — mutate any domain's SSL status
- `storage.generateUploadUrl` — generate upload URLs without auth
- `mediaLibrary.trackUsage` — inflate usage counters for any file

#### Stubbed Features
- `applyBusinessTemplate.ts` — 7 TODOs, always returns `{ success: false }`
- `emailVerification.ts` — `// TODO: Integrate with email service`
- `regenerateAI.ts` — `// TODO: Implement review filtering`

#### Hardcoded Values
- `CLIENT_ORIGIN` defaults to `"*"`
- `locasite.xyz` hardcoded as domain fallback
- `cname.vercel-dns.com` hardcoded in DNS records
- Vercel IPs `76.76.21.21`, `76.223.126.88` hardcoded
- Direct `process.env` access bypassing `convexEnv` in 6+ locations

### Frontend (22 routes, 167 source files)

#### Route Status
- 16 complete routes
- 3 stub/partial routes (analytics, claim verification, demo)
- 3 missing routes (`/dashboard/claims`, `/privacy`, `/terms`)

#### Loading/Error Coverage
- 0 `loading.tsx` files
- 0 `error.tsx` files
- 3 manual Suspense fallbacks (dashboard layout, settings, billing)
- 1 ErrorBoundary usage (dashboard layout)

#### Accessibility
- `user-scalable=no` in both layouts — WCAG 1.4.4 violation
- Only 8 `aria-label` usages across entire app
- Google Sign-In button icon not labeled
- External link icons missing `aria-hidden="true"`

#### Dead Code
- `/app` subdomain rewrite in middleware → no `/app` directory exists
- `window.location.href = "#contact"` in pricing → no `#contact` section
- `handleSaveGeneralSettings` shows success toast but saves nothing
- Analytics UI renders fake data under Coming Soon overlay

### Testing (0 coverage)

- 0 test files for 216 source files
- No Jest/Vitest/Playwright/Cypress installed
- No `test` script in package.json
- No `.github/workflows/` directory
- No `.env.example` file
- 3 type safety suppressions (2 `as any`, 1 `@ts-expect-error`)
- ESLint: Next.js baseline config, `no-unused-vars` set to warn not error

### Infrastructure

- No `vercel.json` — relies on auto-detection
- No security headers configured
- No Sentry or error monitoring
- No health check endpoint
- No README.md
- No `.env.example`
- No CI/CD pipeline
- Convex hostname hardcoded in `next.config.ts`
- Stripe webhook failures silently discarded
- Tinybird write token possibly exposed client-side via `NEXT_PUBLIC_` prefix
