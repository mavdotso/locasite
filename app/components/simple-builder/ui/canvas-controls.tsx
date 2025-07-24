"use client";

import React from "react";
import CanvasControlsBase from "@/app/components/ui/canvas-controls";

export type DeviceSize = "desktop" | "tablet" | "mobile";
export { deviceSizes } from "@/app/components/ui/canvas-controls";

interface CanvasControlsProps {
  deviceSize: DeviceSize;
  onDeviceSizeChangeAction: (size: DeviceSize) => void;
  zoom: number;
  onZoomChangeAction: (zoom: number) => void;
  onFullScreenPreviewAction?: () => void;
  onExitFullScreenAction?: () => void;
  hideZoomControls?: boolean;
  isFullScreen?: boolean;
}

export default function CanvasControls({
  deviceSize,
  onDeviceSizeChangeAction,
  zoom,
  onZoomChangeAction,
  onFullScreenPreviewAction,
  onExitFullScreenAction,
  hideZoomControls = false,
  isFullScreen = false,
}: CanvasControlsProps) {
  return (
    <CanvasControlsBase
      deviceSize={deviceSize}
      onDeviceSizeChange={onDeviceSizeChangeAction}
      zoom={zoom}
      onZoomChange={onZoomChangeAction}
      onFullScreenPreview={onFullScreenPreviewAction}
      onExitFullScreen={onExitFullScreenAction}
      hideZoomControls={hideZoomControls}
      isFullScreen={isFullScreen}
      position="fixed"
    />
  );
}