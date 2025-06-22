"use client";

import React from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { Move, Maximize2 } from "lucide-react";

interface SizeControlProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  type?: "width" | "height";
}

export default function SizeControl({ 
  value = "auto", 
  onChange, 
  label = "Size",
  type = "width"
}: SizeControlProps) {
  const isAuto = value === "auto" || !value;
  const numericValue = isAuto ? "" : value.replace(/[^\d]/g, "");
  const unit = isAuto ? "px" : value.replace(/[\d.]/g, "") || "px";

  const handleModeChange = (mode: string) => {
    if (mode === "auto") {
      onChange("auto");
    } else {
      onChange(numericValue || "100" + unit);
    }
  };

  const handleValueChange = (newValue: string) => {
    if (!isAuto) {
      onChange(newValue + unit);
    }
  };

  const handleUnitChange = (newUnit: string) => {
    if (!isAuto) {
      onChange((numericValue || "100") + newUnit);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        <ToggleGroup 
          type="single" 
          value={isAuto ? "auto" : "manual"}
          onValueChange={handleModeChange}
          className="h-8"
        >
          <ToggleGroupItem 
            value="auto" 
            className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Maximize2 className="h-3 w-3 mr-1" />
            Auto
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="manual" 
            className="h-8 px-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Move className="h-3 w-3 mr-1" />
            Manual
          </ToggleGroupItem>
        </ToggleGroup>
        
        {!isAuto && (
          <>
            <Input
              type="number"
              value={numericValue}
              onChange={(e) => handleValueChange(e.target.value)}
              className="h-8 w-20"
              placeholder="100"
            />
            <ToggleGroup 
              type="single" 
              value={unit}
              onValueChange={handleUnitChange}
              className="h-8"
            >
              <ToggleGroupItem value="px" className="h-8 px-2 text-xs">px</ToggleGroupItem>
              <ToggleGroupItem value="%" className="h-8 px-2 text-xs">%</ToggleGroupItem>
              {type === "width" && (
                <ToggleGroupItem value="vw" className="h-8 px-2 text-xs">vw</ToggleGroupItem>
              )}
              {type === "height" && (
                <ToggleGroupItem value="vh" className="h-8 px-2 text-xs">vh</ToggleGroupItem>
              )}
            </ToggleGroup>
          </>
        )}
      </div>
    </div>
  );
}