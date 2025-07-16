# AGENTS.md

## Commands

```bash
# Development
bun install                # Install dependencies
bun dev                    # Run dev server with Turbopack
bun run build              # Build for production
bun run lint               # Run ESLint
npx convex dev             # Run Convex development server
npx convex deploy          # Deploy Convex functions
npx convex codegen         # Generate Convex types
npx knip                   # Find unused dependencies/exports

# Tinybird Analytics
cd tinybird                # Navigate to Tinybird directory
tb login                   # Authenticate with Tinybird
tb --cloud deploy          # Deploy data sources and pipes to cloud
tb --cloud open            # Open Tinybird UI
```

## Architecture Overview

### Application Type

Locasite is a Business Site Generator SaaS that creates professional websites for businesses by scraping Google Maps data. It uses subdomain-based multi-tenancy where each business gets their own subdomain (e.g., `business-name.locasite.com`).

### Core Technologies

- **Frontend**: Next.js 15 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Convex (database, serverless functions, auth), Next.js API routes
- **Analytics**: Tinybird for scalable analytics data storage and querying
- **AI**: OpenAI SDK for chat features
- **UI**: Custom components built on Radix UI primitives
- **Package Manager**: Bun (for faster dependency management and builds)
- **Development**: ESLint v9 with flat config, Knip for dead code elimination

### Key Architectural Patterns

1. **Subdomain Routing**: The middleware (`middleware.ts`) handles subdomain detection and rewrites requests to appropriate routes:

   - `subdomain.domain.com` → `/subdomain/*`
   - `app.domain.com` → Special app subdomain handling

2. **Convex Integration**:

   - All database operations go through Convex functions in `/convex/`
   - Types are auto-generated in `/convex/_generated/`
   - Authentication uses Convex Auth with GitHub provider
   - Real-time data sync is available via Convex subscriptions

3. **Visual Editor System**: Advanced drag-and-drop page builder in `/app/components/visual-editor/`:

   - Block-based architecture with basic and container blocks
   - Column layouts with individual drop zones for flexible content arrangement
   - Inline editing capabilities for real-time content updates
   - Field editors for various content types (text, images, buttons, etc.)
   - Layout controls and preview functionality

4. **Simple Builder System**: Simplified page builder in `/app/components/simple-builder/`:

   - Section-based editing with pre-built variations
   - Business type presets for quick setup
   - Inline editing for text and images
   - Mode switching between Simple and Pro (visual editor)

5. **Business Site Components**: Modular architecture in `/app/components/business/`:

   - Each component (hero, info, gallery, reviews, etc.) can be independently edited
   - Components receive data from Convex and render based on theme settings
   - Edit mode allows real-time customization

6. **Data Flow**:

   - User inputs Google Maps URL → Scraper extracts data → Creates business & domain records in Convex
   - Business data includes theme customization (colors, fonts, layout)
   - Pages store content as JSON for flexibility
   - Business owners can claim and edit their sites

7. **Authentication Flow**:

   - Uses Convex Auth with session-based authentication
   - Business claiming requires authentication
   - Edit permissions tied to business ownership

8. **Analytics Integration**:
   - Hybrid mode: Events sent to both Convex (real-time) and Tinybird (analytics)
   - Client-side tracking via `Analytics` class
   - Tinybird handles long-term storage and complex analytics queries

## Code Style Guidelines

### Color System & Design Tokens

- **ONLY use semantic color classes from globals.css** - Never use hardcoded Tailwind neutral colors
- **Forbidden neutral color classes**: `text-gray-*`, `bg-gray-*`, `border-gray-*`, `text-black`, `bg-white`, `text-slate-*`, `bg-neutral-*`, etc.
- **Required semantic color mappings**:
  - `text-gray-500/600` → `text-muted-foreground`
  - `text-gray-900` → `text-foreground`
  - `text-gray-400` → `text-muted-foreground/50`
  - `bg-gray-50/100` → `bg-muted`
  - `bg-white` → `bg-background` or `bg-card`
  - `border-gray-200/300` → `border-border`
- **Colorful classes are allowed**: Keep blue, green, red, orange, purple, amber, etc. for accent colors
- **Exception**: `text-white` is allowed on colored backgrounds for contrast

