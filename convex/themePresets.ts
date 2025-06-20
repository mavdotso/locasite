// Theme type definitions (matching the schema)
export interface ThemeSchema {
  id: string;
  name: string;
  description?: string;
  version: string;
  darkMode: boolean;
  colors: {
    light: ColorSchema;
    dark?: ColorSchema;
  };
  typography: TypographySchema;
  spacing: SpacingSchema;
  effects: EffectsSchema;
  components: ComponentStylesSchema;
  sections: SectionStylesSchema;
  customCss?: string;
}

interface ColorSchema {
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

interface TypographySchema {
  fontFamilyBase: string;
  fontFamilyHeading: string;
  fontFamilyMonospace: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
}

interface SpacingSchema {
  spacing: Record<string, string>;
  container: Record<string, string>;
  sectionSpacing: Record<string, string>;
}

interface EffectsSchema {
  borderRadius: Record<string, string>;
  boxShadow: Record<string, string>;
  transition: Record<string, string>;
  animation: Record<string, string>;
}

interface ComponentStylesSchema {
  button: {
    variants: Record<string, ButtonVariant>;
    sizes: Record<string, ButtonSize>;
    borderRadius: string;
    fontWeight: string;
    transition: string;
  };
  link: {
    base: string;
    hover: string;
    visited: string;
    underline: boolean;
    transition: string;
  };
  card: {
    borderRadius: string;
    boxShadow: string;
    padding: string;
    borderWidth: string;
    borderColor: string;
  };
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

interface ButtonVariant {
  base: string;
  hover: string;
  active: string;
  disabled: string;
}

interface ButtonSize {
  padding: string;
  fontSize: string;
  height: string;
}

interface SectionStylesSchema {
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

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: string;
  theme: ThemeSchema;
  tags: string[];
  industry?: string;
}

// Default spacing values
const defaultSpacing = {
  spacing: {
    s0: "0px",
    s0_5: "0.125rem",
    s1: "0.25rem",
    s1_5: "0.375rem",
    s2: "0.5rem",
    s2_5: "0.625rem",
    s3: "0.75rem",
    s3_5: "0.875rem",
    s4: "1rem",
    s5: "1.25rem",
    s6: "1.5rem",
    s7: "1.75rem",
    s8: "2rem",
    s9: "2.25rem",
    s10: "2.5rem",
    s11: "2.75rem",
    s12: "3rem",
    s14: "3.5rem",
    s16: "4rem",
    s20: "5rem",
    s24: "6rem",
    s28: "7rem",
    s32: "8rem",
    s36: "9rem",
    s40: "10rem",
    s44: "11rem",
    s48: "12rem",
    s52: "13rem",
    s56: "14rem",
    s60: "15rem",
    s64: "16rem",
    s72: "18rem",
    s80: "20rem",
    s96: "24rem",
  },
  container: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    xl2: "1536px",
    full: "100%",
  },
  sectionSpacing: {
    none: "0",
    sm: "2rem",
    md: "4rem",
    lg: "6rem",
    xl: "8rem",
    xl2: "10rem",
  },
};

// Default typography values
const defaultTypography = {
  fontFamilyBase: "Inter, system-ui, -apple-system, sans-serif",
  fontFamilyHeading: "Inter, system-ui, -apple-system, sans-serif",
  fontFamilyMonospace: "Menlo, Monaco, Consolas, monospace",
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    xl2: "1.5rem",
    xl3: "1.875rem",
    xl4: "2.25rem",
    xl5: "3rem",
    xl6: "3.75rem",
    xl7: "4.5rem",
    xl8: "6rem",
    xl9: "8rem",
  },
  fontWeight: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeight: {
    none: "1",
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
    loose: "2",
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
};

// Default effects
const defaultEffects = {
  borderRadius: {
    none: "0",
    sm: "0.125rem",
    base: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    xl2: "1rem",
    xl3: "1.5rem",
    full: "9999px",
  },
  boxShadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    xl2: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  },
  transition: {
    none: "none",
    all: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    colors: "background-color, border-color, color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: "opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    shadow: "box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  animation: {
    none: "none",
    spin: "spin 1s linear infinite",
    ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite",
    fadeIn: "fadeIn 0.5s ease-out",
    fadeOut: "fadeOut 0.5s ease-in",
    slideUp: "slideUp 0.3s ease-out",
    slideDown: "slideDown 0.3s ease-out",
  },
};

