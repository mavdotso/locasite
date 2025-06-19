"use client";

import React, { useState } from "react";
import { ComponentData, PageData } from "./types";
import { componentConfigs } from "./config/components";
import { useDragDrop } from "./drag-drop-provider";
import DropZone from "./drop-zone";
import ComponentWrapper from "./component-wrapper";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";

interface PreviewPanelProps {
  pageData: PageData;
  business: Doc<"businesses">;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, props: Record<string, unknown>) => void;
  onRemoveComponent: (id: string) => void;
  onMoveComponent: (fromIndex: number, toIndex: number) => void;
  onAddComponent: (type: string, index: number) => void;
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
  onUpdateComponent: _onUpdateComponent,
  onRemoveComponent,
  onMoveComponent,
  onAddComponent,
  isEditMode = true
}: PreviewPanelProps) {
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");
  const { draggedItem } = useDragDrop();

  const handleDrop = (index: number) => {
    if (!draggedItem) return;

    if (draggedItem.type === "new-component" && draggedItem.componentType) {
      onAddComponent(draggedItem.componentType, index);
    } else if (draggedItem.type === "existing-component" && draggedItem.index !== undefined) {
      onMoveComponent(draggedItem.index, index);
    }
  };

  const renderComponent = (component: ComponentData, _index: number) => {
    const config = componentConfigs[component.type];
    if (!config) return null;

    // Pass business data to components that need it
    const componentProps = {
      ...component.props,
      business
    };

    return config.render(componentProps, isEditMode, business);
  };

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Device Size Selector */}
      <div className="flex items-center justify-center gap-2 p-4 border-b bg-background">
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

            {pageData.components.map((component, index) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}