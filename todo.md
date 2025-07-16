# Locasite Todo List

## ✅ COMPLETED: Dual-Mode Website Builder Implementation

### Strategic Approach: Simple + Pro Mode System

**Core Decision**: Keep existing visual editor as "Pro Mode" (hidden initially) and create a new simplified "Simple Mode" as the default experience.

### Key Requirements

1. ✅ **Minimal schema changes** - Both systems work with existing data structures
2. ✅ **Seamless coexistence** - Users can switch between modes without data loss
3. ✅ **Simple Mode as default** - Non-technical users get streamlined experience
4. ✅ **Pro Mode preserved** - Advanced users retain full functionality (hidden)

---

## ✅ Phase 1: Simple Mode Foundation - COMPLETED

### ✅ Step 1: Create Simple Builder Architecture

**New Components Structure**

```
app/components/simple-builder/
├── core/
│   ├── simple-editor.tsx          # Main simple editor wrapper
│   ├── section-selector.tsx       # Visual section picker
│   └── mode-switcher.tsx          # Toggle between Simple/Pro
├── sections/
│   ├── section-library.ts         # Hardcoded section definitions
│   ├── section-renderer.tsx       # Renders sections in simple mode
│   └── section-variations.ts      # Pre-built section variations
├── ui/
│   ├── section-card.tsx          # Section preview cards
│   ├── inline-editor.tsx         # Simple text/image editing
│   └── style-controls.tsx        # Basic color/font controls
└── types/
    └── simple-builder.ts         # Type definitions
```

**Data Structure (Compatible with existing schema)**

```typescript
// Extends existing ComponentData to work with both systems
interface SectionVariation {
  id: string;
  name: string;
  description: string;
  preview: string; // Base64 or URL to preview image
  category: "hero" | "about" | "services" | "gallery" | "contact" | "footer";
  components: ComponentData[]; // Reuses existing component structure
  editableFields: {
    [componentId: string]: string[]; // Which fields can be edited
  };
}

interface SimplePageData {
  mode: "simple" | "pro";
  sections: {
    id: string;
    variationId: string;
    customData?: Record<string, any>; // User customizations
  }[];
  // Existing page data structure remains unchanged
  components?: ComponentData[]; // For pro mode compatibility
}
```

### ✅ Step 2: Section Library Creation - COMPLETED

**Hardcoded Section Variations (No database changes needed)**

- [x] **Hero Sections** (3 variations):

  - Center-aligned with background image
  - Split-screen layout
  - Minimal text-only

- [x] **About Sections** (3 variations):

  - Text with side image
  - Two-column text layout
  - Timeline/story format

- [x] **Services Sections** (3 variations):

  - 3-column service cards
  - List with icons
  - Pricing table layout

- [x] **Gallery Sections** (3 variations):

  - Grid layout
  - Masonry grid layout
  - Before/after comparison

- [x] **Contact Sections** (3 variations):
  - Form with map
  - Contact info cards
  - Social links focus

### ✅ Step 3: Mode Switching System - COMPLETED

**Implementation Strategy**

- [x] Add mode field to existing page schema (default: 'simple')
- [x] Create conversion functions between modes
- [x] Implement data preservation during switches
- [x] Add warning dialogs for complex→simple conversion

**Conversion Logic**

```typescript
// Convert Pro mode (ComponentData[]) to Simple mode sections
function convertProToSimple(components: ComponentData[]): SectionData[];

// Convert Simple mode sections back to Pro mode components
function convertSimpleToProMode(sections: SectionData[]): ComponentData[];
```

---

## ✅ Phase 2: Simple Editor Interface - COMPLETED

### ✅ Step 1: Main Editor Component

- [x] Create `simple-editor.tsx` as alternative to existing visual editor
- [x] Implement section-based page structure display
- [x] Add section reordering with drag handles
- [x] Create "Add Section" interface with visual previews

### ✅ Step 2: Inline Editing System

- [x] **Text Editing**: Click-to-edit text fields with basic formatting
- [x] **Image Replacement**: Click image → upload/select from media library
- [x] **Color Customization**: Simple color picker for brand colors
- [x] **Font Selection**: Professional font combinations

### ✅ Step 3: Section Management

- [x] **Add Section**: Visual grid of section variations
- [x] **Remove Section**: Delete with confirmation
- [x] **Duplicate Section**: Copy section with customizations
- [x] **Section Settings**: Basic styling options per section

---

## ✅ Phase 3: Pro Mode Integration - COMPLETED (Hidden)

### ✅ Step 1: Mode Switcher Component

- [x] Create toggle in editor header: "Simple" | "Pro" tabs
- [x] Pro tab hidden by default (feature flag controlled)
- [x] Add smooth transition between modes
- [x] Preserve user data during switches

### ✅ Step 2: Data Compatibility Layer

- [x] Ensure Simple mode sections convert cleanly to ComponentData[]
- [x] Maintain existing visual editor functionality unchanged
- [x] Create migration utilities for existing pages
- [x] Add validation for mode-specific data

### ✅ Step 3: Feature Parity Planning

**Simple Mode Capabilities** (Active)

- [x] Section-based editing
- [x] Basic text/image customization
- [x] Color scheme selection
- [x] Font pairing choices
- [x] Mobile preview
- [x] Publish functionality

**Pro Mode Capabilities** (Hidden but Available)

- [x] Full visual editor
- [x] Custom components
- [x] Advanced styling
- [x] Layout controls
- [x] Component library

---

## ✅ Phase 4: Business Integration - COMPLETED

### ✅ Step 1: Smart Defaults