// Modern Minimal Theme
export const modernMinimalTheme: ThemeSchema = {
  id: "modern-minimal",
  name: "Modern Minimal",
  description: "Clean and minimalist design with plenty of whitespace",
  version: "1.0.0",
  darkMode: true,
  colors: {
    light: {
      primary: "#000000",
      primaryForeground: "#ffffff",
      secondary: "#f5f5f5",
      secondaryForeground: "#171717",
      accent: "#0066ff",
      accentForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#171717",
      card: "#ffffff",
      cardForeground: "#171717",
      popover: "#ffffff",
      popoverForeground: "#171717",
      muted: "#f5f5f5",
      mutedForeground: "#737373",
      border: "#e5e5e5",
      input: "#e5e5e5",
      ring: "#0066ff",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      success: "#10b981",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#3b82f6",
      infoForeground: "#ffffff",
    },
    dark: {
      primary: "#ffffff",
      primaryForeground: "#000000",
      secondary: "#262626",
      secondaryForeground: "#fafafa",
      accent: "#3b82f6",
      accentForeground: "#ffffff",
      background: "#0a0a0a",
      foreground: "#fafafa",
      card: "#171717",
      cardForeground: "#fafafa",
      popover: "#171717",
      popoverForeground: "#fafafa",
      muted: "#262626",
      mutedForeground: "#a3a3a3",
      border: "#262626",
      input: "#262626",
      ring: "#3b82f6",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
      info: "#2563eb",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Inter, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Inter, system-ui, -apple-system, sans-serif",
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "0",
      md: "0",
      lg: "0",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground",
          hover: "bg-primary/90",
          active: "bg-primary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground",
          hover: "bg-secondary/80",
          active: "bg-secondary/70",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border border-input bg-background",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          height: "2.25rem",
        },
        md: {
          padding: "0.625rem 1.25rem",
          fontSize: "0.875rem",
          height: "2.5rem",
        },
        lg: {
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          height: "3rem",
        },
      },
      borderRadius: "0",
      fontWeight: "500",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-primary underline-offset-4",
      hover: "underline",
      visited: "text-primary/80",
      underline: false,
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "0",
      boxShadow: "none",
      padding: "1.5rem",
      borderWidth: "1px",
      borderColor: "border",
    },
    input: {
      borderRadius: "0",
      borderWidth: "1px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.5rem 0.75rem",
      fontSize: "1rem",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "70vh",
      padding: "4rem 2rem",
      textAlign: "center",
      overlayOpacity: 0.5,
    },
    about: {
      padding: "4rem 2rem",
      maxWidth: "48rem",
      textAlign: "left",
    },
    gallery: {
      padding: "4rem 2rem",
      gridCols: 3,
      gap: "2rem",
      aspectRatio: "square",
    },
    contact: {
      padding: "4rem 2rem",
      layout: "split",
      formWidth: "24rem",
    },
    reviews: {
      padding: "4rem 2rem",
      layout: "grid",
      itemsPerRow: 3,
    },
  },
};

// Bold & Playful Theme
export const boldPlayfulTheme: ThemeSchema = {
  id: "bold-playful",
  name: "Bold & Playful",
  description: "Vibrant colors and rounded corners for a friendly feel",
  version: "1.0.0",
  darkMode: true,
  colors: {
    light: {
      primary: "#7c3aed",
      primaryForeground: "#ffffff",
      secondary: "#fbbf24",
      secondaryForeground: "#78350f",
      accent: "#ec4899",
      accentForeground: "#ffffff",
      background: "#fefce8",
      foreground: "#451a03",
      card: "#ffffff",
      cardForeground: "#451a03",
      popover: "#ffffff",
      popoverForeground: "#451a03",
      muted: "#fef3c7",
      mutedForeground: "#92400e",
      border: "#fde68a",
      input: "#fef3c7",
      ring: "#7c3aed",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#3b82f6",
      infoForeground: "#ffffff",
    },
    dark: {
      primary: "#a78bfa",
      primaryForeground: "#1e1b4b",
      secondary: "#fbbf24",
      secondaryForeground: "#78350f",
      accent: "#f472b6",
      accentForeground: "#500724",
      background: "#1e1b4b",
      foreground: "#e9d5ff",
      card: "#312e81",
      cardForeground: "#e9d5ff",
      popover: "#312e81",
      popoverForeground: "#e9d5ff",
      muted: "#4c1d95",
      mutedForeground: "#c4b5fd",
      border: "#6d28d9",
      input: "#4c1d95",
      ring: "#a78bfa",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      success: "#10b981",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#60a5fa",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Poppins, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Poppins, system-ui, -apple-system, sans-serif",
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "1rem",
      md: "1.5rem",
      lg: "2rem",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground shadow-lg",
          hover: "bg-primary/90 scale-105",
          active: "bg-primary/80 scale-100",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground shadow-lg",
          hover: "bg-secondary/90 scale-105",
          active: "bg-secondary/80 scale-100",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border-2 border-primary bg-background",
          hover: "bg-primary text-primary-foreground",
          active: "bg-primary/90",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          height: "2.5rem",
        },
        md: {
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          height: "3rem",
        },
        lg: {
          padding: "1rem 2rem",
          fontSize: "1.125rem",
          height: "3.5rem",
        },
      },
      borderRadius: "9999px",
      fontWeight: "600",
      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-primary font-medium",
      hover: "text-primary/80 underline",
      visited: "text-primary/70",
      underline: false,
      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "1.5rem",
      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      padding: "2rem",
      borderWidth: "0",
      borderColor: "transparent",
    },
    input: {
      borderRadius: "0.75rem",
      borderWidth: "2px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "60vh",
      padding: "4rem 2rem",
      textAlign: "center",
      overlayOpacity: 0.3,
    },
    about: {
      padding: "4rem 2rem",
      maxWidth: "56rem",
      textAlign: "center",
    },
    gallery: {
      padding: "4rem 2rem",
      gridCols: 4,
      gap: "1.5rem",
      aspectRatio: "square",
    },
    contact: {
      padding: "4rem 2rem",
      layout: "centered",
      formWidth: "32rem",
    },
    reviews: {
      padding: "4rem 2rem",
      layout: "carousel",
      itemsPerRow: 1,
    },
  },
};

