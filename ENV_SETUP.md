# Environment Variables Setup Guide

This guide explains which environment variables need to be set in Convex vs Vercel.

## Environment Variables Distribution

### Variables for CONVEX ONLY (set with `npx convex env set`)

These variables are used by Convex backend functions and should ONLY be set in Convex:

```bash
# Google OAuth (used by Convex Auth)
npx convex env set AUTH_GOOGLE_ID "your-google-client-id"
npx convex env set AUTH_GOOGLE_SECRET "your-google-client-secret"

# Google Services
npx convex env set GOOGLE_MAPS_API_KEY "your-google-maps-api-key"
npx convex env set GOOGLE_BUSINESS_CLIENT_ID "your-google-business-client-id"
npx convex env set GOOGLE_BUSINESS_CLIENT_SECRET "your-google-business-client-secret"

# Stripe
npx convex env set STRIPE_SECRET_KEY "sk_..."
npx convex env set STRIPE_WEBHOOKS_SECRET "whsec_..."
npx convex env set STRIPE_PRICE_PROFESSIONAL "price_..."
npx convex env set STRIPE_PRICE_BUSINESS "price_..."

# Tinybird (if used in Convex HTTP endpoints)
npx convex env set NEXT_PUBLIC_TINYBIRD_TOKEN "your-tinybird-token"

# Application URLs (for Convex functions that generate links)
npx convex env set NEXT_PUBLIC_APP_URL "https://your-domain.com"
npx convex env set NEXT_PUBLIC_ROOT_DOMAIN "your-domain.com"
```

### Variables for VERCEL ONLY (set in Vercel Dashboard or CLI)

These variables are used by the Next.js application:

```bash
# Convex Connection
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# All client-side variables (NEXT_PUBLIC_*)
NEXT_PUBLIC_ROOT_DOMAIN=locasite.xyz
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX=vercel.app
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_BUSINESS_CLIENT_ID=your-google-business-client-id
NEXT_PUBLIC_TINYBIRD_API_URL=https://api.tinybird.co
NEXT_PUBLIC_TINYBIRD_TOKEN=your-tinybird-token

# Server-side variables used by Next.js
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_BUSINESS_CLIENT_SECRET=your-google-business-client-secret
GOOGLE_SITE_VERIFICATION=your-verification-code
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOKS_SECRET=whsec_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_BUSINESS=price_...

# Vercel API (optional)
VERCEL_API_TOKEN=your-vercel-api-token
VERCEL_PROJECT_ID=your-project-id
VERCEL_TEAM_ID=your-team-id

# Convex Auth variables (for Next.js server-side auth checks)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret
```

## Setup Steps

1. **Local Development (.env.local)**
   - Copy `.env.example` to `.env.local`
   - Fill in all values for local development
   - This file contains ALL variables for convenience

2. **Convex Production**
   - Use `npx convex env set` for each Convex-only variable
   - List current variables: `npx convex env list`
   - Remove a variable: `npx convex env unset VARIABLE_NAME`

3. **Vercel Production**
   - Go to Vercel Dashboard > Project Settings > Environment Variables
   - Add each Vercel-only variable
   - Or use Vercel CLI: `vercel env add`

## Important Notes

- **AUTH_GOOGLE_ID** and **AUTH_GOOGLE_SECRET** need to be in BOTH Convex (for auth) and Vercel (for server-side checks)
- **GOOGLE_MAPS_API_KEY** needs to be in BOTH places (with NEXT_PUBLIC_ prefix for client)
- Some variables like **STRIPE_SECRET_KEY** might be needed in both places depending on your implementation
- The Convex deployment URL must match between your Convex backend and NEXT_PUBLIC_CONVEX_URL

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google Identity API
4. Create OAuth 2.0 credentials
5. Add redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://your-deployment.convex.site/api/auth/callback/google`
6. Copy Client ID and Client Secret