"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SimpleTheme, ModernTheme, simpleThemeToCSS, modernThemeToCSS } from "@/types/simple-theme";

interface SimpleThemeWrapperProps {
  businessId: Id<"businesses">;
  children: React.ReactNode;
}

export default function SimpleThemeWrapper({ businessId, children }: SimpleThemeWrapperProps) {
  const business = useQuery(api.businesses.getBusinessPublic, { businessId });
  const theme = useQuery(
    api.themes.getById, 
    business?.themeId ? { themeId: business.themeId } : "skip"
  );

  useEffect(() => {
    if (!business) return;

    // Handle new theme system with themeId
    if (business.themeId && theme) {
      const baseConfig = theme.config as unknown as ThemeConfig;
      const mergedTheme = business.themeOverrides 
        ? mergeThemes(baseConfig, business.themeOverrides as unknown as ThemeConfig)
        : baseConfig;
      applyModernThemeSystem(mergedTheme);
      return;
    }

    // Handle legacy theme system
    if (!business.theme) return;
    
    let themeToApply: SimpleTheme | null = null;
    
    // Try to parse saved theme from colorScheme
    if (business.theme.colorScheme) {
      try {
        const themeData = JSON.parse(business.theme.colorScheme);
        if (themeData.version === "simple-v1") {
          themeToApply = themeData;
        } else if (themeData.version === "modern-v1") {
          // Apply modern theme directly
          const modernTheme = themeData.theme as ModernTheme;
          const css = modernThemeToCSS(modernTheme);
          let styleEl = document.getElementById("business-theme-styles");
          if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "business-theme-styles";
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = css;
          return; // Exit early for modern theme
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
      };
    }
    
    // Apply theme if we have one
    if (themeToApply) {
      const css = simpleThemeToCSS(themeToApply);
      let styleEl = document.getElementById("business-theme-styles");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "business-theme-styles";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = css;
    }
  }, [business, theme]);

  return <div className="theme-wrapper">{children}</div>;
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

function applyModernThemeSystem(theme: ThemeConfig) {
  const root = document.documentElement;
  
  // Apply color tokens
  if (theme.colors?.light) {
    Object.entries(theme.colors.light).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--${key}`, value);
      }
    });
  }

  // Apply typography
  if (theme.typography) {
    if (theme.typography.fontFamilyBase) {
      root.style.setProperty('--font-family', theme.typography.fontFamilyBase);
    }
    if (theme.typography.fontSize?.base) {
      root.style.setProperty('--font-size-base', theme.typography.fontSize.base);
    }
    if (theme.typography.fontWeight?.normal) {
      root.style.setProperty('--font-weight-normal', theme.typography.fontWeight.normal.toString());
    }
    if (theme.typography.lineHeight?.normal) {
      root.style.setProperty('--line-height-normal', theme.typography.lineHeight.normal.toString());
    }
  }

  // Apply spacing
  if (theme.spacing) {
    Object.entries(theme.spacing).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--spacing-${key}`, value);
      }
    });
  }

  // Apply border radius
  if (theme.borderRadius) {
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--radius-${key}`, value);
      }
    });
  }

  // Apply effects
  if (theme.effects?.shadow) {
    Object.entries(theme.effects.shadow).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--shadow-${key}`, value);
      }
    });
  }

  // Apply custom CSS if provided
  if (theme.customCSS) {
    let styleEl = document.getElementById("business-theme-styles");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "business-theme-styles";
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = theme.customCSS;
  }
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