// Professional Corporate Theme
export const professionalCorporateTheme: ThemeSchema = {
  id: "professional-corporate",
  name: "Professional Corporate",
  description: "Clean and professional design for businesses",
  version: "1.0.0",
  darkMode: false,
  colors: {
    light: {
      primary: "#1e40af",
      primaryForeground: "#ffffff",
      secondary: "#64748b",
      secondaryForeground: "#ffffff",
      accent: "#0891b2",
      accentForeground: "#ffffff",
      background: "#f8fafc",
      foreground: "#0f172a",
      card: "#ffffff",
      cardForeground: "#0f172a",
      popover: "#ffffff",
      popoverForeground: "#0f172a",
      muted: "#f1f5f9",
      mutedForeground: "#64748b",
      border: "#e2e8f0",
      input: "#e2e8f0",
      ring: "#1e40af",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#d97706",
      warningForeground: "#ffffff",
      info: "#0284c7",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Roboto, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Roboto, system-ui, -apple-system, sans-serif",
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground shadow-sm",
          hover: "bg-primary/90",
          active: "bg-primary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground shadow-sm",
          hover: "bg-secondary/90",
          active: "bg-secondary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border border-input bg-background",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.375rem 0.75rem",
          fontSize: "0.875rem",
          height: "2rem",
        },
        md: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          height: "2.5rem",
        },
        lg: {
          padding: "0.625rem 1.25rem",
          fontSize: "1rem",
          height: "3rem",
        },
      },
      borderRadius: "0.375rem",
      fontWeight: "500",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-primary underline-offset-4",
      hover: "text-primary/80 underline",
      visited: "text-primary/70",
      underline: false,
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "0.5rem",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      padding: "1.5rem",
      borderWidth: "1px",
      borderColor: "border",
    },
    input: {
      borderRadius: "0.375rem",
      borderWidth: "1px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.5rem 0.75rem",
      fontSize: "0.875rem",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "50vh",
      padding: "3rem 1.5rem",
      textAlign: "left",
      overlayOpacity: 0.4,
    },
    about: {
      padding: "3rem 1.5rem",
      maxWidth: "64rem",
      textAlign: "left",
    },
    gallery: {
      padding: "3rem 1.5rem",
      gridCols: 3,
      gap: "1.5rem",
      aspectRatio: "video",
    },
    contact: {
      padding: "3rem 1.5rem",
      layout: "split",
      formWidth: "28rem",
    },
    reviews: {
      padding: "3rem 1.5rem",
      layout: "list",
      itemsPerRow: 1,
    },
  },
};

