"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  X,
  Plus,
  Type,
  Image as ImageIcon,
  Users,
  Mail,
  Map,
  Info,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionType: string) => void;
  className?: string;
}

const SECTION_TYPES = [
  {
    type: "hero",
    name: "Hero",
    description: "Large banner with title and background",
    icon: Type,
    color: "bg-blue-500"
  },
  {
    type: "about",
    name: "About",
    description: "Tell your story and mission",
    icon: Info,
    color: "bg-green-500"
  },
  {
    type: "gallery",
    name: "Gallery",
    description: "Showcase your photos",
    icon: ImageIcon,
    color: "bg-purple-500"
  },
  {
    type: "reviews",
    name: "Reviews",
    description: "Customer testimonials",
    icon: Star,
    color: "bg-yellow-500"
  },
  {
    type: "contact",
    name: "Contact",
    description: "Contact form and information",
    icon: Mail,
    color: "bg-red-500"
  },
  {
    type: "map",
    name: "Map",
    description: "Location and directions",
    icon: Map,
    color: "bg-indigo-500"
  },
  {
    type: "info",
    name: "Business Info",
    description: "Hours, phone, address",
    icon: Users,
    color: "bg-teal-500"
  }
];

export function AddSectionModal({
  isOpen,
  onClose,
  onAddSection,
  className
}: AddSectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={cn(
        "relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden",
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add New Section</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-muted-foreground mb-6">
            Choose a section type to add to your website
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECTION_TYPES.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.type}
                  onClick={() => {
                    onAddSection(section.type);
                    onClose();
                  }}
                  className="p-4 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-lg text-white",
                      section.color
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm group-hover:text-blue-600">
                        {section.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-2">Coming Soon</h4>
            <p className="text-xs text-muted-foreground">
              More section types including Team, Services, Pricing, FAQ, and custom sections will be available soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}