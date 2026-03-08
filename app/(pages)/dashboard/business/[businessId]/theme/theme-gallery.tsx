"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ThemePreviewCard } from "./theme-preview-card";
import { getBusinessCategoryTheme } from "@/app/components/simple-builder/core/business-category-themes";
import { useSubscription } from "@/app/hooks/use-subscription";

interface ThemeGalleryProps {
  businessId: Id<"businesses">;
}

/**
 * Maps a business category theme name to theme industry tags for recommendation matching.
 * The business category theme names come from getBusinessCategoryTheme() and the
 * industry values come from preset theme docs in the themes table.
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

export default function ThemeGallery({ businessId }: ThemeGalleryProps) {
  const router = useRouter();
  const [applyingThemeId, setApplyingThemeId] = useState<Id<"themes"> | null>(
    null,
  );
  const { themeLimit } = useSubscription();

  const business = useQuery(api.businesses.getById, { id: businessId });
  const presetThemes = useQuery(api.themes.getPresetThemes);
  const applyTheme = useMutation(api.themes.applyThemeToBusiness);

  // Loading state
  if (business === undefined || presetThemes === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Business not found — redirect to dashboard
  if (business === null) {
    router.push("/dashboard");
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Detect business category for theme recommendation
  const categoryTheme = getBusinessCategoryTheme(
    (business as Record<string, unknown>).category as string | undefined,
  );
  const industryMatches = getCategoryIndustryMatches(categoryTheme.name);

  // Find the recommended theme by matching industry tags
  const recommendedThemeId = findRecommendedTheme(
    presetThemes,
    industryMatches,
  );

  const businessPhoto = business.photos?.[0];

  async function handleSelectTheme(themeId: Id<"themes">) {
    setApplyingThemeId(themeId);
    try {
      await applyTheme({ businessId, themeId });
      toast.success("Theme applied! Redirecting to editor...");
      router.push(`/business/${businessId}/edit`);
    } catch {
      toast.error("Failed to apply theme. Please try again.");
      setApplyingThemeId(null);
    }
  }

  return (
    <div className="container max-w-6xl p-8 mx-auto">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Choose a Look for {business.name}
        </h1>
        <p className="text-muted-foreground mt-1">
          Pick a theme to get started. You can always customize colors, fonts,
          and layout later.
        </p>
      </div>

      {/* Theme grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {presetThemes.map((theme, index) => {
          // themeLimit: 1 = Free (only first theme), 5 = Starter, -1 = Pro (unlimited)
          const isUnlocked = themeLimit === -1 || index < themeLimit;

          if (!isUnlocked) {
            return (
              <div key={theme._id} className="relative">
                <div className="opacity-40 pointer-events-none">
                  <ThemePreviewCard
                    theme={theme}
                    businessName={business.name}
                    businessPhoto={businessPhoto}
                    isRecommended={theme._id === recommendedThemeId}
                    isActive={false}
                    onSelect={() => {}}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-lg backdrop-blur-[2px]">
                  <div className="flex flex-col items-center gap-2 text-center p-4">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Upgrade to unlock more themes
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push("/dashboard/billing")}
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <ThemePreviewCard
              key={theme._id}
              theme={theme}
              businessName={business.name}
              businessPhoto={businessPhoto}
              isRecommended={theme._id === recommendedThemeId}
              isActive={business.themeId === theme._id}
              onSelect={handleSelectTheme}
            />
          );
        })}
      </div>

      {/* Applying overlay */}
      {applyingThemeId && (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Applying theme...</p>
          </div>
        </div>
      )}

      {/* Skip button */}
      <div className="flex justify-center mt-8 pb-8">
        <Button
          variant="ghost"
          onClick={() => router.push(`/business/${businessId}/edit`)}
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
}

/**
 * Find the best recommended theme by matching business category industry to preset theme industries.
 */
function findRecommendedTheme(
  presetThemes: Doc<"themes">[],
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
