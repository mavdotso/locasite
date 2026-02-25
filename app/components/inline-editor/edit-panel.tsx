"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import type {
  SimpleComponentData,
  SectionCategory,
} from "@/app/components/simple-builder/types/simple-builder";
import { SECTION_LABELS } from "./section-overlay";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface EditPanelProps {
  section: {
    id: string;
    variationId: string;
    order: number;
    data: SimpleComponentData;
  };
  category: SectionCategory;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (updatedData: SimpleComponentData) => void;
}

// ---------------------------------------------------------------------------
// Helpers — extract & update editable fields from section content
// ---------------------------------------------------------------------------

/** Returns a flat list of { path, label, value, kind } for known content keys */
function extractEditableFields(
  content: Record<string, unknown>,
): { path: string; label: string; value: string; kind: "short" | "long" | "image" | "list" }[] {
  const fields: {
    path: string;
    label: string;
    value: string;
    kind: "short" | "long" | "image" | "list";
  }[] = [];

  // Short text fields
  const shortKeys: Record<string, string> = {
    title: "Title",
    subtitle: "Subtitle",
    ctaText: "Button Text",
    ctaLink: "Button Link",
    secondaryCtaText: "Secondary Button Text",
    secondaryCtaLink: "Secondary Button Link",
    buttonText: "Button Text",
    buttonLink: "Button Link",
    phone: "Phone",
    email: "Email",
    hours: "Hours",
    address: "Address",
    logoAlt: "Logo Alt Text",
  };

  // Long text fields
  const longKeys: Record<string, string> = {
    content: "Content",
    description: "Description",
    column1: "Column 1",
    column2: "Column 2",
  };

  // Image fields
  const imageKeys: Record<string, string> = {
    backgroundImage: "Background Image",
    image: "Image",
    logo: "Logo",
  };

  for (const [key, label] of Object.entries(shortKeys)) {
    if (key in content && typeof content[key] === "string") {
      fields.push({ path: key, label, value: content[key] as string, kind: "short" });
    }
  }

  for (const [key, label] of Object.entries(longKeys)) {
    if (key in content && typeof content[key] === "string") {
      fields.push({ path: key, label, value: content[key] as string, kind: "long" });
    }
  }

  for (const [key, label] of Object.entries(imageKeys)) {
    if (key in content && typeof content[key] === "string") {
      fields.push({ path: key, label, value: content[key] as string, kind: "image" });
    }
  }

  return fields;
}

/** Extract list fields (services, features, reviews, etc.) */
function extractListFields(
  content: Record<string, unknown>,
): { path: string; label: string; items: Record<string, unknown>[] }[] {
  const listKeys: Record<string, string> = {
    services: "Services",
    features: "Features",
    reviews: "Reviews",
    timeline: "Timeline",
    pricingTiers: "Pricing Tiers",
    menuItems: "Menu Items",
    images: "Images",
    cards: "Cards",
    comparisons: "Comparisons",
    socialLinks: "Social Links",
  };

  const lists: { path: string; label: string; items: Record<string, unknown>[] }[] = [];

  for (const [key, label] of Object.entries(listKeys)) {
    if (key in content && Array.isArray(content[key])) {
      const items = content[key] as Record<string, unknown>[];
      if (items.length > 0) {
        lists.push({ path: key, label, items });
      }
    }
  }

  return lists;
}

// ---------------------------------------------------------------------------
// Sub-components for list items
// ---------------------------------------------------------------------------

function ListItemEditor({
  item,
  index,
  onChange,
}: {
  item: Record<string, unknown>;
  index: number;
  onChange: (updated: Record<string, unknown>) => void;
}) {
  // Show editable string fields of this item
  const stringFields = Object.entries(item).filter(
    ([, v]) => typeof v === "string",
  );

  if (stringFields.length === 0) return null;

  return (
    <div className="rounded-md border border-border/60 p-3 space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Item {index + 1}
      </p>
      {stringFields.map(([key, value]) => (
        <div key={key}>
          <label className="text-xs text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, " $1").trim()}
          </label>
          <Input
            value={value as string}
            onChange={(e) =>
              onChange({ ...item, [key]: e.target.value })
            }
            className="mt-0.5 text-sm"
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Edit Panel
// ---------------------------------------------------------------------------

export function EditPanel({
  section,
  category,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: EditPanelProps) {
  const label = SECTION_LABELS[category] ?? category;

  // Local copy of the section content for editing
  const [localContent, setLocalContent] = useState<Record<string, unknown>>(
    () => ({ ...section.data.content }),
  );

  // Reset local content when a new section is opened
  useEffect(() => {
    if (isOpen) {
      setLocalContent({ ...section.data.content });
    }
  }, [isOpen, section.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape
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

  const fields = extractEditableFields(localContent);
  const lists = extractListFields(localContent);

  function handleFieldChange(path: string, value: string) {
    setLocalContent((prev) => ({ ...prev, [path]: value }));
  }

  function handleListItemChange(
    listPath: string,
    index: number,
    updated: Record<string, unknown>,
  ) {
    setLocalContent((prev) => {
      const list = [...(prev[listPath] as Record<string, unknown>[])];
      list[index] = updated;
      return { ...prev, [listPath]: list };
    });
  }

  function handleSave() {
    const updatedData: SimpleComponentData = {
      ...section.data,
      content: localContent,
    };
    onSave(updatedData);
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Edit ${label}`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Slide-up panel */}
      <div className="relative z-10 w-full max-w-lg bg-background rounded-t-2xl shadow-2xl border border-border animate-in slide-in-from-bottom-4 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border/40 shrink-0">
          <h2 className="text-base font-semibold text-foreground">
            Edit: {label}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close edit panel"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Simple fields */}
          {fields.map((field) => (
            <div key={field.path}>
              <label className="block text-sm font-medium text-foreground mb-1">
                {field.label}
              </label>
              {field.kind === "short" && (
                <Input
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(field.path, e.target.value)
                  }
                />
              )}
              {field.kind === "long" && (
                <Textarea
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(field.path, e.target.value)
                  }
                  rows={4}
                />
              )}
              {field.kind === "image" && (
                <div className="space-y-2">
                  {field.value && !field.value.startsWith("{") ? (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden border border-border/60 bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={field.value}
                        alt={field.label}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 rounded-md border border-dashed border-border bg-muted/50">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <Input
                    value={field.value}
                    onChange={(e) =>
                      handleFieldChange(field.path, e.target.value)
                    }
                    placeholder="Image URL"
                    className="text-sm"
                  />
                </div>
              )}
            </div>
          ))}

          {/* List fields */}
          {lists.map((list) => (
            <div key={list.path}>
              <label className="block text-sm font-medium text-foreground mb-2">
                {list.label}
              </label>
              <div className="space-y-2">
                {list.items.map((item, i) => (
                  <ListItemEditor
                    key={i}
                    item={item}
                    index={i}
                    onChange={(updated) =>
                      handleListItemChange(list.path, i, updated)
                    }
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Empty state if nothing editable found */}
          {fields.length === 0 && lists.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              This section does not have editable fields yet.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 border-t border-border/40 shrink-0">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-10"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>

        {/* Safe area for mobile */}
        <div className="h-safe-area-inset-bottom sm:hidden" />
      </div>
    </div>
  );
}
