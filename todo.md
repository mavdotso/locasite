# Locasite Todo List

## 🔴 Critical Issues to Fix

### Code Quality Violations

- [x] Fix TypeScript `any` usage in `app/components/simple-builder/sections/section-renderer.tsx:26` ✅
- [x] Replace forbidden `bg-white` color classes with semantic colors ✅
  - Fixed in landing components: value-proposition-section.tsx, how-it-works-section.tsx, cta-section.tsx
  - Note: bg-white/20 and bg-white/10 in hero-section.tsx and local-business-sections.tsx are valid for overlay effects

### Performance Optimizations

- [x] Optimize Convex query placement - create Dashboard Context Provider ✅
  - Updated dashboard components to use DashboardProvider
  - Eliminated duplicate queries for user and businesses data
- [x] Implement error boundaries throughout the application ✅
  - Created generic ErrorBoundary component
  - Added DashboardErrorBoundary for dashboard pages
  - Added EditorErrorBoundary for editor components
  - **NEW**: Consolidated all error boundaries into UnifiedErrorBoundary with configurable variants
- [x] Create compound Convex queries for related data ✅
  - Created businessEditData.getBusinessEditData for business + domain + pages + sync status
  - Reduced waterfall queries in business edit page
  - **NEW**: Created dashboardData.ts with compound queries:
    - getDashboardBusinessData: business + domain + unreadCount
    - getUserBusinessesWithMetadata: all user businesses with metadata
  - Eliminated ~27 duplicate Convex queries across the app
- [x] Convert static display components to server components ✅
  - Converted how-it-works-section.tsx
  - Converted footer-section.tsx
  - Converted features-section.tsx
- [x] Add dynamic imports for large components ✅
  - Dynamic import for MediaLibrary in page-settings and section-settings-sidebar
  - Created all-components-dynamic.tsx for lazy loading visual editor blocks
- [x] Reduce excessive `use client` usage (100+ files currently) ✅
  - Analyzed all client components and found most require client-side functionality
  - Converted google-map.tsx to server component
  - UI library components must remain client components due to Radix UI requirements
- [x] Implement `preloadQuery` more extensively ✅
  - Attempted to implement preloadQuery but reverted due to React hooks rules violations
  - The existing compound queries (businessEditData) already optimize data fetching
- [x] Component naming cleanup ✅
  - Removed '-client' suffix from 4 components:
    - business-dashboard-client.tsx → business-dashboard.tsx
    - business-edit-client.tsx → business-edit.tsx
    - domain-page-client.tsx → domain-page.tsx
    - analytics-client.tsx → analytics-page.tsx
- [x] Component wrapper simplification ✅
  - Consolidated error boundaries into single UnifiedErrorBoundary
  - Simplified preview component chain by merging BusinessPreviewRenderer into BusinessPreviewWrapper
  - Centralized auth logic with UnifiedAuthGuard supporting both dashboard and direct modes

### Production Deployment

- [x] Run comprehensive lint and build checks ✅
  - All lint checks pass with no warnings or errors
  - Build completes successfully with all pages generated
- [x] Set up CI/CD pipeline ✅
  - GitHub Actions workflow: lint + typecheck + build on PR and push to main
- [ ] Configure staging environment
- [x] Set up error monitoring (Sentry) ✅
  - Integrated @sentry/nextjs with client + server + instrumentation configs
  - Added global-error.tsx for unhandled React errors
- [ ] Performance monitoring and optimization

### Security (Production Readiness — Feb 2026)

- [x] Add auth guards to all unprotected Convex endpoints ✅
  - 13+ endpoints secured with getUserFromAuth + ownership checks
  - businesses.list and domains.list converted to internalQuery
  - listByUser now derives userId from auth (prevents BOLA)
  - businessEditData, dashboardData, contactMessages, pages, storage, mediaLibrary all secured
