"use client";

import React from "react";
import { ComponentData } from "./types";
import { useDragDrop } from "./drag-drop-provider";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { getLayoutStyles } from "./utils/layout-styles";
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
  isNested?: boolean;
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
  children,
  isNested = false
}: ComponentWrapperProps) {
  const { startDrag } = useDragDrop();

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    const target = e.currentTarget.closest('.group') as HTMLElement;
    startDrag({
      type: "existing-component",
      component
    }, target);
    
    // Create custom drag preview
    const dragPreview = document.createElement('div');
    dragPreview.className = 'fixed pointer-events-none z-50 bg-background border-2 border-primary rounded-lg shadow-xl p-3 opacity-90';
    dragPreview.innerHTML = `
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-primary rounded-full"></div>
        <span class="text-sm font-medium">${component.type.replace(/Block$/, '')}</span>
      </div>
    `;
    dragPreview.style.position = 'absolute';
    dragPreview.style.top = '-9999px';
    document.body.appendChild(dragPreview);
    e.dataTransfer.setDragImage(dragPreview, 0, 0);
    
    setTimeout(() => {
      document.body.removeChild(dragPreview);
    }, 0);
  };

  const layoutStyles = getLayoutStyles(component.layout);

  if (!isEditMode) {
    return (
      <div style={layoutStyles}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative group transition-all duration-200",
        isSelected && "ring-2 ring-primary ring-offset-2",
        "hover:ring-2 hover:ring-primary/30 hover:ring-offset-1"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        cursor: isEditMode ? 'pointer' : 'default'
      }}
    >
      {/* Component Controls */}
      <div className={cn(
        "absolute -top-10 right-2 z-10",
        "flex items-center gap-1 bg-background border rounded-lg p-1",
        "transition-all duration-200",
        isSelected ? "opacity-100 -translate-y-1 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Drag Handle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              draggable
              onDragStart={handleDragStart}
              className="cursor-move p-1.5 hover:bg-muted rounded transition-colors touch-none select-none"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Drag to reorder</p>
          </TooltipContent>
        </Tooltip>

        {/* Move Buttons - only show for Sections and Columns */}
        {!isNested && (component.type === 'SectionBlock' || component.type === 'ColumnsBlock') && (
          <>
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
          </>
        )}

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
      <div className="relative" style={layoutStyles}>
        {children}
      </div>
    </div>
  );
}