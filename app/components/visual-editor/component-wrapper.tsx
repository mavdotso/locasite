"use client";

import React from "react";
import { ComponentData } from "./types";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { getLayoutClasses, getBackgroundStyle } from "./utils/layout";
import { 
  ChevronUp, 
  ChevronDown, 
  Trash2, 
  GripVertical,
  Copy
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

interface ComponentWrapperProps {
  component: ComponentData;
  isSelected: boolean;
  isEditMode: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMove: (direction: "up" | "down") => void;
  onDuplicate?: () => void;
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
  onDuplicate,
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
  const backgroundStyle = getBackgroundStyle(component.layout);

  if (!isEditMode) {
    return (
      <div className={layoutClasses} style={backgroundStyle}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2 animate-in fade-in-0 zoom-in-95",
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
        "transition-all duration-200",
        isSelected ? "opacity-100 -translate-y-1 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Drag Handle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              draggable
              onDragStart={handleDragStart}
              className="cursor-move p-1.5 hover:bg-muted rounded transition-colors"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Drag to reorder</p>
          </TooltipContent>
        </Tooltip>

        {/* Move Buttons */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMove("up");
              }}
              disabled={!canMoveUp}
              className="h-8 w-8 p-0 transition-all hover:bg-primary/10"
            >
              <ChevronUp className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Move up</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMove("down");
              }}
              disabled={!canMoveDown}
              className="h-8 w-8 p-0 transition-all hover:bg-primary/10"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Move down</p>
          </TooltipContent>
        </Tooltip>

        {/* Duplicate Button */}
        {onDuplicate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate();
                }}
                className="h-8 w-8 p-0 transition-all hover:bg-primary/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Duplicate component</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Remove Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete component</p>
          </TooltipContent>
        </Tooltip>

        {/* Component Type Label */}
        <div className="px-2 text-xs font-medium text-muted-foreground">
          {component.type.replace(/Block$/, "")}
        </div>
      </div>

      {/* Component Content */}
      <div className={cn("relative", layoutClasses)} style={backgroundStyle}>
        {children}
      </div>
    </div>
  );
}