### TypeScript Typing

- **NEVER use `any` as a type** - Always use proper TypeScript types
- **Use Convex generated types** when working with Convex functions:
  - Import from `convex/_generated/dataModel` for database types
  - Import from `convex/_generated/server` for server types
  - Use `QueryCtx`, `MutationCtx`, `ActionCtx` for context types
- **Prefer strict typing** over loose typing for better code quality and IDE support
- **Prefer interfaces over types**, no enums
- **Use Zod for form validation** and error handling

### Components & Development

- **Components**: Use functional components with React Server Components where possible
- **Naming**: Use `dash-dir` for directories, `handleEvent` for event handlers
- **File Creation**: When rewriting a component from scratch, ALWAYS overwrite the existing file directly. NEVER create files with `-v2`, `-new`, or similar suffixes
- **Imports**: Group imports by external/internal, sort alphabetically
- **Error Handling**: Use early returns, implement error boundaries
- **Styling**: Use Tailwind classes only, no CSS or style tags
- **Accessibility**: Include `aria-label`, `tabindex="0"`, and keyboard handlers

### Performance Optimization

- **Put fetching Convex Queries as far up in hierarchy as possible and pass the needed data to children as props** - avoid repeated fetching of the same data in children of the same parent
- **Minimize use of `useClient`, `useEffect`, `useState`** - prefer server-side solutions
- **Prefer React Server Components (RSC)** and Suspense for better performance
- **Use dynamic imports** for large components
- **Optimize images** for performance (avoid `<img>` tags, use Next.js `<Image>`)

## Convex Patterns

- Define arguments with `v` from `convex/values`
- Use `path+file+export=api.path.name` for function naming
- Prefer indexes over filters for optimized querying
- Use early returns whenever possible to make code more readable

#### Convex Query Pattern

```typescript
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getTaskList = query({
  args: { taskListId: v.id("taskLists") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("taskListId"), args.taskListId))
      .order("desc")
      .take(100);
    return tasks;
  },
});
```

#### Convex Mutation Pattern

```typescript
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const newTaskId = await ctx.db.insert("tasks", { text: args.text });
    return newTaskId;
  },
});
```

## Tinybird Analytics Integration

### Overview

Locasite uses Tinybird for scalable analytics data storage and querying. The integration works in a hybrid mode where:

- Events are sent to both Convex (for real-time features) and Tinybird (for analytics)
- The analytics dashboard can switch between data sources
- Tinybird handles long-term storage and complex analytics queries

### Setup Instructions

