# Locasite Todo List

## 🔴 CRITICAL: Template System Overhaul & UX Simplification

### Current Problems Identified

- **Over-engineered template system**: 728 lines of static template data, dual template systems, complex conversion logic
- **Too complex for target users**: Current block editor is too technical for small business owners
- **Maintenance burden**: Any component change requires updating 5+ templates manually
- **Unused code**: Multiple unused dependencies, functions, and entire files

### Strategic Decision Points

1. **Target User**: Non-technical small business owners who want websites in "a few clicks"
2. **Complexity Level**: Super-simple vs. flexible building blocks
3. **Pro Mode**: Consider moving advanced editor to separate "pro" tier
4. **Section Variations**: Multiple pre-built options per section type

---

## 📋 New Simple Builder Architecture 

### Recommended Approach: Section-Based Builder

#### Core Concept

Instead of complex drag-and-drop blocks, provide:

1. **Pre-built section types** (Hero, About, Services, Gallery, Contact, etc.)
2. **Multiple variations** per section (3-5 layout options each)
3. **Simple customization** (text, images, colors, basic styling)
4. **One-click section addition** with smart defaults

#### Implementation Plan

**Step 1: Create Section Variation System**

- [ ] Design new data structure for section variations

```typescript
interface SectionVariation {
  id: string;
  name: string;
  preview: string; // Screenshot
  template: ComponentData[];
  customizable: string[]; // Which fields can be edited
}

interface SectionType {
  type: "hero" | "about" | "services" | "gallery" | "contact";
  name: string;
  description: string;
  variations: SectionVariation[];
}
```

**Step 2: Build Section Library**

- [ ] Create 3-5 variations for each section type:
  - **Hero sections**: Center-aligned, left-aligned, with/without image, video background
  - **About sections**: Text-only, text+image, timeline, team focus
  - **Services sections**: Grid cards, list view, pricing table, detailed descriptions
  - **Gallery sections**: Grid, masonry, carousel, before/after
  - **Contact sections**: Form-only, form+map, info cards, social links

**Step 3: Simple Editor Interface**

- [ ] Create new "Simple Builder" component
- [ ] Section selection interface (visual grid of options)
- [ ] Inline editing for text content
- [ ] Simple image replacement (click to upload)
- [ ] Basic styling controls (colors, fonts)
- [ ] Section reordering (drag handles)

**Step 4: Smart Defaults & Business Data Integration**

- [ ] Auto-populate sections with business data from Google Maps
- [ ] Intelligent content suggestions based on business type
- [ ] Smart image recommendations from business photos
- [ ] Auto-generate section content using AI (optional)

---

## 📋 Template System Simplification 

### Replace Current Template System

**Remove Complex Template Files**

- [ ] Delete `app/components/visual-editor/templates/page-templates.ts` (728 lines)
- [ ] Remove template selector UI complexity
- [ ] Simplify template conversion logic

**Create Business Type Presets**

- [ ] Define 5-7 business type presets:
  - Restaurant/Food
  - Beauty/Salon
  - Healthcare/Medical
  - Professional Services
  - Retail/E-commerce
  - Automotive
  - Real Estate

**Preset Structure**

```typescript
interface BusinessPreset {
  type: string;
  name: string;
  sections: {
    type: SectionType;
    variationId: string;
    defaultContent: Record<string, any>;
  }[];
}
```

**Implementation**

- [ ] Create preset definitions (much smaller than current templates)
- [ ] Build preset selection interface
- [ ] Implement preset application logic
- [ ] Add preset customization after selection

---

## 📋 Pro Mode Strategy

### Two-Tier System Implementation

**Simple Mode (Default)**

- [ ] Section-based builder as primary interface
- [ ] Limited but powerful customization options
- [ ] Guided workflow for non-technical users
- [ ] Smart defaults and AI assistance

**Pro Mode (Advanced)**

- [ ] Keep current visual editor for power users
- [ ] Add "Switch to Pro Mode" option
- [ ] Advanced block-level editing
- [ ] Custom CSS and advanced styling
- [ ] Component library access

**Mode Switching**

- [ ] Seamless conversion between modes
- [ ] Warning system for complex→simple conversion
- [ ] Data preservation during mode switches

---

## 📋 Enhanced Section Customization

### Smart Customization System

**Visual Customization**

- [ ] **Color schemes**: Pre-defined palettes that work well together
- [ ] **Typography pairings**: Font combinations that look professional
- [ ] **Layout variations**: Spacing, alignment, proportions
- [ ] **Image treatments**: Filters, overlays, aspect ratios

**Content Assistance**

- [ ] **AI content generation**: Business descriptions, service lists, etc.
- [ ] **Content templates**: Industry-specific copy suggestions
- [ ] **Image suggestions**: Stock photos relevant to business type
- [ ] **SEO optimization**: Auto-generated meta descriptions, titles

