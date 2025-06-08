"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SimpleTheme, simpleThemeToCSS } from "@/types/simple-theme";

interface SimpleThemeWrapperProps {
  businessId: Id<"businesses">;
  children: React.ReactNode;
}

export default function SimpleThemeWrapper({ businessId, children }: SimpleThemeWrapperProps) {
  const business = useQuery(api.businesses.getBusinessPublic, { businessId });

  useEffect(() => {
    if (business?.theme?.colorScheme) {
      try {
        // Parse the theme from colorScheme field
        const themeData = JSON.parse(business.theme.colorScheme);
        if (themeData.version === "simple-v1") {
          const theme: SimpleTheme = themeData;
          const css = simpleThemeToCSS(theme);
          
          // Apply theme CSS
          let styleEl = document.getElementById("business-theme-styles");
          if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "business-theme-styles";
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = css;
        }
      } catch (e) {
        // Fallback for old themes
        if (business.theme.primaryColor) {
          const fallbackTheme: SimpleTheme = {
            primaryColor: business.theme.primaryColor,
            textColor: "#1f2937",
            backgroundColor: "#ffffff",
            fontSize: "normal",
            spacing: "normal",
            borderRadius: "small",
            fontFamily: business.theme.fontFamily
          };
          
          const css = simpleThemeToCSS(fallbackTheme);
          let styleEl = document.getElementById("business-theme-styles");
          if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = "business-theme-styles";
            document.head.appendChild(styleEl);
          }
          styleEl.textContent = css;
        }
      }
    }
  }, [business]);

  return <div className="theme-wrapper">{children}</div>;
}