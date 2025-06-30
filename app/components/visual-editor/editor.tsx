"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  PageData,
  ComponentData,
  ComponentTemplate,
  LayoutOptions,
} from "./types";
import { DragDropProvider } from "./drag-drop-provider";
import LeftSidebar from "./left-sidebar";
import PreviewPanel from "./preview-panel";
import FieldEditor from "./field-editor";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import { Button } from "@/app/components/ui/button";
import {
  Save,
  Loader2,
  Undo,
  Redo,
  HelpCircle,
  Info,
  X,
  Globe,
  Lock,
  Menu,
  Layers,
  Settings,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { PublishDialog } from "@/app/components/business/publish-dialog";
import { useDebouncedCallback } from "./hooks/use-debounced-callback";
import { useComponentPreloader } from "./hooks/use-component-preloader";
import TemplateSelector from "./template-selector";
import SEOMetadataEditor from "./seo-metadata-editor";

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
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("autoSaveEnabled") !== "false";
    }
    return true;
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
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
  const [showSEOEditor, setShowSEOEditor] = useState(false);
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
  const publishBusiness = useMutation(api.businesses.publish);
  const unpublishBusiness = useMutation(api.businesses.unpublish);
  const domain = useQuery(api.domains.getByBusinessId, { businessId });

  // Preload commonly used components
  useComponentPreloader(componentConfigs);
  // Auto-save callback
  const autoSaveCallback = useCallback(
    async (data: PageData) => {
      if (!autoSaveEnabled || isSaving) return;

      try {
        setIsSaving(true);
        if (onSave) {
          await onSave(data);
        } else {
          await updatePage({
            pageId,
            content: JSON.stringify(data),
          });
        }
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Auto-save failed:", error);
      } finally {
        setIsSaving(false);
      }
    },
    [autoSaveEnabled, isSaving, onSave, updatePage, pageId],
  );

  // Debounced auto-save function
  const debouncedAutoSave = useDebouncedCallback(
    autoSaveCallback as (...args: unknown[]) => unknown,
    2000,
  ); // Auto-save after 2 seconds of inactivity

  // Mobile detection and responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
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

  // Update component props (handles nested components)
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
      debouncedAutoSave(newData);
    },
    [pageData, addToHistory, debouncedAutoSave],
  );

  // Update component layout (handles nested components)
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
      debouncedAutoSave(newData);
    },
    [pageData, addToHistory, debouncedAutoSave],
  );

  // Add component
  const handleAddComponent = useCallback(
    (type: string, index: number, parentId?: string) => {
      const config = componentConfigs[type];
      if (!config) return;

      // Check if this is a template component
      if (config.isTemplate && config.template) {
        // Get the template blocks
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
        debouncedAutoSave(newData);
        toast.success("Template added successfully");
      } else {
        // Handle regular component
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
        debouncedAutoSave(newData);
        toast.success("Component added");
      }
    },
    [pageData, addToHistory, debouncedAutoSave, business],
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
        debouncedAutoSave(newData);
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
      debouncedAutoSave(newData);

      if (selectedComponentId === id) {
        setSelectedComponentId(null);
      }
    },
    [pageData, selectedComponentId, addToHistory, debouncedAutoSave],
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
      // Handle save error silently
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  }, [pageId, pageData, onSave, updatePage]);

  // Handle publish/unpublish
  const handlePublish = useCallback(async () => {
    try {
      if (business.isPublished) {
        setIsPublishing(true);
        await unpublishBusiness({ businessId });
        toast.success("Website unpublished successfully");
        setIsPublishing(false);
      } else {
        // Save any pending changes first
        if (hasUnsavedChanges) {
          await handleSave();
        }

        // If no domain exists, show domain selection dialog
        if (!domain) {
          setShowPublishDialog(true);
        } else {
          setIsPublishing(true);
          await publishBusiness({ businessId });
          toast.success("Website published successfully!");
          setIsPublishing(false);
        }
      }
    } catch {
      // Handle publish error silently
      toast.error(
        business.isPublished ? "Failed to unpublish" : "Failed to publish",
      );
      setIsPublishing(false);
    }
  }, [
    business.isPublished,
    businessId,
    publishBusiness,
    unpublishBusiness,
    hasUnsavedChanges,
    handleSave,
    domain,
  ]);

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
    debouncedAutoSave(newData);
    toast.success("Component pasted");
  }, [copiedComponent, pageData, addToHistory, debouncedAutoSave]);

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

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled || !hasUnsavedChanges || isSaving) return;

    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [pageData, autoSaveEnabled, hasUnsavedChanges, isSaving, handleSave]);

  return (
    <TooltipProvider>
      <DragDropProvider>
        <div className="h-screen flex flex-col bg-muted/30">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-background border-b border-border/50">
            <div className="flex items-center gap-3">
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

              {/* Save Status */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {hasUnsavedChanges && !isSaving && (
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                )}
                {autoSaveEnabled && lastSaved && !hasUnsavedChanges && (
                  <span>Saved</span>
                )}
                {copiedComponent && (
                  <span className="text-primary">Component copied</span>
                )}
              </div>
            </div>

            {/* Template Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTemplateSelector(true)}
                  className="h-8 gap-1.5"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span className="text-xs">Templates</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Choose from pre-made templates</p>
              </TooltipContent>
            </Tooltip>

            {/* SEO Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSEOEditor(true)}
                  className="h-8 gap-1.5"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span className="text-xs">SEO</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit SEO metadata</p>
              </TooltipContent>
            </Tooltip>

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
                    disabled={
                      isSaving || (!hasUnsavedChanges && !autoSaveEnabled)
                    }
                    className="h-8"
                  >
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant={business.isPublished ? "destructive" : "default"}
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="h-8 gap-1.5"
                  >
                    {isPublishing ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : business.isPublished ? (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span className="text-xs">Unpublish</span>
                      </>
                    ) : (
                      <>
                        <Globe className="h-3.5 w-3.5" />
                        <span className="text-xs">Publish</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {business.isPublished
                      ? "Unpublish website"
                      : "Make website public"}
                  </p>
                </TooltipContent>
              </Tooltip>
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
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Auto-save
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newValue = !autoSaveEnabled;
                      setAutoSaveEnabled(newValue);
                      localStorage.setItem("autoSaveEnabled", String(newValue));
                      toast.success(
                        newValue ? "Auto-save enabled" : "Auto-save disabled",
                      );
                    }}
                    className="h-5 text-xs px-2"
                  >
                    {autoSaveEnabled ? "On" : "Off"}
                  </Button>
                </div>
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

        {/* Publish Dialog */}
        <PublishDialog
          businessId={businessId}
          businessName={business.name}
          open={showPublishDialog}
          onOpenChange={setShowPublishDialog}
          onPublishComplete={() => {
            setIsPublishing(false);
            // Reload to update UI with published state
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
            debouncedAutoSave(template);
            toast.success("Template applied successfully!");
          }}
          currentPageHasContent={pageData.components.length > 0}
        />

        {/* SEO Metadata Editor */}
        <SEOMetadataEditor
          isOpen={showSEOEditor}
          onClose={() => setShowSEOEditor(false)}
          metadata={seoMetadata}
          onSave={(newMetadata) => {
            const updatedMetadata: SEOMetadataState = {
              title: newMetadata.title,
              description: newMetadata.description,
              keywords: newMetadata.keywords,
              canonicalUrl: newMetadata.canonicalUrl || "",
              ogTitle: newMetadata.ogTitle || "",
              ogDescription: newMetadata.ogDescription || "",
              ogImage: newMetadata.ogImage || "",
              ogType: newMetadata.ogType || "website",
              twitterCard: newMetadata.twitterCard || "summary",
              robots: newMetadata.robots || "index,follow",
              author: newMetadata.author,
              structuredData: newMetadata.structuredData || {},
            };
            setSeoMetadata(updatedMetadata);
            // Update page title if changed
            if (newMetadata.title !== pageData.title) {
              const newPageData = { ...pageData, title: newMetadata.title };
              setPageData(newPageData);
              addToHistory(newPageData);
              setHasUnsavedChanges(true);
              debouncedAutoSave(newPageData);
            }
            toast.success("SEO settings updated!");
          }}
          businessData={{
            name: business.name,
            description: business.description || undefined,
            address: business.address || undefined,
            phone: business.phone || undefined,
            email: business.email || undefined,
            website: business.website || undefined,
          }}
        />
      </DragDropProvider>
    </TooltipProvider>
  );
}