// Elegant Luxury Theme
export const elegantLuxuryTheme: ThemeSchema = {
  id: "elegant-luxury",
  name: "Elegant Luxury",
  description: "Sophisticated design with premium feel",
  version: "1.0.0",
  darkMode: true,
  colors: {
    light: {
      primary: "#0f172a",
      primaryForeground: "#f8fafc",
      secondary: "#e2e8f0",
      secondaryForeground: "#0f172a",
      accent: "#b91c1c",
      accentForeground: "#ffffff",
      background: "#fafaf9",
      foreground: "#0c0a09",
      card: "#ffffff",
      cardForeground: "#0c0a09",
      popover: "#ffffff",
      popoverForeground: "#0c0a09",
      muted: "#f5f5f4",
      mutedForeground: "#57534e",
      border: "#e7e5e4",
      input: "#e7e5e4",
      ring: "#b91c1c",
      destructive: "#b91c1c",
      destructiveForeground: "#ffffff",
      success: "#166534",
      successForeground: "#ffffff",
      warning: "#a16207",
      warningForeground: "#ffffff",
      info: "#1e3a8a",
      infoForeground: "#ffffff",
    },
    dark: {
      primary: "#f8fafc",
      primaryForeground: "#0f172a",
      secondary: "#1e293b",
      secondaryForeground: "#f8fafc",
      accent: "#dc2626",
      accentForeground: "#ffffff",
      background: "#0c0a09",
      foreground: "#fafaf9",
      card: "#1c1917",
      cardForeground: "#fafaf9",
      popover: "#1c1917",
      popoverForeground: "#fafaf9",
      muted: "#292524",
      mutedForeground: "#a8a29e",
      border: "#292524",
      input: "#292524",
      ring: "#dc2626",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#15803d",
      successForeground: "#ffffff",
      warning: "#ca8a04",
      warningForeground: "#ffffff",
      info: "#2563eb",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Playfair Display, Georgia, serif",
    fontFamilyHeading: "Playfair Display, Georgia, serif",
    letterSpacing: {
      ...defaultTypography.letterSpacing,
      normal: "0.025em",
      wide: "0.05em",
      wider: "0.1em",
      widest: "0.2em",
    },
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "0.125rem",
      md: "0.25rem",
      lg: "0.375rem",
    },
    boxShadow: {
      ...defaultEffects.boxShadow,
      base: "0 2px 8px 0 rgb(0 0 0 / 0.1)",
      md: "0 4px 16px -2px rgb(0 0 0 / 0.1)",
      lg: "0 12px 24px -4px rgb(0 0 0 / 0.1)",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground tracking-wider",
          hover: "bg-primary/90",
          active: "bg-primary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-transparent border-2 border-primary text-primary",
          hover: "bg-primary text-primary-foreground",
          active: "bg-primary/90",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border border-input bg-background",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.5rem 1.5rem",
          fontSize: "0.75rem",
          height: "2.5rem",
        },
        md: {
          padding: "0.75rem 2rem",
          fontSize: "0.875rem",
          height: "3rem",
        },
        lg: {
          padding: "1rem 2.5rem",
          fontSize: "1rem",
          height: "3.5rem",
        },
      },
      borderRadius: "0",
      fontWeight: "400",
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-accent tracking-wide",
      hover: "text-accent/80",
      visited: "text-accent/70",
      underline: false,
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "0",
      boxShadow: "0 2px 8px 0 rgb(0 0 0 / 0.1)",
      padding: "2rem",
      borderWidth: "0",
      borderColor: "transparent",
    },
    input: {
      borderRadius: "0",
      borderWidth: "1px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.75rem 1rem",
      fontSize: "0.875rem",
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "80vh",
      padding: "6rem 3rem",
      textAlign: "center",
      overlayOpacity: 0.6,
    },
    about: {
      padding: "6rem 3rem",
      maxWidth: "48rem",
      textAlign: "center",
    },
    gallery: {
      padding: "6rem 3rem",
      gridCols: 2,
      gap: "3rem",
      aspectRatio: "portrait",
    },
    contact: {
      padding: "6rem 3rem",
      layout: "centered",
      formWidth: "36rem",
    },
    reviews: {
      padding: "6rem 3rem",
      layout: "grid",
      itemsPerRow: 2,
    },
  },
};

