"use client";

import React from "react";
import { Pencil, GripVertical, Trash2 } from "lucide-react";
import type { SectionCategory } from "@/app/components/simple-builder/types/simple-builder";

/** Friendly labels for each section category */
const SECTION_LABELS: Record<SectionCategory, string> = {
  hero: "Welcome Banner",
  about: "About Your Business",
  services: "What You Offer",
  gallery: "Photo Gallery",
  reviews: "Customer Reviews",
  contact: "Contact Info",
  header: "Navigation Bar",
  footer: "Footer",
};

interface SectionOverlayProps {
  children: React.ReactNode;
  sectionId: string;
  category: SectionCategory;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Wraps a rendered section with a hover overlay showing:
 *  - A dashed border
 *  - The section label badge
 *  - A pencil (edit) button
 *  - A trash (delete) button
 */
export function SectionOverlay({
  children,
  sectionId,
  category,
  onEdit,
  onDelete,
}: SectionOverlayProps) {
  const label = SECTION_LABELS[category] ?? category;

  return (
    <div
      className="group relative"
      data-section-overlay={sectionId}
    >
      {/* The actual rendered section */}
      {children}

      {/* Overlay controls — visible on hover / focus-within */}
      <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-transparent transition-colors group-hover:border-dashed group-hover:border-primary/40 group-focus-within:border-dashed group-focus-within:border-primary/40">
        {/* Top-left label badge */}
        <div className="pointer-events-auto absolute top-2 left-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="inline-flex items-center gap-1 rounded-md bg-background/90 backdrop-blur-sm border border-border/60 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
            <GripVertical className="h-3 w-3 text-muted-foreground" />
            {label}
          </span>
        </div>

        {/* Top-right action buttons */}
        <div className="pointer-events-auto absolute top-2 right-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center rounded-md bg-background/90 backdrop-blur-sm border border-border/60 shadow-sm h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
            aria-label={`Edit ${label}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center rounded-md bg-background/90 backdrop-blur-sm border border-border/60 shadow-sm h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-background transition-colors"
            aria-label={`Delete ${label}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export { SECTION_LABELS };
