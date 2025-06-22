"use client";

import React from "react";
import { LayoutOptions } from "./types";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { 
  SizeControl, 
  SpacingControl, 
  BorderControl,
  TypographyControl
} from "./field-controls";
import { 
  Palette,
  Image,
  Blend,
  Layout,
  Type,
  Square
} from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Switch } from "@/app/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { ScrollArea } from "@/app/components/ui/scroll-area";

interface LayoutControlsEnhancedProps {
  layout: LayoutOptions;
  onChange: (layout: LayoutOptions) => void;
  showTypography?: boolean;
}

export default function LayoutControlsEnhanced({ 
  layout, 
  onChange,
  showTypography = false 
}: LayoutControlsEnhancedProps) {
  const handleChange = (key: keyof LayoutOptions, value: unknown) => {
    onChange({
      ...layout,
      [key]: value
    });
  };

  const handleSpacingChange = (type: "padding" | "margin", values: Record<string, string>) => {
    handleChange(type, `${values.top || "0"} ${values.right || "0"} ${values.bottom || "0"} ${values.left || "0"}`);
  };

  const handleTypographyChange = (property: string, value: string) => {
    handleChange(property as keyof LayoutOptions, value);
  };

  const handleBorderChange = (property: string, value: string) => {
    handleChange(property as keyof LayoutOptions, value);
  };

  // Parse spacing string to object
  const parseSpacing = (spacing?: string) => {
    if (!spacing) return { top: "0", right: "0", bottom: "0", left: "0" };
    const parts = spacing.split(" ").filter(Boolean);
    if (parts.length === 1) {
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    } else if (parts.length === 2) {
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    } else if (parts.length === 3) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
    } else {
      return { top: parts[0] || "0", right: parts[1] || "0", bottom: parts[2] || "0", left: parts[3] || "0" };
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="size" className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none h-auto p-1 grid grid-cols-4 gap-1">
          <TabsTrigger 
            value="size" 
            className="flex flex-col gap-1 h-auto py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Square className="h-4 w-4" />
            <span className="text-xs">Size</span>
          </TabsTrigger>
          <TabsTrigger 
            value="spacing" 
            className="flex flex-col gap-1 h-auto py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Layout className="h-4 w-4" />
            <span className="text-xs">Spacing</span>
          </TabsTrigger>
          <TabsTrigger 
            value="style" 
            className="flex flex-col gap-1 h-auto py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Palette className="h-4 w-4" />
            <span className="text-xs">Style</span>
          </TabsTrigger>
          {showTypography && (
            <TabsTrigger 
              value="typography" 
              className="flex flex-col gap-1 h-auto py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Type className="h-4 w-4" />
              <span className="text-xs">Text</span>
            </TabsTrigger>
          )}
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="size" className="m-0 p-4 space-y-4">
            <SizeControl
              label="Width"
              type="width"
              value={layout.width}
              onChange={(value) => handleChange("width", value)}
            />
            <SizeControl
              label="Height"
              type="height"
              value={layout.height}
              onChange={(value) => handleChange("height", value)}
            />
            
            <div className="space-y-2">
              <Label className="text-xs font-medium">Display</Label>
              <Select
                value={layout.display || "block"}
                onValueChange={(value) => handleChange("display", value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="block">Block</SelectItem>
                  <SelectItem value="flex">Flex</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="inline">Inline</SelectItem>
                  <SelectItem value="inline-block">Inline Block</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {layout.display === "flex" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Direction</Label>
                  <Select
                    value={layout.direction || "column"}
                    onValueChange={(value) => handleChange("direction", value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="row">Row</SelectItem>
                      <SelectItem value="row-reverse">Row Reverse</SelectItem>
                      <SelectItem value="column">Column</SelectItem>
                      <SelectItem value="column-reverse">Column Reverse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Align Items</Label>
                  <Select
                    value={layout.align || "stretch"}
                    onValueChange={(value) => handleChange("align", value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="end">End</SelectItem>
                      <SelectItem value="stretch">Stretch</SelectItem>
                      <SelectItem value="baseline">Baseline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Justify Content</Label>
                  <Select
                    value={layout.justify || "start"}
                    onValueChange={(value) => handleChange("justify", value)}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start">Start</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="end">End</SelectItem>
                      <SelectItem value="between">Space Between</SelectItem>
                      <SelectItem value="around">Space Around</SelectItem>
                      <SelectItem value="evenly">Space Evenly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Gap</Label>
                  <Input
                    type="number"
                    value={layout.gap?.replace(/\D/g, "") || ""}
                    onChange={(e) => handleChange("gap", e.target.value ? `${e.target.value}px` : undefined)}
                    placeholder="0"
                    className="h-8"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="fullWidth" className="text-xs font-medium">Full Width</Label>
              <Switch
                id="fullWidth"
                checked={layout.fullWidth || false}
                onCheckedChange={(checked) => handleChange("fullWidth", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="m-0 p-4">
            <SpacingControl
              padding={parseSpacing(layout.padding)}
              margin={parseSpacing(layout.margin)}
              onChange={handleSpacingChange}
            />
          </TabsContent>

          <TabsContent value="style" className="m-0 p-4 space-y-4">
            <BorderControl
              borderWidth={layout.borderWidth}
              borderStyle={layout.borderStyle}
              borderColor={layout.borderColor}
              borderRadius={layout.borderRadius}
              onChange={handleBorderChange}
            />

            {/* Background Section */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Background</Label>
              
              <Tabs 
                value={layout.background?.type || "color"} 
                onValueChange={(value) => {
                  const currentValue = layout.background?.value || "";
                  let newValue = currentValue;
                  
                  if (value === "color" && (!currentValue || layout.background?.type !== "color")) {
                    newValue = "#ffffff";
                  } else if (value === "gradient" && (!currentValue || layout.background?.type !== "gradient")) {
                    newValue = "linear-gradient(to bottom, #ffffff, #f0f0f0)";
                  } else if (value === "image" && (!currentValue || layout.background?.type !== "image")) {
                    newValue = "";
                  }
                  
                  handleChange("background", { type: value as "color" | "gradient" | "image", value: newValue });
                }}
                className="w-full"
              >
                <TabsList className="w-full grid grid-cols-3 h-auto p-0.5">
                  <TabsTrigger value="color" className="text-xs gap-1 py-1">
                    <Palette className="h-3 w-3" />
                    Color
                  </TabsTrigger>
                  <TabsTrigger value="gradient" className="text-xs gap-1 py-1">
                    <Blend className="h-3 w-3" />
                    Gradient
                  </TabsTrigger>
                  <TabsTrigger value="image" className="text-xs gap-1 py-1">
                    <Image className="h-3 w-3" />
                    Image
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="color" className="mt-2">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={layout.background?.type === "color" ? layout.background.value : "#ffffff"}
                        onChange={(e) => handleChange("background", { type: "color", value: e.target.value })}
                        className="h-8 w-8 p-0 border-0"
                      />
                      <Input
                        type="text"
                        value={layout.background?.type === "color" ? layout.background.value : "#ffffff"}
                        onChange={(e) => handleChange("background", { type: "color", value: e.target.value })}
                        className="h-8 flex-1 text-xs font-mono"
                        placeholder="#000000"
                      />
                    </div>
                    <div className="grid grid-cols-8 gap-1">
                      {["#ffffff", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563", "#374151",
                        "#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#000000"].map((color) => (
                        <button
                          key={color}
                          className="w-full aspect-square rounded border border-border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => handleChange("background", { type: "color", value: color })}
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="gradient" className="mt-2">
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { name: "Sky", value: "linear-gradient(to bottom, #87CEEB, #ffffff)" },
                        { name: "Sunset", value: "linear-gradient(to bottom, #ff7e5f, #feb47b)" },
                        { name: "Ocean", value: "linear-gradient(to bottom, #2193b0, #6dd5ed)" },
                        { name: "Purple", value: "linear-gradient(to bottom, #667eea, #764ba2)" }
                      ].map((gradient) => (
                        <button
                          key={gradient.name}
                          className="h-10 rounded border border-border hover:scale-105 transition-transform text-xs font-medium text-white"
                          style={{ background: gradient.value }}
                          onClick={() => handleChange("background", { type: "gradient", value: gradient.value })}
                        >
                          {gradient.name}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="text"
                      placeholder="Custom gradient"
                      value={layout.background?.type === "gradient" ? layout.background.value : ""}
                      onChange={(e) => handleChange("background", { type: "gradient", value: e.target.value })}
                      className="text-xs h-8"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="image" className="mt-2">
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="Image URL"
                      value={layout.background?.type === "image" ? layout.background.value : ""}
                      onChange={(e) => handleChange("background", { type: "image", value: e.target.value })}
                      className="text-xs h-8"
                    />
                    {layout.background?.type === "image" && layout.background.value && (
                      <img 
                        src={layout.background.value}
                        alt="Background preview"
                        className="h-16 w-full rounded border object-cover"
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Opacity</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="range"
                  min="0"
                  max="100"
                  value={(layout.opacity || 1) * 100}
                  onChange={(e) => handleChange("opacity", Number(e.target.value) / 100)}
                  className="flex-1"
                />
                <span className="text-xs w-10 text-right">{Math.round((layout.opacity || 1) * 100)}%</span>
              </div>
            </div>
          </TabsContent>

          {showTypography && (
            <TabsContent value="typography" className="m-0 p-4">
              <TypographyControl
                fontFamily={layout.fontFamily}
                fontSize={layout.fontSize}
                fontWeight={layout.fontWeight}
                fontStyle={layout.fontStyle}
                textDecoration={layout.textDecoration}
                textAlign={layout.textAlign}
                onChange={handleTypographyChange}
              />
            </TabsContent>
          )}
        </ScrollArea>
      </Tabs>
    </div>
  );
}