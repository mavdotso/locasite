# Locasite Todo List

## 🔴 CRITICAL: Dual-Mode Website Builder Implementation

### Strategic Approach: Simple + Pro Mode System

**Core Decision**: Keep existing visual editor as "Pro Mode" (hidden initially) and create a new simplified "Simple Mode" as the default experience.

### Key Requirements

1. **Minimal schema changes** - Both systems must work with existing data structures
2. **Seamless coexistence** - Users can switch between modes without data loss
3. **Simple Mode as default** - Non-technical users get streamlined experience
4. **Pro Mode preserved** - Advanced users retain full functionality

---

## 📋 Phase 1: Simple Mode Foundation

### Step 1: Create Simple Builder Architecture

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

### Step 2: Section Library Creation

**Hardcoded Section Variations (No database changes needed)**

- [ ] **Hero Sections** (5 variations):

  - Center-aligned with background image
  - Left-aligned with right image
  - Full-width video background
  - Split-screen layout
  - Minimal text-only

- [ ] **About Sections** (4 variations):

  - Text with side image
  - Two-column text layout
  - Timeline/story format
  - Team showcase grid

- [ ] **Services Sections** (5 variations):

  - 3-column service cards
  - List with icons
  - Pricing table layout
  - Feature comparison
  - Service gallery grid

- [ ] **Gallery Sections** (4 variations):

  - Masonry grid layout
  - Carousel/slider
  - Before/after comparison
  - Grid with lightbox

- [ ] **Contact Sections** (3 variations):
  - Form with map
  - Contact info cards
  - Social links focus

### Step 3: Mode Switching System

**Implementation Strategy**

- [ ] Add mode field to existing page schema (default: 'simple')
- [ ] Create conversion functions between modes
- [ ] Implement data preservation during switches
- [ ] Add warning dialogs for complex→simple conversion

**Conversion Logic**

```typescript
// Convert Pro mode (ComponentData[]) to Simple mode sections
function convertProToSimple(components: ComponentData[]): SectionData[];

// Convert Simple mode sections back to Pro mode components
function convertSimpleToProMode(sections: SectionData[]): ComponentData[];
```

---

## 📋 Phase 2: Simple Editor Interface

### Step 1: Main Editor Component

- [ ] Create `simple-editor.tsx` as alternative to existing visual editor
- [ ] Implement section-based page structure display
- [ ] Add section reordering with drag handles
- [ ] Create "Add Section" interface with visual previews

### Step 2: Inline Editing System

- [ ] **Text Editing**: Click-to-edit text fields with basic formatting
- [ ] **Image Replacement**: Click image → upload/select from media library
- [ ] **Color Customization**: Simple color picker for brand colors
- [ ] **Font Selection**: 3-5 professional font combinations

### Step 3: Section Management

- [ ] **Add Section**: Visual grid of section variations
- [ ] **Remove Section**: Delete with confirmation
- [ ] **Duplicate Section**: Copy section with customizations
- [ ] **Section Settings**: Basic styling options per section

---

## 📋 Phase 3: Pro Mode Integration

### Step 1: Mode Switcher Component

- [ ] Create toggle in editor header: "Simple" | "Pro" tabs
- [ ] Initially hide Pro tab (can be enabled via feature flag)
- [ ] Add smooth transition between modes
- [ ] Preserve user data during switches

### Step 2: Data Compatibility Layer

- [ ] Ensure Simple mode sections convert cleanly to ComponentData[]
- [ ] Maintain existing visual editor functionality unchanged
- [ ] Create migration utilities for existing pages
- [ ] Add validation for mode-specific data

### Step 3: Feature Parity Planning

**Simple Mode Capabilities**

- [ ] Section-based editing
- [ ] Basic text/image customization
- [ ] Color scheme selection
- [ ] Font pairing choices
- [ ] Mobile preview
- [ ] Publish functionality

**Pro Mode Capabilities** (Existing)

- [ ] Full visual editor
- [ ] Custom components
- [ ] Advanced styling
- [ ] Layout controls
- [ ] Component library

---

## 📋 Phase 4: Business Integration

### Step 1: Smart Defaults

- [ ] Auto-populate sections with Google Business data
- [ ] Suggest relevant section types based on business category
- [ ] Pre-fill contact information across sections
- [ ] Import business photos to gallery sections

### Step 2: Business Type Presets

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

- [ ] **Restaurant**: Hero, Menu/Services, Gallery, Contact
- [ ] **Salon/Beauty**: Hero, Services, Gallery, About, Contact
- [ ] **Medical**: Hero, Services, About, Contact
- [ ] **Professional**: Hero, About, Services, Contact
- [ ] **Retail**: Hero, Products, Gallery, Contact
- [ ] **Automotive**: Hero, Services, Gallery, About, Contact

### Step 3: Onboarding Flow

- [ ] Business type selection during site creation
- [ ] Automatic preset application
- [ ] Guided tour of Simple mode features
- [ ] Optional Pro mode introduction

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

## 📋 Technical Implementation Tasks

### Core Development

- [ ] Create section variation definitions (hardcoded)
- [ ] Build simple editor interface components
- [ ] Implement mode switching functionality
- [ ] Create data conversion utilities
- [ ] Add simple mode to page renderer
- [ ] Build section selection interface
- [ ] Implement inline editing system
- [ ] Create business preset system
- [ ] Add onboarding flow for simple mode
- [ ] Test data compatibility between modes

### Integration Tasks

- [ ] Update page creation flow to use simple mode by default
- [ ] Modify business page renderer to handle both modes
- [ ] Add mode switcher to editor header
- [ ] Implement preset selection during site creation
- [ ] Create migration utility for existing pages
- [ ] Add feature flag system for Pro mode visibility

### Quality Assurance

- [ ] Test section variations render correctly
- [ ] Verify mode switching preserves data
- [ ] Validate business preset functionality
- [ ] Test mobile responsiveness of simple editor
- [ ] Ensure existing visual editor remains unchanged
- [ ] Performance test with large numbers of sections

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
