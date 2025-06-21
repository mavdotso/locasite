"use client";

import React from "react";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { allComponentConfigs as componentConfigs } from "./config/all-components";

interface DropZoneProps {
  id: string;
  index: number;
  onDrop: (index: number) => void;
  className?: string;
  showAlways?: boolean;
}

export default function DropZone({ id, index, onDrop, className, showAlways = false }: DropZoneProps) {
  const { isDragging, dropTargetId, setDropTarget, endDrag, draggedItem } = useDragDrop();
  
  // Check if the dragged item is a template
  const isTemplate = draggedItem?.type === "new-component" && 
    draggedItem.componentType && 
    componentConfigs[draggedItem.componentType]?.isTemplate;
  
  // Check what we're dragging
  const isDraggingColumns = draggedItem?.type === "new-component" && 
    draggedItem.componentType === "ColumnsBlock";
  const isDraggingSection = draggedItem?.type === "new-component" && 
    draggedItem.componentType === "SectionBlock";
  
  // Determine drop zone context
  const isRootDropZone = /^drop-zone-\d+$/.test(id);
  const isInColumns = id.includes('-col-');
  
  // Apply restrictions
  const shouldHideForTemplate = isTemplate && !isRootDropZone;
  const shouldHideForColumns = isDraggingColumns && isInColumns; // Columns can't go in columns
  const shouldHideForSection = isDraggingSection && !isRootDropZone; // Sections only at root
  
  const isActive = dropTargetId === id;
  const shouldShow = (showAlways || isDragging) && !shouldHideForTemplate && !shouldHideForColumns && !shouldHideForSection;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) {
      setDropTarget(id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropTargetId === id) {
      setDropTarget(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem) {
      onDrop(index);
      endDrag();
    }
  };

  if (!shouldShow) return null;

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        isDragging ? "h-1" : "h-0",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-200",
          isActive 
            ? "bg-primary h-2 shadow-lg shadow-primary/50" 
            : isDragging ? "bg-muted-foreground/20" : "bg-transparent"
        )}
      >
        {isActive && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full whitespace-nowrap shadow-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  );
}