"use client";

import React from "react";
import { ComponentData } from "./types";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import ComponentWrapper from "./component-wrapper";
import DropZone from "./drop-zone";
import { Doc } from "@/convex/_generated/dataModel";
import { useDragDrop } from "./drag-drop-provider";

interface NestedDropZoneProps {
  component: ComponentData;
  business: Doc<"businesses">;
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponent: (id: string, props: Record<string, unknown>) => void;
  onRemoveComponent: (id: string) => void;
  onAddComponent: (type: string, index: number, parentId?: string, metadata?: Record<string, unknown>) => void;
  onDuplicateComponent?: (id: string) => void;
  isEditMode: boolean;
  onMove?: (direction: "up" | "down") => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

export default function NestedDropZone({
  component,
  business,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponent,
  onRemoveComponent,
  onAddComponent,
  onDuplicateComponent,
  isEditMode,
  onMove,
  canMoveUp = false,
  canMoveDown = false
}: NestedDropZoneProps) {
  const { draggedItem } = useDragDrop();
  const config = componentConfigs[component.type];
  if (!config) return null;

  const handleDropInChild = (index: number) => {
    if (!draggedItem) return;
    
    if (draggedItem.type === "new-component" && draggedItem.componentType) {
      onAddComponent(draggedItem.componentType, index, component.id);
    }
  };

  // Render children with drop zones
  let children: React.ReactNode = null;
  if (config.acceptsChildren) {
    const childComponents = component.children || [];
    
    children = (
      <>
        {/* Initial drop zone */}
        {isEditMode && (
          <DropZone
            id={`drop-zone-${component.id}-0`}
            index={0}
            onDrop={handleDropInChild}
            className="h-16"
            showAlways={childComponents.length === 0}
          />
        )}
        
        {childComponents.map((child, childIndex) => (
          <React.Fragment key={child.id}>
            <NestedDropZone
              component={child}
              business={business}
              selectedComponentId={selectedComponentId}
              onSelectComponent={onSelectComponent}
              onUpdateComponent={onUpdateComponent}
              onRemoveComponent={onRemoveComponent}
              onAddComponent={onAddComponent}
              onDuplicateComponent={onDuplicateComponent}
              isEditMode={isEditMode}
            />
            
            {/* Drop zone after each child */}
            {isEditMode && (
              <DropZone
                id={`drop-zone-${component.id}-${childIndex + 1}`}
                index={childIndex + 1}
                onDrop={handleDropInChild}
                className="h-16"
              />
            )}
          </React.Fragment>
        ))}
      </>
    );
  }

  // Create update handler for this component
  const handleUpdate = (newProps: Record<string, unknown>) => {
    onUpdateComponent(component.id, newProps);
  };

  const componentProps = {
    ...component.props,
    business
  };

  return (
    <ComponentWrapper
      component={component}
      isSelected={selectedComponentId === component.id}
      isEditMode={isEditMode}
      onSelect={() => onSelectComponent(component.id)}
      onRemove={() => onRemoveComponent(component.id)}
      onMove={onMove || (() => {})}
      onDuplicate={onDuplicateComponent ? () => onDuplicateComponent(component.id) : undefined}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
    >
      {config.render(componentProps, isEditMode, business, children, handleUpdate)}
    </ComponentWrapper>
  );
}