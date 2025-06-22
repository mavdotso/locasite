"use client";

import React from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Square, Circle, RectangleHorizontal } from "lucide-react";

interface BorderControlProps {
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  onChange: (property: string, value: string) => void;
}

const borderStyles = [
  { value: "none", label: "None" },
  { value: "solid", label: "Solid" },
  { value: "dashed", label: "Dashed" },
  { value: "dotted", label: "Dotted" },
  { value: "double", label: "Double" },
];

const borderWidths = [
  { value: "0", label: "None" },
  { value: "1", label: "1px" },
  { value: "2", label: "2px" },
  { value: "4", label: "4px" },
  { value: "8", label: "8px" },
];

const borderRadiusPresets = [
  { value: "0", icon: Square, label: "Square" },
  { value: "4", icon: RectangleHorizontal, label: "Small" },
  { value: "8", icon: RectangleHorizontal, label: "Medium" },
  { value: "16", icon: RectangleHorizontal, label: "Large" },
  { value: "9999", icon: Circle, label: "Full" },
];

export default function BorderControl({
  borderWidth = "0",
  borderStyle = "solid",
  borderColor = "#000000",
  borderRadius = "0",
  onChange
}: BorderControlProps) {
  const currentRadius = borderRadius.replace(/\D/g, "");
  const matchingPreset = borderRadiusPresets.find(p => p.value === currentRadius);

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-medium mb-2 block">Border</Label>
        
        {/* Border Style & Width */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Select value={borderStyle} onValueChange={(value) => onChange("borderStyle", value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {borderStyles.map((style) => (
                <SelectItem key={style.value} value={style.value} className="text-xs">
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={borderWidth} onValueChange={(value) => onChange("borderWidth", value + "px")}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {borderWidths.map((width) => (
                <SelectItem key={width.value} value={width.value} className="text-xs">
                  {width.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Border Color */}
        {borderStyle !== "none" && borderWidth !== "0" && (
          <div className="flex items-center gap-2 mb-3">
            <Label className="text-xs">Color</Label>
            <div className="flex items-center gap-2 flex-1">
              <div className="relative">
                <Input
                  type="color"
                  value={borderColor}
                  onChange={(e) => onChange("borderColor", e.target.value)}
                  className="h-8 w-8 p-0 border-0 cursor-pointer"
                />
              </div>
              <Input
                type="text"
                value={borderColor}
                onChange={(e) => onChange("borderColor", e.target.value)}
                className="h-8 flex-1 text-xs font-mono"
                placeholder="#000000"
              />
            </div>
          </div>
        )}

        {/* Border Radius */}
        <div>
          <Label className="text-xs font-medium mb-2 block">Corners</Label>
          <div className="space-y-2">
            <ToggleGroup 
              type="single" 
              value={matchingPreset?.value || "custom"}
              onValueChange={(value) => {
                if (value !== "custom") {
                  onChange("borderRadius", value + "px");
                }
              }}
              className="h-8 w-full"
            >
              {borderRadiusPresets.map((preset) => {
                const Icon = preset.icon;
                return (
                  <ToggleGroupItem 
                    key={preset.value}
                    value={preset.value} 
                    className="h-8 flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                  >
                    <Icon className="h-3 w-3" />
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
            
            {/* Custom radius input */}
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={currentRadius}
                onChange={(e) => onChange("borderRadius", e.target.value + "px")}
                className="h-8 text-xs"
                placeholder="0"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}