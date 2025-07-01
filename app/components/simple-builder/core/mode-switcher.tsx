"use client";

import React from "react";
import { cn } from "@/app/lib/utils";

interface ModeSwitcherProps {
  currentMode: "simple" | "pro";
  onModeChange: (mode: "simple" | "pro") => void;
  showProMode?: boolean; // Feature flag to show/hide pro mode
}

export function ModeSwitcher({
  currentMode,
  onModeChange,
  showProMode = false,
}: ModeSwitcherProps) {
  if (!showProMode) {
    // Don't render anything if pro mode is hidden
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      <button
        onClick={() => onModeChange("simple")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded transition-colors",
          currentMode === "simple"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Simple
      </button>
      <button
        onClick={() => onModeChange("pro")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded transition-colors",
          currentMode === "pro"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        Pro
      </button>
    </div>
  );
}
