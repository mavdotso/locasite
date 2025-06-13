"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SimpleTheme, ModernTheme, simpleThemeToCSS, modernThemeToCSS } from "@/types/simple-theme";

interface ThemeIsolatedWrapperProps {
  businessId: Id<"businesses">;
  children: React.ReactNode;
  className?: string;
  temporaryTheme?: ModernTheme; // For live preview during editing
}

export default function ThemeIsolatedWrapper({ businessId, children, className, temporaryTheme }: ThemeIsolatedWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const business = useQuery(api.businesses.getBusinessPublic, { businessId });
  const theme = useQuery(
    api.themes.getById, 
    business?.themeId ? { themeId: business.themeId } : "skip"
  );

  useEffect(() => {
    if (!wrapperRef.current) return;
    if (!business && !temporaryTheme) return;

    // Create a unique ID for this wrapper's style element
    const styleId = `theme-isolated-${businessId}`;
    let styleEl = document.getElementById(styleId);
    
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    // Generate scoped CSS that only applies within this wrapper
    let scopedCSS = "";
    const scopeSelector = `[data-theme-scope="${businessId}"]`;

    // If we have a temporary theme (during editing), use that
    if (temporaryTheme) {
      scopedCSS = generateScopedCSS(scopeSelector, modernThemeToCSS(temporaryTheme, false));
    }
    // Handle new theme system with themeId
    else if (business?.themeId && theme) {
      const baseConfig = theme.config as unknown as ThemeConfig;
      const mergedTheme = business.themeOverrides 
        ? mergeThemes(baseConfig, business.themeOverrides as unknown as ThemeConfig)
        : baseConfig;
      scopedCSS = generateScopedModernThemeCSS(scopeSelector, mergedTheme);
    }
    // Handle legacy theme system
    else if (business && business.theme) {
      let themeToApply: SimpleTheme | ModernTheme | null = null;
      
      // Try to parse saved theme from colorScheme
      if (business.theme.colorScheme) {
        try {
          const themeData = JSON.parse(business.theme.colorScheme);
          if (themeData.version === "simple-v1") {
            themeToApply = themeData;
          } else if (themeData.version === "modern-v1") {
            themeToApply = themeData.theme as ModernTheme;
          }
        } catch {
          // Continue to fallback
        }
      }
      
      // Fallback to simple theme from primary color
      if (!themeToApply && business.theme.primaryColor) {
        themeToApply = {
          primaryColor: business.theme.primaryColor,
          textColor: "#1f2937",
          backgroundColor: "#ffffff",
          fontSize: "normal",
          spacing: "normal",
          borderRadius: "small",
          fontFamily: business.theme.fontFamily
        } as SimpleTheme;
      }
      
      // Generate scoped CSS
      if (themeToApply) {
        if ('brandColor' in themeToApply) {
          scopedCSS = generateScopedCSS(scopeSelector, modernThemeToCSS(themeToApply, false));
        } else {
          scopedCSS = generateScopedCSS(scopeSelector, simpleThemeToCSS(themeToApply, false));
        }
      }
    }

    styleEl.textContent = scopedCSS;

    // Cleanup on unmount
    return () => {
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [business, theme, businessId, temporaryTheme]);

  return (
    <div 
      ref={wrapperRef}
      data-theme-scope={businessId}
      className={`theme-isolated-wrapper ${className || ''}`}
      style={{ isolation: 'isolate' }}
    >
      {children}
    </div>
  );
}

interface ThemeConfig {
  colors?: {
    light?: Record<string, string>;
  };
  typography?: {
    fontFamilyBase?: string;
    fontSize?: {
      base?: string;
    };
    fontWeight?: {
      normal?: number;
    };
    lineHeight?: {
      normal?: number | string;
    };
  };
  spacing?: Record<string, string>;
  borderRadius?: Record<string, string>;
  effects?: {
    shadow?: Record<string, string>;
  };
  customCSS?: string;
}

function generateScopedModernThemeCSS(scopeSelector: string, theme: ThemeConfig): string {
  let css = "";
  
  // Create a single rule with all CSS variables
  css += `${scopeSelector} {\n`;
  
  // Apply color tokens
  if (theme.colors?.light) {
    Object.entries(theme.colors.light).forEach(([key, value]) => {
      if (typeof value === 'string') {
        css += `  --${key}: ${value};\n`;
      }
    });
  }

  // Apply typography
  if (theme.typography) {
    if (theme.typography.fontFamilyBase) {
      css += `  --font-family: ${theme.typography.fontFamilyBase};\n`;
    }
    if (theme.typography.fontSize?.base) {
      css += `  --font-size-base: ${theme.typography.fontSize.base};\n`;
    }
    if (theme.typography.fontWeight?.normal) {
      css += `  --font-weight-normal: ${theme.typography.fontWeight.normal};\n`;
    }
    if (theme.typography.lineHeight?.normal) {
      css += `  --line-height-normal: ${theme.typography.lineHeight.normal};\n`;
    }
  }

  // Apply spacing
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      if (typeof value === 'string') {
        css += `  --spacing-${key}: ${value};\n`;
      }
    });
  }

  // Apply border radius
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      if (typeof value === 'string') {
        css += `  --radius-${key}: ${value};\n`;
      }
    });
  }

  // Apply effects
  if (theme.effects?.shadow) {
    Object.entries(theme.effects.shadow).forEach(([key, value]) => {
      if (typeof value === 'string') {
        css += `  --shadow-${key}: ${value};\n`;
      }
    });
  }
  
  css += `}\n\n`;
  
  // Apply font-family to all elements
  if (theme.typography?.fontFamilyBase) {
    css += `${scopeSelector} * { font-family: var(--font-family); }\n`;
  }

  // Apply custom CSS if provided
  if (theme.customCSS) {
    // Scope custom CSS by prefixing each rule with the scope selector
    const scopedCustomCSS = theme.customCSS
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('@') && trimmed.includes('{')) {
          // This is likely a CSS rule, prefix it
          return `${scopeSelector} ${trimmed}`;
        }
        return line;
      })
      .join('\n');
    css += scopedCustomCSS;
  }

  return css;
}

