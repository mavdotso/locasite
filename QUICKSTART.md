# Locasite — Quick Start Guide

> Business site generator from Google Maps. Paste a Google Maps URL → get a polished business website.

## Current Status

| Area | Status |
|------|--------|
| Local dev | ⚠️ Needs `npm install` (no node_modules) |
| Environment vars | ✅ `.env.local` has all keys set |
| Convex backend | ✅ `CONVEX_DEPLOYMENT` configured |
| Vercel deployment | ✅ Active (check Vercel dashboard) |
| Stripe | ✅ Keys configured |
| Google Maps API | ✅ Key configured |
| Google Business API | ✅ OAuth configured |

**Readiness estimate:** ~75% — core features built, needs CI/CD + staging environment + error monitoring before public launch.

## Setup (5 min)

```bash
cd ~/Developer/locasite
npm install
npm run dev
```

Open: http://localhost:3000

> **Note:** `.env.local` already has all keys. No manual setup needed for local dev.

## Environment Variables

All required vars are in `.env.local`. Template in `.env.example`.

Key vars:
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — For Maps embed + Places search
- `GOOGLE_BUSINESS_CLIENT_ID/SECRET` — OAuth for Google Business Profile
- `STRIPE_SECRET_KEY` — Payment processing
- `VERCEL_API_TOKEN/PROJECT_ID/TEAM_ID` — For custom domain management via API
- `NEXT_PUBLIC_TINYBIRD_TOKEN` — Analytics

**Missing from `.env.local` (check `.env.example`):**
- `STRIPE_PRICE_PROFESSIONAL` — Price ID for Pro plan
- `STRIPE_PRICE_BUSINESS` — Price ID for Business plan
- `CONVEX_DEPLOY_KEY` — Needed for CI/CD deploys
- `CONVEX_SITE_URL` — Backend callback URL

## Key Scripts

```bash
npm run dev          # Start dev server (Turbopack)
npm run build        # Production build
npm run lint         # Biome + Next.js lint check
npx convex dev       # Run Convex dev server (separate terminal)
```

## Deployment

- **Platform:** Vercel
- **Live URL:** Check Vercel dashboard (project: locasite)
- **Deploy command:** Push to main → auto-deploy via Vercel Git integration
- **Convex:** Separate deployment, update via `npx convex deploy`

## Tech Stack

- **Frontend:** Next.js 15 + Turbopack + Tailwind CSS
- **Backend:** Convex (auth, database, serverless functions)
- **Payments:** Stripe (subscriptions)
- **Maps:** Google Maps API + Google Places
- **Analytics:** Tinybird
- **Custom domains:** Vercel API

## Known Issues / Gaps

- No CI/CD pipeline (GitHub Actions) — deploys require manual push
- No staging environment — everything goes straight to production
- No error monitoring (Sentry or similar) configured
- Google Business API OAuth flow needs end-to-end testing
- Stripe Price IDs missing from `.env.local` — subscription plans may not work

## Next Priorities (from ROADMAP.md)

See `docs/ROADMAP.md` for full roadmap. Phase 1 priorities:
1. Set up staging environment (Vercel preview branch)
2. Add GitHub Actions CI/CD
3. Wire up Stripe Price IDs
4. End-to-end test Google Business OAuth flow
5. Add error monitoring

## Docs

- `docs/MISSION.md` — Product vision and target users
- `docs/ROADMAP.md` — Full feature roadmap and phases

---
*Created: Feb 18, 2026 | Est. to alpha: 1-2 weeks*
