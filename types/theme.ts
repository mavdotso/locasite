import { z } from "zod";

// Color System Types
export const ColorSchemaZ = z.object({
  // Base colors
  primary: z.string(),
  primaryForeground: z.string(),
  secondary: z.string(),
  secondaryForeground: z.string(),
  accent: z.string(),
  accentForeground: z.string(),
  
  // Semantic colors
  background: z.string(),
  foreground: z.string(),
  card: z.string(),
  cardForeground: z.string(),
  popover: z.string(),
  popoverForeground: z.string(),
  muted: z.string(),
  mutedForeground: z.string(),
  
  // UI colors
  border: z.string(),
  input: z.string(),
  ring: z.string(),
  
  // State colors
  destructive: z.string(),
  destructiveForeground: z.string(),
  success: z.string(),
  successForeground: z.string(),
  warning: z.string(),
  warningForeground: z.string(),
  info: z.string(),
  infoForeground: z.string(),
});

export type ColorSchema = z.infer<typeof ColorSchemaZ>;

// Typography System Types
export const TypographySchemaZ = z.object({
  // Font families
  fontFamilyBase: z.string(),
  fontFamilyHeading: z.string(),
  fontFamilyMonospace: z.string(),
  
  // Font sizes
  fontSize: z.object({
    xs: z.string(),
    sm: z.string(),
    base: z.string(),
    lg: z.string(),
    xl: z.string(),
    xl2: z.string(),
    xl3: z.string(),
    xl4: z.string(),
    xl5: z.string(),
    xl6: z.string(),
    xl7: z.string(),
    xl8: z.string(),
    xl9: z.string(),
  }),
  
  // Font weights
  fontWeight: z.object({
    thin: z.number(),
    extralight: z.number(),
    light: z.number(),
    normal: z.number(),
    medium: z.number(),
    semibold: z.number(),
    bold: z.number(),
    extrabold: z.number(),
    black: z.number(),
  }),
  
  // Line heights
  lineHeight: z.object({
    none: z.string(),
    tight: z.string(),
    snug: z.string(),
    normal: z.string(),
    relaxed: z.string(),
    loose: z.string(),
  }),
  
  // Letter spacing
  letterSpacing: z.object({
    tighter: z.string(),
    tight: z.string(),
    normal: z.string(),
    wide: z.string(),
    wider: z.string(),
    widest: z.string(),
  }),
});

export type TypographySchema = z.infer<typeof TypographySchemaZ>;

// Spacing System Types
export const SpacingSchemaZ = z.object({
  // Base spacing scale
  spacing: z.object({
    s0: z.string(),
    s0_5: z.string(),
    s1: z.string(),
    s1_5: z.string(),
    s2: z.string(),
    s2_5: z.string(),
    s3: z.string(),
    s3_5: z.string(),
    s4: z.string(),
    s5: z.string(),
    s6: z.string(),
    s7: z.string(),
    s8: z.string(),
    s9: z.string(),
    s10: z.string(),
    s11: z.string(),
    s12: z.string(),
    s14: z.string(),
    s16: z.string(),
    s20: z.string(),
    s24: z.string(),
    s28: z.string(),
    s32: z.string(),
    s36: z.string(),
    s40: z.string(),
    s44: z.string(),
    s48: z.string(),
    s52: z.string(),
    s56: z.string(),
    s60: z.string(),
    s64: z.string(),
    s72: z.string(),
    s80: z.string(),
    s96: z.string(),
  }),
  
  // Container sizes
  container: z.object({
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    xl2: z.string(),
    full: z.string(),
  }),
  
  // Section spacing
  sectionSpacing: z.object({
    none: z.string(),
    sm: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    xl2: z.string(),
  }),
});

export type SpacingSchema = z.infer<typeof SpacingSchemaZ>;

// Border and Effects Types
export const EffectsSchemaZ = z.object({
  // Border radius
  borderRadius: z.object({
    none: z.string(),
    sm: z.string(),
    base: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    xl2: z.string(),
    xl3: z.string(),
    full: z.string(),
  }),
  
  // Box shadows
  boxShadow: z.object({
    none: z.string(),
    sm: z.string(),
    base: z.string(),
    md: z.string(),
    lg: z.string(),
    xl: z.string(),
    xl2: z.string(),
    inner: z.string(),
  }),
  
  // Transitions
  transition: z.object({
    none: z.string(),
    all: z.string(),
    colors: z.string(),
    opacity: z.string(),
    shadow: z.string(),
    transform: z.string(),
  }),
  
  // Animation
  animation: z.object({
    none: z.string(),
    spin: z.string(),
    ping: z.string(),
    pulse: z.string(),
    bounce: z.string(),
    fadeIn: z.string(),
    fadeOut: z.string(),
    slideUp: z.string(),
    slideDown: z.string(),
  }),
});