- [x] Auto-populate sections with Google Business data
- [x] Suggest relevant section types based on business category
- [x] Pre-fill contact information across sections
- [x] Import business photos to gallery sections

### ✅ Step 2: Business Type Presets

**Preset Definitions** (Using section variations)

```typescript
interface BusinessPreset {
  type:
    | "restaurant"
    | "salon"
    | "medical"
    | "professional"
    | "retail"
    | "automotive";
  name: string;
  description: string;
  defaultSections: {
    variationId: string;
    order: number;
    autoPopulate?: boolean;
  }[];
}
```

- [x] **Restaurant**: Hero, Menu/Services, Gallery, Contact
- [x] **Salon/Beauty**: Hero, Services, Gallery, About, Contact
- [x] **Medical**: Hero, Services, About, Contact
- [x] **Professional**: Hero, About, Services, Contact
- [x] **Retail**: Hero, Products, Gallery, Contact
- [x] **Automotive**: Hero, Services, Gallery, About, Contact

### ✅ Step 3: Onboarding Flow

- [x] Business type selection during site creation
- [x] Automatic preset application
- [x] Guided tour of Simple mode features
- [x] Pro mode hidden (no introduction needed)

---

## 📋 Phase 5: Implementation Details

### Database Schema (Minimal Changes)

**Existing `pages` table - Add optional fields:**

```typescript
// Add to existing schema
interface Page {
  // ... existing fields
  editorMode?: "simple" | "pro"; // Default: 'simple'
  simpleSections?: {
    id: string;
    variationId: string;
    customData?: Record<string, any>;
    order: number;
  }[];
}
```

### File Structure Changes

**New Files** (No modifications to existing visual editor)

```
app/components/simple-builder/     # New simple builder system
app/lib/simple-builder-utils.ts    # Conversion utilities
app/types/simple-builder.ts        # Type definitions
```

**Modified Files** (Minimal changes)

```
app/components/business/business-page-renderer.tsx  # Add simple mode rendering
app/[domain]/page.tsx                              # Route to appropriate editor
convex/pages.ts                                    # Add simple mode fields
```

### Rollout Strategy

**Phase 1**: Simple mode for new sites only
**Phase 2**: Migration tool for existing sites  
**Phase 3**: Pro mode reveal (feature flag or paid tier)
**Phase 4**: Template system cleanup (after validation)

---

## ✅ Technical Implementation Tasks - COMPLETED

### Core Development

- [x] Create section variation definitions (hardcoded)
- [x] Build simple editor interface components
- [x] Implement mode switching functionality
- [x] Create data conversion utilities
- [x] Add simple mode to page renderer
- [x] Build section selection interface
- [x] Implement inline editing system
- [x] Create business preset system
- [x] Add onboarding flow for simple mode
- [x] Test data compatibility between modes

### Integration Tasks

- [x] Update page creation flow to use simple mode by default
- [x] Modify business page renderer to handle both modes
- [x] Add mode switcher to editor header
- [x] Implement preset selection during site creation
- [x] Create migration utility for existing pages
- [x] Add feature flag system for Pro mode visibility

### Quality Assurance

- [x] Test section variations render correctly
- [x] Verify mode switching preserves data
- [x] Validate business preset functionality
- [x] Test mobile responsiveness of simple editor
- [x] Ensure existing visual editor remains unchanged
- [x] Performance test with large numbers of sections

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

## 🎯 NEXT PRIORITIES

Based on the current implementation status, here are the recommended next steps:

### 🔴 High Priority - Production Readiness

#### Code Quality & Performance

- [ ] Fix TypeScript `any` types in `/convex/pages.ts`, `/convex/applyBusinessTemplate.ts`, `/convex/regenerateAI.ts`
- [ ] Replace forbidden color classes (`bg-white` in hero-variations.tsx)
- [ ] Add missing alt attributes to images in simple-builder components
- [ ] Optimize Convex query placement - create Dashboard Context Provider
- [ ] Reduce excessive `use client` usage (103 files currently)
- [ ] Implement error boundaries throughout the application

#### Performance Optimizations

- [ ] Create compound Convex queries for related data
- [ ] Implement `preloadQuery` more extensively
- [ ] Convert static display components to server components
- [ ] Add dynamic imports for large components
- [ ] Implement virtual scrolling for large pages

#### Production Deployment

- [ ] Run comprehensive lint and build checks
- [ ] Set up CI/CD pipeline
- [ ] Configure staging environment
- [ ] Set up error monitoring (Sentry)
- [ ] Performance monitoring and optimization

### 🟡 Medium Priority - Feature Enhancements

#### Advanced Analytics

- [ ] Add cohort analysis and funnel tracking
- [ ] Implement data export functionality (CSV, JSON)
- [ ] Create scheduled analytics reports
- [ ] Add geographic data enrichment

#### User Experience

- [ ] Implement undo/redo for simple editor
- [ ] Add interactive tutorials for each section type
- [ ] Improve mobile editing experience
- [ ] Add AI integration for content generation

#### Business Features

- [ ] Implement payment system integration
- [ ] Add messages/reservations with third-party integrations
- [ ] Create version history with rollback
- [ ] Implement team management and user roles

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
- [x] Implement Google Maps business claiming
- [x] Complete business ownership verification system
- [x] Email verification with magic links
- [x] Publishing permission gates
- [x] Rate limiting and security measures

### Analytics Dashboard

- [x] Integrate Tinybird for analytics visualization
- [x] Set up Tinybird data warehouse connection
- [x] Create custom Tinybird dashboards for business metrics
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
