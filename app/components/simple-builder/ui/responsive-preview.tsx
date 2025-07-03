"use client";

import React, { useState } from "react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Smartphone, Tablet, Monitor, RotateCw, Maximize2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export type DeviceType = "mobile" | "tablet" | "desktop" | "fullwidth";
export type OrientationType = "portrait" | "landscape";

interface DeviceConfig {
  width: number;
  height: number;
  scale?: number;
}

const DEVICE_CONFIGS: Record<DeviceType, DeviceConfig> = {
  mobile: { width: 375, height: 667 }, // iPhone SE
  tablet: { width: 768, height: 1024 }, // iPad
  desktop: { width: 1440, height: 900 }, // Desktop
  fullwidth: { width: 0, height: 0 }, // Full width
};

interface ResponsivePreviewProps {
  children: React.ReactNode;
  currentDevice: DeviceType;
  orientation: OrientationType;
  onDeviceChangeAction: (device: DeviceType) => void;
  onOrientationChangeAction: (orientation: OrientationType) => void;
  className?: string;
}

export function ResponsivePreview({
  children,
  currentDevice,
  orientation,
  onDeviceChangeAction,
  onOrientationChangeAction,
  className,
}: ResponsivePreviewProps) {
  const [scale, setScale] = useState(1);

  const config = DEVICE_CONFIGS[currentDevice];
  const isLandscape =
    orientation === "landscape" &&
    currentDevice !== "desktop" &&
    currentDevice !== "fullwidth";

  const frameWidth = isLandscape ? config.height : config.width;
  const frameHeight = isLandscape ? config.width : config.height;

  const deviceButtons = [
    {
      device: "mobile" as DeviceType,
      icon: Smartphone,
      tooltip: "Mobile View (375px)",
    },
    {
      device: "tablet" as DeviceType,
      icon: Tablet,
      tooltip: "Tablet View (768px)",
    },
    {
      device: "desktop" as DeviceType,
      icon: Monitor,
      tooltip: "Desktop View (1440px)",
    },
    {
      device: "fullwidth" as DeviceType,
      icon: Maximize2,
      tooltip: "Full Width",
    },
  ];

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Device Selector Bar */}
      <div className="flex items-center justify-center gap-2 p-3 bg-muted/50 border-b">
        <TooltipProvider>
          <div className="flex items-center gap-1 bg-background rounded-lg p-1">
            {deviceButtons.map(({ device, icon: Icon, tooltip }) => (
              <Tooltip key={device}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentDevice === device ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onDeviceChangeAction(device)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Orientation Toggle */}
          {(currentDevice === "mobile" || currentDevice === "tablet") && (
            <>
              <div className="h-6 w-px bg-border" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      onOrientationChangeAction(
                        orientation === "portrait" ? "landscape" : "portrait",
                      )
                    }
                    className="h-8 w-8 p-0"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rotate Device</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          {/* Device Info */}
          <div className="ml-4 text-sm text-muted-foreground">
            {currentDevice === "fullwidth" ? (
              "Full Width"
            ) : (
              <>
                {frameWidth} × {frameHeight}px
                {currentDevice !== "desktop" && (
                  <span className="ml-2">
                    ({orientation === "portrait" ? "Portrait" : "Landscape"})
                  </span>
                )}
              </>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto bg-muted/30 p-8">
        {currentDevice === "fullwidth" ? (
          <div className="h-full">{children}</div>
        ) : (
          <div className="flex items-start justify-center min-h-full">
            <div
              className={cn(
                "bg-background shadow-2xl transition-all duration-300",
                "ring-1 ring-border",
                currentDevice === "mobile" && "rounded-[2.5rem]",
                currentDevice === "tablet" && "rounded-2xl",
                currentDevice === "desktop" && "rounded-lg",
              )}
              style={{
                width: `${frameWidth}px`,
                height: `${frameHeight}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top center",
              }}
            >
              {/* Device Frame */}
              {currentDevice === "mobile" && (
                <>
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-2xl z-10" />
                  {/* Home Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full" />
                </>
              )}

              {/* Content */}
              <div
                className={cn(
                  "w-full h-full overflow-auto",
                  currentDevice === "mobile" && "rounded-[2rem] pt-8 pb-6",
                  currentDevice === "tablet" && "rounded-xl",
                  currentDevice === "desktop" && "rounded-md",
                )}
              >
                {children}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Controls */}
      {currentDevice !== "fullwidth" && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background rounded-lg shadow-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="h-8 w-8 p-0"
          >
            -
          </Button>
          <span className="text-sm w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale(Math.min(1.5, scale + 0.1))}
            className="h-8 w-8 p-0"
          >
            +
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale(1)}
            className="h-8 px-2"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