// Restaurant & Cafe Theme
export const restaurantCafeTheme: ThemeSchema = {
  id: "restaurant-cafe",
  name: "Restaurant & Cafe",
  description: "Warm and inviting design for food establishments",
  version: "1.0.0",
  darkMode: true,
  colors: {
    light: {
      primary: "#7c2d12",
      primaryForeground: "#ffffff",
      secondary: "#f97316",
      secondaryForeground: "#ffffff",
      accent: "#ea580c",
      accentForeground: "#ffffff",
      background: "#fffbeb",
      foreground: "#451a03",
      card: "#ffffff",
      cardForeground: "#451a03",
      popover: "#ffffff",
      popoverForeground: "#451a03",
      muted: "#fed7aa",
      mutedForeground: "#7c2d12",
      border: "#fdba74",
      input: "#fed7aa",
      ring: "#ea580c",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#3b82f6",
      infoForeground: "#ffffff",
    },
    dark: {
      primary: "#fb923c",
      primaryForeground: "#431407",
      secondary: "#fdba74",
      secondaryForeground: "#431407",
      accent: "#f97316",
      accentForeground: "#ffffff",
      background: "#1c0a00",
      foreground: "#fff7ed",
      card: "#451a03",
      cardForeground: "#fff7ed",
      popover: "#451a03",
      popoverForeground: "#fff7ed",
      muted: "#7c2d12",
      mutedForeground: "#fed7aa",
      border: "#92400e",
      input: "#7c2d12",
      ring: "#f97316",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      success: "#10b981",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#60a5fa",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Merriweather Sans, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Merriweather, Georgia, serif",
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground",
          hover: "bg-primary/90",
          active: "bg-primary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground",
          hover: "bg-secondary/90",
          active: "bg-secondary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border-2 border-primary bg-transparent text-primary",
          hover: "bg-primary text-primary-foreground",
          active: "bg-primary/90",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          height: "2.5rem",
        },
        md: {
          padding: "0.625rem 1.25rem",
          fontSize: "1rem",
          height: "3rem",
        },
        lg: {
          padding: "0.75rem 1.5rem",
          fontSize: "1.125rem",
          height: "3.5rem",
        },
      },
      borderRadius: "0.5rem",
      fontWeight: "600",
      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-accent font-medium",
      hover: "text-accent/80 underline",
      visited: "text-accent/70",
      underline: false,
      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "0.75rem",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      padding: "1.5rem",
      borderWidth: "0",
      borderColor: "transparent",
    },
    input: {
      borderRadius: "0.5rem",
      borderWidth: "2px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.625rem 0.875rem",
      fontSize: "1rem",
      transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "65vh",
      padding: "4rem 2rem",
      textAlign: "center",
      overlayOpacity: 0.4,
    },
    about: {
      padding: "4rem 2rem",
      maxWidth: "56rem",
      textAlign: "center",
    },
    gallery: {
      padding: "4rem 2rem",
      gridCols: 3,
      gap: "1.5rem",
      aspectRatio: "square",
    },
    contact: {
      padding: "4rem 2rem",
      layout: "split",
      formWidth: "28rem",
    },
    reviews: {
      padding: "4rem 2rem",
      layout: "grid",
      itemsPerRow: 2,
    },
  },
};

// Beauty Salon & Spa Theme
export const beautySalonSpaTheme: ThemeSchema = {
  id: "beauty-salon-spa",
  name: "Beauty Salon & Spa",
  description: "Elegant and calming design for beauty and wellness",
  version: "1.0.0",
  darkMode: true,
  colors: {
    light: {
      primary: "#831843",
      primaryForeground: "#ffffff",
      secondary: "#fbbf24",
      secondaryForeground: "#78350f",
      accent: "#ec4899",
      accentForeground: "#ffffff",
      background: "#fdf2f8",
      foreground: "#500724",
      card: "#ffffff",
      cardForeground: "#500724",
      popover: "#ffffff",
      popoverForeground: "#500724",
      muted: "#fce7f3",
      mutedForeground: "#9f1239",
      border: "#fbcfe8",
      input: "#fce7f3",
      ring: "#ec4899",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#3b82f6",
      infoForeground: "#ffffff",
    },
    dark: {
      primary: "#f472b6",
      primaryForeground: "#500724",
      secondary: "#fbbf24",
      secondaryForeground: "#78350f",
      accent: "#f9a8d4",
      accentForeground: "#500724",
      background: "#190211",
      foreground: "#fdf2f8",
      card: "#500724",
      cardForeground: "#fdf2f8",
      popover: "#500724",
      popoverForeground: "#fdf2f8",
      muted: "#831843",
      mutedForeground: "#fbcfe8",
      border: "#9f1239",
      input: "#831843",
      ring: "#f472b6",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      success: "#10b981",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#60a5fa",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Montserrat, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Cormorant Garamond, Georgia, serif",
    letterSpacing: {
      ...defaultTypography.letterSpacing,
      normal: "0.025em",
      wide: "0.05em",
    },
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground shadow-md",
          hover: "bg-primary/90 shadow-lg",
          active: "bg-primary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground",
          hover: "bg-secondary/90",
          active: "bg-secondary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border-2 border-primary bg-transparent text-primary",
          hover: "bg-primary/10",
          active: "bg-primary/20",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.5rem 1.25rem",
          fontSize: "0.875rem",
          height: "2.5rem",
        },
        md: {
          padding: "0.75rem 1.75rem",
          fontSize: "1rem",
          height: "3rem",
        },
        lg: {
          padding: "1rem 2.25rem",
          fontSize: "1.125rem",
          height: "3.5rem",
        },
      },
      borderRadius: "2rem",
      fontWeight: "500",
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-accent",
      hover: "text-accent/80 underline",
      visited: "text-accent/70",
      underline: false,
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "1.5rem",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      padding: "2rem",
      borderWidth: "0",
      borderColor: "transparent",
    },
    input: {
      borderRadius: "1rem",
      borderWidth: "1px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "60vh",
      padding: "5rem 2rem",
      textAlign: "center",
      overlayOpacity: 0.3,
    },
    about: {
      padding: "5rem 2rem",
      maxWidth: "48rem",
      textAlign: "center",
    },
    gallery: {
      padding: "5rem 2rem",
      gridCols: 4,
      gap: "1rem",
      aspectRatio: "portrait",
    },
    contact: {
      padding: "5rem 2rem",
      layout: "centered",
      formWidth: "32rem",
    },
    reviews: {
      padding: "5rem 2rem",
      layout: "carousel",
      itemsPerRow: 1,
    },
  },
};

