"use client";

import React from "react";
import { LayoutOptions } from "./types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  AlignStartHorizontal, 
  AlignCenterHorizontal, 
  AlignEndHorizontal,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Maximize2
} from "lucide-react";

interface LayoutControlsProps {
  layout: LayoutOptions;
  onChange: (layout: LayoutOptions) => void;
}

const gapOptions = [
  { value: "none", label: "None", pixels: "0" },
  { value: "small", label: "Small", pixels: "8px" },
  { value: "medium", label: "Medium", pixels: "16px" },
  { value: "large", label: "Large", pixels: "32px" }
];

const spacingOptions = [
  { value: "none", label: "None", pixels: "0" },
  { value: "small", label: "Small", pixels: "16px" },
  { value: "medium", label: "Medium", pixels: "32px" },
  { value: "large", label: "Large", pixels: "64px" }
];

export default function LayoutControls({ layout, onChange }: LayoutControlsProps) {
  const handleChange = (key: keyof LayoutOptions, value: unknown) => {
    onChange({
      ...layout,
      [key]: value
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
      <div>
        <h4 className="text-sm font-semibold mb-4">Layout Controls</h4>
        
        {/* Direction */}
        <div className="space-y-3">
          <div>
            <Label htmlFor="direction" className="text-xs">Direction</Label>
            <Select
              value={layout.direction || "column"}
              onValueChange={(value) => handleChange("direction", value)}
            >
              <SelectTrigger id="direction" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="column">
                  <div className="flex items-center gap-2">
                    <AlignStartVertical className="h-3 w-3" />
                    Column
                  </div>
                </SelectItem>
                <SelectItem value="row">
                  <div className="flex items-center gap-2">
                    <AlignStartHorizontal className="h-3 w-3" />
                    Row
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alignment */}
          <div>
            <Label htmlFor="align" className="text-xs">
              Align Items {layout.direction === "row" ? "(Vertical)" : "(Horizontal)"}
            </Label>
            <Select
              value={layout.align || "stretch"}
              onValueChange={(value) => handleChange("align", value)}
            >
              <SelectTrigger id="align" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">
                  <div className="flex items-center gap-2">
                    {layout.direction === "row" ? 
                      <AlignStartVertical className="h-3 w-3" /> : 
                      <AlignStartHorizontal className="h-3 w-3" />
                    }
                    Start
                  </div>
                </SelectItem>
                <SelectItem value="center">
                  <div className="flex items-center gap-2">
                    {layout.direction === "row" ? 
                      <AlignCenterVertical className="h-3 w-3" /> : 
                      <AlignCenterHorizontal className="h-3 w-3" />
                    }
                    Center
                  </div>
                </SelectItem>
                <SelectItem value="end">
                  <div className="flex items-center gap-2">
                    {layout.direction === "row" ? 
                      <AlignEndVertical className="h-3 w-3" /> : 
                      <AlignEndHorizontal className="h-3 w-3" />
                    }
                    End
                  </div>
                </SelectItem>
                <SelectItem value="stretch">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-3 w-3" />
                    Stretch
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Justify Content */}
          <div>
            <Label htmlFor="justify" className="text-xs">
              Justify Content {layout.direction === "row" ? "(Horizontal)" : "(Vertical)"}
            </Label>
            <Select
              value={layout.justify || "start"}
              onValueChange={(value) => handleChange("justify", value)}
            >
              <SelectTrigger id="justify" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="start">Start</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="end">End</SelectItem>
                <SelectItem value="between">Space Between</SelectItem>
                <SelectItem value="around">Space Around</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gap */}
          <div>
            <Label htmlFor="gap" className="text-xs">Gap Between Items</Label>
            <Select
              value={layout.gap || "medium"}
              onValueChange={(value) => handleChange("gap", value)}
            >
              <SelectTrigger id="gap" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gapOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {option.pixels}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Padding */}
          <div>
            <Label htmlFor="padding" className="text-xs">Padding</Label>
            <Select
              value={layout.padding || "medium"}
              onValueChange={(value) => handleChange("padding", value)}
            >
              <SelectTrigger id="padding" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spacingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {option.pixels}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Margin */}
          <div>
            <Label htmlFor="margin" className="text-xs">Margin</Label>
            <Select
              value={layout.margin || "none"}
              onValueChange={(value) => handleChange("margin", value)}
            >
              <SelectTrigger id="margin" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {spacingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">
                        {option.pixels}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Full Width */}
          <div className="flex items-center justify-between">
            <Label htmlFor="fullWidth" className="text-xs">Full Width</Label>
            <Switch
              id="fullWidth"
              checked={layout.fullWidth || false}
              onCheckedChange={(checked) => handleChange("fullWidth", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}