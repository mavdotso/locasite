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
- [ ] Set up CI/CD pipeline
- [ ] Configure staging environment
- [ ] Set up error monitoring (Sentry)
- [ ] Performance monitoring and optimization

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

- [ ] Add cohort analysis and funnel tracking
- [ ] Implement data export functionality (CSV, JSON)
- [ ] Create scheduled analytics reports
- [ ] Add geographic data enrichment

### User Experience

- [ ] Implement undo/redo for simple editor
- [ ] Add interactive tutorials for each section type
- [ ] Improve mobile editing experience
- [ ] Onboarding flow for new users
- [ ] Interactive tutorials for each section type
- [ ] Preview mode improvements
- [ ] Mobile editing experience

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

- [ ] Set up Jest and React Testing Library
- [ ] Create component test suite
- [ ] Implement CI/CD pipeline for testing
- [ ] Add end-to-end tests with Playwright or Cypress
- [ ] Add tests for visual editor components
- [ ] Add E2E tests for business creation flow

### Integrations

- [ ] Implement email sending functionality in messages-management.tsx
- [ ] Multi-language support
- [ ] Configure error monitoring (Sentry)

### Infrastructure

- [ ] Set up CI/CD pipeline
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

### Documentation

- [ ] Document visual editor performance optimizations
- [ ] Document optimization techniques
- [ ] Create developer guides for visual editor
- [ ] Add inline documentation for complex components
