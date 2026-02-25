"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/app/components/ui/badge";
import { Check, Star } from "lucide-react";

interface ThemePreviewCardProps {
  theme: Doc<"themes">;
  businessName: string;
  businessPhoto?: string;
  isRecommended?: boolean;
  isActive?: boolean;
  onSelect: (themeId: Doc<"themes">["_id"]) => void;
}

export function ThemePreviewCard({
  theme,
  businessName,
  businessPhoto,
  isRecommended,
  isActive,
  onSelect,
}: ThemePreviewCardProps) {
  const colors = theme.config.colors.light;
  const typography = theme.config.typography;

  return (
    <button
      type="button"
      onClick={() => onSelect(theme._id)}
      className={`group relative rounded-xl border bg-card overflow-hidden text-left transition-all hover:shadow-lg hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        isActive
          ? "ring-2 ring-primary ring-offset-2"
          : "hover:border-primary/50"
      }`}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex gap-1.5">
        {isRecommended && (
          <Badge className="bg-amber-500 text-white border-0 shadow-sm">
            <Star className="size-3 mr-1 fill-current" />
            Recommended
          </Badge>
        )}
      </div>

      {/* Active checkmark */}
      {isActive && (
        <div className="absolute top-2 right-2 z-10 size-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
          <Check className="size-3.5" />
        </div>
      )}

      {/* Mini Preview */}
      <div
        className="aspect-[4/3] overflow-hidden relative"
        style={{ backgroundColor: colors.background }}
      >
        {/* Simulated header bar */}
        <div
          className="flex items-center justify-between px-3 py-1.5"
          style={{ backgroundColor: colors.card, borderBottom: `1px solid ${colors.muted}` }}
        >
          <span
            className="text-[8px] font-semibold truncate max-w-[60%]"
            style={{
              color: colors.foreground,
              fontFamily: typography.fontFamilyHeading,
            }}
          >
            {businessName}
          </span>
          <div className="flex gap-1.5">
            {["About", "Services", "Contact"].map((item) => (
              <span
                key={item}
                className="text-[6px]"
                style={{
                  color: colors.mutedForeground,
                  fontFamily: typography.fontFamilyBase,
                }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Simulated hero section */}
        <div
          className="px-3 py-3 relative"
          style={{ backgroundColor: colors.primary }}
        >
          {businessPhoto && (
            <div
              className="absolute inset-0 opacity-20 bg-cover bg-center"
              style={{ backgroundImage: `url(${businessPhoto})` }}
            />
          )}
          <div className="relative">
            <div
              className="text-[10px] font-bold leading-tight mb-1"
              style={{
                color: colors.primaryForeground,
                fontFamily: typography.fontFamilyHeading,
              }}
            >
              {businessName}
            </div>
            <div
              className="text-[6px] opacity-80 mb-1.5"
              style={{
                color: colors.primaryForeground,
                fontFamily: typography.fontFamilyBase,
              }}
            >
              Your trusted local business
            </div>
            <div
              className="inline-block text-[5px] px-1.5 py-0.5 rounded-sm font-medium"
              style={{
                backgroundColor: colors.accent,
                color: colors.accentForeground,
              }}
            >
              Learn More
            </div>
          </div>
        </div>

        {/* Simulated content blocks */}
        <div className="px-3 py-2 space-y-1.5">
          {/* Section heading */}
          <div
            className="text-[7px] font-semibold"
            style={{
              color: colors.foreground,
              fontFamily: typography.fontFamilyHeading,
            }}
          >
            Our Services
          </div>

          {/* Service cards */}
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
                  className="size-2.5 rounded-sm mb-0.5"
                  style={{ backgroundColor: colors.accent, opacity: 0.3 }}
                />
                <div
                  className="h-[3px] rounded-full mb-0.5"
                  style={{
                    backgroundColor: colors.foreground,
                    width: `${50 + i * 10}%`,
                    opacity: 0.7,
                  }}
                />
                <div
                  className="h-[2px] rounded-full"
                  style={{
                    backgroundColor: colors.mutedForeground,
                    width: `${70 - i * 5}%`,
                    opacity: 0.4,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card footer with theme info */}
      <div className="p-3 border-t">
        <div className="font-medium text-sm text-foreground">{theme.name}</div>
        {theme.description && (
          <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {theme.description}
          </div>
        )}
      </div>
    </button>
  );
}
