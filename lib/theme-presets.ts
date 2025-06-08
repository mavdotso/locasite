import { ThemeSchema, ThemePreset } from "@/types/theme";

// Re-export theme presets from Convex
export { themePresets, getThemePreset } from "@/convex/themePresets";

// Helper function to apply theme to CSS variables (client-side only)
export function applyThemeToCSS(theme: ThemeSchema, isDark = false) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  const colors = isDark && theme.colors.dark ? theme.colors.dark : theme.colors.light;
  
  // Apply color variables
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value as string);
  });
  
  // Apply typography variables
  root.style.setProperty("--font-base", theme.typography.fontFamilyBase);
  root.style.setProperty("--font-heading", theme.typography.fontFamilyHeading);
  root.style.setProperty("--font-mono", theme.typography.fontFamilyMonospace);
  
  // Apply other CSS custom properties as needed
}