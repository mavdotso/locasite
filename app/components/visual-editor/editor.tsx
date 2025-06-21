"use client";

import React, { useState, useCallback, useEffect } from "react";
import { PageData, ComponentData, LayoutOptions, ComponentTemplate } from "./types";
import { DragDropProvider } from "./drag-drop-provider";
import ComponentLibrary from "./component-library";
import PreviewPanel from "./preview-panel";
import FieldEditor from "./field-editor";
import OutlineView from "./outline-view";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import { Button } from "@/app/components/ui/button";
import { Save, Loader2, Undo, Redo, Eye, EyeOff, Layers, HelpCircle, Info, X } from "lucide-react";
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

interface VisualEditorProps {
  businessId: Id<"businesses">;
  business: Doc<"businesses">;
  pageId: Id<"pages">;
  initialData?: PageData;
  onSave?: (data: PageData) => Promise<void>;
}

export default function VisualEditor({
  businessId,
  business,
  pageId,
  initialData,
  onSave
}: VisualEditorProps) {
  const [pageData, setPageData] = useState<PageData>(
    initialData || {
      title: "New Page",
      components: []
    }
  );
  
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<PageData[]>([pageData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showOutline, setShowOutline] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('autoSaveEnabled') !== 'false';
    }
    return true;
  });
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updatePage = useMutation(api.pages.updatePage);

  // Add to history
  const addToHistory = useCallback((newData: PageData) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newData];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Generate unique ID
  const generateId = () => `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Add component
  const handleAddComponent = useCallback((type: string, index: number, parentId?: string, metadata?: Record<string, unknown>) => {
    const config = componentConfigs[type];
    if (!config) return;

    // Check if this is a template component
    if (config.isTemplate && config.template) {
      // Get the template blocks
      const templateBlocks = config.template(business);
      
      // Convert template blocks to ComponentData
      const convertTemplate = (template: ComponentTemplate, parentId?: string): ComponentData => {
        const componentConfig = componentConfigs[template.type];
        const componentId = generateId();
        const component: ComponentData = {
          id: componentId,
          type: template.type,
          props: template.props,
          layout: {},
          parentId,
          children: componentConfig?.acceptsChildren && template.children 
            ? template.children.map(child => convertTemplate(child, componentId))
            : undefined
        };
        return component;
      };
      
      // Convert all template blocks
      const newComponents = templateBlocks.map(template => convertTemplate(template));
      
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
            ...pageData.components.slice(index)
          ]
        };
      }
      
      setPageData(newData);
      addToHistory(newData);
      if (newComponents.length > 0) {
        setSelectedComponentId(newComponents[0].id);
      }
      return;
    }

    // Regular component addition
    const defaultProps: Record<string, unknown> = {};
    Object.entries(config.fields).forEach(([key, field]) => {
      defaultProps[key] = field.defaultValue ?? "";
    });

    const newComponent: ComponentData = {
      id: generateId(),
      type,
      props: defaultProps,
      layout: {}, // Initialize with empty layout
      parentId,
      children: config.acceptsChildren ? [] : undefined,
      ...(metadata ? { metadata } : {})
    };

    let newData: PageData;
    
    if (parentId) {
      // Add to parent's children
      const updateComponentChildren = (components: ComponentData[]): ComponentData[] => {
        return components.map(comp => {
          if (comp.id === parentId) {
            return {
              ...comp,
              children: [
                ...(comp.children || []).slice(0, index),
                newComponent,
                ...(comp.children || []).slice(index)
              ]
            };
          }
          if (comp.children) {
            return {
              ...comp,
              children: updateComponentChildren(comp.children)
            };
          }
          return comp;
        });
      };
      
      newData = {
        ...pageData,
        components: updateComponentChildren(pageData.components)
      };
    } else {
      // Add to root level
      newData = {
        ...pageData,
        components: [
          ...pageData.components.slice(0, index),
          newComponent,
          ...pageData.components.slice(index)
        ]
      };
    }

    setPageData(newData);
    addToHistory(newData);
    setSelectedComponentId(newComponent.id);
  }, [pageData, addToHistory, business]);

  // Update component (handles nested components)
  const handleUpdateComponent = useCallback((id: string, props: Record<string, unknown>) => {
    const updateInComponents = (components: ComponentData[]): ComponentData[] => {
      return components.map(comp => {
        if (comp.id === id) {
          return { ...comp, props };
        }
        if (comp.children) {
          return { ...comp, children: updateInComponents(comp.children) };
        }
        return comp;
      });
    };
    
    const newData = {
      ...pageData,
      components: updateInComponents(pageData.components)
    };
    setPageData(newData);
    setHasUnsavedChanges(true);
  }, [pageData]);

  // Update component layout (handles nested components)
  const handleUpdateComponentLayout = useCallback((id: string, layout: LayoutOptions) => {
    const updateLayoutInComponents = (components: ComponentData[]): ComponentData[] => {
      return components.map(comp => {
        if (comp.id === id) {
          return { ...comp, layout };
        }
        if (comp.children) {
          return { ...comp, children: updateLayoutInComponents(comp.children) };
        }
        return comp;
      });
    };
    
    const newData = {
      ...pageData,
      components: updateLayoutInComponents(pageData.components)
    };
    setPageData(newData);
    addToHistory(newData);
    setHasUnsavedChanges(true);
  }, [pageData, addToHistory]);

  // Duplicate component (handles nested components)
  const handleDuplicateComponent = useCallback((id: string) => {
    const findAndDuplicate = (components: ComponentData[]): ComponentData[] => {
      for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        if (comp.id === id) {
          // Found the component to duplicate
          const duplicatedComponent: ComponentData = {
            ...comp,
            id: generateId(),
            props: { ...comp.props },
            layout: comp.layout ? { ...comp.layout } : {},
            children: comp.children ? comp.children.map(child => ({
              ...child,
              id: generateId(),
              parentId: generateId()
            })) : undefined
          };
          
          // Insert after the original
          return [
            ...components.slice(0, i + 1),
            duplicatedComponent,
            ...components.slice(i + 1)
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
  }, [pageData, addToHistory]);

  // Remove component (handles nested components)
  const handleRemoveComponent = useCallback((id: string) => {
    const removeFromComponents = (components: ComponentData[]): ComponentData[] => {
      return components.filter(comp => comp.id !== id).map(comp => {
        if (comp.children) {
          return {
            ...comp,
            children: removeFromComponents(comp.children)
          };
        }
        return comp;
      });
    };
    
    const newData = {
      ...pageData,
      components: removeFromComponents(pageData.components)
    };
    setPageData(newData);
    addToHistory(newData);
    
    if (selectedComponentId === id) {
      setSelectedComponentId(null);
    }
  }, [pageData, selectedComponentId, addToHistory]);

  // Move component
  const handleMoveComponent = useCallback((fromIndex: number, toIndex: number) => {
    const components = [...pageData.components];
    const [removed] = components.splice(fromIndex, 1);
    components.splice(toIndex, 0, removed);
    
    const newData = { ...pageData, components };
    setPageData(newData);
    addToHistory(newData);
  }, [pageData, addToHistory]);

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
          content: JSON.stringify(pageData)
        });
      }
      
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast.success("Page saved successfully");
    } catch (error) {
      console.error("Error saving page:", error);
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
  const findComponent = (components: ComponentData[], id: string): ComponentData | null => {
    for (const comp of components) {
      if (comp.id === id) return comp;
      if (comp.children) {
        const found = findComponent(comp.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const selectedComponent = selectedComponentId ? findComponent(pageData.components, selectedComponentId) : null;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleRedo();
      }
      // Toggle preview: Ctrl/Cmd + P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsEditMode(!isEditMode);
      }
      // Show help: Ctrl/Cmd + /
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, showHelp, handleRedo, handleSave, handleUndo]);

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
        <div className="h-screen flex flex-col bg-background">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">Visual Editor</h1>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHelp(!showHelp)}
                    className="h-8 w-8 p-0"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show keyboard shortcuts and tips</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                variant="ghost"
                size="sm"
                      onClick={handleUndo}
                      disabled={!canUndo}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Undo (Ctrl+Z)</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                variant="ghost"
                size="sm"
                      onClick={handleRedo}
                      disabled={!canRedo}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Redo (Ctrl+Shift+Z)</p>
                  </TooltipContent>
                </Tooltip>
            </div>
          </div>

            <div className="flex items-center gap-2">
              {isEditMode && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                variant="outline"
                size="sm"
                      onClick={() => setShowOutline(!showOutline)}
                    >
                      <Layers className="h-4 w-4 mr-2" />
                      Outline
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle page structure view</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    {isEditMode ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Preview
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle between edit and preview mode</p>
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center gap-2">
                {autoSaveEnabled && lastSaved && (
                  <span className="text-xs text-muted-foreground">
                    Saved {new Date(lastSaved).toLocaleTimeString()}
                  </span>
                )}
                {hasUnsavedChanges && !isSaving && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={isSaving || (!hasUnsavedChanges && !autoSaveEnabled)}
                    >
                      {isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save changes (Ctrl+S)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
          </div>
        </div>

        {/* Help Overlay */}
        {showHelp && (
          <div className="absolute top-16 left-4 z-50 bg-card border rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Keyboard Shortcuts
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Save</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Undo</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl+Z</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Redo</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl+Shift+Z</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Preview</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl+P</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Help</span>
                <kbd className="px-2 py-0.5 bg-muted rounded text-xs">Ctrl+/</kbd>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t space-y-2">
              <p className="text-xs text-muted-foreground">
                <Info className="h-3 w-3 inline mr-1" />
                Drag components from the left sidebar to add them to your page.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Auto-save</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newValue = !autoSaveEnabled;
                    setAutoSaveEnabled(newValue);
                    localStorage.setItem('autoSaveEnabled', String(newValue));
                    toast.success(newValue ? "Auto-save enabled" : "Auto-save disabled");
                  }}
                  className="h-5 text-xs px-2"
                >
                  {autoSaveEnabled ? "On" : "Off"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Library */}
          {isEditMode && (
            <div className="w-64 border-r bg-card relative z-50">
              <ComponentLibrary />
            </div>
          )}

          {/* Outline View */}
          {isEditMode && showOutline && (
            <div className="w-64 border-r bg-card">
              <OutlineView
                pageData={pageData}
                selectedComponentId={selectedComponentId}
                onSelectComponent={setSelectedComponentId}
              />
            </div>
          )}

          {/* Center - Preview */}
          <div className="flex-1">
            <PreviewPanel
              pageData={pageData}
              business={business}
              selectedComponentId={selectedComponentId}
              onSelectComponent={setSelectedComponentId}
              onUpdateComponent={handleUpdateComponent}
              onRemoveComponent={handleRemoveComponent}
              onMoveComponent={handleMoveComponent}
              onAddComponent={(type, index, parentId) => handleAddComponent(type, index, parentId)}
              onDuplicateComponent={handleDuplicateComponent}
              isEditMode={isEditMode}
            />
          </div>

          {/* Right Sidebar - Field Editor */}
          {isEditMode && (
            <div className={cn(
              "border-l bg-card transition-all duration-300",
              selectedComponent ? "w-80" : "w-0"
            )}>
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
          )}
        </div>
      </div>
    </DragDropProvider>
  </TooltipProvider>
  );
}