"use client";

import React, { useState, useCallback } from "react";
import { ComponentData, PageData } from "./types";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import { useDragDrop } from "./drag-drop-provider";
import DropZone from "./drop-zone";
import ComponentWrapper from "./component-wrapper";
import { cn } from "@/app/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import NestedDropZone from "./nested-drop-zone";
import ColumnsDropZone from "./columns-drop-zone";
import CanvasControls, { DeviceSize, deviceSizes } from "./canvas-controls";
import ResponsiveFrame from "./responsive-frame-simple";

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


const PreviewPanel = React.memo(function PreviewPanel({
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
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [showRulers, setShowRulers] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { draggedItem } = useDragDrop();

  const handleDrop = (index: number, parentId?: string) => {
    if (!draggedItem) return;

    if (draggedItem.type === "new-component" && draggedItem.componentType) {
      onAddComponent(draggedItem.componentType, index, parentId, draggedItem.metadata);
    } else if (draggedItem.type === "existing-component" && draggedItem.component) {
      // Find the current index of the dragged component
      const currentIndex = pageData.components.findIndex(c => c.id === draggedItem.component?.id);
      if (currentIndex !== -1 && currentIndex !== index) {
        // Adjust target index if dragging to a position after the current position
        const targetIndex = currentIndex < index ? index - 1 : index;
        onMoveComponent(currentIndex, targetIndex);
      }
    }
  };

  const renderComponent = useCallback((component: ComponentData, _index: number): React.ReactNode => {
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
      // Special handling for ColumnsBlock to distribute children
      if (component.type === 'ColumnsBlock') {
        const columnCount = parseInt(component.props.columns as string || "2");
        const columnContents: React.ReactNode[][] = Array(columnCount).fill(null).map(() => []);
        
        // Distribute children to columns based on metadata
        component.children.forEach((child, index) => {
          // Get columnIndex from metadata, ensuring it's valid for current column count
          let columnIndex = child.metadata?.columnIndex as number | undefined;
          
          // If columnIndex is undefined or out of bounds, redistribute
          if (columnIndex === undefined || columnIndex >= columnCount) {
            columnIndex = index % columnCount;
          }
          
          // Ensure columnIndex is within bounds
          const safeColumnIndex = Math.min(Math.max(0, columnIndex), columnCount - 1);
          
          const childNode = (
            <ComponentWrapper
              key={child.id}
              component={child}
              isSelected={selectedComponentId === child.id}
              isEditMode={isEditMode}
              onSelect={() => onSelectComponent(child.id)}
              onRemove={() => onRemoveComponent(child.id)}
              onMove={(_direction) => {
                // TODO: Implement nested component movement
              }}
              onDuplicate={onDuplicateComponent ? () => onDuplicateComponent(child.id) : undefined}
              canMoveUp={index > 0}
              canMoveDown={index < (component.children?.length || 0) - 1}
              isNested={true}
            >
              {renderComponent(child, index)}
            </ComponentWrapper>
          );
          
          columnContents[safeColumnIndex].push(childNode);
        });
        
        // Create pre-distributed children for ColumnsBlock
        children = columnContents.map((colChildren, colIndex) => (
          <div key={colIndex} className="column-content">
            {colChildren}
          </div>
        ));
      } else {
        // For other container components, render children normally
        children = component.children.map((child, childIndex) => (
          <ComponentWrapper
            key={child.id}
            component={child}
            isSelected={selectedComponentId === child.id}
            isEditMode={isEditMode}
            onSelect={() => onSelectComponent(child.id)}
            onRemove={() => onRemoveComponent(child.id)}
            onMove={(_direction) => {
              // TODO: Implement nested component movement
            }}
            onDuplicate={onDuplicateComponent ? () => onDuplicateComponent(child.id) : undefined}
            canMoveUp={childIndex > 0}
            canMoveDown={childIndex < (component.children?.length || 0) - 1}
            isNested={true}
          >
            {renderComponent(child, childIndex)}
          </ComponentWrapper>
        ));
      }
    }

    // Create update handler for this component
    const handleUpdate = (newProps: Record<string, unknown>) => {
      onUpdateComponent(component.id, newProps);
    };

    return config.render(componentProps, isEditMode, business, children, handleUpdate);
  }, [business, selectedComponentId, onSelectComponent, onRemoveComponent, onUpdateComponent, onDuplicateComponent, isEditMode]);

  const effectiveEditMode = isEditMode && !isPreviewMode;

  return (
    <div className="h-full relative bg-muted/30">
      

      {/* Canvas Area */}
      <div className="h-full overflow-hidden">
        <div
          className="w-full h-full flex items-start justify-center p-8"
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          <div
            className={cn(
              "shadow-xl transition-all duration-300 h-full",
              deviceSize === "tablet" && "max-w-[768px]",
              deviceSize === "mobile" && "max-w-[375px]",
              deviceSize === "desktop" && "w-full"
            )}
            style={{ 
              width: deviceSize === "desktop" ? "100%" : deviceSizes[deviceSize].width
            }}
          >
            <ResponsiveFrame 
              width={deviceSize === "desktop" ? "100%" : deviceSizes[deviceSize].width}
              showGrid={showGrid}
              className="bg-background"
            >
            {/* Components */}
            <div className="relative">
              {/* Initial drop zone */}
              {effectiveEditMode && (
                <DropZone
                  id="drop-zone-0"
                  index={0}
                  onDrop={handleDrop}
                  showAlways={pageData.components.length === 0}
                />
              )}

              {pageData.components.map((component, index) => {
                const config = componentConfigs[component.type];
                
                // Use ColumnsDropZone for Columns blocks, NestedDropZone for other containers
                if (config?.acceptsChildren) {
                  const DropZoneComponent = component.type === "ColumnsBlock" ? ColumnsDropZone : NestedDropZone;
                  return (
                    <React.Fragment key={`${component.id}-${component.props.columns || '2'}`}>
                      <DropZoneComponent
                        component={component}
                        business={business}
                        selectedComponentId={selectedComponentId}
                        onSelectComponent={onSelectComponent}
                        onUpdateComponent={onUpdateComponent}
                        onRemoveComponent={onRemoveComponent}
                        onAddComponent={onAddComponent}
                        onDuplicateComponent={onDuplicateComponent}
                        isEditMode={effectiveEditMode}
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
                      {effectiveEditMode && (
                        <DropZone
                          id={`drop-zone-${index + 1}`}
                          index={index + 1}
                          onDrop={handleDrop}
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
                      isEditMode={effectiveEditMode}
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
                    {effectiveEditMode && (
                      <DropZone
                        id={`drop-zone-${index + 1}`}
                        index={index + 1}
                        onDrop={handleDrop}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            </ResponsiveFrame>
          </div>
        </div>
      </div>
      {/* Canvas Controls */}
      {isEditMode && (
        <CanvasControls
          deviceSize={deviceSize}
          onDeviceSizeChange={setDeviceSize}
          zoom={zoom}
          onZoomChange={setZoom}
          showGrid={showGrid}
          onShowGridChange={setShowGrid}
          showRulers={showRulers}
          onShowRulersChange={setShowRulers}
          isPreviewMode={isPreviewMode}
          onPreviewModeChange={setIsPreviewMode}
        />
      )}
    </div>
  );
});

export default PreviewPanel;