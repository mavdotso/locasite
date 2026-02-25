"use client";

import React, { useState } from "react";
import {
  Menu,
  Sparkles,
  FileText,
  Briefcase,
  ImageIcon,
  MessageSquare,
  Phone,
} from "lucide-react";
import { SectionCategory } from "../types/simple-builder";
import { getVariationsByCategory } from "../sections/section-variations";
import { SectionMiniPreview } from "./section-mini-preview";
import { cn } from "@/app/lib/utils";

interface SectionSelectorProps {
  onSelect: (variationId: string) => void;
  onClose: () => void;
}

const categories: {
  id: SectionCategory;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "header",
    label: "Navigation Bar",
    description: "Menu at the top of your site",
    icon: <Menu className="h-5 w-5" />,
  },
  {
    id: "hero",
    label: "Welcome Banner",
    description: "Eye-catching section visitors see first",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: "about",
    label: "About Your Business",
    description: "Tell your story",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "services",
    label: "What You Offer",
    description: "Services, menu, or products",
    icon: <Briefcase className="h-5 w-5" />,
  },
  {
    id: "gallery",
    label: "Photo Gallery",
    description: "Photos of your work or space",
    icon: <ImageIcon className="h-5 w-5" />,
  },
  {
    id: "reviews",
    label: "Customer Reviews",
    description: "What customers are saying",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    id: "contact",
    label: "Contact Info",
    description: "Help customers reach you",
    icon: <Phone className="h-5 w-5" />,
  },
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
          <div className="w-56 border-r bg-muted/30 p-4">
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
                  <span className="shrink-0">{category.icon}</span>
                  <div>
                    <span className="text-sm">{category.label}</span>
                    <span className="text-xs text-muted-foreground block">
                      {category.description}
                    </span>
                  </div>
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
                  {/* Mini Layout Preview */}
                  <div className="aspect-video rounded mb-3 overflow-hidden border bg-slate-50">
                    <SectionMiniPreview variationId={variation.id} />
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
