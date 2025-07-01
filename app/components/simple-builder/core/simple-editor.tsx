"use client";

import React, { useState, useCallback } from "react";
import {
  SimplePageData,
  SectionInstance,
  SimpleComponentData,
} from "../types/simple-builder";
import { SectionRenderer } from "../sections/section-renderer";
import { SectionSelector } from "./section-selector";
import { getVariationById } from "../sections/section-variations";
import { cn } from "@/app/lib/utils";

interface SimpleEditorProps {
  initialData: SimplePageData;
  businessData?: Record<string, unknown>;
  onSave: (data: SimplePageData) => void;
  onPublish?: (data: SimplePageData) => void;
}

export function SimpleEditor({
  initialData,
  businessData,
  onSave,
  onPublish,
}: SimpleEditorProps) {
  const [pageData, setPageData] = useState<SimplePageData>(initialData);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add a new section
  const handleAddSection = useCallback(
    (variationId: string) => {
      const variation = getVariationById(variationId);
      if (!variation) return;

      const newSection: SectionInstance = {
        id: generateId(),
        variationId: variation.id,
        order: pageData.sections.length,
        data: JSON.parse(JSON.stringify(variation.template)), // Deep clone
      };

      setPageData((prev) => ({
        ...prev,
        sections: [...prev.sections, newSection],
      }));

      setIsAddingSectionOpen(false);
      setSelectedSectionId(newSection.id);
    },
    [pageData.sections.length],
  );

  // Update section data
  const handleUpdateSection = useCallback(
    (sectionId: string, newData: SimpleComponentData) => {
      setPageData((prev) => ({
        ...prev,
        sections: prev.sections.map((section) =>
          section.id === sectionId ? { ...section, data: newData } : section,
        ),
      }));
    },
    [],
  );

  // Delete section
  const handleDeleteSection = useCallback((sectionId: string) => {
    setPageData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
    setSelectedSectionId(null);
  }, []);

  // Reorder sections
  const handleReorderSections = useCallback(
    (fromIndex: number, toIndex: number) => {
      setPageData((prev) => {
        const newSections = [...prev.sections];
        const [movedSection] = newSections.splice(fromIndex, 1);
        newSections.splice(toIndex, 0, movedSection);

        // Update order values
        return {
          ...prev,
          sections: newSections.map((section, index) => ({
            ...section,
            order: index,
          })),
        };
      });
    },
    [],
  );

  // Save changes
  const handleSave = useCallback(() => {
    onSave(pageData);
  }, [pageData, onSave]);

  // Publish changes
  const handlePublish = useCallback(() => {
    if (onPublish) {
      onPublish(pageData);
    }
  }, [pageData, onPublish]);

  return (
    <div className="simple-editor">
      {/* Editor Header */}
      <div className="sticky top-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Simple Page Editor</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium rounded-md bg-secondary hover:bg-secondary/80"
              >
                Save Draft
              </button>
              {onPublish && (
                <button
                  onClick={handlePublish}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-screen bg-muted/30">
        {/* Sections */}
        <div className="py-8">
          {pageData.sections.length === 0 ? (
            <div className="container mx-auto px-4">
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">
                  No sections added yet. Start building your page!
                </p>
                <button
                  onClick={() => setIsAddingSectionOpen(true)}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Add First Section
                </button>
              </div>
            </div>
          ) : (
            <>
              {pageData.sections
                .sort((a, b) => a.order - b.order)
                .map((section, index) => (
                  <div
                    key={section.id}
                    className={cn(
                      "relative group",
                      selectedSectionId === section.id && "ring-2 ring-primary",
                    )}
                    onClick={() => setSelectedSectionId(section.id)}
                  >
                    {/* Section Controls */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 bg-background rounded-md shadow-lg p-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorderSections(
                              index,
                              Math.max(0, index - 1),
                            );
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-accent rounded disabled:opacity-50"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorderSections(
                              index,
                              Math.min(pageData.sections.length - 1, index + 1),
                            );
                          }}
                          disabled={index === pageData.sections.length - 1}
                          className="p-1 hover:bg-accent rounded disabled:opacity-50"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                "Are you sure you want to delete this section?",
                              )
                            ) {
                              handleDeleteSection(section.id);
                            }
                          }}
                          className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded"
                          title="Delete section"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Section Content */}
                    <SectionRenderer
                      data={section.data}
                      editMode={true}
                      businessData={businessData}
                      onUpdate={(newData) =>
                        handleUpdateSection(section.id, newData)
                      }
                    />
                  </div>
                ))}

              {/* Add Section Button */}
              <div className="container mx-auto px-4 py-8">
                <button
                  onClick={() => setIsAddingSectionOpen(true)}
                  className="w-full py-4 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors"
                >
                  + Add Section
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section Selector Modal */}
      {isAddingSectionOpen && (
        <SectionSelector
          onSelect={handleAddSection}
          onClose={() => setIsAddingSectionOpen(false)}
        />
      )}
    </div>
  );
}
