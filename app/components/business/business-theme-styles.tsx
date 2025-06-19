"use client";

import { ModernTheme } from "@/types/simple-theme";

export function generateBusinessThemeCSS(theme: ModernTheme, scopeSelector: string): string {
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

  // Generate CSS that ONLY affects business content, not UI elements
  return `
    /* Business Website Theme - Scoped to ${scopeSelector} */
    
    /* Base styles for the business content */
    ${scopeSelector} {
      background-color: ${theme.backgroundColor};
      color: ${theme.textColor};
      font-family: ${theme.fontFamily === 'system' ? 'system-ui, -apple-system, sans-serif' : theme.fontFamily};
      font-size: ${fontSizes[theme.fontSize].base};
    }
    
    /* Typography within business content */
    ${scopeSelector} h1 {
      font-size: ${fontSizes[theme.fontSize].h1};
      color: ${theme.headingColor};
      font-weight: 700;
      line-height: 1.2;
    }
    
    ${scopeSelector} h2 {
      font-size: ${fontSizes[theme.fontSize].h2};
      color: ${theme.headingColor};
      font-weight: 700;
      line-height: 1.3;
    }
    
    ${scopeSelector} h3 {
      font-size: ${fontSizes[theme.fontSize].h3};
      color: ${theme.headingColor};
      font-weight: 600;
      line-height: 1.4;
    }
    
    ${scopeSelector} h4,
    ${scopeSelector} h5,
    ${scopeSelector} h6 {
      color: ${theme.headingColor};
      font-weight: 600;
    }
    
    ${scopeSelector} p,
    ${scopeSelector} div {
      color: ${theme.textColor};
    }
    
    /* Links within business content */
    ${scopeSelector} a {
      color: ${theme.linkColor};
      text-decoration: none;
    }
    
    ${scopeSelector} a:hover {
      text-decoration: underline;
      opacity: 0.8;
    }
    
    /* Sections within business content */
    ${scopeSelector} section {
      padding-top: ${spacings[theme.spacing].section};
      padding-bottom: ${spacings[theme.spacing].section};
    }
    
    ${scopeSelector} .section-alt {
      background-color: ${theme.sectionBackgroundColor};
    }
    
    /* Images within business content */
    ${scopeSelector} img {
      border-radius: ${radii[theme.borderRadius]};
    }
    
    /* Business-specific component styles */
    ${scopeSelector} .business-hero {
      background: linear-gradient(to right, ${theme.brandColor}, ${theme.primaryButtonColor});
    }
    
    ${scopeSelector} .business-card {
      background-color: ${theme.backgroundColor};
      border: 1px solid ${theme.textColor}20;
      border-radius: ${radii[theme.borderRadius]};
      padding: ${spacings[theme.spacing].element};
    }
    
    ${scopeSelector} .business-button-primary {
      background-color: ${theme.primaryButtonColor};
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: ${radii[theme.borderRadius]};
      font-weight: 500;
      transition: opacity 0.2s;
      border: none;
      cursor: pointer;
    }
    
    ${scopeSelector} .business-button-primary:hover {
      opacity: 0.9;
    }
    
    ${scopeSelector} .business-button-secondary {
      background-color: ${theme.secondaryButtonColor};
      color: ${theme.textColor};
      padding: 0.75rem 1.5rem;
      border-radius: ${radii[theme.borderRadius]};
      font-weight: 500;
      transition: opacity 0.2s;
      border: none;
      cursor: pointer;
      opacity: ${theme.secondaryButtonOpacity / 100};
    }
    
    ${scopeSelector} .business-button-secondary:hover {
      opacity: ${Math.min(1, (theme.secondaryButtonOpacity / 100) + 0.1)};
    }
    
    /* Container styles */
    ${scopeSelector} .container {
      padding-left: ${spacings[theme.spacing].element};
      padding-right: ${spacings[theme.spacing].element};
    }
    
    /* Gap utilities for business content */
    ${scopeSelector} .gap-business {
      gap: ${spacings[theme.spacing].gap};
    }
    
    ${scopeSelector} .space-y-business > * + * {
      margin-top: ${spacings[theme.spacing].gap};
    }
  `;
}