"use client";

import React from "react";
import { ComponentData } from "./types";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { getLayoutClasses } from "./utils/layout";
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  GripVertical 
} from "lucide-react";

interface ComponentWrapperProps {
  component: ComponentData;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  children: React.ReactNode;
}

export default function ComponentWrapper({
  component,
  isSelected,
  isEditMode,
  onSelect,
  onRemove,
  onMove,
  canMoveUp,
  canMoveDown,
  children
}: ComponentWrapperProps) {
  const { startDrag } = useDragDrop();

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    startDrag({
      type: "existing-component",
      component
    });
  };

  const layoutClasses = getLayoutClasses(component.layout);

  if (!isEditMode) {
    return <div className={layoutClasses}>{children}</div>;
  }

  return (
    <div
      className={cn(
        "relative group transition-all",
        isSelected && "ring-2 ring-primary ring-offset-2",
        "hover:ring-2 hover:ring-primary/50 hover:ring-offset-2"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Component Controls */}
      <div className={cn(
        "absolute -top-10 right-2 z-10",
        "flex items-center gap-1 bg-background border rounded-lg shadow-lg p-1",
        "opacity-0 group-hover:opacity-100 transition-opacity",
        isSelected && "opacity-100"
      )}>
        {/* Drag Handle */}
        <div
          draggable
          onDragStart={handleDragStart}
          className="cursor-move p-1.5 hover:bg-muted rounded"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Move Buttons */}
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onMove("up");
          }}
          disabled={!canMoveUp}
          className="h-8 w-8 p-0"
        >
          <ChevronUp className="w-4 h-4" />
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onMove("down");
          }}
          disabled={!canMoveDown}
          className="h-8 w-8 p-0"
        >
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Remove Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {/* Component Type Label */}
        <div className="px-2 text-xs font-medium text-muted-foreground">
          {component.type.replace(/Block$/, "")}
        </div>
      </div>

      {/* Component Content */}
      <div className={cn("relative", layoutClasses)}>
        {children}
      </div>
    </div>
  );
}