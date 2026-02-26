# Locasite

Paste a Google Maps link, get a professional website for your local business -- live in one click.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4, Radix UI primitives
- **Backend**: Convex (database, serverless functions, real-time sync, auth)
- **Payments**: Stripe (subscriptions, webhooks)
- **APIs**: Google Maps / Places, Google Business Profile OAuth
- **AI**: OpenAI SDK (content generation)
- **Analytics**: Tinybird (scalable event storage and querying)
- **Monitoring**: Sentry
- **Email**: Resend (magic link verification)
- **Testing**: Vitest (unit), Playwright (E2E)
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 20+
- [Bun](https://bun.sh) (`curl -fsSL https://bun.sh/install | bash`)
- [Convex CLI](https://docs.convex.dev) (`npm install -g convex`)

### Setup

```bash
git clone <repo-url> && cd locasite
bun install
cp .env.example .env.local   # fill in required values
```

### Run the dev server

You need two terminals -- one for Next.js and one for Convex:

```bash
# Terminal 1 - Next.js dev server (Turbopack)
bun dev

# Terminal 2 - Convex dev server (syncs functions + schema)
npx convex dev
```

The app will be available at `http://localhost:3000`.

## Scripts

| Script | Command | Description |
| --- | --- | --- |
| `dev` | `bun dev` | Start Next.js dev server with Turbopack |
| `build` | `bun run build` | Production build |
| `start` | `bun start` | Start production server |
| `lint` | `bun run lint` | Run ESLint |
| `test` | `bun run test` | Run Vitest in watch mode |
| `test:run` | `bun run test:run` | Run Vitest once (CI) |
| `test:e2e` | `bun run test:e2e` | Run Playwright E2E tests |

Additional commands:

```bash
npx convex dev              # Convex dev server
npx convex deploy           # Deploy Convex functions to production
npx knip                    # Find unused dependencies/exports
```

## Project Structure

```
app/
  (pages)/          # Next.js route groups (site pages, dashboard, editor)
  api/              # API routes (webhooks, verification endpoints)
  components/       # React components (business/, simple-builder/, visual-editor/, ui/)
  hooks/            # Custom React hooks
  lib/              # Shared utilities
  types/            # TypeScript type definitions
convex/
  _generated/       # Auto-generated types and API (do not edit)
  *.ts              # Database schema, queries, mutations, actions
e2e/                # Playwright E2E test specs
__tests__/          # Vitest unit tests
tinybird/           # Tinybird data sources, pipes, and fixtures
middleware.ts       # Subdomain routing and rewrites
env.ts              # Environment variable validation (t3-env)
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

### Required

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL |
| `NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_BUSINESS_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_MAPS_API_KEY` | Server-side Google Maps API key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOKS_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_PROFESSIONAL` / `STRIPE_PRICE_BUSINESS` | Stripe price IDs for plans |
| `NEXT_PUBLIC_TINYBIRD_TOKEN` / `TINYBIRD_WRITE_TOKEN` | Tinybird read and write tokens |
| `OPENAI_API_KEY` | OpenAI API key (AI content generation) |
| `CLIENT_ORIGIN` | CORS origin for Convex HTTP endpoints |
| `RESEND_API_KEY` | Resend API key (email verification) |

### Optional

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_ROOT_DOMAIN` / `NEXT_PUBLIC_APP_URL` | Domain configuration |
| `VERCEL_API_TOKEN` / `VERCEL_PROJECT_ID` / `VERCEL_TEAM_ID` | Custom domain management via Vercel API |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Public-facing Maps key (client-side) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error monitoring |
| `NEXT_PUBLIC_TINYBIRD_API_URL` | Tinybird API base URL |

## Deployment

### Vercel (Next.js frontend)

1. Connect the repo to Vercel.
2. Set all required environment variables in the Vercel dashboard.
3. Set the build command to `bun run build` and install command to `bun install`.
4. Configure wildcard subdomain (`*.locasite.xyz`) for multi-tenant routing.

### Convex (backend)

```bash
npx convex deploy
```

Set environment variables in the Convex dashboard for production (Stripe keys, Google API keys, etc.).

### Tinybird (analytics)

```bash
cd tinybird
tb login
tb --cloud deploy
```

## Testing

### Unit tests (Vitest)

```bash
bun run test          # watch mode
bun run test:run      # single run (CI)
```

### E2E tests (Playwright)

```bash
npx playwright install   # first time only -- install browsers
bun run test:e2e
```

Test files live in `__tests__/` (unit) and `e2e/` (end-to-end).