function generateScopedCSS(scopeSelector: string, originalCSS: string): string {
  // Handle CSS that sets variables on :root
  let processedCSS = originalCSS;
  
  // First, extract all :root rules and apply them to our scope
  const rootRegex = /:root\s*{([^}]+)}/g;
  const rootMatches = [...originalCSS.matchAll(rootRegex)];
  
  if (rootMatches.length > 0) {
    // Combine all root variables into one rule for our scope
    let scopedVariables = `${scopeSelector} {\n`;
    rootMatches.forEach(match => {
      scopedVariables += match[1];
    });
    scopedVariables += '\n}\n\n';
    
    // Remove original :root rules
    processedCSS = processedCSS.replace(rootRegex, '');
    
    // Add scoped variables at the beginning
    processedCSS = scopedVariables + processedCSS;
  }
  
  // Add important styles to ensure our theme overrides the default
  processedCSS += `\n\n/* Ensure theme isolation */\n`;
  processedCSS += `${scopeSelector} * {\n`;
  processedCSS += `  color: inherit;\n`;
  processedCSS += `  background-color: inherit;\n`;
  processedCSS += `  border-color: inherit;\n`;
  processedCSS += `}\n`;
  
  // Then prefix all other CSS rules with the scope selector
  return processedCSS
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.includes(scopeSelector) && !trimmed.startsWith('@') && !trimmed.startsWith('/*') && !trimmed.startsWith('*') && trimmed.includes('{') && !trimmed.includes(':root')) {
        // This is a CSS rule that needs to be scoped
        return `${scopeSelector} ${trimmed}`;
      }
      return line;
    })
    .join('\n');
}

function mergeThemes(baseTheme: ThemeConfig, overrides: ThemeConfig): ThemeConfig {
  // Deep merge theme objects
  const merged = JSON.parse(JSON.stringify(baseTheme));
  
  function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
      } else {
        target[key] = source[key];
      }
    }
  }
  
  deepMerge(merged as Record<string, unknown>, overrides as Record<string, unknown>);
  return merged;
}