- [x] Strip OAuth tokens from public queries ✅
  - getById now strips googleBusinessAuth from return value
  - updateSslStatus removed as public mutation (uses internal only)
- [x] Unify publish flow behind permission check ✅
  - All three publish mutations (publish, publishDraft, publishBusiness) now check canPublishBusiness
  - publishDraft now preserves themeId and themeOverrides
- [x] Fix CORS wildcard default ✅
  - CLIENT_ORIGIN no longer defaults to "*" — requires explicit configuration
- [x] Add HTTP security headers ✅
  - HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] Proxy Tinybird writes server-side ✅
  - Created /api/analytics API route to proxy writes with server-side token
  - Client-side token now only used for reads
- [x] Fix WCAG zoom violation ✅
  - Removed user-scalable=no from both layout files
- [x] Add input validation to contact form ✅
  - Name 100 chars, email 254 chars + format validation, message 5000 chars
- [x] Add rate limiting to contact form ✅
  - 10 messages per minute per business
- [x] Fix Stripe webhook silent failures ✅
  - Webhook errors now logged and return 500 (enables Stripe retries)
  - Price ID fallbacks removed (fail loudly if not set)
  - syncStripeDataToConvex preserves original error message
- [x] Add missing database indexes ✅
  - Added by_themeId index on businesses
  - Fixed businessDomainSync to use by_subdomain index instead of full table scan
- [x] Add orphan cleanup on business deletion ✅
  - Business claims now cascade-deleted when business is deleted

### UX Gaps (Production Readiness — Feb 2026)

- [x] Create missing pages (privacy, terms, claims) ✅
  - Placeholder /privacy and /terms pages
  - /dashboard/claims page with getByUser query
- [x] Add loading skeletons to all dashboard routes ✅
  - 6 loading.tsx files with route-specific pulse skeletons
- [x] Add error boundaries to dashboard routes ✅
  - 2 error.tsx files (dashboard + business sub-routes) with reset functionality
- [x] Clean up fake analytics data ✅
  - Replaced 445-line fake chart component with clean Coming Soon card

### Infrastructure (Production Readiness — Feb 2026)

- [x] Create .env.example ✅
  - All 22 environment variables documented with descriptions
- [x] Add health check endpoint ✅
  - GET /api/health returns { status: "ok", timestamp }
- [x] Integrate email verification (Resend) ✅
  - sendVerificationEmail now sends actual magic link emails via Resend API
  - resendVerificationEmail scheduler uncommented

### Testing (Production Readiness — Feb 2026)

- [x] Set up Vitest test infrastructure ✅
  - vitest.config.ts with jsdom, React plugin, path aliases
- [x] Write initial unit tests ✅
  - 20 tests: middleware routing (6) + URL utilities (14)
- [x] Set up Playwright E2E ✅
  - playwright.config.ts + smoke test scaffolded
- [x] Remove dead code ✅
  - applyBusinessTemplate stub gutted (509 → 9 lines)
  - Dead /app subdomain rewrite removed from middleware

## 🟡 Feature Enhancements

### Mobile-Responsive Preview

- [ ] Implement device-specific style controls
- [ ] Create responsive design helpers
- [ ] Ensure accurate rendering across device sizes
- [ ] Add mobile-specific editing mode

### Visual Editor Enhancements

- [ ] Add layer panel showing page structure hierarchy
- [ ] Reorganize style controls into focused modules (Background, Borders, Typography, Spacing)
- [ ] Add AI integration for content generation
- [ ] Expand block categories beyond basic/container (e.g., Media, Forms, Navigation)
- [ ] Optimize re-renders for large pages
- [ ] Virtual scrolling for large pages
- [ ] Performance optimizations for complex layouts
- [ ] Add loading states for image uploads
- [ ] Lazy load component previews
- [ ] Add progress indicators for auto-save

### Layout Controls