export type EffectsSchema = z.infer<typeof EffectsSchemaZ>;

// Component Styles Types
export const ComponentStylesSchemaZ = z.object({
  // Button styles
  button: z.object({
    variants: z.object({
      primary: z.object({
        base: z.string(),
        hover: z.string(),
        active: z.string(),
        disabled: z.string(),
      }),
      secondary: z.object({
        base: z.string(),
        hover: z.string(),
        active: z.string(),
        disabled: z.string(),
      }),
      outline: z.object({
        base: z.string(),
        hover: z.string(),
        active: z.string(),
        disabled: z.string(),
      }),
      ghost: z.object({
        base: z.string(),
        hover: z.string(),
        active: z.string(),
        disabled: z.string(),
      }),
    }),
    sizes: z.object({
      sm: z.object({
        padding: z.string(),
        fontSize: z.string(),
        height: z.string(),
      }),
      md: z.object({
        padding: z.string(),
        fontSize: z.string(),
        height: z.string(),
      }),
      lg: z.object({
        padding: z.string(),
        fontSize: z.string(),
        height: z.string(),
      }),
    }),
    borderRadius: z.string(),
    fontWeight: z.string(),
    transition: z.string(),
  }),
  
  // Link styles
  link: z.object({
    base: z.string(),
    hover: z.string(),
    visited: z.string(),
    underline: z.boolean(),
    transition: z.string(),
  }),
  
  // Card styles
  card: z.object({
    borderRadius: z.string(),
    boxShadow: z.string(),
    padding: z.string(),
    borderWidth: z.string(),
    borderColor: z.string(),
  }),
  
  // Input/Form styles
  input: z.object({
    borderRadius: z.string(),
    borderWidth: z.string(),
    borderColor: z.string(),
    focusBorderColor: z.string(),
    padding: z.string(),
    fontSize: z.string(),
    transition: z.string(),
  }),
});

export type ComponentStylesSchema = z.infer<typeof ComponentStylesSchemaZ>;

// Section-specific styles
export const SectionStylesSchemaZ = z.object({
  hero: z.object({
    minHeight: z.string(),
    padding: z.string(),
    textAlign: z.enum(["left", "center", "right"]),
    overlayOpacity: z.number().min(0).max(1),
  }),
  about: z.object({
    padding: z.string(),
    maxWidth: z.string(),
    textAlign: z.enum(["left", "center", "right", "justify"]),
  }),
  gallery: z.object({
    padding: z.string(),
    gridCols: z.number().min(1).max(6),
    gap: z.string(),
    aspectRatio: z.enum(["square", "video", "portrait", "landscape", "auto"]),
  }),
  contact: z.object({
    padding: z.string(),
    layout: z.enum(["single", "split", "centered"]),
    formWidth: z.string(),
  }),
  reviews: z.object({
    padding: z.string(),
    layout: z.enum(["grid", "list", "carousel"]),
    itemsPerRow: z.number().min(1).max(4),
  }),
});

export type SectionStylesSchema = z.infer<typeof SectionStylesSchemaZ>;

// Main Theme Schema
export const ThemeSchemaZ = z.object({
  // Metadata
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  
  // Dark mode support
  darkMode: z.boolean(),
  
  // Color schemes
  colors: z.object({
    light: ColorSchemaZ,
    dark: ColorSchemaZ.optional(),
  }),
  
  // Typography
  typography: TypographySchemaZ,
  
  // Spacing
  spacing: SpacingSchemaZ,
  
  // Effects
  effects: EffectsSchemaZ,
  
  // Component styles
  components: ComponentStylesSchemaZ,
  
  // Section-specific styles
  sections: SectionStylesSchemaZ,
  
  // Custom CSS
  customCss: z.string().optional(),
});

export type ThemeSchema = z.infer<typeof ThemeSchemaZ>;

// Theme preset type
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: string;
  theme: ThemeSchema;
  tags: string[];
  industry?: string;
}

// Helper type for partial theme updates
export type PartialTheme = DeepPartial<ThemeSchema>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};