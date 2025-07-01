"use client";

import React, { useState } from "react";
import { SectionCategory } from "../types/simple-builder";
import { getVariationsByCategory } from "../sections/section-variations";
import { cn } from "@/app/lib/utils";

interface SectionSelectorProps {
  onSelect: (variationId: string) => void;
  onClose: () => void;
}

const categories: { id: SectionCategory; label: string; icon: string }[] = [
  { id: "hero", label: "Hero", icon: "🏠" },
  { id: "about", label: "About", icon: "📝" },
  { id: "services", label: "Services", icon: "⚡" },
  { id: "gallery", label: "Gallery", icon: "🖼️" },
  { id: "contact", label: "Contact", icon: "📞" },
];

export function SectionSelector({ onSelect, onClose }: SectionSelectorProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<SectionCategory>("hero");
  const variations = getVariationsByCategory(selectedCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add Section</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:bg-accent rounded-md p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[60vh]">
          {/* Category Sidebar */}
          <div className="w-48 border-r bg-muted/30 p-4">
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-md flex items-center gap-2",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent",
                  )}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Variations Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              {variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => onSelect(variation.id)}
                  className="text-left p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
                >
                  {/* Preview Placeholder */}
                  <div className="aspect-video bg-muted rounded mb-3 flex items-center justify-center">
                    <span className="text-4xl opacity-50">📄</span>
                  </div>

                  <h3 className="font-medium mb-1">{variation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {variation.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
