"use client";

import React, { useState, useCallback } from "react";
import {
  SimplePageData,
  SectionInstance,
  SimpleComponentData,
} from "../types/simple-builder";
import { SectionRenderer } from "../sections/section-renderer";
import { SectionSelector } from "./section-selector";
import { PageSettingsSidebar } from "../ui/page-settings-sidebar-enhanced";
import { SectionSettingsSidebarEnhanced } from "../ui/section-settings-sidebar-enhanced";
import ResponsiveFrame from "../ui/responsive-frame";
import CanvasControls, { DeviceSize, deviceSizes } from "../ui/canvas-controls";
import {
  ResponsiveStyleControls,
  ResponsiveStyles,
} from "../ui/responsive-style-controls";
import { getVariationById } from "../sections/section-variations";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
  Plus,
  Settings,
  Eye,
  Save,
  Rocket,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Layers,
  Smartphone,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { TooltipProvider } from "@/app/components/ui/tooltip";

interface SimpleEditorProps {
  initialData: SimplePageData;
  businessData?: Record<string, string>;
  domain?: string;
  isPublished?: boolean;
  businessId?: string;
  business?: Record<string, unknown>;
  pageId?: string;
  onSaveAction?: (data: SimplePageData) => void;
  onPublishAction?: (data: SimplePageData) => void;
}

