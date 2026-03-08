"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Check, Star } from "lucide-react";

interface ThemePreviewCardProps {
  theme: Doc<"themes">;
  businessName: string;
  isRecommended?: boolean;
  isActive?: boolean;
  onSelect: (themeId: Doc<"themes">["_id"]) => void;
}

/**
 * Compact theme preview card for the theme picker bottom sheet.
 * Shows colored rectangles representing the theme layout and colors,
 * with the theme name below and optional badges.
 */
export function ThemePreviewCard({
  theme,
  businessName,
  isRecommended,
  isActive,
  onSelect,
}: ThemePreviewCardProps) {
  const colors = theme.config.colors.light;

  return (
    <button
      type="button"
      onClick={() => onSelect(theme._id)}
      className={`group relative rounded-lg border overflow-hidden text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
        isActive
          ? "ring-2 ring-primary ring-offset-2 border-primary"
          : "border-border hover:border-primary/40"
      }`}
    >
      {/* Active checkmark */}
      {isActive && (
        <div className="absolute top-1.5 right-1.5 z-10 size-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
          <Check className="size-3" />
        </div>
      )}

      {/* Mini Preview - colored rectangles representing the layout */}
      <div
        className="aspect-[4/3] overflow-hidden relative p-2"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header bar */}
        <div
          className="flex items-center gap-1 px-1.5 py-1 rounded-sm mb-1.5"
          style={{
            backgroundColor: colors.card,
            border: `0.5px solid ${colors.muted}`,
          }}
        >
          <span
            className="text-[5px] font-semibold truncate max-w-[60%] leading-none"
            style={{ color: colors.foreground }}
          >
            {businessName}
          </span>
          <div className="flex gap-0.5 ml-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[2px] w-2 rounded-full"
                style={{ backgroundColor: colors.mutedForeground, opacity: 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Hero section */}
        <div
          className="rounded-sm px-1.5 py-2 mb-1.5"
          style={{ backgroundColor: colors.primary }}
        >
          <div
            className="h-[4px] rounded-full mb-1 w-3/4"
            style={{ backgroundColor: colors.primaryForeground, opacity: 0.9 }}
          />
          <div
            className="h-[3px] rounded-full mb-1.5 w-1/2"
            style={{ backgroundColor: colors.primaryForeground, opacity: 0.5 }}
          />
          <div
            className="h-[6px] w-8 rounded-sm"
            style={{ backgroundColor: colors.accent }}
          />
        </div>

        {/* Content blocks - 3 service cards */}
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-sm p-1"
              style={{
                backgroundColor: colors.card,
                border: `0.5px solid ${colors.muted}`,
              }}
            >
              <div
                className="w-full h-1.5 rounded-sm mb-0.5"
                style={{ backgroundColor: colors.accent, opacity: 0.25 }}
              />
              <div
                className="h-[2px] rounded-full"
                style={{
                  backgroundColor: colors.foreground,
                  width: `${50 + i * 12}%`,
                  opacity: 0.5,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Card footer with theme name and badges */}
      <div className="px-2 py-1.5 border-t bg-card">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-foreground truncate">
            {theme.name}
          </span>
        </div>
        {isRecommended && (
          <div className="flex items-center gap-0.5 mt-0.5">
            <Star className="size-2.5 fill-amber-500 text-amber-500" />
            <span className="text-[10px] text-amber-600 font-medium">
              Best match
            </span>
          </div>
        )}
      </div>
    </button>
  );
}