1. **Create a Tinybird Account**

   - Sign up at [tinybird.co](https://www.tinybird.co)
   - Create a new workspace for your project

2. **Deploy Tinybird Resources**

   ```bash
   cd tinybird
   tb login
   tb --cloud deploy
   ```

3. **Configure Environment Variables**
   Add to your `.env.local`:

   ```env
   NEXT_PUBLIC_TINYBIRD_API_URL=https://api.tinybird.co
   NEXT_PUBLIC_TINYBIRD_TOKEN=your_token_here
   ```

4. **Load Test Data (Optional)**
   ```bash
   tb --cloud datasource append page_views fixtures/page_views.ndjson
   tb --cloud datasource append events fixtures/events.ndjson
   tb --cloud datasource append sessions fixtures/sessions.ndjson
   ```

### Data Sources

- **page_views**: Tracks all page view events with visitor, session, and page details
- **events**: Stores custom events like clicks, form submissions, and conversions
- **sessions**: Maintains session-level data with aggregated metrics

### Endpoints

- **analytics_summary**: Returns overall analytics metrics for a business
- **top_pages**: Lists the most visited pages with view counts
- **real_time_visitors**: Shows active visitors in the last 5 minutes

### Testing Locally

```bash
tb local start
tb datasource append page_views fixtures/page_views.ndjson
tb pipe data analytics_summary --param business_id=j57d4m5p6q7r8s9t
```

## Business Claims & Verification System

### Overview

Complete business ownership verification system with multiple verification paths:

- Google Business Profile OAuth integration
- Email verification with magic links
- Manual review process for edge cases

### Key Features

- **Publishing Permissions**: Only verified business owners can publish sites
- **Multiple Verification Methods**: Google OAuth, email verification, manual review
- **Rate Limiting**: 5 verification attempts per hour per IP/user
- **Security**: JWT tokens with 24-hour expiry, audit logging
- **Admin Dashboard**: Manual review workflow for complex cases

### Database Schema

```typescript
// businesses table additions
canPublish: v.boolean();
verificationRequired: v.boolean();
publishingBlocked: v.boolean();
verificationMethod: v.optional(
  v.union(v.literal("google"), v.literal("email"), v.literal("manual")),
);
verificationCompletedAt: v.optional(v.number());

// businessClaims table additions
emailVerificationToken: v.optional(v.string());
emailVerificationExpiry: v.optional(v.number());
magicLinkSent: v.boolean();
verificationAttempts: v.number();
```

### API Endpoints

- `/api/auth/google-business/verify-ownership` - Enhanced Google Business verification
- `/api/auth/google-business/check-status` - Check current verification status
- `/api/verification/send-email` - Send magic link verification email
- `/api/verification/verify-token` - Verify email verification token

## Simple Builder System

### Overview

The Simple Builder provides a section-based editing experience as an alternative to the complex visual editor:

- **Default Mode**: Simple mode for non-technical users
- **Pro Mode**: Full visual editor (hidden by default)
- **Business Presets**: Industry-specific section combinations
- **Smart Defaults**: Auto-populated with Google Business data

### Section Variations

Each section type has multiple pre-built variations:

- **Hero Sections**: Center-aligned, split-screen, minimal text-only
- **About Sections**: Text with side image, two-column, timeline format
- **Services Sections**: 3-column cards, list with icons, pricing table
- **Gallery Sections**: Grid layout, masonry grid, before/after comparison
- **Contact Sections**: Form with map, contact info cards, social links focus

### Business Type Presets

- **Restaurant**: Hero, Menu/Services, Gallery, Contact
- **Salon/Beauty**: Hero, Services, Gallery, About, Contact
- **Medical**: Hero, Services, About, Contact
- **Professional**: Hero, About, Services, Contact
- **Retail**: Hero, Products, Gallery, Contact
- **Automotive**: Hero, Services, Gallery, About, Contact

### Data Structure

```typescript
interface SectionVariation {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: "hero" | "about" | "services" | "gallery" | "contact" | "footer";
  components: ComponentData[];
  editableFields: { [componentId: string]: string[] };
}

interface SimplePageData {
  mode: "simple" | "pro";
  sections: {
    id: string;
    variationId: string;
    customData?: Record<string, any>;
  }[];
  components?: ComponentData[]; // For pro mode compatibility
}
```

## Quality Assurance

### Development Workflow

- **ALWAYS run lint and build before completing major refactoring** to ensure code quality
- **Fix all lint and build errors** before considering any refactoring task complete
- Use `bun run lint` to check for code style issues
- Use `bun run build` to verify the application builds successfully
- Address any TypeScript errors, ESLint warnings, or build failures immediately
- **Never leave code in a broken state** - all changes must result in a working application

### Critical Issues to Avoid

1. **TypeScript `any` Usage**: Replace all `any` types with proper interfaces
2. **Forbidden Color Classes**: Use semantic colors only
3. **Missing Alt Attributes**: All images must have alt attributes
4. **Excessive Client Components**: Minimize `use client` usage
5. **Query Duplication**: Fetch data at parent level and pass as props

### Testing and Validation

- Run both lint and build commands as the final step of any significant code changes
- Ensure TypeScript compilation succeeds without errors
- Verify all ESLint rules pass before submitting changes
- Use Knip to identify and remove dead code when refactoring
- Test visual editor functionality when making changes to page building components
- Never modify files in @/components/ui (Shadcn components)

## Important Considerations

- **Google Business Verification**: Complete integration with Google Business Profile API for business claiming
- Environment variables are required for Convex, authentication, Google API, and Tinybird integration
- The app uses server components where possible for performance
- Theme customization is stored per-business in the database with advanced theming options
- Gallery images are stored in Convex storage with public URLs
- **Turbopack**: Development server uses Turbopack for significantly faster builds
- **Visual Editor**: Comprehensive drag-and-drop page builder for business site customization
- **Simple Builder**: Streamlined section-based editor for non-technical users
