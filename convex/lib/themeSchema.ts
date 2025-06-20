import { v } from "convex/values";

// Color value object
const colorValue = v.string();

// Color schema for light/dark modes
export const colorSchemaV = v.object({
  // Base colors
  primary: colorValue,
  primaryForeground: colorValue,
  secondary: colorValue,
  secondaryForeground: colorValue,
  accent: colorValue,
  accentForeground: colorValue,
  
  // Semantic colors
  background: colorValue,
  foreground: colorValue,
  card: colorValue,
  cardForeground: colorValue,
  popover: colorValue,
  popoverForeground: colorValue,
  muted: colorValue,
  mutedForeground: colorValue,
  
  // UI colors
  border: colorValue,
  input: colorValue,
  ring: colorValue,
  
  // State colors
  destructive: colorValue,
  destructiveForeground: colorValue,
  success: colorValue,
  successForeground: colorValue,
  warning: colorValue,
  warningForeground: colorValue,
  info: colorValue,
  infoForeground: colorValue,
});

// Typography schema
export const typographySchemaV = v.object({
  // Font families
  fontFamilyBase: v.string(),
  fontFamilyHeading: v.string(),
  fontFamilyMonospace: v.string(),
  
  // Font size scale (stored as rem values)
  fontSize: v.object({
    xs: v.string(),
    sm: v.string(),
    base: v.string(),
    lg: v.string(),
    xl: v.string(),
    xl2: v.string(),
    xl3: v.string(),
    xl4: v.string(),
    xl5: v.string(),
    xl6: v.string(),
    xl7: v.string(),
    xl8: v.string(),
    xl9: v.string(),
  }),
  
  // Font weights
  fontWeight: v.object({
    thin: v.number(),
    extralight: v.number(),
    light: v.number(),
    normal: v.number(),
    medium: v.number(),
    semibold: v.number(),
    bold: v.number(),
    extrabold: v.number(),
    black: v.number(),
  }),
  
  // Line heights
  lineHeight: v.object({
    none: v.string(),
    tight: v.string(),
    snug: v.string(),
    normal: v.string(),
    relaxed: v.string(),
    loose: v.string(),
  }),
  
  // Letter spacing
  letterSpacing: v.object({
    tighter: v.string(),
    tight: v.string(),
    normal: v.string(),
    wide: v.string(),
    wider: v.string(),
    widest: v.string(),
  }),
});

// Spacing schema
export const spacingSchemaV = v.object({
  // Base spacing scale
  spacing: v.object({
    s0: v.string(),
    s0_5: v.string(),
    s1: v.string(),
    s1_5: v.string(),
    s2: v.string(),
    s2_5: v.string(),
    s3: v.string(),
    s3_5: v.string(),
    s4: v.string(),
    s5: v.string(),
    s6: v.string(),
    s7: v.string(),
    s8: v.string(),
    s9: v.string(),
    s10: v.string(),
    s11: v.string(),
    s12: v.string(),
    s14: v.string(),
    s16: v.string(),
    s20: v.string(),
    s24: v.string(),
    s28: v.string(),
    s32: v.string(),
    s36: v.string(),
    s40: v.string(),
    s44: v.string(),
    s48: v.string(),
    s52: v.string(),
    s56: v.string(),
    s60: v.string(),
    s64: v.string(),
    s72: v.string(),
    s80: v.string(),
    s96: v.string(),
  }),
  
  // Container sizes
  container: v.object({
    sm: v.string(),
    md: v.string(),
    lg: v.string(),
    xl: v.string(),
    xl2: v.string(),
    full: v.string(),
  }),
  
  // Section spacing
  sectionSpacing: v.object({
    none: v.string(),
    sm: v.string(),
    md: v.string(),
    lg: v.string(),
    xl: v.string(),
    xl2: v.string(),
  }),
});

