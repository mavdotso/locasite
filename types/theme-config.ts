// This file matches the Convex schema from convex/themeSchema.ts
// It provides TypeScript types for theme configuration

export interface ColorSchema {
  // Base colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // Semantic colors
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  
  // UI colors
  border: string;
  input: string;
  ring: string;
  
  // State colors
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

export interface TypographySchema {
  // Font families
  fontFamilyBase: string;
  fontFamilyHeading: string;
  fontFamilyMonospace: string;
  
  // Font size scale (stored as rem values)
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    xl2: string;
    xl3: string;
    xl4: string;
    xl5: string;
    xl6: string;
    xl7: string;
    xl8: string;
    xl9: string;
  };
  
  // Font weights
  fontWeight: {
    thin: number;
    extralight: number;
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
    black: number;
  };
  
  // Line heights
  lineHeight: {
    none: string;
    tight: string;
    snug: string;
    normal: string;
    relaxed: string;
    loose: string;
  };
  
  // Letter spacing
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

export interface SpacingSchema {
  // Base spacing scale
  spacing: {
    s0: string;
    s0_5: string;
    s1: string;
    s1_5: string;
    s2: string;
    s2_5: string;
    s3: string;
    s3_5: string;
    s4: string;
    s5: string;
    s6: string;
    s7: string;
    s8: string;
    s9: string;
    s10: string;
    s11: string;
    s12: string;
    s14: string;
    s16: string;
    s20: string;
    s24: string;
    s28: string;
    s32: string;
    s36: string;
    s40: string;
    s44: string;
    s48: string;
    s52: string;
    s56: string;
    s60: string;
    s64: string;
    s72: string;
    s80: string;
    s96: string;
  };
  
  // Container sizes
  container: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xl2: string;
    full: string;
  };
  
  // Section spacing
  sectionSpacing: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xl2: string;
  };
}

export interface EffectsSchema {
  // Border radius
  borderRadius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    xl2: string;
    xl3: string;
    full: string;
  };
  
  // Box shadows
  boxShadow: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    xl2: string;
    inner: string;
  };
  
  // Transitions
  transition: {
    none: string;
    all: string;
    colors: string;
    opacity: string;
    shadow: string;
    transform: string;
  };
  
  // Animation
  animation: {
    none: string;
    spin: string;
    ping: string;
    pulse: string;
    bounce: string;
    fadeIn: string;
    fadeOut: string;
    slideUp: string;
    slideDown: string;
  };
}

export interface ButtonVariant {
  base: string;
  hover: string;
  active: string;
  disabled: string;
}

export interface ButtonSize {
  padding: string;
  fontSize: string;
  height: string;
}

export interface ComponentStylesSchema {
  // Button styles
  button: {
    variants: {
      primary: ButtonVariant;
      secondary: ButtonVariant;
      outline: ButtonVariant;
      ghost: ButtonVariant;
    };
    sizes: {
      sm: ButtonSize;
      md: ButtonSize;
      lg: ButtonSize;
    };
    borderRadius: string;
    fontWeight: string;
    transition: string;
  };
  
  // Link styles
  link: {
    base: string;
    hover: string;
    visited: string;
    underline: boolean;
    transition: string;
  };
  
  // Card styles
  card: {
    borderRadius: string;
    boxShadow: string;
    padding: string;
    borderWidth: string;
    borderColor: string;
  };
  
  // Input/Form styles
  input: {
    borderRadius: string;
    borderWidth: string;
    borderColor: string;
    focusBorderColor: string;
    padding: string;
    fontSize: string;
    transition: string;
  };
}

export interface SectionStylesSchema {
  hero: {
    minHeight: string;
    padding: string;
    textAlign: "left" | "center" | "right";
    overlayOpacity: number;
  };
  about: {
    padding: string;
    maxWidth: string;
    textAlign: "left" | "center" | "right" | "justify";
  };
  gallery: {
    padding: string;
    gridCols: number;
    gap: string;
    aspectRatio: "square" | "video" | "portrait" | "landscape" | "auto";
  };
  contact: {
    padding: string;
    layout: "single" | "split" | "centered";
    formWidth: string;
  };
  reviews: {
    padding: string;
    layout: "grid" | "list" | "carousel";
    itemsPerRow: number;
  };
}

export interface AdvancedThemeConfig {
  // Metadata
  id: string;
  name: string;
  description?: string;
  version: string;
  
  // Dark mode support
  darkMode: boolean;
  
  // Color schemes
  colors: {
    light: ColorSchema;
    dark?: ColorSchema;
  };
  
  // Typography
  typography: TypographySchema;
  
  // Spacing
  spacing: SpacingSchema;
  
  // Effects
  effects: EffectsSchema;
  
  // Component styles
  components: ComponentStylesSchema;
  
  // Section-specific styles
  sections: SectionStylesSchema;
  
  // Custom CSS
  customCss?: string;
}

// Type guard function
export function isAdvancedThemeConfig(value: unknown): value is AdvancedThemeConfig {
  if (!value || typeof value !== 'object') return false;
  
  const theme = value as Record<string, unknown>;
  
  // Check required top-level properties
  return (
    typeof theme.id === 'string' &&
    typeof theme.name === 'string' &&
    typeof theme.version === 'string' &&
    typeof theme.darkMode === 'boolean' &&
    theme.colors !== undefined &&
    theme.typography !== undefined &&
    theme.spacing !== undefined &&
    theme.effects !== undefined &&
    theme.components !== undefined &&
    theme.sections !== undefined
  );
}