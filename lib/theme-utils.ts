import { ThemeSchema } from "@/types/theme";
import { Doc } from "@/convex/_generated/dataModel";

// Deep merge function for theme objects
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === "object" &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(
          result[key] as Record<string, any>,
          source[key] as Record<string, any>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

// Apply theme overrides to base theme
export function applyThemeOverrides(
  baseTheme: ThemeSchema,
  overrides?: any
): ThemeSchema {
  if (!overrides) return baseTheme;
  return deepMerge(baseTheme, overrides);
}

// Convert legacy theme to theme overrides
export function legacyThemeToOverrides(legacyTheme?: Doc<"businesses">["theme"]) {
  if (!legacyTheme) return undefined;

  const overrides: any = {};

  // Convert colors
  if (legacyTheme.primaryColor || legacyTheme.secondaryColor || legacyTheme.accentColor) {
    overrides.colors = {
      light: {},
      dark: {},
    };

    if (legacyTheme.primaryColor) {
      overrides.colors.light.primary = legacyTheme.primaryColor;
      overrides.colors.dark.primary = legacyTheme.primaryColor;
    }

    if (legacyTheme.secondaryColor) {
      overrides.colors.light.secondary = legacyTheme.secondaryColor;
      overrides.colors.dark.secondary = legacyTheme.secondaryColor;
    }

    if (legacyTheme.accentColor) {
      overrides.colors.light.accent = legacyTheme.accentColor;
      overrides.colors.dark.accent = legacyTheme.accentColor;
    }
  }

  // Convert typography
  if (legacyTheme.fontFamily) {
    overrides.typography = {
      fontFamilyBase: legacyTheme.fontFamily,
      fontFamilyHeading: legacyTheme.fontFamily,
    };
  }

  return Object.keys(overrides).length > 0 ? overrides : undefined;
}

// Generate CSS variables from theme
export function generateThemeCSSVariables(
  theme: ThemeSchema,
  isDark = false
): string {
  const colors = isDark && theme.colors.dark ? theme.colors.dark : theme.colors.light;
  let css = ":root {\n";

  // Color variables
  Object.entries(colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    css += `  --${cssKey}: ${value};\n`;
  });

  // Typography variables
  css += `  --font-base: ${theme.typography.fontFamilyBase};\n`;
  css += `  --font-heading: ${theme.typography.fontFamilyHeading};\n`;
  css += `  --font-mono: ${theme.typography.fontFamilyMonospace};\n`;

  // Font size variables
  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    css += `  --font-size-${key}: ${value};\n`;
  });

  // Spacing variables
  Object.entries(theme.spacing.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });

  // Border radius variables
  Object.entries(theme.effects.borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });

  // Shadow variables
  Object.entries(theme.effects.boxShadow).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });

  css += "}\n";

  // Component-specific CSS
  css += generateComponentCSS(theme);

  return css;
}

// Generate component-specific CSS
function generateComponentCSS(theme: ThemeSchema): string {
  let css = "";

  // Button styles
  const button = theme.components.button;
  
  css += `.btn {
  font-weight: ${button.fontWeight};
  border-radius: ${button.borderRadius};
  transition: ${button.transition};
}\n\n`;

  // Button variants
  Object.entries(button.variants).forEach(([variant, styles]) => {
    css += `.btn-${variant} {
  ${styles.base}
}
.btn-${variant}:hover {
  ${styles.hover}
}
.btn-${variant}:active {
  ${styles.active}
}
.btn-${variant}:disabled {
  ${styles.disabled}
}\n\n`;
  });

  // Button sizes
  Object.entries(button.sizes).forEach(([size, styles]) => {
    css += `.btn-${size} {
  padding: ${styles.padding};
  font-size: ${styles.fontSize};
  height: ${styles.height};
}\n\n`;
  });

  // Link styles
  const link = theme.components.link;
  css += `a {
  ${link.base}
  ${link.underline ? "text-decoration: underline;" : "text-decoration: none;"}
  transition: ${link.transition};
}
a:hover {
  ${link.hover}
}
a:visited {
  ${link.visited}
}\n\n`;

  // Card styles
  const card = theme.components.card;
  css += `.card {
  border-radius: ${card.borderRadius};
  box-shadow: ${card.boxShadow};
  padding: ${card.padding};
  border-width: ${card.borderWidth};
  border-color: var(--${card.borderColor});
}\n\n`;

  // Input styles
  const input = theme.components.input;
  css += `.input {
  border-radius: ${input.borderRadius};
  border-width: ${input.borderWidth};
  border-color: var(--${input.borderColor});
  padding: ${input.padding};
  font-size: ${input.fontSize};
  transition: ${input.transition};
}
.input:focus {
  border-color: var(--${input.focusBorderColor});
  outline: none;
}\n\n`;

  return css;
}

// Get computed theme styles for a business
export async function getBusinessThemeStyles(
  business: Doc<"businesses">,
  theme?: Doc<"themes"> | null
): Promise<{ theme: ThemeSchema; css: string } | null> {
  // If no theme is set, return null
  if (!business.themeId && !business.theme) {
    return null;
  }

  // If using new theme system
  if (business.themeId && theme) {
    const finalTheme = applyThemeOverrides(
      theme.config as unknown as ThemeSchema,
      business.themeOverrides
    );
    
    const css = generateThemeCSSVariables(finalTheme);
    return { theme: finalTheme, css };
  }

  // If using legacy theme, convert it
  if (business.theme) {
    // Use a default theme as base and apply legacy overrides
    const { modernMinimalTheme } = await import("@/lib/theme-presets");
    const overrides = legacyThemeToOverrides(business.theme);
    const finalTheme = applyThemeOverrides(modernMinimalTheme, overrides);
    const css = generateThemeCSSVariables(finalTheme);
    return { theme: finalTheme, css };
  }

  return null;
}

// Check if business is using legacy theme
export function isUsingLegacyTheme(business: Doc<"businesses">): boolean {
  return !business.themeId && !!business.theme;
}

// Get theme preview CSS for editor
export function getThemePreviewCSS(theme: ThemeSchema, selector = ".preview"): string {
  const colors = theme.colors.light;
  let css = `${selector} {\n`;

  // Apply color variables scoped to preview
  Object.entries(colors).forEach(([key, value]) => {
    const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    css += `  --${cssKey}: ${value};\n`;
  });

  // Typography
  css += `  font-family: ${theme.typography.fontFamilyBase};\n`;

  css += "}\n";
  return css;
}