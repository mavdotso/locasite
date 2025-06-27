# Locasite Todo List

## 🔴 High Priority

### Features
- [x] Visual Editor Redesign
- [ ] Re-create all basic sections in visual editor style
- [ ] Create user library component for image storage
- [ ] Create pre-made page templates for business types
- [ ] Implement messages/reservations with third-party integrations
- [ ] Implement payment system

### Advanced Features  
- [ ] Implement copy/paste for components
- [ ] Add mobile-specific editing mode
- [ ] Add undo/redo UI buttons in header
- [ ] Create component templates (pre-built combinations)
- [ ] Add keyboard shortcuts for common actions
- [ ] Component variations (multiple preset styles per component)
- [ ] Export/Import page designs

### Visual Editor Architecture Improvements (Inspired by Mainland.js)
- [ ] Add layer panel showing page structure hierarchy
- [ ] Implement canvas-level actions (undo/redo, zoom controls)
- [ ] Reorganize style controls into focused modules (Background, Borders, Typography, Spacing)
- [ ] Add AI integration for content generation
- [ ] Expand block categories beyond basic/container (e.g., Media, Forms, Navigation)
- [ ] Implement dedicated canvas actions component
- [ ] Add element hierarchy visualization similar to layers panel

### Performance
- [ ] Optimize re-renders for large pages
- [ ] Virtual scrolling for large pages
- [ ] Performance optimizations for complex layouts

### Business Features
- [ ] Save as template functionality
- [ ] Version history with rollback
- [ ] SEO metadata editing

### Documentation
- [x] Create README.md with setup instructions

### Testing
- [ ] Add tests for visual editor components
- [ ] Add E2E tests for business creation flow

## 🟡 Medium Priority

### Code Improvements
- [ ] Implement nested component movement in preview-panel.tsx
- [ ] Implement user settings mutations (profile update, notifications, account deletion)
- [ ] Implement email sending functionality in messages-management.tsx

### Features
- [ ] Implement Google Maps business claiming
- [x] Add logo upload functionality

### Layout Controls
- [ ] Add margin/padding controls for sections
- [ ] Implement column width distribution presets (e.g., 30/70, 25/75 splits)
- [x] Add alignment options for content within containers
- [ ] CSS Grid support
- [ ] Advanced flexbox controls
- [ ] Global styles/theme editor (colors, fonts, spacing)

### Building Blocks
- [ ] Create icon block with icon picker
- [ ] Create embed block for external content (maps, forms, etc.)
- [ ] Create list block with customizable bullets/numbers
- [ ] Create social media links block

### Advanced Features
- [ ] Create component templates/presets library
- [ ] Add global styles management
- [ ] Multi-select components for bulk operations

### Performance
- [ ] Add loading states for image uploads
- [x] Implement component search in library
- [ ] Lazy load component previews
- [ ] Add progress indicators for auto-save
- [ ] Component search within page structure

### Business Features
- [ ] Analytics integration
- [ ] Multi-language support

### Documentation
- [ ] Update production deployment guide

### Infrastructure
- [ ] Set up CI/CD pipeline
- [ ] Configure error monitoring (Sentry)
- [ ] Set up staging environment

## 🔵 Low Priority

### Code Improvements
- [ ] Move domain validation logic from convex/domains.ts to frontend

### Layout Controls
- [ ] Add background image positioning controls
- [ ] Better responsive preview modes (phone, tablet, desktop views)

