"use client";

import { useEffect } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { ThemeProvider } from "@/app/components/providers/theme-provider";
import { useBusinessTheme } from "@/app/hooks/useBusinessTheme";

interface BusinessThemeWrapperProps {
  businessId: Id<"businesses">;
  children: React.ReactNode;
}

// Inner component that uses the hook
function ThemeApplier({ businessId, children }: BusinessThemeWrapperProps) {
  const { theme, themeCSS, isLoading } = useBusinessTheme(businessId);

  useEffect(() => {
    if (themeCSS) {
      // Create or update style element
      let styleEl = document.getElementById("business-theme-styles");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "business-theme-styles";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = themeCSS;
    }
  }, [themeCSS]);

  if (isLoading) {
    return <div className="min-h-screen animate-pulse bg-muted" />;
  }

  return <>{children}</>;
}

export default function BusinessThemeWrapper({ businessId, children }: BusinessThemeWrapperProps) {
  return (
    <ThemeProvider businessId={businessId}>
      <ThemeApplier businessId={businessId}>
        {children}
      </ThemeApplier>
    </ThemeProvider>
  );
}