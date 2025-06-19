"use client";

import React, { useState, useCallback } from "react";
import { PageData, ComponentData } from "./types";
import { DragDropProvider } from "./drag-drop-provider";
import ComponentLibrary from "./component-library";
import PreviewPanel from "./preview-panel";
import FieldEditor from "./field-editor";
import { componentConfigs } from "./config/components";
import { Button } from "@/app/components/ui/button";
import { Save, Loader2, Undo, Redo, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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
  const handleAddComponent = useCallback((type: string, index: number) => {
    const config = componentConfigs[type];
    if (!config) return;

    const defaultProps: Record<string, unknown> = {};
    Object.entries(config.fields).forEach(([key, field]) => {
      defaultProps[key] = field.defaultValue ?? "";
    });

    const newComponent: ComponentData = {
      id: generateId(),
      type,
      props: defaultProps
    };

    const newData = {
      ...pageData,
      components: [
        ...pageData.components.slice(0, index),
        newComponent,
        ...pageData.components.slice(index)
      ]
    };

    setPageData(newData);
    addToHistory(newData);
    setSelectedComponentId(newComponent.id);
  }, [pageData, addToHistory]);

  // Update component
  const handleUpdateComponent = useCallback((id: string, props: Record<string, unknown>) => {
    const newData = {
      ...pageData,
      components: pageData.components.map((comp) =>
        comp.id === id ? { ...comp, props } : comp
      )
    };
    setPageData(newData);
  }, [pageData]);

  // Remove component
  const handleRemoveComponent = useCallback((id: string) => {
    const newData = {
      ...pageData,
      components: pageData.components.filter((comp) => comp.id !== id)
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
  const handleSave = async () => {
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
      
      toast.success("Page saved successfully");
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  // Undo/Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPageData(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPageData(history[newIndex]);
    }
  };

  const selectedComponent = pageData.components.find(
    (comp) => comp.id === selectedComponentId
  );

  return (
    <DragDropProvider>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Visual Editor</h1>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Component Library */}
          {isEditMode && (
            <div className="w-64 border-r bg-card">
              <ComponentLibrary />
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
              onAddComponent={handleAddComponent}
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
                  onClose={() => setSelectedComponentId(null)}
                  businessId={businessId}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </DragDropProvider>
  );
}