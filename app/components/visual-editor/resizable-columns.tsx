"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/utils";

interface ResizableColumnsProps {
  columnCount: number;
  gap: string;
  stackOnMobile: string;
  children: React.ReactNode[];
  onColumnWidthsChange?: (widths: number[]) => void;
  initialWidths?: number[];
  isEditMode?: boolean;
  verticalAlign?: 'top' | 'center' | 'bottom';
  minHeight?: string | number;
}

export default function ResizableColumns({
  columnCount,
  gap,
  stackOnMobile,
  children,
  onColumnWidthsChange,
  initialWidths,
  isEditMode = false,
  verticalAlign = 'top',
  minHeight = '100px'
}: ResizableColumnsProps) {
  // Initialize column widths - equal distribution by default
  const [columnWidths, setColumnWidths] = useState<number[]>(() => {
    if (initialWidths && initialWidths.length === columnCount) {
      return initialWidths;
    }
    return Array(columnCount).fill(100 / columnCount);
  });

  // Update column widths when column count changes
  useEffect(() => {
    const newWidths = Array(columnCount).fill(100 / columnCount);
    setColumnWidths(newWidths);
    if (onColumnWidthsChange) {
      onColumnWidthsChange(newWidths);
    }
  }, [columnCount, onColumnWidthsChange]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartWidths, setDragStartWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Update container width and check mobile on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      setIsMobile(window.innerWidth < 768);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    if (!isEditMode || !containerRef.current) return;
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    setDragStartX(x);
    setDragStartWidths([...columnWidths]);
    setIsDragging(index);
  };

  useEffect(() => {
    if (isDragging === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const deltaX = currentX - dragStartX;
      const deltaPercentage = (deltaX / containerWidth) * 100;

      const newWidths = [...dragStartWidths];
      const leftIndex = isDragging;
      const rightIndex = isDragging + 1;

      if (rightIndex >= columnCount) return;

      const originalLeftWidth = dragStartWidths[leftIndex];
      const originalRightWidth = dragStartWidths[rightIndex];
      const totalWidth = originalLeftWidth + originalRightWidth;
      const minWidth = 10; // Minimum 10% width

      let newLeftWidth = originalLeftWidth + deltaPercentage;
      newLeftWidth = Math.max(minWidth, Math.min(newLeftWidth, totalWidth - minWidth));
      
      newWidths[leftIndex] = newLeftWidth;
      newWidths[rightIndex] = totalWidth - newLeftWidth;

      setColumnWidths(newWidths);
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      if (onColumnWidthsChange) {
        onColumnWidthsChange(columnWidths);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStartX, dragStartWidths, containerWidth, columnCount, onColumnWidthsChange]);

  const gapClasses = {
    none: "",
    small: "gap-2",
    medium: "gap-6",
    large: "gap-10"
  };

  const gapPixels = {
    none: 0,
    small: 8,
    medium: 24,
    large: 40
  };

  const currentGap = gapPixels[gap as keyof typeof gapPixels] || 0;

  // Apply grid template columns only on desktop or when not stacking on mobile
  const shouldApplyColumns = !isMobile || stackOnMobile !== "yes";
  const gridStyle: React.CSSProperties = shouldApplyColumns
    ? { 
        gridTemplateColumns: columnWidths.map(w => `minmax(0, ${w}fr)`).join(' '),
        gridAutoFlow: 'column'
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid",
        stackOnMobile === "yes" && "grid-cols-1 md:grid-flow-col md:auto-cols-fr",
        gapClasses[gap as keyof typeof gapClasses] || gapClasses.medium,
        "w-full"
      )}
      style={gridStyle}
    >
      {children.map((child, index) => (
        <div 
          key={index} 
          className={cn(
            "relative min-w-0 flex",
            verticalAlign === 'top' && "items-start",
            verticalAlign === 'center' && "items-center",
            verticalAlign === 'bottom' && "items-end"
          )}
          style={{ 
            minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
            flexShrink: 0 
          }}
        >
          <div className="w-full">
            {child}
          </div>
          
          {/* Resize handle - spans entire gap between columns with minimum width */}
          {isEditMode && index < columnCount - 1 && (
            <div
              className={cn(
                "absolute top-0 bottom-0 cursor-col-resize z-20 group"
              )}
              style={{
                right: `-${Math.max(currentGap / 2 + 12, 20)}px`,
                width: `${Math.max(24, currentGap + 24)}px`,
                marginLeft: '-12px',
                marginRight: '-12px',
                paddingLeft: '12px',
                paddingRight: '12px'
              }}
              onMouseDown={handleMouseDown(index)}
            >
              {/* Background hover effect on both sides */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary/10" />
              
              {/* Center resize line */}
              <div 
                className={cn(
                  "absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 transition-all z-10",
                  "bg-border/50 group-hover:bg-primary group-hover:w-2",
                  isDragging === index && "bg-primary w-2"
                )}
              />
              
              {/* Drag handle dots indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <div className="flex flex-col gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  <div className="w-1 h-1 bg-primary rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Dragging overlay */}
      {isDragging !== null && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
    </div>
  );
}