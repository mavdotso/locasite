# AGENTS.md

## Commands

```bash
# Development
bun install                # Install dependencies
bun dev                    # Run dev server with Turbopack
bun run build              # Build for production
bun run lint               # Run ESLint
npx convex dev             # Run Convex development server
npx convex deploy          # Deploy Convex functions
npx convex codegen         # Generate Convex types
npx knip                   # Find unused dependencies/exports
```

## Code Style Guidelines

- **TypeScript**: NEVER use `any`. Use proper types from `convex/_generated/dataModel` and `convex/_generated/server`
- **Colors**: FORBIDDEN: `text-gray-*`, `bg-gray-*`, `border-gray-*`, `text-black`, `bg-white`, `text-slate-*`. Use semantic colors: `text-muted-foreground`, `bg-muted`, `bg-background`, `bg-card`, `border-border`
- **Components**: Use functional components with React Server Components where possible
- **Naming**: Use `dash-dir` for directories, `handleEvent` for event handlers
- **Imports**: Group imports by external/internal, sort alphabetically
- **Error Handling**: Use early returns, implement error boundaries
- **Styling**: Use Tailwind classes only, no CSS or style tags
- **Accessibility**: Include `aria-label`, `tabindex="0"`, and keyboard handlers

## Convex Patterns

- Define arguments with `v` from `convex/values`
- Use `path+file+export=api.path.name` for function naming
- Prefer indexes over filters for optimized querying

## Quality Assurance

- Run `bun run lint` and `bun run build` before completing changes
- Fix all TypeScript errors and ESLint warnings immediately
- Never modify files in @/components/ui (Shadcn components)
