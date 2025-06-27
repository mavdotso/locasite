# Locasite Todo List

## 🔴 High Priority

### Core Features

- [x] Visual Editor Redesign
- [x] Fix TypeScript errors in editor.tsx related to handleUpdateComponent
- [x] Fix type incompatibilities in use-debounced-callback hook
- [x] Implement code splitting for visual editor components
- [x] Add preloading strategies for commonly used components
- [x] Create caching layer for frequently accessed component data
- [ ] Re-create all basic sections in visual editor style
- [ ] Create user library component for image storage
- [ ] Create pre-made page templates for business types

### Code Quality Fixes

- [ ] Fix missing dependency 'debouncedAutoSave' in useCallback in editor.tsx
- [ ] Resolve critical dependency warning in use-component-preloader.ts
- [ ] Fix serializable props in image-field.tsx
- [ ] Fix serializable props in left-sidebar.tsx
- [ ] Fix serializable props in virtualized-media-grid.tsx
- [ ] Fix serializable props in virtualized-component-list.tsx

### Google Business Profile API Integration

- [ ] Set up OAuth flow with Google Business Profile API
- [ ] Create verification status tracking in database
- [ ] Implement business verification UI flow
- [ ] Add verification status indicators throughout the application
- [ ] Implement Google Maps business claiming

### Analytics Dashboard

- [ ] Integrate Tinybirt for analytics visualization
- [ ] Set up Tinybirt data warehouse connection
- [ ] Create custom Tinybirt dashboards for business metrics
- [ ] Implement visitor tracking and data collection
- [ ] Create time-based filtering for analytics data
- [ ] Add conversion tracking for key user actions

### SEO Optimization Features

- [ ] Create SEO metadata editor component
- [ ] Implement structured data generation (schema.org)
- [ ] Add SEO score and recommendations
- [ ] Implement sitemap generation

### Mobile-Responsive Preview

- [ ] Add device toggle UI for responsive preview
- [ ] Implement device-specific style controls
- [ ] Create responsive design helpers
- [ ] Ensure accurate rendering across device sizes
- [ ] Add mobile-specific editing mode
- [ ] Better responsive preview modes (phone, tablet, desktop views)

### Visual Editor Enhancements

- [ ] Implement copy/paste for components
- [ ] Add undo/redo UI buttons in header
- [ ] Create component templates (pre-built combinations)
- [ ] Add keyboard shortcuts for common actions
- [ ] Component variations (multiple preset styles per component)
- [ ] Export/Import page designs
- [ ] Add layer panel showing page structure hierarchy
- [ ] Implement canvas-level actions (undo/redo, zoom controls)
- [ ] Reorganize style controls into focused modules (Background, Borders, Typography, Spacing)
- [ ] Add AI integration for content generation
- [ ] Expand block categories beyond basic/container (e.g., Media, Forms, Navigation)
- [ ] Implement dedicated canvas actions component

### Performance Optimizations

- [x] Implement component search in library
- [ ] Optimize re-renders for large pages
- [ ] Virtual scrolling for large pages
- [ ] Performance optimizations for complex layouts
- [ ] Add loading states for image uploads
- [ ] Lazy load component previews
- [ ] Add progress indicators for auto-save

### Business Features

- [ ] Implement messages/reservations with third-party integrations
- [ ] Implement payment system
- [ ] Save as template functionality
- [ ] Version history with rollback

## 🟡 Medium Priority

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

### Layout Controls

- [x] Add alignment options for content within containers
- [ ] Add margin/padding controls for sections
- [ ] Implement column width distribution presets (e.g., 30/70, 25/75 splits)
- [ ] CSS Grid support
- [ ] Advanced flexbox controls
- [ ] Global styles/theme editor (colors, fonts, spacing)
- [ ] Add background image positioning controls

### Building Blocks

- [x] Add logo upload functionality
- [ ] Create icon block with icon picker
- [ ] Create embed block for external content (maps, forms, etc.)
- [ ] Create list block with customizable bullets/numbers
- [ ] Create social media links block
- [ ] Create component templates/presets library
- [ ] Add global styles management
- [ ] Multi-select components for bulk operations

### Integrations

- [ ] Implement email sending functionality in messages-management.tsx
- [ ] Multi-language support
- [ ] Configure error monitoring (Sentry)

### Infrastructure

- [ ] Set up CI/CD pipeline
- [ ] Set up staging environment
- [ ] Update production deployment guide

## 🔵 Low Priority

### Performance Testing

- [ ] Add visual editor performance tests
- [ ] Create performance benchmarking tools
- [ ] Test editor with large component trees
- [ ] Implement performance monitoring
- [ ] Component search within page structure

### Documentation

- [x] Create README.md with setup instructions
- [ ] Document visual editor performance optimizations
- [ ] Document optimization techniques
- [ ] Create developer guides for visual editor
- [ ] Add inline documentation for complex components

### Code Improvements

- [ ] Move domain validation logic from convex/domains.ts to frontend
- [ ] Implement nested component movement in preview-panel.tsx