- [ ] Add margin/padding controls for sections
- [ ] Implement column width distribution presets (e.g., 30/70, 25/75 splits)
- [ ] CSS Grid support
- [ ] Advanced flexbox controls
- [ ] Global styles/theme editor (colors, fonts, spacing)
- [ ] Add background image positioning controls

### Building Blocks

- [ ] Create icon block with icon picker
- [ ] Create embed block for external content (maps, forms, etc.)
- [ ] Create list block with customizable bullets/numbers
- [ ] Create social media links block
- [ ] Create component templates/presets library
- [ ] Add global styles management
- [ ] Multi-select components for bulk operations

### Business Features

- [ ] Implement messages/reservations with third-party integrations
- [ ] Implement payment system
- [ ] Save as template functionality
- [ ] Version history with rollback

### Enhanced Section Customization

- [ ] Color schemes: Pre-defined palettes that work well together
- [ ] Typography pairings: Font combinations that look professional
- [ ] Layout variations: Spacing, alignment, proportions
- [ ] Image treatments: Filters, overlays, aspect ratios
- [ ] AI content generation: Business descriptions, service lists, etc.
- [ ] Content templates: Industry-specific copy suggestions
- [ ] Image suggestions: Stock photos relevant to business type
- [ ] SEO optimization: Auto-generated meta descriptions, titles
- [ ] Google Business data sync: Hours, photos, reviews, services
- [ ] Social media integration: Auto-import posts, reviews
- [ ] Contact form integration: Lead capture and management
- [ ] Analytics integration: Simple metrics dashboard

### Advanced Analytics

- [ ] Wire Tinybird backend to real analytics UI (replace Coming Soon)
- [ ] Add cohort analysis and funnel tracking
- [ ] Implement data export functionality (CSV, JSON)
- [ ] Create scheduled analytics reports
- [ ] Add geographic data enrichment

### User Experience

- [ ] Implement undo/redo for simple editor
- [ ] Add interactive tutorials for each section type
- [ ] Improve mobile editing experience
- [ ] Onboarding flow for new users
- [ ] Preview mode improvements

## 🔵 Medium Priority

### User Role Management

- [ ] Create user invitation system
- [ ] Implement permission-based UI restrictions
- [ ] Add team management dashboard
- [ ] Create audit logs for team actions
- [ ] Implement user settings mutations (profile update, notifications, account deletion)

### Data Export Functionality

- [ ] Build data export API endpoints
- [ ] Create export format converters (JSON, CSV)
- [ ] Implement scheduled exports
- [ ] Add backup and restore functionality

### Testing Infrastructure

- [x] Set up test runner (Vitest) and React Testing Library ✅
- [ ] Create component test suite
- [x] Implement CI/CD pipeline for testing ✅
- [x] Add end-to-end tests with Playwright ✅ (scaffolded, needs more tests)
- [ ] Add tests for visual editor components
- [ ] Add E2E tests for business creation flow

### Integrations

- [x] Implement email sending functionality (Resend) ✅
- [ ] Multi-language support
- [x] Configure error monitoring (Sentry) ✅

### Infrastructure

- [x] Set up CI/CD pipeline ✅
- [ ] Set up staging environment
- [ ] Update production deployment guide

## 🟢 Low Priority

### Performance Testing

- [ ] Add visual editor performance tests
- [ ] Create performance benchmarking tools
- [ ] Test editor with large component trees
- [ ] Implement performance monitoring
- [ ] Component search within page structure

### Performance & Polish

- [ ] Remove unused visual editor components if going simple-only
- [ ] Optimize bundle size after template system removal
- [ ] Improve loading times for section previews
- [ ] Add progressive loading for large galleries
- [ ] Strip googleBusinessAuth from remaining public queries (getByPlaceId, listByDomain, getByDomainId)

### Documentation

- [ ] Document visual editor performance optimizations
- [ ] Document optimization techniques
- [ ] Create developer guides for visual editor
- [ ] Add inline documentation for complex components