// Gym & Fitness Theme
export const gymFitnessTheme: ThemeSchema = {
  id: "gym-fitness",
  name: "Gym & Fitness",
  description: "Bold and energetic design for fitness centers",
  version: "1.0.0",
  darkMode: true,
  colors: {
    light: {
      primary: "#dc2626",
      primaryForeground: "#ffffff",
      secondary: "#171717",
      secondaryForeground: "#ffffff",
      accent: "#f59e0b",
      accentForeground: "#451a03",
      background: "#f5f5f5",
      foreground: "#171717",
      card: "#ffffff",
      cardForeground: "#171717",
      popover: "#ffffff",
      popoverForeground: "#171717",
      muted: "#e5e5e5",
      mutedForeground: "#525252",
      border: "#d4d4d4",
      input: "#e5e5e5",
      ring: "#dc2626",
      destructive: "#b91c1c",
      destructiveForeground: "#ffffff",
      success: "#16a34a",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#0284c7",
      infoForeground: "#ffffff",
    },
    dark: {
      primary: "#ef4444",
      primaryForeground: "#ffffff",
      secondary: "#fafafa",
      secondaryForeground: "#171717",
      accent: "#fbbf24",
      accentForeground: "#451a03",
      background: "#0a0a0a",
      foreground: "#fafafa",
      card: "#171717",
      cardForeground: "#fafafa",
      popover: "#171717",
      popoverForeground: "#fafafa",
      muted: "#262626",
      mutedForeground: "#a3a3a3",
      border: "#404040",
      input: "#262626",
      ring: "#ef4444",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#22c55e",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#06b6d4",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Oswald, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Bebas Neue, system-ui, -apple-system, sans-serif",
    fontWeight: {
      ...defaultTypography.fontWeight,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "0.125rem",
      md: "0.25rem",
      lg: "0.375rem",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground uppercase tracking-wider shadow-lg",
          hover: "bg-primary/90 scale-105",
          active: "bg-primary/80 scale-100",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground uppercase tracking-wider",
          hover: "bg-secondary/90",
          active: "bg-secondary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border-2 border-primary bg-transparent text-primary uppercase tracking-wider",
          hover: "bg-primary text-primary-foreground",
          active: "bg-primary/90",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted uppercase tracking-wider",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          height: "2.5rem",
        },
        md: {
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          height: "3rem",
        },
        lg: {
          padding: "1rem 2rem",
          fontSize: "1.25rem",
          height: "3.75rem",
        },
      },
      borderRadius: "0.125rem",
      fontWeight: "700",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-primary font-bold uppercase tracking-wide",
      hover: "text-primary/80 underline",
      visited: "text-primary/70",
      underline: false,
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "0.25rem",
      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      padding: "1.5rem",
      borderWidth: "0",
      borderColor: "transparent",
    },
    input: {
      borderRadius: "0.125rem",
      borderWidth: "2px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.75rem 1rem",
      fontSize: "1rem",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "80vh",
      padding: "4rem 2rem",
      textAlign: "center",
      overlayOpacity: 0.7,
    },
    about: {
      padding: "4rem 2rem",
      maxWidth: "64rem",
      textAlign: "center",
    },
    gallery: {
      padding: "4rem 2rem",
      gridCols: 3,
      gap: "1rem",
      aspectRatio: "video",
    },
    contact: {
      padding: "4rem 2rem",
      layout: "split",
      formWidth: "28rem",
    },
    reviews: {
      padding: "4rem 2rem",
      layout: "grid",
      itemsPerRow: 3,
    },
  },
};

