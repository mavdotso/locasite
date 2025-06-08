"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ThemeSchema } from "@/types/theme";
import { getBusinessThemeStyles } from "@/lib/theme-utils";
import { useEffect, useState } from "react";

export function useBusinessTheme(businessId: Id<"businesses">) {
  const [themeStyles, setThemeStyles] = useState<{
    theme: ThemeSchema;
    css: string;
  } | null>(null);

  const business = useQuery(api.businesses.getBusinessPublic, { businessId });
  const theme = useQuery(
    api.themes.getTheme,
    business?.themeId ? { themeId: business.themeId } : "skip"
  );

  useEffect(() => {
    async function loadTheme() {
      if (business) {
        const styles = await getBusinessThemeStyles(business, theme);
        setThemeStyles(styles);
      }
    }

    loadTheme();
  }, [business, theme]);

  return {
    business,
    theme: themeStyles?.theme,
    themeCSS: themeStyles?.css,
    isLoading: !business,
  };
}