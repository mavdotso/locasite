"use client";

import React from "react";
import CanvasControlsBase from "@/app/components/ui/canvas-controls";

export type DeviceSize = "desktop" | "tablet" | "mobile";
export { deviceSizes } from "@/app/components/ui/canvas-controls";

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
  return (
    <CanvasControlsBase
      deviceSize={deviceSize}
      onDeviceSizeChange={onDeviceSizeChange}
      zoom={zoom}
      onZoomChange={onZoomChange}
      onFullScreenPreview={
        onFullScreenChange ? () => onFullScreenChange(true) : undefined
      }
      onExitFullScreen={
        onFullScreenChange ? () => onFullScreenChange(false) : undefined
      }
      isFullScreen={isFullScreen}
      position="absolute"
    />
  );
}