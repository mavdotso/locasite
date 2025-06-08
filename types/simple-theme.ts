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

// Convert simple theme to CSS variables
export function simpleThemeToCSS(theme: SimpleTheme): string {
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
    
    /* Apply to body for immediate effect */
    body {
      background-color: var(--theme-background);
      color: var(--theme-text);
      font-family: var(--theme-font-family);
      font-size: var(--theme-font-size-base);
    }
    
    /* Typography */
    h1, h2, h3, h4, h5, h6 {
      font-size: var(--theme-font-size-heading);
    }
    
    /* Sections */
    section {
      padding-top: var(--theme-spacing-section);
      padding-bottom: var(--theme-spacing-section);
    }
    
    /* Border radius for common elements */
    .rounded-lg,
    .rounded-md,
    .card,
    button,
    input,
    textarea,
    select {
      border-radius: var(--theme-border-radius) !important;
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