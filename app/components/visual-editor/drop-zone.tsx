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
  
  // If dragging a template and this is not a root-level drop zone, hide it
  // Root drop zones have IDs like "drop-zone-0", "drop-zone-1", etc.
  // Nested drop zones have IDs like "drop-zone-componentId-0"
  const isRootDropZone = /^drop-zone-\d+$/.test(id);
  const shouldHideForTemplate = isTemplate && !isRootDropZone;
  
  const isActive = dropTargetId === id;
  const shouldShow = (showAlways || isDragging) && !shouldHideForTemplate;

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