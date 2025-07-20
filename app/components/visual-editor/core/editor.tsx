"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  PageData,
  ComponentData,
  ComponentTemplate,
  LayoutOptions,
} from "@/app/types/visual-editor";
import { DragDropProvider } from "../drag-drop/drag-drop-provider";
import LeftSidebar from "../ui/left-sidebar";
import PreviewPanel from "../ui/preview-panel";
import FieldEditor from "../components/field-editor";
import { allComponentConfigs as componentConfigs } from "../config/all-components";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Save,
  Loader2,
  Undo,
  Redo,
  HelpCircle,
  Info,
  X,
  Menu,
  Layers,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { PublishSettingsDialog } from "@/app/components/business/publish-settings-dialog";
import { useComponentPreloader } from "@/app/hooks/use-component-preloader";
import TemplateSelector from "../library/template-selector";
import Logo from "@/app/components/ui/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import {
  PageSettings,
  PageSettingsData,
} from "@/app/components/common/page-settings";
import Link from "next/link";

interface VisualEditorProps {
  businessId: Id<"businesses">;
  business: Doc<"businesses">;
  pageId: Id<"pages">;
  initialData?: PageData;
  onSave?: (data: PageData) => Promise<void>;
}

interface SEOMetadataState {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  robots: string;
  author?: string;
  structuredData: Record<string, unknown>;
}

