"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/utils";

interface ResizableColumnsProps {
  columnCount: number;
  mobileColumns?: string;
  tabletColumns?: string;
  gap: string;
  mobileGap?: string;
  children: React.ReactNode[];
  onColumnWidthsChange?: (widths: number[]) => void;
  initialWidths?: number[];
  isEditMode?: boolean;
  verticalAlign?: 'top' | 'center' | 'bottom';
  minHeight?: string | number;
  reverseOnMobile?: boolean;
  stackOnMobile?: string; // Kept for backward compatibility
}

export default function ResizableColumns({
  columnCount,
  mobileColumns = "1",
  tabletColumns = "2",
  gap,
  mobileGap = "small",
  children,
  onColumnWidthsChange,
  initialWidths,
  isEditMode = false,
  verticalAlign = 'top',
  minHeight = '100px',
  reverseOnMobile = false,
  stackOnMobile // Backward compatibility
}: ResizableColumnsProps) {
  // Initialize column widths - equal distribution by default
  const getEqualWidths = (count: number) => Array(count).fill(100 / count);
  
  const [columnWidths, setColumnWidths] = useState<number[]>(() => {
    if (initialWidths && initialWidths.length === columnCount) {
      return initialWidths;
    }
    return getEqualWidths(columnCount);
  });

  // Ensure column widths array matches column count
  const actualColumnWidths = columnWidths.length === columnCount 
    ? columnWidths 
    : getEqualWidths(columnCount);

  // Update column widths when column count changes
  useEffect(() => {
    if (columnWidths.length !== columnCount) {
      const newWidths = getEqualWidths(columnCount);
      setColumnWidths(newWidths);
      if (onColumnWidthsChange) {
        onColumnWidthsChange(newWidths);
      }
    }
  }, [columnCount, columnWidths.length, onColumnWidthsChange]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragStartWidths, setDragStartWidths] = useState<number[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Update container width and check screen size on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
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
  }, [isDragging, dragStartX, dragStartWidths, containerWidth, columnCount, columnWidths, onColumnWidthsChange]);

  const gapPixels = {
    none: 0,
    small: 8,
    medium: 24,
    large: 40
  };

  const currentGap = gapPixels[gap as keyof typeof gapPixels] || 0;
  const currentMobileGap = gapPixels[mobileGap as keyof typeof gapPixels] || gapPixels.small;

  // Determine effective column count based on screen size
  const getEffectiveColumns = () => {
    if (screenSize === 'mobile') {
      // Handle backward compatibility with stackOnMobile
      if (stackOnMobile === "no") return columnCount;
      return mobileColumns === 'same' ? columnCount : parseInt(mobileColumns);
    }
    if (screenSize === 'tablet') {
      return tabletColumns === 'same' ? columnCount : parseInt(tabletColumns);
    }
    return columnCount;
  };

  const effectiveColumns = getEffectiveColumns();
  const shouldUseGrid = effectiveColumns > 1;

  // Generate responsive class names
  const getResponsiveClasses = () => {
    const classes = [];
    
    // Mobile columns
    const mobileCols = mobileColumns === 'same' ? columnCount : parseInt(mobileColumns);
    if (mobileCols === 1) {
      classes.push('grid-cols-1');
    } else if (mobileCols === 2) {
      classes.push('grid-cols-2');
    }
    
    // Tablet columns
    const tabletCols = tabletColumns === 'same' ? columnCount : parseInt(tabletColumns);
    if (tabletCols === 1) {
      classes.push('sm:grid-cols-1');
    } else if (tabletCols === 2) {
      classes.push('sm:grid-cols-2');
    } else if (tabletCols === 3) {
      classes.push('sm:grid-cols-3');
    }
    
    // Desktop columns
    if (columnCount === 2) {
      classes.push('lg:grid-cols-2');
    } else if (columnCount === 3) {
      classes.push('lg:grid-cols-3');
    } else if (columnCount === 4) {
      classes.push('lg:grid-cols-4');
    }
    
    return classes.join(' ');
  };

  // Apply custom widths only on desktop
  const gridStyle: React.CSSProperties = screenSize === 'desktop' && shouldUseGrid
    ? { 
        gridTemplateColumns: actualColumnWidths.map(w => `minmax(0, ${w}fr)`).join(' '),
        gap: currentGap + 'px'
      }
    : {
        gap: screenSize === 'mobile' ? currentMobileGap + 'px' : currentGap + 'px'
      };

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid",
        getResponsiveClasses(),
        reverseOnMobile && "flex-col-reverse sm:flex-row",
        "w-full"
      )}
      style={gridStyle}
    >
      {actualColumnWidths.map((width, index) => (
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
            {index < children.length ? children[index] : null}
          </div>
          
          {/* Resize handle - only show on desktop */}
          {isEditMode && screenSize === 'desktop' && index < columnCount - 1 && (
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