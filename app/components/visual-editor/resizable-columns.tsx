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
}

export default function ResizableColumns({
  columnCount,
  gap,
  stackOnMobile,
  children,
  onColumnWidthsChange,
  initialWidths,
  isEditMode = false
}: ResizableColumnsProps) {
  // Initialize column widths - equal distribution by default
  const [columnWidths, setColumnWidths] = useState<number[]>(() => {
    if (initialWidths && initialWidths.length === columnCount) {
      return initialWidths;
    }
    return Array(columnCount).fill(100 / columnCount);
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
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
    if (!isEditMode) return;
    e.preventDefault();
    setIsDragging(index);
  };

  useEffect(() => {
    if (isDragging === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = (x / containerWidth) * 100;

      setColumnWidths(widths => {
        const newWidths = [...widths];
        const leftIndex = isDragging;
        const rightIndex = isDragging + 1;

        if (rightIndex >= columnCount) return widths;

        const totalWidth = newWidths[leftIndex] + newWidths[rightIndex];
        const minWidth = 10; // Minimum 10% width

        let newLeftWidth = percentage - widths.slice(0, leftIndex).reduce((a, b) => a + b, 0);
        newLeftWidth = Math.max(minWidth, Math.min(newLeftWidth, totalWidth - minWidth));
        
        newWidths[leftIndex] = newLeftWidth;
        newWidths[rightIndex] = totalWidth - newLeftWidth;

        return newWidths;
      });
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
  }, [isDragging, containerWidth, columnCount, columnWidths, onColumnWidthsChange]);

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
    ? { gridTemplateColumns: columnWidths.map(w => `${w}%`).join(' ') }
    : {};

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid",
        stackOnMobile === "yes" && "grid-cols-1 md:grid-cols-none",
        gapClasses[gap as keyof typeof gapClasses] || gapClasses.medium
      )}
      style={gridStyle}
    >
      {children.map((child, index) => (
        <div key={index} className="relative min-h-[100px]">
          {child}
          
          {/* Resize handle */}
          {isEditMode && index < columnCount - 1 && (
            <div
              className={cn(
                "absolute top-0 bottom-0 w-1 cursor-col-resize z-20",
                "hover:bg-primary/50 transition-colors",
                isDragging === index && "bg-primary"
              )}
              style={{
                right: `-${currentGap / 2 + 2}px`,
                width: '4px'
              }}
              onMouseDown={handleMouseDown(index)}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8" />
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