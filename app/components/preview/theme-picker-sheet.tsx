"use client";

import { useEffect, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ThemePreviewCard } from "./theme-preview-card";
import { getBusinessCategoryTheme } from "@/app/components/simple-builder/core/business-category-themes";

/**
 * Maps a business category theme name to theme industry tags for recommendation matching.
 * Mirrors the logic from the full theme gallery.
 */
function getCategoryIndustryMatches(categoryThemeName: string): string[] {
  const map: Record<string, string[]> = {
    "Restaurant & Dining": ["food"],
    "Beauty & Wellness": ["beauty"],
    "Medical & Healthcare": ["healthcare"],
    "Fitness & Sports": ["fitness"],
    "Automotive Services": ["automotive"],
    "Professional Services": ["corporate", "technology"],
    "Retail & Shopping": ["creative", "luxury"],
    "Creative & Entertainment": ["creative"],
    "Education & Learning": ["corporate", "technology"],
    "Home Services": ["automotive", "corporate"],
  };
  return map[categoryThemeName] ?? [];
}

/**
 * Find the best recommended theme by matching business category industry
 * to preset theme industries.
 */
function findRecommendedThemeId(
  presetThemes: { _id: Id<"themes">; industry?: string }[],
  industryMatches: string[],
): Id<"themes"> | null {
  if (industryMatches.length === 0) return null;

  for (const industry of industryMatches) {
    const match = presetThemes.find(
      (t) => t.industry?.toLowerCase() === industry.toLowerCase(),
    );
    if (match) return match._id;
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

interface ThemePickerSheetProps {
  businessId: Id<"businesses">;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A bottom-sheet / modal overlay that lets the user pick from up to 6 preset
 * themes. Each theme card shows a mini-preview with colored rectangles
 * representing the layout.  Tapping a theme applies it immediately via
 * `applyThemeToBusiness` — no extra "Apply" button needed.
 */
export function ThemePickerSheet({
  businessId,
  isOpen,
  onClose,
}: ThemePickerSheetProps) {
  const business = useQuery(api.businesses.getById, { id: businessId });
  const presetThemes = useQuery(api.themes.getPresetThemes);
  const applyTheme = useMutation(api.themes.applyThemeToBusiness);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  // Prevent body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Loading state
  const isLoading =
    business === undefined || presetThemes === undefined;

  // Only show first 6 themes
  const themes = presetThemes?.slice(0, 6) ?? [];

  // Determine recommended theme
  let recommendedThemeId: Id<"themes"> | null = null;
  if (business && presetThemes) {
    const categoryTheme = getBusinessCategoryTheme(
      (business as Record<string, unknown>).category as string | undefined,
    );
    const industryMatches = getCategoryIndustryMatches(categoryTheme.name);
    recommendedThemeId = findRecommendedThemeId(themes, industryMatches);
  }

  async function handleSelectTheme(themeId: Id<"themes">) {
    try {
      await applyTheme({ businessId, themeId });
      toast.success("Theme applied!");
    } catch {
      toast.error("Failed to apply theme. Please try again.");
    }
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Pick a theme"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full sm:max-w-lg bg-background rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-foreground">
            Pick a look
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close theme picker"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <ThemePreviewCard
                  key={theme._id}
                  theme={theme}
                  businessName={business?.name ?? "Your Business"}
                  isRecommended={theme._id === recommendedThemeId}
                  isActive={business?.themeId === theme._id}
                  onSelect={handleSelectTheme}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom safe area for mobile */}
        <div className="h-safe-area-inset-bottom sm:hidden" />
      </div>
    </div>
  );
}
