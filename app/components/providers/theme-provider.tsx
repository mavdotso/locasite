"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ThemeSchema } from "@/types/theme";
import { applyThemeToCSS } from "@/lib/theme-presets";
import { getBusinessThemeStyles } from "@/lib/theme-utils";

interface ThemeContextValue {
  theme: ThemeSchema | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  businessId?: Id<"businesses">;
  themeId?: Id<"themes">;
}

export function ThemeProvider({
  children,
  businessId,
  themeId,
}: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [computedTheme, setComputedTheme] = useState<ThemeSchema | null>(null);

  // Fetch business data if businessId is provided
  const business = useQuery(
    api.businesses.getBusinessPublic,
    businessId ? { businessId } : "skip"
  );

  // Fetch theme data
  const theme = useQuery(
    api.themes.getTheme,
    themeId || business?.themeId ? { themeId: themeId || business?.themeId! } : "skip"
  );

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setIsDarkMode(savedMode === "true");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Update theme when data changes
  useEffect(() => {
    async function updateTheme() {
      if (business && theme) {
        const themeStyles = await getBusinessThemeStyles(business, theme);
        if (themeStyles) {
          setComputedTheme(themeStyles.theme);
          applyThemeToCSS(themeStyles.theme, isDarkMode);
        }
      } else if (theme) {
        // Direct theme without business overrides
        setComputedTheme(theme.config as unknown as ThemeSchema);
        applyThemeToCSS(theme.config as unknown as ThemeSchema, isDarkMode);
      }
    }

    updateTheme();
  }, [business, theme, isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    
    // Update CSS classes
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Apply initial dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const isLoading = businessId ? !business : themeId ? !theme : false;

  return (
    <ThemeContext.Provider
      value={{
        theme: computedTheme,
        isDarkMode,
        toggleDarkMode,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}