# Visual Theme Editor Enhancement Plan

Based on analysis of Puck's visual editor architecture and the current Locasite theme editing system.

## Phase 1: Component-Based Visual Editor
- [ ] Create draggable component system similar to Puck's block architecture
- [ ] Implement drag & drop interface for section reordering and component placement
- [ ] Add component library with pre-built blocks (Hero, Gallery, Reviews, Contact, etc.)
- [ ] Enable real-time visual composition with drop zones and live preview

## Phase 2: Advanced Field System
- [ ] Upgrade field types inspired by Puck's field system:
  - [ ] Rich text fields with inline editing
  - [ ] Image upload fields with cropping
  - [ ] Color picker fields with palette management
  - [ ] Number fields with sliders for spacing/sizing
  - [ ] Select fields for font/style choices
  - [ ] Array fields for managing lists (gallery images, testimonials)
- [ ] Implement field validation and default value handling

## Phase 3: Simple Layout Controls (MVP)
- [ ] Add basic flexbox layout controls for section arrangement
- [ ] Implement simple responsive breakpoint editing (desktop/mobile)
- [ ] Create basic spacing controls with preset options
- [ ] Keep positioning simple (normal flow only)

## Phase 4: Configuration System Upgrade
- [ ] Restructure component configuration to match Puck's config pattern
- [ ] Add component categories for better organization
- [ ] Create reusable component presets and templates

## Phase 5: User Experience Improvements
- [ ] Add visual outline view showing page structure
- [ ] Implement better preview modes with iframe isolation
- [ ] Create keyboard shortcuts for common actions

## Technical Implementation Details
- Use existing Convex backend for data persistence
- Create new component-level configuration system (clean slate)
- Build on existing theme isolation system for proper CSS scoping
- Integrate with current business site architecture and subdomain routing
- Fresh start - no backward compatibility needed

## Key Puck Concepts to Adopt

### Component Configuration Pattern
```javascript
const config = {
  components: {
    HeroBlock: {
      fields: {
        title: { type: "text" },
        subtitle: { type: "textarea" },
        backgroundImage: { type: "image" },
        buttonText: { type: "text" },
        buttonLink: { type: "text" }
      },
      render: ({ title, subtitle, backgroundImage, buttonText, buttonLink }) => (
        // Component JSX
      )
    }
  }
}
```

### Visual Editor Architecture
- **Editor Component**: Main editing interface with drag & drop
- **Render Component**: Display-only component for published pages
- **Config System**: Define available components and their fields
- **Data Model**: JSON structure representing page content and layout

### Field System Integration
- Leverage existing theme color system with enhanced visual controls
- Integrate with Convex storage for image uploads
- Extend current font management with visual typography controls
- Add responsive design controls for mobile/tablet/desktop

## Current Strengths to Build Upon
- Advanced theme system with comprehensive customization
- Real-time preview with responsive device simulation
- Scoped CSS system preventing style conflicts
- Professional theme presets and color palettes
- Inline editing capabilities for text content
- Convex backend for real-time data synchronization

## Implementation Priority (MVP Focus)
1. **Phase 1** - Core drag & drop functionality 
2. **Phase 2** - Enhanced field controls 
3. **Phase 3** - Simple layout tools
4. **Phase 4** - Configuration system
5. **Phase 5** - UX polish 

## MVP Scope
- Focus on non-developer users who need a simple "just works" editor
- Basic flexbox layout (no complex grid/positioning)
- Essential field types only
- Clean, intuitive interface
- Reliable drag & drop functionality 
