# Visual Builder Migration Plan

## Overview
This document outlines the step-by-step migration plan for redesigning the visual builder to match the professional mockup design. Each section will be implemented independently with full testing between steps.

## Current State Analysis
The existing visual builder has:
- Three-panel layout (component library, preview, properties)
- Basic drag-and-drop functionality
- Simple property editing
- Inline editing capabilities

## Target Design Analysis
Based on the mockup, the new design features:
- Enhanced three-panel layout with better visual hierarchy
- Professional UI with improved spacing and typography
- Organized component library with collapsible categories
- Advanced property controls with visual feedback
- Floating action buttons for quick edits
- Bottom panel for AI integration (future phase)

## Migration Steps

### Step 1: Core Layout Enhancement
**Objective**: Update the main editor layout structure with improved spacing and visual hierarchy.

**Location**: `/app/components/visual-editor/editor.tsx`

**Requirements**:
- Maintain three-panel layout but with refined proportions
- Left sidebar: 280px width (currently 256px)
- Right sidebar: 320px width (currently 320px)
- Remove redundant borders and add subtle shadows
- Update background colors to match mockup (lighter grays)
- Improve header with cleaner design

**Visual Specifications**:
- Background: `#f8f9fa` for main canvas
- Sidebars: `#ffffff` with subtle shadow
- Borders: Remove heavy borders, use subtle `#e5e7eb` where needed
- Spacing: Increase padding for better visual breathing room

### Step 2: Component Library Redesign (Left Sidebar)
**Objective**: Transform the component library into a hierarchical tree structure with better organization.

**Location**: `/app/components/visual-editor/component-library.tsx`

**Requirements**:
- Hierarchical tree structure with collapsible categories:
  - Pages (Home, Category, CTA, etc.)
  - Sections (Heading, Paragraph, Image)
  - Community
  - Media (Image, Video, YouTube, etc.)
  - Forms (Form Block, Label, Input)
- Indentation for sub-items (24px indent)
- Expand/collapse icons (chevron)
- Drag handles on hover
- Component count badges
- Search functionality at the top
- "Add Column" action item

**Visual Specifications**:
- Category headers: Bold, 14px font
- Sub-items: Regular weight, 14px font
- Hover state: Light gray background (#f3f4f6)
- Active state: Blue highlight
- Icons: 16px size, subtle gray color

### Step 3: Canvas Area Enhancement
**Objective**: Improve the preview area with better visual feedback and floating controls.

**Location**: `/app/components/visual-editor/preview-panel.tsx`

**Requirements**:
- Clean white background for content area
- Subtle drop shadow for content container
- Floating action buttons (bottom-right of selected components)
- Better placeholder states with dashed borders
- Grid overlay option for alignment
- Zoom controls
- Responsive preview options

**Visual Specifications**:
- Content background: `#ffffff`
- Container shadow: `0 2px 8px rgba(0,0,0,0.08)`
- Grid: 8px base unit, light gray lines
- Action buttons: 32px circular buttons with icons

### Step 4: Properties Panel Redesign (Right Sidebar)
**Objective**: Create a more organized and visual property editing experience.

**Location**: `/app/components/visual-editor/field-editor.tsx`

**Requirements**:
- Section-based organization:
  - Size (with visual Auto/Width/Height controls)
  - Overflow settings
  - Typography (with visual style buttons)
  - Backgrounds (with visual presets)
  - Borders (with visual controls)
- Visual toggle buttons instead of dropdowns where appropriate
- Inline number inputs with units
- Color pickers with preset swatches
- Collapsible sections for better organization

**Visual Specifications**:
- Section headers: 12px uppercase, gray text
- Toggle buttons: Segmented control style
- Input fields: Clean borders, proper spacing
- Color swatches: 24px squares with rounded corners

### Step 5: Enhanced Field Controls
**Objective**: Create specialized field controls for better user experience.

**New Files**:
- `/app/components/visual-editor/fields/size-control.tsx`
- `/app/components/visual-editor/fields/typography-control.tsx`
- `/app/components/visual-editor/fields/spacing-control.tsx`
- `/app/components/visual-editor/fields/border-control.tsx`

**Requirements**:
- Size Control: Visual toggle between Auto/Manual with inline inputs
- Typography Control: Visual style buttons (left/center/right/justify alignment)
- Spacing Control: Visual box model editor
- Border Control: Visual border style picker with width and color

### Step 6: Header Simplification
**Objective**: Clean up the header with better organization and visual hierarchy.

**Location**: `/app/components/visual-editor/editor.tsx` (header section)

**Requirements**:
- Cleaner title and navigation
- Group related actions
- Better save state indicator
- Simplified button styles
- Remove unnecessary icons

### Step 7: Interaction Improvements
**Objective**: Enhance drag-and-drop and selection interactions.

**Requirements**:
- Better drag preview
- Smooth hover states
- Clear selection indicators
- Improved drop zones
- Better visual feedback

### Step 8: Style System Update
**Objective**: Update the overall visual style to match the professional mockup.

**Requirements**:
- Update color palette
- Improve typography scale
- Add subtle animations
- Consistent spacing system
- Better shadow hierarchy

## Implementation Order
1. Core Layout Enhancement
2. Style System Update
3. Component Library Redesign
4. Properties Panel Redesign
5. Enhanced Field Controls
6. Canvas Area Enhancement
7. Header Simplification
8. Interaction Improvements

## Testing Protocol
After each step:
1. Run `bun run lint` to check for code style issues
2. Run `bun run build` to ensure no TypeScript errors
3. Manual testing of affected functionality
4. Visual regression testing against mockup
5. Performance testing for smooth interactions

## Success Criteria
- All existing functionality maintained
- Improved visual hierarchy and professional appearance
- Better user experience with enhanced controls
- Smooth animations and interactions
- Clean, maintainable code structure
- All tests passing