// Effects schema
export const effectsSchemaV = v.object({
  // Border radius
  borderRadius: v.object({
    none: v.string(),
    sm: v.string(),
    base: v.string(),
    md: v.string(),
    lg: v.string(),
    xl: v.string(),
    xl2: v.string(),
    xl3: v.string(),
    full: v.string(),
  }),
  
  // Box shadows
  boxShadow: v.object({
    none: v.string(),
    sm: v.string(),
    base: v.string(),
    md: v.string(),
    lg: v.string(),
    xl: v.string(),
    xl2: v.string(),
    inner: v.string(),
  }),
  
  // Transitions
  transition: v.object({
    none: v.string(),
    all: v.string(),
    colors: v.string(),
    opacity: v.string(),
    shadow: v.string(),
    transform: v.string(),
  }),
  
  // Animation
  animation: v.object({
    none: v.string(),
    spin: v.string(),
    ping: v.string(),
    pulse: v.string(),
    bounce: v.string(),
    fadeIn: v.string(),
    fadeOut: v.string(),
    slideUp: v.string(),
    slideDown: v.string(),
  }),
});

// Button variant schema
const buttonVariantV = v.object({
  base: v.string(),
  hover: v.string(),
  active: v.string(),
  disabled: v.string(),
});

// Button size schema
const buttonSizeV = v.object({
  padding: v.string(),
  fontSize: v.string(),
  height: v.string(),
});

// Component styles schema
export const componentStylesSchemaV = v.object({
  // Button styles
  button: v.object({
    variants: v.object({
      primary: buttonVariantV,
      secondary: buttonVariantV,
      outline: buttonVariantV,
      ghost: buttonVariantV,
    }),
    sizes: v.object({
      sm: buttonSizeV,
      md: buttonSizeV,
      lg: buttonSizeV,
    }),
    borderRadius: v.string(),
    fontWeight: v.string(),
    transition: v.string(),
  }),
  
  // Link styles
  link: v.object({
    base: v.string(),
    hover: v.string(),
    visited: v.string(),
    underline: v.boolean(),
    transition: v.string(),
  }),
  
  // Card styles
  card: v.object({
    borderRadius: v.string(),
    boxShadow: v.string(),
    padding: v.string(),
    borderWidth: v.string(),
    borderColor: v.string(),
  }),
  
  // Input/Form styles
  input: v.object({
    borderRadius: v.string(),
    borderWidth: v.string(),
    borderColor: v.string(),
    focusBorderColor: v.string(),
    padding: v.string(),
    fontSize: v.string(),
    transition: v.string(),
  }),
});

// Section styles schema
export const sectionStylesSchemaV = v.object({
  hero: v.object({
    minHeight: v.string(),
    padding: v.string(),
    textAlign: v.union(v.literal("left"), v.literal("center"), v.literal("right")),
    overlayOpacity: v.number(),
  }),
  about: v.object({
    padding: v.string(),
    maxWidth: v.string(),
    textAlign: v.union(
      v.literal("left"),
      v.literal("center"),
      v.literal("right"),
      v.literal("justify")
    ),
  }),
  gallery: v.object({
    padding: v.string(),
    gridCols: v.number(),
    gap: v.string(),
    aspectRatio: v.union(
      v.literal("square"),
      v.literal("video"),
      v.literal("portrait"),
      v.literal("landscape"),
      v.literal("auto")
    ),
  }),
  contact: v.object({
    padding: v.string(),
    layout: v.union(v.literal("single"), v.literal("split"), v.literal("centered")),
    formWidth: v.string(),
  }),
  reviews: v.object({
    padding: v.string(),
    layout: v.union(v.literal("grid"), v.literal("list"), v.literal("carousel")),
    itemsPerRow: v.number(),
  }),
});

