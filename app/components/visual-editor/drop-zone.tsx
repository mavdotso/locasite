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

const DropZone = React.memo(function DropZone({ id, index, onDrop, className, showAlways = false }: DropZoneProps) {
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
        "relative transition-all duration-300 ease-out",
        isDragging ? (isActive ? "h-20" : "h-2") : "h-0",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-lg transition-all duration-300 ease-out",
          isActive 
            ? "h-16 bg-primary/10 border-2 border-dashed border-primary shadow-lg shadow-primary/20" 
            : isDragging 
              ? "h-0.5 bg-muted-foreground/30 hover:h-1 hover:bg-muted-foreground/50" 
              : "bg-transparent"
        )}
      >
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={cn(
              "px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md transition-all",
              "animate-in fade-in-0 zoom-in-95 duration-300"
            )}>
              Drop to place here
            </div>
          </div>
        )}
        {isActive && (
          <div className="absolute inset-0 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-shimmer" />
          </div>
        )}
      </div>
    </div>
  );
});

export default DropZone;