"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import { 
  Monitor, 
  Tablet, 
  Smartphone,
  ZoomIn,
  ZoomOut,
  Grid3x3,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  Maximize2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/app/lib/utils";

export type DeviceSize = "desktop" | "tablet" | "mobile";

export const deviceSizes: Record<DeviceSize, { width: string; icon: typeof Monitor; label: string }> = {
  desktop: { width: "100%", icon: Monitor, label: "Desktop" },
  tablet: { width: "768px", icon: Tablet, label: "Tablet" },
  mobile: { width: "375px", icon: Smartphone, label: "Mobile" }
};

interface CanvasControlsProps {
  deviceSize: DeviceSize;
  onDeviceSizeChange: (size: DeviceSize) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  showGrid: boolean;
  onShowGridChange: (show: boolean) => void;
  showRulers: boolean;
  onShowRulersChange: (show: boolean) => void;
  onExport?: () => void;
  onImport?: () => void;
  isPreviewMode?: boolean;
  onPreviewModeChange?: (preview: boolean) => void;
}

export default function CanvasControls({
  deviceSize,
  onDeviceSizeChange,
  zoom,
  onZoomChange,
  showGrid,
  onShowGridChange,
  showRulers,
  onShowRulersChange,
  onExport,
  onImport,
  isPreviewMode = false,
  onPreviewModeChange
}: CanvasControlsProps) {
  const zoomPresets = [50, 75, 100, 125, 150];

  return (
    <>
      {/* Top Floating Controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-1 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-1">
          {/* Device Size Controls */}
          <div className="flex items-center gap-0.5 px-1">
            {(Object.entries(deviceSizes) as [DeviceSize, typeof deviceSizes[DeviceSize]][]).map(([size, config]) => {
              const Icon = config.icon;
              return (
                <Tooltip key={size}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={deviceSize === size ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => onDeviceSizeChange(size)}
                      className="h-8 w-8 p-0"
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{config.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          <div className="w-px h-6 bg-border" />

          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onZoomChange(Math.max(25, zoom - 10))}
                  className="h-8 w-8 p-0"
                  disabled={zoom <= 25}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom out</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2 min-w-[60px]">
                  {zoom}%
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>Zoom Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {zoomPresets.map(preset => (
                  <DropdownMenuItem 
                    key={preset}
                    onClick={() => onZoomChange(preset)}
                    className={cn(zoom === preset && "bg-accent")}
                  >
                    {preset}%
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onZoomChange(100)}>
                  <Maximize2 className="h-4 w-4 mr-2" />
                  Fit to screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onZoomChange(Math.min(200, zoom + 10))}
                  className="h-8 w-8 p-0"
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom in</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border" />

          {/* View Options */}
          <div className="flex items-center gap-0.5 px-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showGrid ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onShowGridChange(!showGrid)}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showGrid ? "Hide grid" : "Show grid"}</p>
              </TooltipContent>
            </Tooltip>

            {onPreviewModeChange && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isPreviewMode ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => onPreviewModeChange(!isPreviewMode)}
                    className="h-8 w-8 p-0"
                  >
                    {isPreviewMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPreviewMode ? "Exit preview" : "Preview mode"}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Right Floating Actions */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="flex flex-col gap-2">
          {onExport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onExport}
                  className="h-10 w-10 p-0 bg-background/95 backdrop-blur-sm shadow-lg"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Export page</p>
              </TooltipContent>
            </Tooltip>
          )}

          {onImport && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onImport}
                  className="h-10 w-10 p-0 bg-background/95 backdrop-blur-sm shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Import page</p>
              </TooltipContent>
            </Tooltip>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 w-10 p-0 bg-background/95 backdrop-blur-sm shadow-lg"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" align="end">
              <DropdownMenuLabel>Canvas Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onShowGridChange(!showGrid)}>
                <Grid3x3 className="h-4 w-4 mr-2" />
                {showGrid ? "Hide Grid" : "Show Grid"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShowRulersChange(!showRulers)}>
                <Settings className="h-4 w-4 mr-2" />
                {showRulers ? "Hide Rulers" : "Show Rulers"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}