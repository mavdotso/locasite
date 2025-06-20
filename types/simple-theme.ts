export interface SimpleTheme {
  // Core colors
  primaryColor: string;      // Main brand color (buttons, links)
  textColor: string;         // Main text color
  backgroundColor: string;   // Page background
  
  // Simple size options
  fontSize: 'small' | 'normal' | 'large';
  spacing: 'small' | 'normal' | 'large';
  
  // Simple style options
  borderRadius: 'none' | 'small' | 'large';
  
  // Font
  fontFamily?: string;
}

export interface ModernTheme {
  // Brand
  brandColor: string;
  
  // Buttons
  primaryButtonColor: string;
  secondaryButtonColor: string;
  secondaryButtonOpacity: number;
  
  // Text
  textColor: string;
  headingColor: string;
  linkColor: string;
  
  // Background
  backgroundColor: string;
  sectionBackgroundColor: string;
  
  // Typography
  fontFamily: string;
  fontSize: 'small' | 'normal' | 'large';
  
  // Layout
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'spacious';
}

// Convert simple theme to CSS variables
export function simpleThemeToCSS(theme: SimpleTheme, includeBodyStyles = true): string {
  const fontSizes = {
    small: { base: '14px', heading: '1.5rem' },
    normal: { base: '16px', heading: '2rem' },
    large: { base: '18px', heading: '2.5rem' }
  };
  
  const spacings = {
    small: { section: '3rem', element: '1rem' },
    normal: { section: '5rem', element: '1.5rem' },
    large: { section: '7rem', element: '2rem' }
  };
  
  const radii = {
    none: '0',
    small: '0.375rem',
    large: '1rem'
  };
  
  // Generate a lighter version of primary for backgrounds
  const primaryRGB = hexToRgb(theme.primaryColor);
  const primaryLight = primaryRGB ? `rgb(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.1)` : `${theme.primaryColor}20`;
  
  return `
    :root {
      /* Custom theme variables */
      --theme-primary: ${theme.primaryColor};
      --theme-text: ${theme.textColor};
      --theme-background: ${theme.backgroundColor};
      --theme-font-size-base: ${fontSizes[theme.fontSize].base};
      --theme-font-size-heading: ${fontSizes[theme.fontSize].heading};
      --theme-spacing-section: ${spacings[theme.spacing].section};
      --theme-spacing-element: ${spacings[theme.spacing].element};
      --theme-border-radius: ${radii[theme.borderRadius]};
      --theme-font-family: ${theme.fontFamily || 'system-ui, -apple-system, sans-serif'};
      
      /* Override Tailwind's semantic colors */
      --primary: ${theme.primaryColor};
      --primary-foreground: #ffffff;
      --background: ${theme.backgroundColor};
      --foreground: ${theme.textColor};
      --card: ${theme.backgroundColor};
      --card-foreground: ${theme.textColor};
      --muted: ${primaryLight};
      --muted-foreground: ${theme.textColor}80;
      --border: ${theme.textColor}20;
      --input: ${theme.textColor}20;
      --ring: ${theme.primaryColor};
    }
    
    ${includeBodyStyles ? `/* Apply to body for immediate effect */
    body {` : `/* Apply to scoped element */
    {`}
      background-color: var(--theme-background);
      color: var(--theme-text);
      font-family: var(--theme-font-family);
      font-size: var(--theme-font-size-base);
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      font-size: var(--theme-font-size-heading);
      color: var(--theme-text);
      font-weight: 700;
    }
    
    /* Links */
    a {
      color: var(--theme-primary);
    }
    
    a:hover {
      opacity: 0.8;
    }
    
    /* Buttons */
    .btn-primary,
    button[type="submit"],
    .bg-primary {
      background-color: var(--theme-primary) !important;
      color: white !important;
      border-radius: var(--theme-border-radius);
    }
    
    .btn-secondary {
      background-color: var(--muted) !important;
      color: var(--theme-text) !important;
      border-radius: var(--theme-border-radius);
    }
    
    /* Sections */
    section {
      padding-top: var(--theme-spacing-section);
      padding-bottom: var(--theme-spacing-section);
    }
    
    /* Border radius for common elements */
    .rounded-lg,
    .rounded-md,
    .rounded,
    .card,
    button,
    input,
    textarea,
    select {
      border-radius: var(--theme-border-radius) !important;
    }
    
    /* Background sections */
    .bg-muted {
      background-color: var(--muted) !important;
    }
  `;
}

// Convert modern theme to CSS variables
export function modernThemeToCSS(theme: ModernTheme, includeBodyStyles = true): string {
  const fontSizes = {
    small: { base: '14px', h1: '2rem', h2: '1.75rem', h3: '1.5rem' },
    normal: { base: '16px', h1: '2.5rem', h2: '2rem', h3: '1.75rem' },
    large: { base: '18px', h1: '3rem', h2: '2.5rem', h3: '2rem' }
  };
  
  const spacings = {
    compact: { section: '2rem', element: '0.75rem', gap: '0.5rem' },
    normal: { section: '4rem', element: '1.5rem', gap: '1rem' },
    spacious: { section: '6rem', element: '2.5rem', gap: '1.5rem' }
  };
  
  const radii = {
    none: '0',
    small: '0.375rem',
    medium: '0.75rem',
    large: '1.5rem'
  };
  
  // Helper to create lighter/darker versions
  const adjustColor = (hex: string, amount: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const factor = amount > 0 ? 255 - Math.max(rgb.r, rgb.g, rgb.b) : Math.min(rgb.r, rgb.g, rgb.b);
    const adjust = Math.floor(factor * Math.abs(amount));
    const sign = amount > 0 ? 1 : -1;
    return `#${[
      Math.max(0, Math.min(255, rgb.r + sign * adjust)),
      Math.max(0, Math.min(255, rgb.g + sign * adjust)),
      Math.max(0, Math.min(255, rgb.b + sign * adjust))
    ].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  };
  
  const mutedBg = adjustColor(theme.backgroundColor, 0.05);
  const borderColor = adjustColor(theme.textColor, 0.8);
  
  return `
    :root {
      /* Modern theme variables */
      --theme-brand: ${theme.brandColor};
      --theme-primary-button: ${theme.primaryButtonColor};
      --theme-secondary-button: ${theme.secondaryButtonColor};
      --theme-secondary-button-opacity: ${theme.secondaryButtonOpacity / 100};
      --theme-text: ${theme.textColor};
      --theme-heading: ${theme.headingColor};
      --theme-link: ${theme.linkColor};
      --theme-background: ${theme.backgroundColor};
      --theme-section-background: ${theme.sectionBackgroundColor};
      --theme-font-family: ${theme.fontFamily === 'system' ? 'system-ui, -apple-system, sans-serif' : theme.fontFamily};
      --theme-font-size-base: ${fontSizes[theme.fontSize].base};
      --theme-font-size-h1: ${fontSizes[theme.fontSize].h1};
      --theme-font-size-h2: ${fontSizes[theme.fontSize].h2};
      --theme-font-size-h3: ${fontSizes[theme.fontSize].h3};
      --theme-spacing-section: ${spacings[theme.spacing].section};
      --theme-spacing-element: ${spacings[theme.spacing].element};
      --theme-spacing-gap: ${spacings[theme.spacing].gap};
      --theme-border-radius: ${radii[theme.borderRadius]};
      
      /* Business website theme colors - prefixed to avoid conflicts */
      --business-background: ${theme.backgroundColor};
      --business-foreground: ${theme.textColor};
      --business-card: ${theme.backgroundColor};
      --business-card-foreground: ${theme.textColor};
      --business-primary: ${theme.brandColor};
      --business-primary-foreground: #ffffff;
      --business-secondary: ${mutedBg};
      --business-secondary-foreground: ${theme.textColor};
      --business-muted: ${theme.sectionBackgroundColor};
      --business-muted-foreground: ${adjustColor(theme.textColor, 0.4)};
      --business-accent: ${theme.brandColor};
      --business-accent-foreground: #ffffff;
      --business-border: ${borderColor};
      --business-radius: ${radii[theme.borderRadius]};
    }
    
    ${includeBodyStyles ? `/* Apply to body */
    body {` : `/* Apply to scoped element */
    {`}
      background-color: var(--theme-background);
      color: var(--theme-text);
      font-family: var(--theme-font-family);
      font-size: var(--theme-font-size-base);
    }
    
    /* Typography */
    h1 {
      font-size: var(--theme-font-size-h1);
      color: var(--theme-heading);
      font-weight: 700;
      line-height: 1.2;
    }
    
    h2 {
      font-size: var(--theme-font-size-h2);
      color: var(--theme-heading);
      font-weight: 700;
      line-height: 1.3;
    }
    
    h3 {
      font-size: var(--theme-font-size-h3);
      color: var(--theme-heading);
      font-weight: 600;
      line-height: 1.4;
    }
    
    h4, h5, h6 {
      color: var(--theme-heading);
      font-weight: 600;
    }
    
    /* Links */
    a {
      color: var(--theme-link);
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Buttons */
    .btn-primary,
    button[type="submit"],
    .bg-primary {
      background-color: var(--theme-primary-button) !important;
      color: white !important;
      border-radius: var(--theme-border-radius);
    }
    
    .btn-secondary {
      background-color: var(--theme-secondary-button) !important;
      opacity: var(--theme-secondary-button-opacity);
      color: var(--theme-text) !important;
      border-radius: var(--theme-border-radius);
    }
    
    /* Sections */
    section {
      padding-top: var(--theme-spacing-section);
      padding-bottom: var(--theme-spacing-section);
    }
    
    .section-alt {
      background-color: var(--theme-section-background);
    }
    
    /* Spacing */
    .container {
      padding-left: var(--theme-spacing-element);
      padding-right: var(--theme-spacing-element);
    }
    
    .space-y-4 > * + * {
      margin-top: var(--theme-spacing-gap);
    }
    
    .gap-4 {
      gap: var(--theme-spacing-gap);
    }
    
    /* Business website border radius */
    .business-rounded {
      border-radius: var(--theme-border-radius);
    }
    
    /* Background sections */
    .bg-muted {
      background-color: var(--theme-section-background) !important;
    }
    
    /* Cards */
    .card {
      background-color: var(--theme-background);
      border: 1px solid var(--border);
    }
  `;
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}