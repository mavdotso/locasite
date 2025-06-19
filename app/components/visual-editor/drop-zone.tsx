"use client";

import React from "react";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { Plus } from "lucide-react";

interface DropZoneProps {
  id: string;
  index: number;
  onDrop: (index: number) => void;
  className?: string;
  showAlways?: boolean;
}

export default function DropZone({ id, index, onDrop, className, showAlways = false }: DropZoneProps) {
  const { isDragging, dropTargetId, setDropTarget, endDrag, draggedItem } = useDragDrop();
  
  const isActive = dropTargetId === id;
  const shouldShow = showAlways || isDragging;

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
        isDragging && "min-h-[80px]",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={cn(
          "absolute inset-0 border-2 border-dashed rounded-lg transition-all",
          "flex items-center justify-center",
          isActive 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : "border-muted-foreground/20",
          !isDragging && "opacity-0 hover:opacity-100"
        )}
      >
        <div className={cn(
          "flex items-center gap-2 text-sm",
          isActive ? "text-primary" : "text-muted-foreground"
        )}>
          <Plus className="w-4 h-4" />
          <span>Drop component here</span>
        </div>
      </div>
    </div>
  );
}