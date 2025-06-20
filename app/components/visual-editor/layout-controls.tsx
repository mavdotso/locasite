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
  Maximize2,
  Palette,
  Image,
  Blend
} from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

        {/* Background Section */}
        <div className="mt-6 pt-6 border-t">
          <Label className="text-xs font-semibold mb-3 block">Background</Label>
          
          <Tabs defaultValue={layout.background?.type || "color"} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-auto p-0.5">
              <TabsTrigger 
                value="color" 
                className="text-xs gap-1.5 py-1.5"
                onClick={() => handleChange("background", { type: "color", value: layout.background?.value || "#ffffff" })}
              >
                <Palette className="h-3 w-3" />
                Color
              </TabsTrigger>
              <TabsTrigger 
                value="gradient" 
                className="text-xs gap-1.5 py-1.5"
                onClick={() => handleChange("background", { type: "gradient", value: layout.background?.value || "linear-gradient(to bottom, #ffffff, #f0f0f0)" })}
              >
                <Blend className="h-3 w-3" />
                Gradient
              </TabsTrigger>
              <TabsTrigger 
                value="image" 
                className="text-xs gap-1.5 py-1.5"
                onClick={() => handleChange("background", { type: "image", value: layout.background?.value || "" })}
              >
                <Image className="h-3 w-3" />
                Image
              </TabsTrigger>
            </TabsList>

            <TabsContent value="color" className="mt-3">
              <div className="space-y-2">
                <Input
                  type="color"
                  value={layout.background?.type === "color" ? layout.background.value : "#ffffff"}
                  onChange={(e) => handleChange("background", { type: "color", value: e.target.value })}
                  className="h-10 w-full"
                />
                <div className="grid grid-cols-6 gap-1">
                  {["#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", 
                    "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#6366f1", "#8b5cf6"].map((color) => (
                    <button
                      key={color}
                      className="w-full h-6 rounded border border-border hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      onClick={() => handleChange("background", { type: "color", value: color })}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gradient" className="mt-3">
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Sky", value: "linear-gradient(to bottom, #87CEEB, #ffffff)" },
                    { name: "Sunset", value: "linear-gradient(to bottom, #ff7e5f, #feb47b)" },
                    { name: "Ocean", value: "linear-gradient(to bottom, #2193b0, #6dd5ed)" },
                    { name: "Purple", value: "linear-gradient(to bottom, #667eea, #764ba2)" },
                    { name: "Green", value: "linear-gradient(to bottom, #84fab0, #8fd3f4)" },
                    { name: "Dark", value: "linear-gradient(to bottom, #232526, #414345)" }
                  ].map((gradient) => (
                    <button
                      key={gradient.name}
                      className="h-12 rounded border border-border hover:scale-105 transition-transform text-xs font-medium text-white"
                      style={{ background: gradient.value }}
                      onClick={() => handleChange("background", { type: "gradient", value: gradient.value })}
                    >
                      {gradient.name}
                    </button>
                  ))}
                </div>
                <Input
                  type="text"
                  placeholder="Custom gradient (e.g., linear-gradient(...))"
                  value={layout.background?.type === "gradient" ? layout.background.value : ""}
                  onChange={(e) => handleChange("background", { type: "gradient", value: e.target.value })}
                  className="text-xs"
                />
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-3">
              <div className="space-y-2">
                <Input
                  type="url"
                  placeholder="Image URL"
                  value={layout.background?.type === "image" ? layout.background.value : ""}
                  onChange={(e) => handleChange("background", { type: "image", value: e.target.value })}
                  className="text-xs"
                />
                {layout.background?.type === "image" && layout.background.value && (
                  <div 
                    className="h-20 rounded border bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${layout.background.value})` }}
                    role="img"
                    aria-label="Background preview"
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  Enter a direct image URL or upload to your storage first
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}