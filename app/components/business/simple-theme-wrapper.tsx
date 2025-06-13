"use client";

import ThemeIsolatedWrapper from "./theme-isolated-wrapper";

import { Id } from "@/convex/_generated/dataModel";

interface SimpleThemeWrapperProps {
  businessId: Id<"businesses">;
  children: React.ReactNode;
}

export default function SimpleThemeWrapper({ businessId, children }: SimpleThemeWrapperProps) {
  // Simply use the ThemeIsolatedWrapper which handles all theme logic
  return <ThemeIsolatedWrapper businessId={businessId}>{children}</ThemeIsolatedWrapper>;
}