export default function VisualEditor({
  businessId,
  business,
  pageId,
  initialData,
  onSave,
}: VisualEditorProps) {
  const [pageData, setPageData] = useState<PageData>(
    initialData || {
      title: "New Page",
      components: [],
    },
  );

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<PageData[]>([pageData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [copiedComponent, setCopiedComponent] = useState<ComponentData | null>(
    null,
  );
  const [showStats, setShowStats] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileActivePanel, setMobileActivePanel] = useState<
    "components" | "canvas" | "properties"
  >("canvas");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [isFullScreenPreview, setIsFullScreenPreview] = useState(false);
  const [seoMetadata, setSeoMetadata] = useState<SEOMetadataState>({
    title: pageData.title || "",
    description: "",
    keywords: [],
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    twitterCard: "summary",
    robots: "index,follow",
    structuredData: {},
  });

  const updatePage = useMutation(api.pages.updatePage);

  // Preload commonly used components
  useComponentPreloader(componentConfigs);

  // Mobile detection and responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleEnterFullScreen = () => {
      setIsFullScreenPreview(true);
    };

    window.addEventListener("enterFullScreenPreview", handleEnterFullScreen);
    return () =>
      window.removeEventListener(
        "enterFullScreenPreview",
        handleEnterFullScreen,
      );
  }, []);

  // Auto-switch to canvas on mobile when component is selected
  useEffect(() => {
    if (isMobileView && selectedComponentId) {
      setMobileActivePanel("properties");
    }
  }, [isMobileView, selectedComponentId]);

  // Add to history
  const addToHistory = useCallback(
    (newData: PageData) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        return [...newHistory, newData];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  // Generate unique ID
  const generateId = () =>
    `component-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

  const handleUpdateComponent = useCallback(
    (id: string, props: Record<string, unknown>) => {
      const updateInComponents = (
        components: ComponentData[],
      ): ComponentData[] => {
        return components.map((comp) => {
          if (comp.id === id) {
            return { ...comp, props: { ...comp.props, ...props } };
          }
          if (comp.children) {
            return {
              ...comp,
              children: updateInComponents(comp.children),
            };
          }
          return comp;
        });
      };

      const newData = {
        ...pageData,
        components: updateInComponents(pageData.components),
      };
      setPageData(newData);
      addToHistory(newData);
      setHasUnsavedChanges(true);
    },
    [pageData, addToHistory],
  );

  const handleUpdateComponentLayout = useCallback(
    (id: string, layout: LayoutOptions) => {
      const updateInComponents = (
        components: ComponentData[],
      ): ComponentData[] => {
        return components.map((comp) => {
          if (comp.id === id) {
            return { ...comp, layout: { ...comp.layout, ...layout } };
          }
          if (comp.children) {
            return {
              ...comp,
              children: updateInComponents(comp.children),
            };
          }
          return comp;
        });
      };

      const newData = {
        ...pageData,
        components: updateInComponents(pageData.components),
      };
      setPageData(newData);
      addToHistory(newData);
      setHasUnsavedChanges(true);
    },
    [pageData, addToHistory],
  );

  // Add component
  const handleAddComponent = useCallback(
    (type: string, index: number, parentId?: string) => {
      const config = componentConfigs[type];
      if (!config) return;

      if (config.isTemplate && config.template) {
        const templateBlocks = config.template(business);

        // Convert template blocks to ComponentData
        const convertTemplate = (
          template: ComponentTemplate,
          parentId?: string,
        ): ComponentData => {
          const componentConfig = componentConfigs[template.type];
          const componentId = generateId();
          const component: ComponentData = {
            id: componentId,
            type: template.type,
            props: template.props,
            layout: {},
            parentId,
            children:
              componentConfig?.acceptsChildren && template.children
                ? template.children.map((child) =>
                    convertTemplate(child, componentId),
                  )
                : undefined,
          };
          return component;
        };

        // Convert all template blocks
        const newComponents = templateBlocks.map((template) =>
          convertTemplate(template),
        );

        let newData: PageData;

        if (parentId) {
          // Templates can't be added to containers - they always go at root level
          toast.error("Template sections must be added at the root level");
          return;
        } else {
          // Add all template components to root level
          newData = {
            ...pageData,
            components: [
              ...pageData.components.slice(0, index),
              ...newComponents,
              ...pageData.components.slice(index),
            ],
          };
        }

        setPageData(newData);
        addToHistory(newData);
        setHasUnsavedChanges(true);
        toast.success("Template added successfully");
      } else {
        const newComponent: ComponentData = {
          id: generateId(),
          type,
          props: config.defaultProps || {},
          layout: {},
          parentId,
        };

        let newData: PageData;

        if (parentId) {
          // Add to parent component's children
          const addToParent = (
            components: ComponentData[],
          ): ComponentData[] => {
            return components.map((comp) => {
              if (comp.id === parentId) {
                const children = comp.children || [];
                return {
                  ...comp,
                  children: [
                    ...children.slice(0, index),
                    newComponent,
                    ...children.slice(index),
                  ],
                };
              }
              if (comp.children) {
                return {
                  ...comp,
                  children: addToParent(comp.children),
                };
              }
              return comp;
            });
          };

          newData = {
            ...pageData,
            components: addToParent(pageData.components),
          };
        } else {
          // Add to root level
          newData = {
            ...pageData,
            components: [
              ...pageData.components.slice(0, index),
              newComponent,
              ...pageData.components.slice(index),
            ],
          };
        }

        setPageData(newData);
        addToHistory(newData);
        setHasUnsavedChanges(true);
        toast.success("Component added");
      }
    },
    [pageData, addToHistory, business],
  );

  // Duplicate component (handles nested components)
  const handleDuplicateComponent = useCallback(
    (id: string) => {
      const findAndDuplicate = (
        components: ComponentData[],
      ): ComponentData[] => {
        for (let i = 0; i < components.length; i++) {
          const comp = components[i];
          if (comp.id === id) {
            // Found the component to duplicate
            const duplicatedComponent: ComponentData = {
              ...comp,
              id: generateId(),
              props: { ...comp.props },
              layout: comp.layout ? { ...comp.layout } : {},
              children: comp.children
                ? comp.children.map((child) => ({
                    ...child,
                    id: generateId(),
                    parentId: generateId(),
                  }))
                : undefined,
            };

            // Insert after the original
            return [
              ...components.slice(0, i + 1),
              duplicatedComponent,
              ...components.slice(i + 1),
            ];
          }

          // Search in children
          if (comp.children) {
            const updatedChildren = findAndDuplicate(comp.children);
            if (updatedChildren !== comp.children) {
              // Component was found and duplicated in children
              components[i] = { ...comp, children: updatedChildren };
              return [...components];
            }
          }
        }
        return components;
      };

      const newComponents = findAndDuplicate(pageData.components);
      if (newComponents !== pageData.components) {
        const newData = { ...pageData, components: newComponents };
        setPageData(newData);
        addToHistory(newData);
        setHasUnsavedChanges(true);
        toast.success("Component duplicated");
      }
    },
    [pageData, addToHistory],
  );

  // Remove component (handles nested components)
  const handleRemoveComponent = useCallback(
    (id: string) => {
      const removeFromComponents = (
        components: ComponentData[],
      ): ComponentData[] => {
        return components
          .filter((comp) => comp.id !== id)
          .map((comp) => {
            if (comp.children) {
              return {
                ...comp,
                children: removeFromComponents(comp.children),
              };
            }
            return comp;
          });
      };

      const newData = {
        ...pageData,
        components: removeFromComponents(pageData.components),
      };
      setPageData(newData);
      addToHistory(newData);
      setHasUnsavedChanges(true);

      if (selectedComponentId === id) {
        setSelectedComponentId(null);
      }
    },
    [pageData, selectedComponentId, addToHistory],
  );

  // Move component
  const handleMoveComponent = useCallback(
    (fromIndex: number, toIndex: number) => {
      const components = [...pageData.components];
      const [removed] = components.splice(fromIndex, 1);
      components.splice(toIndex, 0, removed);

      const newData = { ...pageData, components };
      setPageData(newData);
      addToHistory(newData);
    },
    [pageData, addToHistory],
  );

  // Save
  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);

      if (onSave) {
        await onSave(pageData);
      } else {
        // Default save to Convex
        await updatePage({
          pageId,
          content: JSON.stringify(pageData),
        });
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast.success("Page saved successfully");
    } catch {
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  }, [pageId, pageData, onSave, updatePage]);

  // Undo/Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPageData(history[newIndex]);
    }
  }, [canUndo, historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPageData(history[newIndex]);
    }
  }, [canRedo, historyIndex, history]);

  // Find selected component (including nested ones)
  const findComponent = (
    components: ComponentData[],
    id: string,
  ): ComponentData | null => {
    for (const comp of components) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponent(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedComponent = selectedComponentId
    ? findComponent(pageData.components, selectedComponentId)
    : null;

  // Copy component
  const handleCopyComponent = useCallback((component: ComponentData) => {
    setCopiedComponent(component);
    toast.success("Component copied to clipboard");
  }, []);

  // Paste component
  const handlePasteComponent = useCallback(() => {
    if (!copiedComponent) return;

    const deepCopyComponent = (comp: ComponentData): ComponentData => {
      return {
        ...comp,
        id: generateId(),
        children: comp.children?.map((child) => deepCopyComponent(child)),
      };
    };

    const newComponent = deepCopyComponent(copiedComponent);
    const newData = {
      ...pageData,
      components: [...pageData.components, newComponent],
    };
    setPageData(newData);
    addToHistory(newData);
    setHasUnsavedChanges(true);
    toast.success("Component pasted");
  }, [copiedComponent, pageData, addToHistory]);

  // Calculate stats
  const calculateStats = useCallback(() => {
    let totalComponents = 0;
    const componentsByType: Record<string, number> = {};

    const countComponents = (components: ComponentData[]) => {
      components.forEach((comp) => {
        totalComponents++;
        componentsByType[comp.type] = (componentsByType[comp.type] || 0) + 1;
        if (comp.children) {
          countComponents(comp.children);
        }
      });
    };

    countComponents(pageData.components);
    return { totalComponents, componentsByType };
  }, [pageData.components]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") {
        e.preventDefault();
        handleRedo();
      }
      // Show help: Ctrl/Cmd + /
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
      // Copy: Ctrl/Cmd + C
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && selectedComponent) {
        e.preventDefault();
        handleCopyComponent(selectedComponent);
      }
      // Paste: Ctrl/Cmd + V
      if ((e.ctrlKey || e.metaKey) && e.key === "v" && copiedComponent) {
        e.preventDefault();
        handlePasteComponent();
      }
      // Stats: Ctrl/Cmd + I
      if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        setShowStats(!showStats);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showHelp,
    handleRedo,
    handleSave,
    handleUndo,
    selectedComponent,
    handleCopyComponent,
    copiedComponent,
    handlePasteComponent,
    showStats,
  ]);

  // Auto-save functionality - removed auto-save on changes
  // Now only saves when explicitly triggered by user

  // Full-screen preview mode
  if (isFullScreenPreview) {
    return (
      <>
        {/* Full-screen preview without any UI elements */}
        <PreviewPanel
          pageData={pageData}
          business={business}
          selectedComponentId={null}
          onSelectComponent={() => {}}
          onUpdateComponent={() => {}}
          onRemoveComponent={() => {}}
          onMoveComponent={() => {}}
          onAddComponent={() => {}}
          isEditMode={false}
          showCanvasControls={true}
          hideZoomControls={true}
        />

        {/* Exit button */}
        <div className="fixed top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullScreenPreview(false)}
            className="gap-2 bg-background/95 backdrop-blur-sm border shadow-lg"
          >
            <X className="h-4 w-4" />
            Exit Preview
          </Button>
        </div>
      </>
    );
  }

  return (
    <TooltipProvider>
      <DragDropProvider>
        <div className="h-screen flex flex-col bg-muted/30">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border/50">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center">
                <Logo />
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-1 bg-muted/50 rounded-md p-0.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={canUndo ? "ghost" : "ghost"}
                      size="sm"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className="h-7 w-7 p-0 rounded"
                    >
                      <Undo className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Undo (Ctrl+Z)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={canRedo ? "ghost" : "ghost"}
                      size="sm"
                      onClick={handleRedo}
                      disabled={!canRedo}
                      className="h-7 w-7 p-0 rounded"
                    >
                      <Redo className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Redo (Ctrl+Shift+Z)</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Status Badge */}
              <Badge
                variant={
                  business.isPublished
                    ? hasUnsavedChanges
                      ? "secondary"
                      : "default"
                    : "outline"
                }
                className="gap-1.5"
              >
                {business.isPublished ? (
                  hasUnsavedChanges ? (
                    <>
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      Unsaved Changes
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Published
                    </>
                  )
                ) : (
                  <>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    Draft
                  </>
                )}
              </Badge>

              {/* Additional Status Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {lastSaved && !hasUnsavedChanges && (
                  <span>
                    Last saved {new Date(lastSaved).toLocaleTimeString()}
                  </span>
                )}
                {copiedComponent && (
                  <span className="text-primary">Component copied</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(!showHelp)}
                    className="h-8 w-8 p-0"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show keyboard shortcuts</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="h-8"
                  >
                    {" "}
                    {isSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save changes (Ctrl+S)</p>
                </TooltipContent>
              </Tooltip>

              {/* Page Settings Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPageSettings(true)}
                className="h-8 gap-1.5"
              >
                <Settings className="h-3.5 w-3.5" />
                <span className="text-xs">Settings</span>
              </Button>
            </div>
          </div>

          {/* Help Overlay */}
          {showHelp && (
            <div className="absolute top-16 left-4 z-50 bg-background border border-border/50 rounded-lg shadow-lg p-5 max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2 text-foreground">
                  <HelpCircle className="h-4 w-4" />
                  Keyboard Shortcuts
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(false)}
                  className="h-7 w-7 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Save</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs">
                    Ctrl+S
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Undo</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs">
                    Ctrl+Z
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Redo</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs">
                    Ctrl+Shift+Z
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Help</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs">
                    Ctrl+/
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Copy</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs">
                    Ctrl+C
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paste</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs">
                    Ctrl+V
                  </kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Stats</span>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs">
                    Ctrl+I
                  </kbd>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t space-y-2">
                <p className="text-xs text-muted-foreground">
                  <Info className="h-3 w-3 inline mr-1" />
                  Drag components from the left sidebar to add them to your
                  page.
                </p>
              </div>
            </div>
          )}

          {/* Stats Overlay */}
          {showStats &&
            (() => {
              const stats = calculateStats();
              return (
                <div className="absolute top-16 right-4 z-50 bg-background border border-border/50 rounded-lg shadow-lg p-5 max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center gap-2 text-foreground">
                      <Info className="h-4 w-4" />
                      Page Statistics
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowStats(false)}
                      className="h-7 w-7 p-0 hover:bg-muted"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Total Components</p>
                      <p className="text-2xl font-bold text-primary">
                        {stats.totalComponents}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Components by Type
                      </p>
                      <div className="space-y-1">
                        {Object.entries(stats.componentsByType)
                          .sort(([, a], [, b]) => b - a)
                          .map(([type, count]) => (
                            <div
                              key={type}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {type.replace(/Block$/, "")}
                              </span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Layout */}
            <div className="hidden lg:flex flex-1 overflow-hidden">
              {/* Left Sidebar - Page Structure + Component Library */}
              <div className="w-[280px] bg-background shadow-sm relative z-50 border-r border-border/50">
                <LeftSidebar
                  pageData={pageData}
                  selectedComponentId={selectedComponentId}
                  onSelectComponent={setSelectedComponentId}
                  onOpenTemplates={() => setShowTemplateSelector(true)}
                />
              </div>

              {/* Center - Canvas */}
              <div className="flex-1 relative overflow-hidden">
                <PreviewPanel
                  pageData={pageData}
                  business={business}
                  selectedComponentId={selectedComponentId}
                  onSelectComponent={setSelectedComponentId}
                  onUpdateComponent={handleUpdateComponent}
                  onRemoveComponent={handleRemoveComponent}
                  onMoveComponent={handleMoveComponent}
                  onAddComponent={(type, index, parentId) =>
                    handleAddComponent(type, index, parentId)
                  }
                  onDuplicateComponent={handleDuplicateComponent}
                  isEditMode={true}
                />
              </div>

              {/* Right Sidebar - Field Editor */}
              <div
                className={cn(
                  "bg-background shadow-sm border-l border-border/50 transition-all duration-300 overflow-hidden flex flex-col",
                  selectedComponent ? "w-[320px]" : "w-0",
                )}
              >
                {selectedComponent && (
                  <FieldEditor
                    component={selectedComponent}
                    onUpdate={(props) =>
                      handleUpdateComponent(selectedComponent.id, props)
                    }
                    onUpdateLayout={(layout) =>
                      handleUpdateComponentLayout(selectedComponent.id, layout)
                    }
                    onClose={() => setSelectedComponentId(null)}
                    businessId={businessId}
                  />
                )}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
              {/* Mobile Tab Navigation */}
              <div className="flex bg-background border-b border-border/50">
                <button
                  onClick={() => setMobileActivePanel("components")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors",
                    mobileActivePanel === "components"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Layers className="h-4 w-4" />
                  Components
                </button>
                <button
                  onClick={() => setMobileActivePanel("canvas")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors",
                    mobileActivePanel === "canvas"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Menu className="h-4 w-4" />
                  Canvas
                </button>
                <button
                  onClick={() => setMobileActivePanel("properties")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors",
                    mobileActivePanel === "properties"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                    !selectedComponent && "opacity-50 cursor-not-allowed",
                  )}
                  disabled={!selectedComponent}
                >
                  <Settings className="h-4 w-4" />
                  Properties
                </button>
              </div>

              {/* Mobile Panel Content */}
              <div className="flex-1 overflow-hidden">
                {/* Components Panel */}
                {mobileActivePanel === "components" && (
                  <div className="h-full bg-background">
                    <LeftSidebar
                      pageData={pageData}
                      selectedComponentId={selectedComponentId}
                      onSelectComponent={(id) => {
                        setSelectedComponentId(id);
                        if (id) setMobileActivePanel("properties");
                      }}
                      onOpenTemplates={() => setShowTemplateSelector(true)}
                    />
                  </div>
                )}

                {/* Canvas Panel */}
                {mobileActivePanel === "canvas" && (
                  <div className="h-full relative overflow-hidden">
                    <PreviewPanel
                      pageData={pageData}
                      business={business}
                      selectedComponentId={selectedComponentId}
                      onSelectComponent={(id) => {
                        setSelectedComponentId(id);
                        if (id) setMobileActivePanel("properties");
                      }}
                      onUpdateComponent={handleUpdateComponent}
                      onRemoveComponent={handleRemoveComponent}
                      onMoveComponent={handleMoveComponent}
                      onAddComponent={(type, index, parentId) =>
                        handleAddComponent(type, index, parentId)
                      }
                      onDuplicateComponent={handleDuplicateComponent}
                      isEditMode={true}
                    />
                  </div>
                )}

                {/* Properties Panel */}
                {mobileActivePanel === "properties" && selectedComponent && (
                  <div className="h-full bg-background">
                    <FieldEditor
                      component={selectedComponent}
                      onUpdate={(props) =>
                        handleUpdateComponent(selectedComponent.id, props)
                      }
                      onUpdateLayout={(layout) =>
                        handleUpdateComponentLayout(
                          selectedComponent.id,
                          layout,
                        )
                      }
                      onClose={() => {
                        setSelectedComponentId(null);
                        setMobileActivePanel("canvas");
                      }}
                      businessId={businessId}
                    />
                  </div>
                )}

                {/* Empty state for properties when no component selected */}
                {mobileActivePanel === "properties" && !selectedComponent && (
                  <div className="h-full flex items-center justify-center bg-background">
                    <div className="text-center text-muted-foreground">
                      <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">
                        No Component Selected
                      </p>
                      <p className="text-sm">
                        Select a component from the canvas to edit its
                        properties
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setMobileActivePanel("canvas")}
                        className="mt-4"
                      >
                        Go to Canvas
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Publish Settings Dialog */}
        <PublishSettingsDialog
          businessId={businessId}
          businessName={business.name}
          open={showPublishDialog}
          onOpenChange={setShowPublishDialog}
          pageData={{
            pageTitle: pageData.title,
            seoTitle: pageData.seoTitle,
            seoDescription: pageData.seoDescription,
            seoKeywords: pageData.seoKeywords,
            ogTitle: pageData.ogTitle,
            ogDescription: pageData.ogDescription,
            ogImage: pageData.ogImage,
          }}
          onUpdatePageData={(data) => {
            setPageData((prev) => ({
              ...prev,
              ...data,
            }));
          }}
          onPublishComplete={() => {
            // Save and reload to update UI with published state
            handleSave();
            window.location.reload();
          }}
        />

        {/* Template Selector */}
        <TemplateSelector
          isOpen={showTemplateSelector}
          onClose={() => setShowTemplateSelector(false)}
          onSelectTemplate={(template) => {
            setPageData(template);
            addToHistory(template);
            setHasUnsavedChanges(true);
            toast.success("Template applied successfully!");
          }}
          currentPageHasContent={pageData.components.length > 0}
        />

        {/* Page Settings Sidebar */}
        <Sheet open={showPageSettings} onOpenChange={setShowPageSettings}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Page Settings
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <PageSettings
                businessId={businessId}
                business={business}
                initialData={{
                  pageTitle: pageData.title || "",
                  seoTitle: pageData.seoTitle || seoMetadata.title,
                  seoDescription:
                    pageData.seoDescription || seoMetadata.description,
                  seoKeywords:
                    pageData.seoKeywords || seoMetadata.keywords.join(", "),
                  ogTitle: pageData.ogTitle || seoMetadata.ogTitle,
                  ogDescription:
                    pageData.ogDescription || seoMetadata.ogDescription,
                  ogImage: pageData.ogImage || seoMetadata.ogImage,
                }}
                onSave={(data: PageSettingsData) => {
                  const newPageData = {
                    ...pageData,
                    title: data.pageTitle,
                    seoTitle: data.seoTitle,
                    seoDescription: data.seoDescription,
                    seoKeywords: data.seoKeywords,
                    ogTitle: data.ogTitle,
                    ogDescription: data.ogDescription,
                    ogImage: data.ogImage,
                  };
                  setPageData(newPageData);
                  addToHistory(newPageData);
                  setHasUnsavedChanges(true);

                  // Update SEO metadata
                  setSeoMetadata({
                    ...seoMetadata,
                    title: data.seoTitle,
                    description: data.seoDescription,
                    keywords: data.seoKeywords
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean),
                    ogTitle: data.ogTitle,
                    ogDescription: data.ogDescription,
                    ogImage: data.ogImage,
                  });

                  setShowPageSettings(false);
                }}
                showDomainSettings={false}
                showPublishButton={false}
              />
            </div>
          </SheetContent>
        </Sheet>
      </DragDropProvider>
    </TooltipProvider>
  );
}
