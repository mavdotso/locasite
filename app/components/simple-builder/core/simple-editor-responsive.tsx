"use client";

import React, { useState, useCallback } from "react";
import {
  SimplePageData,
  SectionInstance,
  SimpleComponentData,
} from "../types/simple-builder";
import { SectionRenderer } from "../sections/section-renderer";
import { SectionSelector } from "./section-selector";
import {
  PageSettings,
  PageSettingsData,
} from "@/app/components/common/page-settings";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import { SectionSettingsSidebar } from "../ui/section-settings-sidebar";
import ResponsiveFrame from "../ui/responsive-frame";
import CanvasControls, { DeviceSize, deviceSizes } from "../ui/canvas-controls";

import { getVariationById } from "../sections/section-variations";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import ErrorBoundary from "@/app/components/common/error-boundary";
import {
  Plus,
  Settings,
  Save,
  Rocket,
  ChevronUp,
  ChevronDown,
  Trash2,
  Copy,
  Layers,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Logo from "@/app/components/ui/logo";

import { TooltipProvider } from "@/app/components/ui/tooltip";
import { PublishSettingsDialog } from "@/app/components/business/publish-settings-dialog";
import { Id } from "@/convex/_generated/dataModel";

interface SimpleEditorProps {
  initialData: SimplePageData;
  businessData?: Record<string, string>;
  isPublished?: boolean;
  businessId?: string;
  business?: Record<string, unknown>;
  pageId?: string;
  themeColors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    card: string;
    muted: string;
  };
  onSaveAction?: (data: SimplePageData) => void;
  onPublishAction?: (data: SimplePageData) => void;
}