**Business Integration**

- [ ] **Google Business data sync**: Hours, photos, reviews, services
- [ ] **Social media integration**: Auto-import posts, reviews
- [ ] **Contact form integration**: Lead capture and management
- [ ] **Analytics integration**: Simple metrics dashboard

---

## 📋 Performance & Polish 

### Optimization

- [ ] Remove unused visual editor components if going simple-only
- [ ] Optimize bundle size after template system removal
- [ ] Improve loading times for section previews
- [ ] Add progressive loading for large galleries

### User Experience Polish

- [ ] Onboarding flow for new users
- [ ] Interactive tutorials for each section type
- [ ] Preview mode improvements
- [ ] Mobile editing experience
- [ ] Undo/redo for simple editor

---

## 🎯 RECOMMENDED STRATEGY

Based on your goals, I recommend:

### 1. **Section-Based Builder as Primary Interface**

- Much simpler than current block editor
- Still flexible with multiple variations per section
- Easier to maintain than massive template files
- Better for non-technical users

### 2. **Business Type Presets Instead of Full Templates**

- Smaller, more maintainable preset definitions
- Auto-populated with business data
- Easier to add new business types
- Less code duplication

### 3. **Two-Tier System (Simple + Pro)**

- Simple mode for 80% of users (small business owners)
- Pro mode for 20% who need advanced features
- Allows you to serve both markets
- Can be separate pricing tiers

### 4. **Focus on Smart Defaults**

- Leverage Google Business data for auto-population
- Use AI for content suggestions
- Provide industry-specific recommendations
- Minimize user decision fatigue

This approach would:

- ✅ Dramatically reduce code complexity
- ✅ Make the product accessible to non-technical users
- ✅ Maintain flexibility for power users
- ✅ Be much easier to maintain and extend
- ✅ Provide clear upgrade path to Pro features

---

## 🔴 High Priority (Existing)

### Core Features

- [x] Visual Editor Redesign
- [x] Fix TypeScript errors in editor.tsx related to handleUpdateComponent
- [x] Fix type incompatibilities in use-debounced-callback hook
- [x] Implement code splitting for visual editor components
- [x] Add preloading strategies for commonly used components
- [x] Create caching layer for frequently accessed component data
- [x] Re-create all basic sections in visual editor style
- [x] Create user library component for image storage
- [x] Create pre-made page templates for business types

### Code Quality Fixes

- [x] Fix missing dependency 'debouncedAutoSave' in useCallback in editor.tsx
- [x] Resolve critical dependency warning in use-component-preloader.ts
- [x] Fix serializable props in image-field.tsx
- [x] Fix serializable props in left-sidebar.tsx
- [x] Fix serializable props in virtualized-media-grid.tsx
- [x] Fix serializable props in virtualized-component-list.tsx

### Google Business Profile API Integration

- [x] Set up OAuth flow with Google Business Profile API
- [x] Create verification status tracking in database
- [x] Implement business verification UI flow
- [x] Add verification status indicators throughout the application
- [ ] Implement Google Maps business claiming

### Analytics Dashboard

- [ ] Integrate Tinybirt for analytics visualization
- [ ] Set up Tinybirt data warehouse connection
- [ ] Create custom Tinybirt dashboards for business metrics
- [x] Implement visitor tracking and data collection
- [x] Create time-based filtering for analytics data
- [x] Add conversion tracking for key user actions
- [x] Build analytics dashboard UI with real data
- [x] Add real-time visitor tracking widget
- [x] Implement analytics charts and visualizations

### SEO Optimization Features

- [x] Create SEO metadata editor component
- [x] Implement structured data generation (schema.org)
- [x] Add SEO score and recommendations
- [x] Implement sitemap generation

### Mobile-Responsive Preview

- [x] Add device toggle UI for responsive preview
- [ ] Implement device-specific style controls
- [ ] Create responsive design helpers
- [ ] Ensure accurate rendering across device sizes
- [ ] Add mobile-specific editing mode
- [x] Better responsive preview modes (phone, tablet, desktop views)

### Visual Editor Enhancements

- [x] Implement copy/paste for components
- [x] Add undo/redo UI buttons in header
- [x] Create component templates (pre-built combinations)
- [x] Add keyboard shortcuts for common actions
- [x] Component variations (multiple preset styles per component)
- [x] Export/Import page designs
- [ ] Add layer panel showing page structure hierarchy
- [x] Implement canvas-level actions (undo/redo, zoom controls)
- [ ] Reorganize style controls into focused modules (Background, Borders, Typography, Spacing)
- [ ] Add AI integration for content generation
- [ ] Expand block categories beyond basic/container (e.g., Media, Forms, Navigation)
- [x] Implement dedicated canvas actions component

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
