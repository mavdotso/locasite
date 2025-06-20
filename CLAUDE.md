# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies
bun install

# Run development server (uses Turbopack for faster builds)
bun dev

# Build for production
bun run build

# Start production server
bun start

# Lint code
bun run lint

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
- **Frontend**: Next.js 15 (App Router with Turbopack), React 19, TypeScript, Tailwind CSS v4
- **Backend**: Convex (database, serverless functions, auth), Next.js API routes
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

4. **Business Site Components**: Modular architecture in `/app/components/business/`:
   - Each component (hero, info, gallery, reviews, etc.) can be independently edited
   - Components receive data from Convex and render based on theme settings
   - Edit mode allows real-time customization

5. **Data Flow**:
   - User inputs Google Maps URL → Scraper extracts data → Creates business & domain records in Convex
   - Business data includes theme customization (colors, fonts, layout)
   - Pages store content as JSON for flexibility
   - Business owners can claim and edit their sites

6. **Authentication Flow**:
   - Uses Convex Auth with session-based authentication
   - Business claiming requires authentication
   - Edit permissions tied to business ownership

### Important Considerations

- **Theme v2**: Recently implemented major theme system overhaul with enhanced customization capabilities
- **Google Business Verification**: Complete integration with Google Business Profile API for business claiming
- Environment variables are required for Convex, authentication, and Google API integration
- The app uses server components where possible for performance
- Theme customization is stored per-business in the database with advanced theming options
- Gallery images are stored in Convex storage with public URLs
- Never change files inside @/components/ui. They are preset components from Shadcn.
- **Turbopack**: Development server uses Turbopack for significantly faster builds
- **Visual Editor**: Comprehensive drag-and-drop page builder for business site customization

## Code Quality Rules

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

### Convex Best Practices
- **Use `path+file+export=api.path.name`** for function naming
- **Nest files** like `convex/foo/file.ts=api.foo.file.fn`
- **Always define arguments explicitly** and serialize them with `v` from `convex/values`
- **Prefer Convex indexes over filters** for optimized querying
- **Use early returns** whenever possible to make code more readable

#### Convex Query Pattern
```typescript
import { query } from './_generated/server';
import { v } from 'convex/values';

export const getTaskList = query({
    args: { taskListId: v.id('taskLists') },
    handler: async (ctx, args) => {
        const tasks = await ctx.db
            .query('tasks')
            .filter((q) => q.eq(q.field('taskListId'), args.taskListId))
            .order('desc')
            .take(100);
        return tasks;
    },
});
```

#### Convex Mutation Pattern
```typescript
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const createTask = mutation({
    args: { text: v.string() },
    handler: async (ctx, args) => {
        const newTaskId = await ctx.db.insert('tasks', { text: args.text });
        return newTaskId;
    },
});
```

### Development Workflow
- **ALWAYS run lint and build before completing major refactoring** to ensure code quality
- **Fix all lint and build errors** before considering any refactoring task complete
- **Code review with 3x check** - verify functionality thoroughly
- **Run code first before committing** - test all changes
- Use `bun run lint` to check for code style issues
- Use `bun run build` to verify the application builds successfully
- Address any TypeScript errors, ESLint warnings, or build failures immediately
- **Never leave code in a broken state** - all changes must result in a working application

### Code Implementation Guidelines
- **Use early returns** whenever possible to make code more readable
- **Always use Tailwind classes** for styling HTML elements; avoid using CSS or style tags
- **Use descriptive variable and function names** - event functions should be named with "handle" prefix (e.g., `handleClick`, `handleKeyDown`)
- **Implement accessibility features** - use `tabindex="0"`, `aria-label`, click/keydown handlers
- **Use concise TypeScript** with functional components
- **Modular structure** with static typing and explicit components
- **Utilize subcomponents** for reusability
- **Implement error boundaries** and early logging

### Naming Conventions
- **Use `dash-dir`** for directory names, named exports
- **Prefer interfaces over types**, no enums
- **Function components over class components**
- **Concise function syntax** with declarative JSX
- **Descriptive variable names** with clear intent

### Performance Optimization
- **Minimize use of `useClient`, `useEffect`, `useState`** - prefer server-side solutions
- **Prefer React Server Components (RSC)** and Suspense for better performance  
- **Use dynamic imports** for large components
- **Optimize images** for performance (avoid `<img>` tags, use Next.js `<Image>`)
- **Utilize `nuqs`** for URL handling
- **Follow Web Vitals** best practices
- **Limit `useClient` usage** to only when absolutely necessary

### Testing and Quality Assurance
- Run both lint and build commands as the final step of any significant code changes
- Ensure TypeScript compilation succeeds without errors
- Verify all ESLint rules pass before submitting changes  
- Use Knip to identify and remove dead code when refactoring
- Test visual editor functionality when making changes to page building components