// Medical & Healthcare Theme
export const medicalHealthcareTheme: ThemeSchema = {
  id: "medical-healthcare",
  name: "Medical & Healthcare",
  description: "Clean and trustworthy design for medical practices",
  version: "1.0.0",
  darkMode: false,
  colors: {
    light: {
      primary: "#0891b2",
      primaryForeground: "#ffffff",
      secondary: "#06b6d4",
      secondaryForeground: "#ffffff",
      accent: "#0e7490",
      accentForeground: "#ffffff",
      background: "#f0fdfa",
      foreground: "#083344",
      card: "#ffffff",
      cardForeground: "#083344",
      popover: "#ffffff",
      popoverForeground: "#083344",
      muted: "#e0f2fe",
      mutedForeground: "#0c4a6e",
      border: "#bae6fd",
      input: "#e0f2fe",
      ring: "#0891b2",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#0284c7",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Source Sans Pro, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Source Sans Pro, system-ui, -apple-system, sans-serif",
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "0.375rem",
      md: "0.5rem",
      lg: "0.75rem",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground",
          hover: "bg-primary/90",
          active: "bg-primary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground",
          hover: "bg-secondary/90",
          active: "bg-secondary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border border-primary bg-transparent text-primary",
          hover: "bg-primary/10",
          active: "bg-primary/20",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.375rem 0.875rem",
          fontSize: "0.875rem",
          height: "2.25rem",
        },
        md: {
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          height: "2.75rem",
        },
        lg: {
          padding: "0.625rem 1.25rem",
          fontSize: "1.125rem",
          height: "3.25rem",
        },
      },
      borderRadius: "0.5rem",
      fontWeight: "500",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-primary",
      hover: "text-primary/80 underline",
      visited: "text-primary/70",
      underline: false,
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "0.5rem",
      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      padding: "1.5rem",
      borderWidth: "1px",
      borderColor: "border",
    },
    input: {
      borderRadius: "0.375rem",
      borderWidth: "1px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.5rem 0.75rem",
      fontSize: "1rem",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "50vh",
      padding: "3rem 2rem",
      textAlign: "left",
      overlayOpacity: 0.2,
    },
    about: {
      padding: "3rem 2rem",
      maxWidth: "64rem",
      textAlign: "left",
    },
    gallery: {
      padding: "3rem 2rem",
      gridCols: 3,
      gap: "1.5rem",
      aspectRatio: "video",
    },
    contact: {
      padding: "3rem 2rem",
      layout: "split",
      formWidth: "32rem",
    },
    reviews: {
      padding: "3rem 2rem",
      layout: "list",
      itemsPerRow: 1,
    },
  },
};

