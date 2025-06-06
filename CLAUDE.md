# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start

# Lint code
yarn lint

# Run Convex development
npx convex dev
```

### Convex Commands
```bash
# Deploy Convex functions
npx convex deploy

# Generate Convex types
npx convex codegen
```

## Architecture Overview

### Application Type
Locasite is a Business Site Generator SaaS that creates professional websites for businesses by scraping Google Maps data. It uses subdomain-based multi-tenancy where each business gets their own subdomain (e.g., `business-name.locasite.com`).

### Core Technologies
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (database, serverless functions, auth), Next.js API routes
- **AI**: OpenAI SDK for chat features
- **UI**: Custom components built on Radix UI primitives

### Key Architectural Patterns

1. **Subdomain Routing**: The middleware (`middleware.ts`) handles subdomain detection and rewrites requests to appropriate routes:
   - `subdomain.domain.com` → `/subdomain/*`
   - `app.domain.com` → Special app subdomain handling

2. **Convex Integration**:
   - All database operations go through Convex functions in `/convex/`
   - Types are auto-generated in `/convex/_generated/`
   - Authentication uses Convex Auth with GitHub provider
   - Real-time data sync is available via Convex subscriptions

3. **Business Site Components**: Modular architecture in `/app/components/business/`:
   - Each component (hero, info, gallery, reviews, etc.) can be independently edited
   - Components receive data from Convex and render based on theme settings
   - Edit mode allows real-time customization

4. **Data Flow**:
   - User inputs Google Maps URL → Scraper extracts data → Creates business & domain records in Convex
   - Business data includes theme customization (colors, fonts, layout)
   - Pages store content as JSON for flexibility
   - Business owners can claim and edit their sites

5. **Authentication Flow**:
   - Uses Convex Auth with session-based authentication
   - Business claiming requires authentication
   - Edit permissions tied to business ownership

### Important Considerations

- The project is on the `convex-auth` branch, indicating ongoing auth implementation
- Environment variables are required for Convex and authentication
- The app uses server components where possible for performance
- Theme customization is stored per-business in the database
- Gallery images are stored in Convex storage with public URLs