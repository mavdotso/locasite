"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SimpleTheme, ModernTheme } from "@/types/simple-theme";
import { generateBusinessThemeCSS } from "./business-theme-styles";

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
      scopedCSS = generateBusinessThemeCSS(temporaryTheme, scopeSelector);
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
      if (themeToApply && 'brandColor' in themeToApply) {
        scopedCSS = generateBusinessThemeCSS(themeToApply, scopeSelector);
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
      className={className}
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
  // Convert theme config to ModernTheme format
  const modernTheme: ModernTheme = {
    brandColor: theme.colors?.light?.primary || "#00C9A8",
    primaryButtonColor: theme.colors?.light?.primary || "#035C67",
    secondaryButtonColor: theme.colors?.light?.secondary || "#DAF1EE",
    secondaryButtonOpacity: 100,
    textColor: theme.colors?.light?.foreground || "#1f2937",
    headingColor: theme.colors?.light?.foreground || "#111827",
    linkColor: theme.colors?.light?.primary || "#00C9A8",
    backgroundColor: theme.colors?.light?.background || "#ffffff",
    sectionBackgroundColor: theme.colors?.light?.muted || "#f9fafb",
    fontFamily: theme.typography?.fontFamilyBase || "Inter",
    fontSize: "normal" as const,
    borderRadius: "small" as const,
    spacing: "normal" as const,
  };
  
  return generateBusinessThemeCSS(modernTheme, scopeSelector);
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