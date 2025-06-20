"use client";

import React from "react";
import { ComponentData } from "./types";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
import ComponentWrapper from "./component-wrapper";
import DropZone from "./drop-zone";
import { Doc } from "@/convex/_generated/dataModel";
import { useDragDrop } from "./drag-drop-provider";
import NestedDropZone from "./nested-drop-zone";
import { cn } from "@/app/lib/utils";

interface ColumnsDropZoneProps {
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

export default function ColumnsDropZone({
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
}: ColumnsDropZoneProps) {
  const { draggedItem } = useDragDrop();
  const config = componentConfigs[component.type];
  
  if (!config || component.type !== "ColumnsBlock") {
    // Fallback to regular NestedDropZone if not a columns block
    return (
      <NestedDropZone
        component={component}
        business={business}
        selectedComponentId={selectedComponentId}
        onSelectComponent={onSelectComponent}
        onUpdateComponent={onUpdateComponent}
        onRemoveComponent={onRemoveComponent}
        onAddComponent={onAddComponent}
        onDuplicateComponent={onDuplicateComponent}
        isEditMode={isEditMode}
        onMove={onMove}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
    );
  }

  const handleDropInColumn = (columnIndex: number, dropIndex: number) => {
    if (!draggedItem) return;
    
    if (draggedItem.type === "new-component" && draggedItem.componentType) {
      // Calculate the actual index considering all columns
      const actualIndex = calculateActualIndex(columnIndex, dropIndex);
      
      // Add metadata to track which column this component belongs to
      onAddComponent(
        draggedItem.componentType, 
        actualIndex, 
        component.id,
        { columnIndex }
      );
    }
  };

  // Get column count from props
  const columnCount = parseInt((component.props.columns as string) || "2");

  // Calculate the actual index in the full children array
  const calculateActualIndex = (columnIndex: number, dropIndex: number): number => {
    if (!component.children) return dropIndex;
    
    // Get all children with their metadata preserved
    const allChildren = component.children.map((child, idx) => ({
      child,
      originalIndex: idx,
      columnIndex: child.metadata?.columnIndex ?? idx % columnCount
    }));
    
    // Filter children in the target column
    const targetColumnChildren = allChildren
      .filter(item => item.columnIndex === columnIndex)
      .sort((a, b) => a.originalIndex - b.originalIndex);
    
    if (dropIndex === 0) {
      // Insert at the beginning of the column
      return targetColumnChildren.length > 0 ? targetColumnChildren[0].originalIndex : 0;
    } else if (dropIndex >= targetColumnChildren.length) {
      // Insert at the end of the column
      if (targetColumnChildren.length === 0) {
        // Empty column - find the right position
        for (let i = 0; i < component.children.length; i++) {
          const childCol = component.children[i].metadata?.columnIndex ?? i % columnCount;
          if (typeof childCol === 'number' && childCol > columnIndex) {
            return i;
          }
        }
        return component.children.length;
      }
      // After the last item in this column
      const lastItemIndex = targetColumnChildren[targetColumnChildren.length - 1].originalIndex;
      return lastItemIndex + 1;
    } else {
      // Insert between items
      return targetColumnChildren[dropIndex].originalIndex;
    }
  };


  // Build the columns structure directly instead of using renderComponent
  // because ColumnsBlock's render expects raw children, not pre-distributed
  const columnsContent = (() => {
    const columnCount = parseInt(component.props.columns as string || "2");
    const columnContents: React.ReactNode[][] = Array(columnCount).fill(null).map(() => []);
    
    // Distribute children to columns based on metadata
    if (component.children) {
      component.children.forEach((child, index) => {
        const columnIndex = child.metadata?.columnIndex !== undefined 
          ? child.metadata.columnIndex as number
          : index % columnCount;
        
        
        // Ensure columnIndex is within bounds
        const safeColumnIndex = Math.min(Math.max(0, columnIndex), columnCount - 1);
        
        const childNode = (
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
                id={`drop-zone-${component.id}-col-${safeColumnIndex}-${columnContents[safeColumnIndex].length + 1}`}
                index={columnContents[safeColumnIndex].length + 1}
                onDrop={(index) => handleDropInColumn(safeColumnIndex, index)}
                className="h-16"
              />
            )}
          </React.Fragment>
        );
        
        columnContents[safeColumnIndex].push(childNode);
      });
    }
    
    
    // Create the columns layout directly
    const gap = component.props.gap as string || "medium";
    const stackOnMobile = component.props.stackOnMobile as string || "yes";
    const direction = component.props.direction as string || "row";
    const isVertical = direction === "col";
    
    let layoutClasses = "";
    if (isVertical) {
      layoutClasses = "flex flex-col";
    } else {
      layoutClasses = cn(
        "grid",
        stackOnMobile === "yes" ? "grid-cols-1" : "",
        columnCount === 2 && "md:grid-cols-2",
        columnCount === 3 && "md:grid-cols-3",
        columnCount === 4 && "md:grid-cols-4"
      );
    }
    
    const gapClasses = {
      none: "",
      small: "gap-2",
      medium: "gap-6",
      large: "gap-10"
    };
    
    return (
      <div className={cn(
        layoutClasses,
        gapClasses[gap as keyof typeof gapClasses] || gapClasses.medium
      )}>
        {columnContents.map((colChildren, colIndex) => (
          <div key={colIndex} className="min-h-[100px] column-drop-zone">
            {/* Initial drop zone for this column */}
            {isEditMode && (
              <DropZone
                id={`drop-zone-${component.id}-col-${colIndex}-0`}
                index={0}
                onDrop={(index) => handleDropInColumn(colIndex, index)}
                className="h-16"
                showAlways={colChildren.length === 0}
              />
            )}
            {colChildren}
            {/* Show placeholder if column is empty */}
            {isEditMode && colChildren.length === 0 && (
              <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">Column {colIndex + 1}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  })();

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
      {columnsContent}
    </ComponentWrapper>
  );
}