export function SimpleEditorResponsive({
  initialData,
  businessData,
  isPublished = false,
  businessId,
  business,
  themeColors,
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
  const [settingsSectionId, setSettingsSectionId] = useState<string | null>(
    null,
  );

  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [pendingInsertIndex, setPendingInsertIndex] = useState<
    number | undefined
  >(undefined);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  // Responsive preview states
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const [zoom, setZoom] = useState(100);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Add a new section
  const handleAddSection = useCallback(
    (variationId: string, insertAfterIndex?: number) => {
      const variation = getVariationById(variationId);
      if (!variation) return;

      // Generate a smart ID based on section type
      const baseId = variation.template.type.split("-")[0]; // e.g., "hero" from "hero-section"

      // Count existing sections of the same base type
      const existingSectionsOfType = pageData.sections.filter((s) => {
        const sectionVariation = getVariationById(s.variationId);
        return sectionVariation?.template.type.startsWith(baseId);
      });

      // Only add number if there's already a section of this type
      const sectionId =
        existingSectionsOfType.length > 0
          ? `${baseId}-${existingSectionsOfType.length + 1}`
          : baseId;

      // Deep clone the template
      const templateClone = JSON.parse(JSON.stringify(variation.template));
      templateClone.id = sectionId;

      // Replace placeholders with actual business data
      const replacePlaceholders = (obj: unknown): unknown => {
        if (typeof obj === "string") {
          return obj
            .replace(/\{businessName\}/g, businessData?.businessName || "Your Business")
            .replace(/\{businessAddress\}/g, businessData?.businessAddress || "123 Main Street")
            .replace(/\{businessPhone\}/g, businessData?.businessPhone || "(555) 123-4567")
            .replace(/\{businessEmail\}/g, businessData?.businessEmail || "info@business.com")
            .replace(/\{businessMainPhoto\}/g, businessData?.businessMainPhoto || "")
            .replace(/\{businessHours\}/g, businessData?.businessHours || "Mon-Fri: 9AM-5PM")
            .replace(/\{businessDescription\}/g, businessData?.businessDescription || "Your trusted local business");
        }
        if (Array.isArray(obj)) return obj.map(replacePlaceholders);
        if (obj && typeof obj === "object") {
          return Object.fromEntries(
            Object.entries(obj as Record<string, unknown>).map(([k, v]) => [k, replacePlaceholders(v)])
          );
        }
        return obj;
      };

      const newSection: SectionInstance = {
        id: generateId(),
        variationId: variation.id,
        order: 0, // Will be set properly below
        data: replacePlaceholders(templateClone) as SectionInstance["data"],
      };

      setPageData((prev) => {
        // Sort sections by order first to work with visual order
        const sortedSections = [...prev.sections].sort(
          (a, b) => a.order - b.order,
        );

        let newSections: SectionInstance[];

        if (insertAfterIndex !== undefined) {
          // Insert after the specified index
          newSections = [
            ...sortedSections.slice(0, insertAfterIndex + 1),
            newSection,
            ...sortedSections.slice(insertAfterIndex + 1),
          ];
        } else {
          // Add to end
          newSections = [...sortedSections, newSection];
        }

        // Reassign order values based on new positions
        newSections.forEach((section, idx) => {
          section.order = idx;
        });

        return {
          ...prev,
          sections: newSections,
        };
      });

      setIsAddingSectionOpen(false);
      setSelectedSectionId(newSection.id);
    },
    [pageData.sections, businessData],
  );

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

      // Generate a smart ID for the duplicated section
      const variation = getVariationById(sectionToDuplicate.variationId);
      if (!variation) return;

      const baseId = variation.template.type.split("-")[0];

      // Count all sections of the same base type
      const existingSectionsOfType = pageData.sections.filter((s) => {
        const sectionVariation = getVariationById(s.variationId);
        return sectionVariation?.template.type.startsWith(baseId);
      });

      // Always add a number for duplicates
      const sectionDataId = `${baseId}-${existingSectionsOfType.length + 1}`;

      const newSection: SectionInstance = {
        id: generateId(),
        variationId: sectionToDuplicate.variationId,
        order: sectionToDuplicate.order + 1,
        data: {
          ...JSON.parse(JSON.stringify(sectionToDuplicate.data)), // Deep clone
          id: sectionDataId, // Override the ID
        },
      };

      setPageData((prev) => {
        const newSections = [...prev.sections];
        const insertIndex =
          newSections.findIndex((s) => s.id === sectionId) + 1;
        newSections.splice(insertIndex, 0, newSection);

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
    if (onSaveAction) {
      onSaveAction(pageData);
    }
  }, [pageData, onSaveAction]);

  // Publish changes
  const handlePublish = useCallback(() => {
    // First save the current state
    handleSave();
    // Then open the publish dialog
    setIsPublishDialogOpen(true);
  }, [handleSave]);

  const settingsSection = pageData.sections.find(
    (s) => s.id === settingsSectionId,
  );

  // Full-screen preview mode
  if (isFullScreenPreview) {
    return (
      <TooltipProvider>
        {/* Full-screen preview without any UI elements */}
        <div className="h-screen w-screen overflow-hidden relative">
          {deviceSize === "desktop" ? (
            // For desktop, render directly without iframe
            <div className="h-full w-full overflow-auto bg-background">
              {pageData.sections.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    No sections to preview
                  </p>
                </div>
              ) : (
                <div>
                  {pageData.sections
                    .sort((a, b) => a.order - b.order)
                    .map((section) => (
                      <SectionRenderer
                        key={section.id}
                        data={section.data}
                        editMode={false}
                        businessData={businessData}
                        businessId={businessId}
                        onUpdate={() => {}}
                      />
                    ))}
                </div>
              )}
            </div>
          ) : (
            // For tablet/mobile, use ResponsiveFrame
            <div className="h-full overflow-hidden flex items-center justify-center bg-muted/30">
              <ResponsiveFrame
                width={deviceSizes[deviceSize].width}
                className="bg-background h-full shadow-xl"
              >
                <div className="min-h-full">
                  {pageData.sections.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        No sections to preview
                      </p>
                    </div>
                  ) : (
                    <div>
                      {pageData.sections
                        .sort((a, b) => a.order - b.order)
                        .map((section) => (
                          <SectionRenderer
                            key={section.id}
                            data={section.data}
                            editMode={false}
                            businessData={businessData}
                            businessId={businessId}
                            onUpdate={() => {}}
                          />
                        ))}
                    </div>
                  )}
                </div>
              </ResponsiveFrame>
            </div>
          )}

          {/* Canvas Controls - Only Device Size */}
          <CanvasControls
            deviceSize={deviceSize}
            onDeviceSizeChangeAction={setDeviceSize}
            zoom={100}
            onZoomChangeAction={() => {}}
            onExitFullScreenAction={() => setIsFullScreenPreview(false)}
            hideZoomControls={true}
            isFullScreen={true}
          />
        </div>
      </TooltipProvider>
    );
  }

  return (
    <ErrorBoundary variant="editor" onSaveRecovery={handleSave}>
      <TooltipProvider>
        <div className="simple-editor h-screen flex flex-col">
          {/* Editor Header */}
          <div className="sticky top-0 z-40 bg-background border-b">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Logo />
                  </Link>
                  <div className="h-6 w-px bg-border" />
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPageSettingsOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Page Settings
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

                  <Button
                    onClick={handlePublish}
                    size="sm"
                    variant={isPublished ? "secondary" : "default"}
                    className="flex items-center gap-2"
                  >
                    <Rocket className="h-4 w-4" />
                    {isPublished ? "Update Site" : "Go Live"}
                  </Button>
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
                    onClick={() => {
                      setPendingInsertIndex(undefined); // Add to end
                      setIsAddingSectionOpen(true);
                    }}
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
                      onClick={() => {
                        setPendingInsertIndex(undefined); // Add to end
                        setIsAddingSectionOpen(true);
                      }}
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
                      onClick={() => {
                        setPendingInsertIndex(undefined);
                        setIsAddingSectionOpen(true);
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
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
                    <div className="min-h-full">
                      {pageData.sections.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <p className="text-muted-foreground mb-4">
                              Start building your page by adding sections
                            </p>
                            <Button
                              onClick={() => {
                                setPendingInsertIndex(undefined);
                                setIsAddingSectionOpen(true);
                              }}
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
                              return (
                                <div
                                  key={section.id}
                                  className={cn(
                                    "relative group",
                                    "hover:ring-2 hover:ring-primary/50",
                                    selectedSectionId === section.id &&
                                      "ring-2 ring-primary",
                                  )}
                                  onClick={() =>
                                    setSelectedSectionId(section.id)
                                  }
                                >
                                  {/* Section Controls */}
                                  {
                                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <div className="flex items-center gap-1 bg-background rounded-md shadow-lg p-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setSettingsSectionId(section.id);
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
                                  }

                                  {/* Section Content with Responsive Styles */}
                                  <div>
                                    <SectionRenderer
                                      data={section.data}
                                      editMode={true}
                                      businessData={businessData}
                                      businessId={businessId}
                                      onUpdate={(newData) =>
                                        handleUpdateSection(section.id, newData)
                                      }
                                    />
                                  </div>

                                  {/* Add Section Button */}
                                  {index < pageData.sections.length - 1 && (
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 shadow-lg"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Find the sorted index for insertion
                                          const sortedSections =
                                            pageData.sections.sort(
                                              (a, b) => a.order - b.order,
                                            );
                                          const sortedIndex =
                                            sortedSections.findIndex(
                                              (s) => s.id === section.id,
                                            );
                                          setPendingInsertIndex(sortedIndex);
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
                onFullScreenPreviewAction={() => setIsFullScreenPreview(true)}
              />
            </div>
          </div>

          {/* Section Selector Modal */}
          {isAddingSectionOpen && (
            <SectionSelector
              onSelect={(variationId) => {
                handleAddSection(variationId, pendingInsertIndex);
                setPendingInsertIndex(undefined);
              }}
              onClose={() => {
                setIsAddingSectionOpen(false);
                setPendingInsertIndex(undefined);
              }}
            />
          )}

          {/* Page Settings Sidebar */}
          <Sheet open={isPageSettingsOpen} onOpenChange={setIsPageSettingsOpen}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Page Settings
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <PageSettings
                  businessId={businessId as Id<"businesses">}
                  initialData={{
                    pageTitle: pageData.pageTitle || "Untitled Page",
                    seoTitle: pageData.seoTitle || "",
                    seoDescription: pageData.seoDescription || "",
                    seoKeywords: pageData.seoKeywords || "",
                    ogTitle: pageData.ogTitle || "",
                    ogDescription: pageData.ogDescription || "",
                    ogImage: pageData.ogImage || "",
                  }}
                  onSave={(data: PageSettingsData) => {
                    setPageData((prev) => ({
                      ...prev,
                      pageTitle: data.pageTitle,
                      seoTitle: data.seoTitle,
                      seoDescription: data.seoDescription,
                      seoKeywords: data.seoKeywords,
                      ogTitle: data.ogTitle,
                      ogDescription: data.ogDescription,
                      ogImage: data.ogImage,
                    }));
                    setIsPageSettingsOpen(false);
                  }}
                  showDomainSettings={false}
                  showPublishButton={false}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Section Settings Sidebar */}
          {settingsSection && (
            <SectionSettingsSidebar
              isOpen={isSectionSettingsOpen}
              onClose={() => {
                setIsSectionSettingsOpen(false);
                setSettingsSectionId(null);
              }}
              sectionData={settingsSection.data}
              variationId={settingsSection.variationId}
              businessId={businessId}
              themeColors={themeColors}
              pageSections={pageData.sections.map((s) => ({
                id: s.id,
                type: s.variationId,
                content: s.data.content,
              }))}
              onUpdate={(newData) =>
                handleUpdateSection(settingsSection.id, newData)
              }
            />
          )}

          {/* Publish Settings Dialog */}
          {businessId && (
            <PublishSettingsDialog
              businessId={businessId as Id<"businesses">}
              businessName={
                (business?.name as string) || businessData?.name || "Business"
              }
              open={isPublishDialogOpen}
              onOpenChange={setIsPublishDialogOpen}
              onPublishComplete={() => {
                if (onPublishAction) {
                  onPublishAction(pageData);
                }
              }}
            />
          )}
        </div>
      </TooltipProvider>
    </ErrorBoundary>
  );
}