export function SimpleEditorResponsive({
  initialData,
  businessData,
  domain,
  isPublished = false,
  onSaveAction,
  onPublishAction,
}: SimpleEditorProps) {
  const [pageData, setPageData] = useState<SimplePageData>(initialData);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [isPageSettingsOpen, setIsPageSettingsOpen] = useState(false);
  const [isSectionSettingsOpen, setIsSectionSettingsOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isResponsiveStylesOpen, setIsResponsiveStylesOpen] = useState(false);

  // Responsive preview states
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const [zoom, setZoom] = useState(100);
  const [responsiveStyles, setResponsiveStyles] = useState<
    Record<string, ResponsiveStyles>
  >({});

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add a new section
  const handleAddSection = useCallback(
    (variationId: string, insertIndex?: number) => {
      const variation = getVariationById(variationId);
      if (!variation) return;

      const newSection: SectionInstance = {
        id: generateId(),
        variationId: variation.id,
        order: insertIndex ?? pageData.sections.length,
        data: JSON.parse(JSON.stringify(variation.template)), // Deep clone
      };

      setPageData((prev) => {
        const newSections = [...prev.sections];
        if (insertIndex !== undefined) {
          // Insert at specific position
          newSections.splice(insertIndex, 0, newSection);
          // Update order for all sections
          newSections.forEach((section, idx) => {
            section.order = idx;
          });
        } else {
          // Add to end
          newSections.push(newSection);
        }

        return {
          ...prev,
          sections: newSections,
        };
      });

      setIsAddingSectionOpen(false);
      setSelectedSectionId(newSection.id);
    },
    [pageData.sections],
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

  // Duplicate section
  const handleDuplicateSection = useCallback(
    (sectionId: string) => {
      const sectionToDuplicate = pageData.sections.find(
        (s) => s.id === sectionId,
      );
      if (!sectionToDuplicate) return;

      const newSection: SectionInstance = {
        id: generateId(),
        variationId: sectionToDuplicate.variationId,
        order: sectionToDuplicate.order + 1,
        data: JSON.parse(JSON.stringify(sectionToDuplicate.data)), // Deep clone
      };

      setPageData((prev) => {
        const newSections = [...prev.sections];
        const insertIndex =
          newSections.findIndex((s) => s.id === sectionId) + 1;
        newSections.splice(insertIndex, 0, newSection);

        // Update order for all sections
        newSections.forEach((section, idx) => {
          section.order = idx;
        });

        return {
          ...prev,
          sections: newSections,
        };
      });

      setSelectedSectionId(newSection.id);
    },
    [pageData.sections],
  );

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

  // Update responsive styles for a section
  const handleResponsiveStyleUpdate = useCallback(
    (
      device: "mobile" | "tablet" | "desktop",
      styles: ResponsiveStyles[keyof ResponsiveStyles],
    ) => {
      if (!selectedSectionId || !styles) return;

      setResponsiveStyles((prev) => ({
        ...prev,
        [selectedSectionId]: {
          ...prev[selectedSectionId],
          [device]: styles,
        },
      }));
    },
    [selectedSectionId],
  );

  // Save changes
  const handleSave = useCallback(() => {
    if (onSaveAction) {
      // Include responsive styles in the page data
      const enhancedPageData = {
        ...pageData,
        responsiveStyles,
      };
      onSaveAction(enhancedPageData);
    }
  }, [pageData, responsiveStyles, onSaveAction]);

  // Publish changes
  const handlePublish = useCallback(() => {
    if (onPublishAction) {
      const enhancedPageData = {
        ...pageData,
        responsiveStyles,
      };
      onPublishAction(enhancedPageData);
    }
  }, [pageData, responsiveStyles, onPublishAction]);

  // Get selected section data
  const selectedSection = pageData.sections.find(
    (s) => s.id === selectedSectionId,
  );

  return (
    <TooltipProvider>
      <div className="simple-editor h-screen flex flex-col">
        {/* Editor Header */}
        <div className="sticky top-0 z-40 bg-background border-b">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">Page Editor</h1>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPageSettingsOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Page Settings
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className={cn(
                    "flex items-center gap-2",
                    isPreviewMode && "bg-accent",
                  )}
                >
                  <Eye className="h-4 w-4" />
                  {isPreviewMode ? "Edit" : "Preview"}
                </Button>

                <div className="h-6 w-px bg-border" />

                <Button
                  onClick={handleSave}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save
                </Button>

                {onPublishAction && (
                  <Button
                    onClick={handlePublish}
                    size="sm"
                    variant={isPublished ? "secondary" : "default"}
                    className="flex items-center gap-2"
                  >
                    <Rocket className="h-4 w-4" />
                    {isPublished ? "Update" : "Publish"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Section List */}
          <div className="w-64 border-r bg-muted/30 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Page Sections
                </h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingSectionOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {pageData.sections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-3">
                    No sections yet
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setIsAddingSectionOpen(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {pageData.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section, index) => {
                      const variation = getVariationById(section.variationId);
                      return (
                        <div
                          key={section.id}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-colors",
                            selectedSectionId === section.id
                              ? "bg-primary/10 border-primary"
                              : "bg-background hover:bg-accent",
                          )}
                          onClick={() => setSelectedSectionId(section.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {variation?.name || "Unknown Section"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {variation?.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReorderSections(
                                    index,
                                    Math.max(0, index - 1),
                                  );
                                }}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReorderSections(
                                    index,
                                    Math.min(
                                      pageData.sections.length - 1,
                                      index + 1,
                                    ),
                                  );
                                }}
                                disabled={
                                  index === pageData.sections.length - 1
                                }
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* Add section button between sections */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingSectionOpen(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              )}

              {/* Responsive Styles Button */}
              {selectedSectionId && (
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsResponsiveStylesOpen(true)}
                    className="w-full flex items-center gap-2"
                  >
                    <Smartphone className="h-4 w-4" />
                    Responsive Styles
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Center - Page Preview with Responsive Frame */}
          <div className="flex-1 overflow-hidden relative bg-muted/30">
            <div className="h-full overflow-hidden flex items-center justify-center p-4">
              <div
                className="flex items-start justify-center"
                style={{
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "center center",
                  height: `${100 / (zoom / 100)}%`,
                  width: "100%",
                }}
              >
                <ResponsiveFrame
                  width={
                    deviceSize === "desktop"
                      ? "100%"
                      : deviceSizes[deviceSize].width
                  }
                  className="bg-background shadow-xl"
                >
                  <div
                    className={cn(
                      "min-h-full",
                      isPreviewMode && "pointer-events-none",
                    )}
                  >
                    {pageData.sections.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <p className="text-muted-foreground mb-4">
                            Start building your page by adding sections
                          </p>
                          <Button
                            onClick={() => setIsAddingSectionOpen(true)}
                            size="lg"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add First Section
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {pageData.sections
                          .sort((a, b) => a.order - b.order)
                          .map((section, index) => {
                            const sectionStyles =
                              deviceSize !== "desktop"
                                ? responsiveStyles[section.id]?.[
                                    deviceSize === "tablet"
                                      ? "tablet"
                                      : "mobile"
                                  ]
                                : undefined;
                            const shouldHide = sectionStyles?.hideOnDevice;
                            if (shouldHide && isPreviewMode) {
                              return null;
                            }

                            return (
                              <div
                                key={section.id}
                                className={cn(
                                  "relative group",
                                  !isPreviewMode &&
                                    "hover:ring-2 hover:ring-primary/50",
                                  selectedSectionId === section.id &&
                                    "ring-2 ring-primary",
                                  shouldHide && !isPreviewMode && "opacity-50",
                                )}
                                onClick={() =>
                                  !isPreviewMode &&
                                  setSelectedSectionId(section.id)
                                }
                              >
                                {/* Section Controls */}
                                {!isPreviewMode && (
                                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-1 bg-background rounded-md shadow-lg p-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsSectionSettingsOpen(true);
                                        }}
                                        title="Section settings"
                                      >
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDuplicateSection(section.id);
                                        }}
                                        title="Duplicate section"
                                      >
                                        <Copy className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
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
                                        title="Delete section"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Section Content with Responsive Styles */}
                                <div
                                  className={cn(
                                    sectionStyles?.padding &&
                                      `p-${sectionStyles.padding}`,
                                    sectionStyles?.margin &&
                                      `m-${sectionStyles.margin}`,
                                    sectionStyles?.fontSize,
                                    sectionStyles?.textAlign &&
                                      `text-${sectionStyles.textAlign}`,
                                    sectionStyles?.stackVertically &&
                                      "flex flex-col",
                                    sectionStyles?.columnGap &&
                                      `gap-${sectionStyles.columnGap}`,
                                  )}
                                >
                                  <SectionRenderer
                                    data={section.data}
                                    editMode={!isPreviewMode}
                                    businessData={businessData}
                                    onUpdate={(newData) =>
                                      handleUpdateSection(section.id, newData)
                                    }
                                  />
                                </div>

                                {/* Add Section Button */}
                                {!isPreviewMode &&
                                  index < pageData.sections.length - 1 && (
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 shadow-lg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setIsAddingSectionOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </ResponsiveFrame>
              </div>
            </div>
            {/* Canvas Controls */}
            <CanvasControls
              deviceSize={deviceSize}
              onDeviceSizeChangeAction={setDeviceSize}
              zoom={zoom}
              onZoomChangeAction={setZoom}
              isPreviewMode={isPreviewMode}
              onPreviewModeChangeAction={setIsPreviewMode}
            />
          </div>
        </div>

        {/* Section Selector Modal */}
        {isAddingSectionOpen && (
          <SectionSelector
            onSelect={handleAddSection}
            onClose={() => setIsAddingSectionOpen(false)}
          />
        )}

        {/* Page Settings Sidebar */}
        <PageSettingsSidebar
          isOpen={isPageSettingsOpen}
          onClose={() => setIsPageSettingsOpen(false)}
          pageTitle={pageData.pageTitle || "Untitled Page"}
          domain={domain}
          seoTitle={pageData.seoTitle}
          seoDescription={pageData.seoDescription}
          seoKeywords={pageData.seoKeywords}
          ogTitle={pageData.ogTitle}
          ogDescription={pageData.ogDescription}
          ogImage={pageData.ogImage}
          isPublished={isPublished}
          onUpdate={(settings) => {
            setPageData((prev) => ({
              ...prev,
              ...settings,
            }));
          }}
        />

        {/* Section Settings Sidebar */}
        {selectedSection && (
          <SectionSettingsSidebarEnhanced
            isOpen={isSectionSettingsOpen}
            onClose={() => setIsSectionSettingsOpen(false)}
            sectionData={selectedSection.data}
            variationId={selectedSection.variationId}
            pageSections={pageData.sections.map((s) => ({
              id: s.id,
              type: s.variationId,
              content: s.data.content,
            }))}
            onUpdate={(newData) =>
              handleUpdateSection(selectedSection.id, newData)
            }
          />
        )}

        {/* Responsive Styles Sheet */}
        <Sheet
          open={isResponsiveStylesOpen}
          onOpenChange={setIsResponsiveStylesOpen}
        >
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Responsive Styles</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              {selectedSectionId && (
                <ResponsiveStyleControls
                  currentDevice={
                    deviceSize === "tablet"
                      ? "tablet"
                      : deviceSize === "mobile"
                        ? "mobile"
                        : "desktop"
                  }
                  styles={responsiveStyles[selectedSectionId] || {}}
                  onStyleChangeAction={handleResponsiveStyleUpdate}
                />
              )}{" "}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  );
}