// Main theme schema
export const advancedThemeSchemaV = v.object({
  // Metadata
  id: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  version: v.string(),
  
  // Dark mode support
  darkMode: v.boolean(),
  
  // Color schemes
  colors: v.object({
    light: colorSchemaV,
    dark: v.optional(colorSchemaV),
  }),
  
  // Typography
  typography: typographySchemaV,
  
  // Spacing
  spacing: spacingSchemaV,
  
  // Effects
  effects: effectsSchemaV,
  
  // Component styles
  components: componentStylesSchemaV,
  
  // Section-specific styles
  sections: sectionStylesSchemaV,
  
  // Custom CSS
  customCss: v.optional(v.string()),
});

// Partial theme schema for overrides
export const partialAdvancedThemeSchemaV = v.object({
  // All fields are optional for overrides
  colors: v.optional(v.object({
    light: v.optional(v.object({
      primary: v.optional(colorValue),
      primaryForeground: v.optional(colorValue),
      secondary: v.optional(colorValue),
      secondaryForeground: v.optional(colorValue),
      accent: v.optional(colorValue),
      accentForeground: v.optional(colorValue),
      background: v.optional(colorValue),
      foreground: v.optional(colorValue),
      card: v.optional(colorValue),
      cardForeground: v.optional(colorValue),
      popover: v.optional(colorValue),
      popoverForeground: v.optional(colorValue),
      muted: v.optional(colorValue),
      mutedForeground: v.optional(colorValue),
      border: v.optional(colorValue),
      input: v.optional(colorValue),
      ring: v.optional(colorValue),
      destructive: v.optional(colorValue),
      destructiveForeground: v.optional(colorValue),
      success: v.optional(colorValue),
      successForeground: v.optional(colorValue),
      warning: v.optional(colorValue),
      warningForeground: v.optional(colorValue),
      info: v.optional(colorValue),
      infoForeground: v.optional(colorValue),
    })),
    dark: v.optional(v.object({
      primary: v.optional(colorValue),
      primaryForeground: v.optional(colorValue),
      secondary: v.optional(colorValue),
      secondaryForeground: v.optional(colorValue),
      accent: v.optional(colorValue),
      accentForeground: v.optional(colorValue),
      background: v.optional(colorValue),
      foreground: v.optional(colorValue),
      card: v.optional(colorValue),
      cardForeground: v.optional(colorValue),
      popover: v.optional(colorValue),
      popoverForeground: v.optional(colorValue),
      muted: v.optional(colorValue),
      mutedForeground: v.optional(colorValue),
      border: v.optional(colorValue),
      input: v.optional(colorValue),
      ring: v.optional(colorValue),
      destructive: v.optional(colorValue),
      destructiveForeground: v.optional(colorValue),
      success: v.optional(colorValue),
      successForeground: v.optional(colorValue),
      warning: v.optional(colorValue),
      warningForeground: v.optional(colorValue),
      info: v.optional(colorValue),
      infoForeground: v.optional(colorValue),
    })),
  })),
  
  typography: v.optional(v.object({
    fontFamilyBase: v.optional(v.string()),
    fontFamilyHeading: v.optional(v.string()),
    fontFamilyMonospace: v.optional(v.string()),
    fontSize: v.optional(v.object({
      xs: v.optional(v.string()),
      sm: v.optional(v.string()),
      base: v.optional(v.string()),
      lg: v.optional(v.string()),
      xl: v.optional(v.string()),
      xl2: v.optional(v.string()),
      xl3: v.optional(v.string()),
      xl4: v.optional(v.string()),
      xl5: v.optional(v.string()),
      xl6: v.optional(v.string()),
      xl7: v.optional(v.string()),
      xl8: v.optional(v.string()),
      xl9: v.optional(v.string()),
    })),
    fontWeight: v.optional(v.object({
      thin: v.optional(v.number()),
      extralight: v.optional(v.number()),
      light: v.optional(v.number()),
      normal: v.optional(v.number()),
      medium: v.optional(v.number()),
      semibold: v.optional(v.number()),
      bold: v.optional(v.number()),
      extrabold: v.optional(v.number()),
      black: v.optional(v.number()),
    })),
    lineHeight: v.optional(v.object({
      none: v.optional(v.string()),
      tight: v.optional(v.string()),
      snug: v.optional(v.string()),
      normal: v.optional(v.string()),
      relaxed: v.optional(v.string()),
      loose: v.optional(v.string()),
    })),
    letterSpacing: v.optional(v.object({
      tighter: v.optional(v.string()),
      tight: v.optional(v.string()),
      normal: v.optional(v.string()),
      wide: v.optional(v.string()),
      wider: v.optional(v.string()),
      widest: v.optional(v.string()),
    })),
  })),
  
  spacing: v.optional(v.object({
    spacing: v.optional(v.object({
      s0: v.optional(v.string()),
      s0_5: v.optional(v.string()),
      s1: v.optional(v.string()),
      s1_5: v.optional(v.string()),
      s2: v.optional(v.string()),
      s2_5: v.optional(v.string()),
      s3: v.optional(v.string()),
      s3_5: v.optional(v.string()),
      s4: v.optional(v.string()),
      s5: v.optional(v.string()),
      s6: v.optional(v.string()),
      s7: v.optional(v.string()),
      s8: v.optional(v.string()),
      s9: v.optional(v.string()),
      s10: v.optional(v.string()),
      s11: v.optional(v.string()),
      s12: v.optional(v.string()),
      s14: v.optional(v.string()),
      s16: v.optional(v.string()),
      s20: v.optional(v.string()),
      s24: v.optional(v.string()),
      s28: v.optional(v.string()),
      s32: v.optional(v.string()),
      s36: v.optional(v.string()),
      s40: v.optional(v.string()),
      s44: v.optional(v.string()),
      s48: v.optional(v.string()),
      s52: v.optional(v.string()),
      s56: v.optional(v.string()),
      s60: v.optional(v.string()),
      s64: v.optional(v.string()),
      s72: v.optional(v.string()),
      s80: v.optional(v.string()),
      s96: v.optional(v.string()),
    })),
    container: v.optional(v.object({
      sm: v.optional(v.string()),
      md: v.optional(v.string()),
      lg: v.optional(v.string()),
      xl: v.optional(v.string()),
      xl2: v.optional(v.string()),
      full: v.optional(v.string()),
    })),
    sectionSpacing: v.optional(v.object({
      none: v.optional(v.string()),
      sm: v.optional(v.string()),
      md: v.optional(v.string()),
      lg: v.optional(v.string()),
      xl: v.optional(v.string()),
      xl2: v.optional(v.string()),
    })),
  })),
  effects: v.optional(v.object({
    borderRadius: v.optional(v.object({
      none: v.optional(v.string()),
      sm: v.optional(v.string()),
      base: v.optional(v.string()),
      md: v.optional(v.string()),
      lg: v.optional(v.string()),
      xl: v.optional(v.string()),
      xl2: v.optional(v.string()),
      xl3: v.optional(v.string()),
      full: v.optional(v.string()),
    })),
    boxShadow: v.optional(v.object({
      none: v.optional(v.string()),
      sm: v.optional(v.string()),
      base: v.optional(v.string()),
      md: v.optional(v.string()),
      lg: v.optional(v.string()),
      xl: v.optional(v.string()),
      xl2: v.optional(v.string()),
      inner: v.optional(v.string()),
    })),
    transition: v.optional(v.object({
      none: v.optional(v.string()),
      all: v.optional(v.string()),
      colors: v.optional(v.string()),
      opacity: v.optional(v.string()),
      shadow: v.optional(v.string()),
      transform: v.optional(v.string()),
    })),
    animation: v.optional(v.object({
      none: v.optional(v.string()),
      spin: v.optional(v.string()),
      ping: v.optional(v.string()),
      pulse: v.optional(v.string()),
      bounce: v.optional(v.string()),
      fadeIn: v.optional(v.string()),
      fadeOut: v.optional(v.string()),
      slideUp: v.optional(v.string()),
      slideDown: v.optional(v.string()),
    })),
  })),
  components: v.optional(v.object({
    button: v.optional(v.object({
      variants: v.optional(v.object({
        primary: v.optional(v.object({
          base: v.optional(v.string()),
          hover: v.optional(v.string()),
          active: v.optional(v.string()),
          disabled: v.optional(v.string()),
        })),
        secondary: v.optional(v.object({
          base: v.optional(v.string()),
          hover: v.optional(v.string()),
          active: v.optional(v.string()),
          disabled: v.optional(v.string()),
        })),
        outline: v.optional(v.object({
          base: v.optional(v.string()),
          hover: v.optional(v.string()),
          active: v.optional(v.string()),
          disabled: v.optional(v.string()),
        })),
        ghost: v.optional(v.object({
          base: v.optional(v.string()),
          hover: v.optional(v.string()),
          active: v.optional(v.string()),
          disabled: v.optional(v.string()),
        })),
      })),
      sizes: v.optional(v.object({
        sm: v.optional(v.object({
          padding: v.optional(v.string()),
          fontSize: v.optional(v.string()),
          height: v.optional(v.string()),
        })),
        md: v.optional(v.object({
          padding: v.optional(v.string()),
          fontSize: v.optional(v.string()),
          height: v.optional(v.string()),
        })),
        lg: v.optional(v.object({
          padding: v.optional(v.string()),
          fontSize: v.optional(v.string()),
          height: v.optional(v.string()),
        })),
      })),
      borderRadius: v.optional(v.string()),
      fontWeight: v.optional(v.string()),
      transition: v.optional(v.string()),
    })),
    link: v.optional(v.object({
      base: v.optional(v.string()),
      hover: v.optional(v.string()),
      visited: v.optional(v.string()),
      underline: v.optional(v.boolean()),
      transition: v.optional(v.string()),
    })),
    card: v.optional(v.object({
      borderRadius: v.optional(v.string()),
      boxShadow: v.optional(v.string()),
      padding: v.optional(v.string()),
      borderWidth: v.optional(v.string()),
      borderColor: v.optional(v.string()),
    })),
    input: v.optional(v.object({
      borderRadius: v.optional(v.string()),
      borderWidth: v.optional(v.string()),
      borderColor: v.optional(v.string()),
      focusBorderColor: v.optional(v.string()),
      padding: v.optional(v.string()),
      fontSize: v.optional(v.string()),
      transition: v.optional(v.string()),
    })),
  })),
  sections: v.optional(v.object({
    hero: v.optional(v.object({
      minHeight: v.optional(v.string()),
      padding: v.optional(v.string()),
      textAlign: v.optional(v.union(v.literal("left"), v.literal("center"), v.literal("right"))),
      overlayOpacity: v.optional(v.number()),
    })),
    about: v.optional(v.object({
      padding: v.optional(v.string()),
      maxWidth: v.optional(v.string()),
      textAlign: v.optional(v.union(
        v.literal("left"),
        v.literal("center"),
        v.literal("right"),
        v.literal("justify")
      )),
    })),
    gallery: v.optional(v.object({
      padding: v.optional(v.string()),
      gridCols: v.optional(v.number()),
      gap: v.optional(v.string()),
      aspectRatio: v.optional(v.string()),
    })),
    contact: v.optional(v.object({
      padding: v.optional(v.string()),
      maxWidth: v.optional(v.string()),
    })),
    footer: v.optional(v.object({
      padding: v.optional(v.string()),
    })),
  })),
  customCss: v.optional(v.string()),
});

// Backward-compatible simple theme schema
export const simpleThemeSchemaV = v.object({
  colorScheme: v.optional(v.string()),
  primaryColor: v.optional(v.string()),
  secondaryColor: v.optional(v.string()),
  accentColor: v.optional(v.string()),
  fontFamily: v.optional(v.string()),
  logoUrl: v.optional(v.string()),
});