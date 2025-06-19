# AI Prompt: Build Visual Theme Editor for Locasite

## Project Context
I'm building Locasite, a Business Site Generator SaaS that creates professional websites by scraping Google Maps data. Each business gets a subdomain (e.g., `business-name.locasite.com`). I need to enhance the visual theme editor to be more intuitive for non-developer users.

## Current Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Convex (database, serverless functions, auth)
- **UI**: Custom components built on Radix UI primitives
- **Architecture**: Subdomain-based multi-tenancy with middleware routing

## Current Theme System (Reference Only)
- Advanced theme system with comprehensive customization options
- Real-time preview with responsive device simulation
- Scoped CSS system preventing style conflicts
- Professional theme presets and color palettes
- Theme data stored in Convex database
- Components in `/app/components/business/` (hero, info, gallery, reviews, etc.)

## Goal: Build Puck-Inspired Visual Editor (MVP)
Create a drag-and-drop visual editor inspired by Puck (https://puckeditor.com) but simplified for MVP. Focus on non-developer users who need a "just works" experience.

## Core Requirements

### 1. Component-Based Architecture
- Create draggable component system similar to Puck's block architecture
- Component library with pre-built blocks: Hero, Gallery, Reviews, Contact, About, etc.
- Each component should have a config defining its fields and render function
- JSON data model to represent page content and layout

### 2. Drag & Drop Interface
- Visual drag & drop for section reordering and component placement
- Drop zones with visual feedback
- Real-time preview updates as user drags components
- Sidebar with available components to drag from

### 3. Field System (Essential Types Only)
- **Text fields**: Simple text inputs for titles, descriptions
- **Textarea fields**: Multi-line text for longer content
- **Image upload fields**: Integration with Convex storage
- **Color picker fields**: Using existing color palette system
- **Select fields**: Dropdowns for font choices, preset options
- **Number fields**: Sliders for spacing/sizing with preset values
- **Array fields**: For managing lists (gallery images, testimonials)

### 4. Simple Layout Controls
- Basic flexbox layout controls for section arrangement
- Simple responsive editing (desktop/mobile preview)
- Basic spacing controls with preset options (small/medium/large)
- Keep positioning simple (normal document flow only)

### 5. Configuration System
- Component configuration pattern similar to Puck:
```javascript
const config = {
  components: {
    HeroBlock: {
      fields: {
        title: { type: "text", defaultValue: "Welcome" },
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

## Technical Constraints & Preferences

### Must Use
- TypeScript (strict typing, no `any` types)
- Tailwind CSS with semantic color classes from globals.css
- Convex for data persistence
- Existing business site component architecture
- Subdomain routing system

### Must Avoid
- Hardcoded Tailwind neutral colors (use semantic colors from globals.css)
- Real-time collaboration features
- Backward compatibility with existing themes
- AI-powered suggestions
- Component permissions
- Complex grid/positioning tools

### Integration Points
- Use existing Convex backend for data persistence
- Build on existing theme isolation system for CSS scoping
- Integrate with current business site architecture
- Work within subdomain routing system

## Expected Deliverables

### Phase 1: Core Editor (2-3 weeks)
- Main editor component with drag & drop functionality
- Basic component library (Hero, About, Contact, Gallery)
- Drop zones and visual feedback
- JSON data model for page structure

### Phase 2: Field System (1-2 weeks)
- Essential field types (text, textarea, image, color, select, number, array)
- Field validation and default values
- Integration with existing color/font systems

### Phase 3: Layout Controls (1 week)
- Basic flexbox arrangement controls
- Simple responsive preview (desktop/mobile)
- Preset spacing options

### Phase 4: Configuration (1 week)
- Component configuration system
- Component categories for organization
- Reusable component presets

### Phase 5: Polish (1 week)
- Visual outline view of page structure
- Better preview modes
- Keyboard shortcuts for common actions

## Success Criteria
- Non-developer users can easily create professional-looking business sites
- Drag & drop feels smooth and intuitive
- Real-time preview updates work reliably
- All components render correctly on published sites
- Clean, uncluttered interface that doesn't overwhelm users
- Works seamlessly within existing Locasite architecture

## File Structure Suggestions
```
/app/components/visual-editor/
├── editor.tsx              # Main editor component
├── component-library.tsx   # Available components sidebar
├── drag-drop-provider.tsx  # Drag & drop context
├── preview-panel.tsx       # Live preview area
├── field-editor.tsx        # Properties panel for selected component
├── config/
│   ├── components.ts       # Component configurations
│   └── field-types.ts      # Field type definitions
└── fields/
    ├── text-field.tsx
    ├── image-field.tsx
    ├── color-field.tsx
    └── ...
```

## Key Design Principles
1. **Simplicity First**: Prioritize ease of use over advanced features
2. **Visual Feedback**: Clear visual cues for all interactions
3. **Immediate Preview**: Changes should reflect instantly
4. **Familiar Patterns**: Use common UI patterns users expect
5. **Error Prevention**: Guide users toward successful outcomes

Please implement this visual editor system step by step, starting with Phase 1. Focus on creating a solid foundation that can be built upon incrementally.