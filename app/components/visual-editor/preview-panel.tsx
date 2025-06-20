"use client";

import React, { useState } from "react";
import { ComponentData, PageData } from "./types";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import { useDragDrop } from "./drag-drop-provider";
import DropZone from "./drop-zone";
import ComponentWrapper from "./component-wrapper";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import NestedDropZone from "./nested-drop-zone";
import ColumnsDropZone from "./columns-drop-zone";

interface PreviewPanelProps {
  pageData: PageData;
  business: Doc<"businesses">;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, props: Record<string, unknown>) => void;
  onRemoveComponent: (id: string) => void;
  onMoveComponent: (fromIndex: number, toIndex: number) => void;
  onAddComponent: (type: string, index: number, parentId?: string, metadata?: Record<string, unknown>) => void;
  onDuplicateComponent?: (id: string) => void;
  isEditMode?: boolean;
}

type DeviceSize = "desktop" | "tablet" | "mobile";

const deviceSizes: Record<DeviceSize, { width: string; icon: typeof Monitor }> = {
  desktop: { width: "100%", icon: Monitor },
  tablet: { width: "768px", icon: Tablet },
  mobile: { width: "375px", icon: Smartphone }
};

export default function PreviewPanel({
  pageData,
  business,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onRemoveComponent,
  onMoveComponent,
  onAddComponent,
  onDuplicateComponent,
  isEditMode = true
}: PreviewPanelProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const { draggedItem } = useDragDrop();

  const handleDrop = (index: number, parentId?: string) => {
    if (!draggedItem) return;

    if (draggedItem.type === "new-component" && draggedItem.componentType) {
      onAddComponent(draggedItem.componentType, index, parentId);
    } else if (draggedItem.type === "existing-component" && draggedItem.index !== undefined) {
      onMoveComponent(draggedItem.index, index);
    }
  };

  const renderComponent = (component: ComponentData, _index: number): React.ReactNode => {
    const config = componentConfigs[component.type];
    if (!config) return null;

    // Pass business data to components that need it
    const componentProps = {
      ...component.props,
      business
    };

    // Render children if component accepts them
    let children: React.ReactNode = null;
    if (config.acceptsChildren && component.children && component.children.length > 0) {
      children = component.children.map((child, childIndex) => (
        <ComponentWrapper
          key={child.id}
          component={child}
          isSelected={selectedComponentId === child.id}
          isEditMode={isEditMode}
          onSelect={() => onSelectComponent(child.id)}
          onRemove={() => onRemoveComponent(child.id)}
          onMove={(direction) => {
            // TODO: Implement nested component movement
            console.log('Move nested component', direction);
          }}
          onDuplicate={onDuplicateComponent ? () => onDuplicateComponent(child.id) : undefined}
          canMoveUp={childIndex > 0}
          canMoveDown={childIndex < (component.children?.length || 0) - 1}
        >
          {renderComponent(child, childIndex)}
        </ComponentWrapper>
      ));
    }

    // Create update handler for this component
    const handleUpdate = (newProps: Record<string, unknown>) => {
      onUpdateComponent(component.id, newProps);
    };

    return config.render(componentProps, isEditMode, business, children, handleUpdate);
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Device Size Selector */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-2">
          {Object.entries(deviceSizes).map(([size, { icon: Icon }]) => (
            <Button
              key={size}
              variant={deviceSize === size ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceSize(size as DeviceSize)}
              className="gap-2"
            >
              <Icon className="w-4 h-4" />
              <span className="capitalize">{size}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8">
        <div
            className={cn(
              "mx-auto bg-background shadow-xl transition-all duration-300",
              deviceSize === "tablet" && "max-w-[768px]",
              deviceSize === "mobile" && "max-w-[375px]"
            )}
            style={{ minHeight: "100%" }}
          >
            {/* Page Title */}
            <div className="p-8 border-b">
              <h1 className="text-3xl font-bold">{pageData.title}</h1>
            </div>

            {/* Components */}
            <div className="relative">
              {/* Initial drop zone */}
              {isEditMode && (
                <DropZone
                  id="drop-zone-0"
                  index={0}
                  onDrop={handleDrop}
                  className="h-20"
                  showAlways={pageData.components.length === 0}
                />
              )}

              {pageData.components.map((component, index) => {
                const config = componentConfigs[component.type];
                
                // Use ColumnsDropZone for Columns blocks, NestedDropZone for other containers
                if (config?.acceptsChildren) {
                  const DropZoneComponent = component.type === "ColumnsBlock" ? ColumnsDropZone : NestedDropZone;
                  return (
                    <React.Fragment key={component.id}>
                      <DropZoneComponent
                        component={component}
                        business={business}
                        selectedComponentId={selectedComponentId}
                        onSelectComponent={onSelectComponent}
                        onUpdateComponent={onUpdateComponent}
                        onRemoveComponent={onRemoveComponent}
                        onAddComponent={onAddComponent}
                        onDuplicateComponent={onDuplicateComponent}
                        isEditMode={isEditMode}
                        onMove={(direction) => {
                          const newIndex = direction === "up" ? index - 1 : index + 1;
                          if (newIndex >= 0 && newIndex < pageData.components.length) {
                            onMoveComponent(index, newIndex);
                          }
                        }}
                        canMoveUp={index > 0}
                        canMoveDown={index < pageData.components.length - 1}
                      />
                      
                      {/* Drop zone after component */}
                      {isEditMode && (
                        <DropZone
                          id={`drop-zone-${index + 1}`}
                          index={index + 1}
                          onDrop={handleDrop}
                          className="h-20"
                        />
                      )}
                    </React.Fragment>
                  );
                }
                
                // Regular component rendering
                return (
                  <React.Fragment key={component.id}>
                    <ComponentWrapper
                      component={component}
                      isSelected={selectedComponentId === component.id}
                      isEditMode={isEditMode}
                      onSelect={() => onSelectComponent(component.id)}
                      onRemove={() => onRemoveComponent(component.id)}
                      onMove={(direction) => {
                        const newIndex = direction === "up" ? index - 1 : index + 1;
                        if (newIndex >= 0 && newIndex < pageData.components.length) {
                          onMoveComponent(index, newIndex);
                        }
                      }}
                      onDuplicate={onDuplicateComponent ? () => onDuplicateComponent(component.id) : undefined}
                      canMoveUp={index > 0}
                      canMoveDown={index < pageData.components.length - 1}
                    >
                      {renderComponent(component, index)}
                    </ComponentWrapper>

                    {/* Drop zone after each component */}
                    {isEditMode && (
                      <DropZone
                        id={`drop-zone-${index + 1}`}
                        index={index + 1}
                        onDrop={handleDrop}
                        className="h-20"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
      </div>
    </div>
  );
}