// Automotive & Repair Theme
export const automotiveRepairTheme: ThemeSchema = {
  id: "automotive-repair",
  name: "Automotive & Repair",
  description: "Industrial and reliable design for auto services",
  version: "1.0.0",
  darkMode: true,
  colors: {
    light: {
      primary: "#0f172a",
      primaryForeground: "#ffffff",
      secondary: "#ef4444",
      secondaryForeground: "#ffffff",
      accent: "#f59e0b",
      accentForeground: "#451a03",
      background: "#f8fafc",
      foreground: "#0f172a",
      card: "#ffffff",
      cardForeground: "#0f172a",
      popover: "#ffffff",
      popoverForeground: "#0f172a",
      muted: "#e2e8f0",
      mutedForeground: "#475569",
      border: "#cbd5e1",
      input: "#e2e8f0",
      ring: "#0f172a",
      destructive: "#dc2626",
      destructiveForeground: "#ffffff",
      success: "#059669",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#0284c7",
      infoForeground: "#ffffff",
    },
    dark: {
      primary: "#f8fafc",
      primaryForeground: "#0f172a",
      secondary: "#ef4444",
      secondaryForeground: "#ffffff",
      accent: "#fbbf24",
      accentForeground: "#451a03",
      background: "#020617",
      foreground: "#f8fafc",
      card: "#0f172a",
      cardForeground: "#f8fafc",
      popover: "#0f172a",
      popoverForeground: "#f8fafc",
      muted: "#1e293b",
      mutedForeground: "#94a3b8",
      border: "#334155",
      input: "#1e293b",
      ring: "#f8fafc",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      success: "#10b981",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      info: "#06b6d4",
      infoForeground: "#ffffff",
    },
  },
  typography: {
    ...defaultTypography,
    fontFamilyBase: "Roboto Condensed, system-ui, -apple-system, sans-serif",
    fontFamilyHeading: "Roboto Condensed, system-ui, -apple-system, sans-serif",
    fontWeight: {
      ...defaultTypography.fontWeight,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: defaultSpacing,
  effects: {
    ...defaultEffects,
    borderRadius: {
      ...defaultEffects.borderRadius,
      base: "0",
      md: "0.125rem",
      lg: "0.25rem",
    },
  },
  components: {
    button: {
      variants: {
        primary: {
          base: "bg-primary text-primary-foreground uppercase tracking-wide",
          hover: "bg-primary/90",
          active: "bg-primary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        secondary: {
          base: "bg-secondary text-secondary-foreground uppercase tracking-wide",
          hover: "bg-secondary/90",
          active: "bg-secondary/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
        outline: {
          base: "border-2 border-primary bg-transparent text-primary uppercase tracking-wide",
          hover: "bg-primary text-primary-foreground",
          active: "bg-primary/90",
          disabled: "opacity-50 cursor-not-allowed",
        },
        ghost: {
          base: "hover:bg-muted uppercase tracking-wide",
          hover: "bg-muted",
          active: "bg-muted/80",
          disabled: "opacity-50 cursor-not-allowed",
        },
      },
      sizes: {
        sm: {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
          height: "2.5rem",
        },
        md: {
          padding: "0.625rem 1.25rem",
          fontSize: "1rem",
          height: "3rem",
        },
        lg: {
          padding: "0.75rem 1.5rem",
          fontSize: "1.125rem",
          height: "3.5rem",
        },
      },
      borderRadius: "0",
      fontWeight: "700",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    link: {
      base: "text-accent font-bold uppercase",
      hover: "text-accent/80 underline",
      visited: "text-accent/70",
      underline: false,
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
    card: {
      borderRadius: "0",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      padding: "1.5rem",
      borderWidth: "0",
      borderColor: "transparent",
    },
    input: {
      borderRadius: "0",
      borderWidth: "2px",
      borderColor: "border",
      focusBorderColor: "ring",
      padding: "0.625rem 0.875rem",
      fontSize: "1rem",
      transition: "all 150ms cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  sections: {
    hero: {
      minHeight: "60vh",
      padding: "4rem 2rem",
      textAlign: "center",
      overlayOpacity: 0.6,
    },
    about: {
      padding: "4rem 2rem",
      maxWidth: "64rem",
      textAlign: "left",
    },
    gallery: {
      padding: "4rem 2rem",
      gridCols: 4,
      gap: "1rem",
      aspectRatio: "video",
    },
    contact: {
      padding: "4rem 2rem",
      layout: "split",
      formWidth: "28rem",
    },
    reviews: {
      padding: "4rem 2rem",
      layout: "grid",
      itemsPerRow: 2,
    },
  },
};

// All theme presets
export const themePresets: ThemePreset[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean and minimalist design with plenty of whitespace",
    preview: "/themes/modern-minimal-preview.jpg",
    theme: modernMinimalTheme,
    tags: ["minimal", "clean", "modern", "tech"],
    industry: "technology",
  },
  {
    id: "bold-playful",
    name: "Bold & Playful",
    description: "Vibrant colors and rounded corners for a friendly feel",
    preview: "/themes/bold-playful-preview.jpg",
    theme: boldPlayfulTheme,
    tags: ["colorful", "fun", "creative", "rounded"],
    industry: "creative",
  },
  {
    id: "professional-corporate",
    name: "Professional Corporate",
    description: "Clean and professional design for businesses",
    preview: "/themes/professional-corporate-preview.jpg",
    theme: professionalCorporateTheme,
    tags: ["corporate", "professional", "business", "clean"],
    industry: "corporate",
  },
  {
    id: "elegant-luxury",
    name: "Elegant Luxury",
    description: "Sophisticated design with premium feel",
    preview: "/themes/elegant-luxury-preview.jpg",
    theme: elegantLuxuryTheme,
    tags: ["luxury", "elegant", "premium", "sophisticated"],
    industry: "luxury",
  },
  {
    id: "restaurant-cafe",
    name: "Restaurant & Cafe",
    description: "Warm and inviting design for food establishments",
    preview: "/themes/restaurant-cafe-preview.jpg",
    theme: restaurantCafeTheme,
    tags: ["food", "warm", "inviting", "restaurant"],
    industry: "food",
  },
  {
    id: "beauty-salon-spa",
    name: "Beauty Salon & Spa",
    description: "Elegant and calming design for beauty and wellness",
    preview: "/themes/beauty-salon-spa-preview.jpg",
    theme: beautySalonSpaTheme,
    tags: ["beauty", "wellness", "elegant", "calming"],
    industry: "beauty",
  },
  {
    id: "gym-fitness",
    name: "Gym & Fitness",
    description: "Bold and energetic design for fitness centers",
    preview: "/themes/gym-fitness-preview.jpg",
    theme: gymFitnessTheme,
    tags: ["fitness", "gym", "bold", "energetic"],
    industry: "fitness",
  },
  {
    id: "medical-healthcare",
    name: "Medical & Healthcare",
    description: "Clean and trustworthy design for medical practices",
    preview: "/themes/medical-healthcare-preview.jpg",
    theme: medicalHealthcareTheme,
    tags: ["medical", "healthcare", "clean", "professional"],
    industry: "healthcare",
  },
  {
    id: "automotive-repair",
    name: "Automotive & Repair",
    description: "Industrial and reliable design for auto services",
    preview: "/themes/automotive-repair-preview.jpg",
    theme: automotiveRepairTheme,
    tags: ["automotive", "repair", "industrial", "reliable"],
    industry: "automotive",
  },
];

// Helper function to get theme by ID
export function getThemePreset(id: string): ThemePreset | undefined {
  return themePresets.find((preset) => preset.id === id);
}