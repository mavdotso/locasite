"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { DeviceSize, deviceSizes } from "./canvas-controls";

interface CanvasControlsPreviewProps {
  deviceSize: DeviceSize;
  onDeviceSizeChangeAction: (size: DeviceSize) => void;
}

export default function CanvasControlsPreview({
  deviceSize,
  onDeviceSizeChangeAction,
}: CanvasControlsPreviewProps) {
  return (
    <>
      {/* Bottom Floating Controls - Only Device Size */}
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
                      onClick={() => onDeviceSizeChangeAction(size)}
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
        </div>
      </div>
    </>
  );
}
