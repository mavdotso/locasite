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

  useEffect(() => {
    if (!business?.theme) return;
    
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
      } catch (e) {
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
  }, [business]);

  return <div className="theme-wrapper">{children}</div>;
}