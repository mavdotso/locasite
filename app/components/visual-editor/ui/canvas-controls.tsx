"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Eye,
  Maximize2,
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

export const deviceSizes: Record<
  DeviceSize,
  { width: string; icon: typeof Monitor; label: string }
> = {
  desktop: { width: "100%", icon: Monitor, label: "Desktop" },
  tablet: { width: "768px", icon: Tablet, label: "Tablet" },
  mobile: { width: "375px", icon: Smartphone, label: "Mobile" },
};

interface CanvasControlsProps {
  deviceSize: DeviceSize;
  onDeviceSizeChange: (size: DeviceSize) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isFullScreen?: boolean;
  onFullScreenChange?: (fullScreen: boolean) => void;
}

export default function CanvasControls({
  deviceSize,
  onDeviceSizeChange,
  zoom,
  onZoomChange,
  isFullScreen = false,
  onFullScreenChange,
}: CanvasControlsProps) {
  const zoomPresets = [50, 75, 100, 125, 150];

  return (
    <>
      {/* Top Floating Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
        <div className="flex items-center gap-1 bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-1">
          {/* Device Size Controls */}
          <div className="flex items-center gap-0.5 px-1">
            {(
              Object.entries(deviceSizes) as [
                DeviceSize,
                (typeof deviceSizes)[DeviceSize],
              ][]
            ).map(([size, config]) => {
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 min-w-[60px]"
                >
                  {zoom}%
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>Zoom Level</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {zoomPresets.map((preset) => (
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
            {onFullScreenChange && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFullScreenChange(!isFullScreen)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Full screen preview</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
