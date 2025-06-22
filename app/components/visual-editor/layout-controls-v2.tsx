"use client";

import React from "react";
import { LayoutOptions } from "./types";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Slider } from "@/app/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { 
  ChevronDown,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  CornerUpLeft,
  CornerUpRight,
  CornerDownLeft,
  CornerDownRight,
  Minus
} from "lucide-react";
import { cn } from "@/app/lib/utils";

interface LayoutControlsV2Props {
  layout: LayoutOptions;
  onChange: (layout: LayoutOptions) => void;
  showTypography?: boolean;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function Section({ title, children, defaultOpen = true }: SectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border-b border-border/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        <ChevronDown 
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            !isOpen && "-rotate-90"
          )} 
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface SizeInputProps {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SizeInput({ label, value = "Auto", onChange, placeholder = "Auto" }: SizeInputProps) {
  const isAuto = !value || value === "auto" || value === "Auto";
  const numericValue = isAuto ? "" : value.replace(/[^\d.-]/g, "");

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={isAuto ? "secondary" : "outline"}
        size="sm"
        className="h-8 px-3 flex-1"
        onClick={() => onChange("auto")}
      >
        {label === "Width" || label === "Height" ? "Auto" : label}
      </Button>
      <Input
        type="text"
        value={numericValue}
        onChange={(e) => onChange(e.target.value ? `${e.target.value}px` : "auto")}
        placeholder={placeholder}
        className="h-8 w-20 text-center"
        disabled={isAuto}
      />
    </div>
  );
}

export default function LayoutControlsV2({ 
  layout, 
  onChange,
  showTypography = false 
}: LayoutControlsV2Props) {
  const handleChange = (key: keyof LayoutOptions, value: unknown) => {
    onChange({
      ...layout,
      [key]: value
    });
  };

  // Parse spacing values
  const parsePadding = (padding?: string) => {
    if (!padding || padding === "none") return 0;
    return parseInt(padding.replace(/[^\d]/g, "")) || 0;
  };

  const parseSpacing = (spacing?: string) => {
    if (!spacing || spacing === "0") return { top: "0", right: "0", bottom: "0", left: "0" };
    const parts = spacing.split(" ").filter(Boolean);
    if (parts.length === 1) {
      return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
    } else if (parts.length === 2) {
      return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
    } else if (parts.length === 4) {
      return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
    }
    return { top: "0", right: "0", bottom: "0", left: "0" };
  };

  const borderRadius = parseSpacing(layout.borderRadius);

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      {/* Padding Section (Always visible at top) */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <div className="border-2 border-dashed border-primary/30 rounded-lg p-8">
            <div className="absolute top-2 left-1/2 -translate-x-1/2">
              <Input
                type="number"
                value={parsePadding(layout.padding)}
                onChange={(e) => handleChange("padding", e.target.value ? `${e.target.value}px` : "0")}
                className="h-7 w-14 text-center text-xs"
                placeholder="0"
              />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              0
            </div>
            <div className="bg-muted/50 rounded h-8" />
          </div>
        </div>
      </div>

      {/* Size Section */}
      <Section title="Size">
        <div className="grid grid-cols-2 gap-3">
          <SizeInput
            label="Width"
            value={layout.width}
            onChange={(value) => handleChange("width", value)}
          />
          <SizeInput
            label="Height"
            value={layout.height}
            onChange={(value) => handleChange("height", value)}
          />
          <SizeInput
            label="Min W"
            value={layout.minWidth}
            onChange={(value) => handleChange("minWidth", value)}
            placeholder="0"
          />
          <SizeInput
            label="Min H"
            value={layout.minHeight}
            onChange={(value) => handleChange("minHeight", value)}
            placeholder="0"
          />
          <SizeInput
            label="Max W"
            value={layout.maxWidth}
            onChange={(value) => handleChange("maxWidth", value)}
            placeholder="None"
          />
          <SizeInput
            label="Max H"
            value={layout.maxHeight}
            onChange={(value) => handleChange("maxHeight", value)}
            placeholder="None"
          />
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <Label className="text-xs font-normal">Overflow</Label>
          <Select
            value={layout.overflow || "visible"}
            onValueChange={(value) => handleChange("overflow", value)}
          >
            <SelectTrigger className="h-8 w-32">
              <Eye className="h-3 w-3 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
              <SelectItem value="scroll">Scroll</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* Typography Section */}
      {showTypography && (
        <Section title="Typography">
          {/* Text Alignment */}
          <div className="flex gap-1">
            <Button
              type="button"
              variant={layout.textAlign === "left" ? "secondary" : "outline"}
              size="sm"
              className="flex-1 h-8 p-0"
              onClick={() => handleChange("textAlign", "left")}
            >
              <AlignLeft className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={layout.textAlign === "center" ? "secondary" : "outline"}
              size="sm"
              className="flex-1 h-8 p-0"
              onClick={() => handleChange("textAlign", "center")}
            >
              <AlignCenter className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={layout.textAlign === "right" ? "secondary" : "outline"}
              size="sm"
              className="flex-1 h-8 p-0"
              onClick={() => handleChange("textAlign", "right")}
            >
              <AlignRight className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              variant={layout.textAlign === "justify" ? "secondary" : "outline"}
              size="sm"
              className="flex-1 h-8 p-0"
              onClick={() => handleChange("textAlign", "justify")}
            >
              <AlignJustify className="h-3 w-3" />
            </Button>
          </div>

          {/* Font Family */}
          <Select
            value={layout.fontFamily || "Roboto"}
            onValueChange={(value) => handleChange("fontFamily", value)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
            </SelectContent>
          </Select>

          {/* Font Weight and Size */}
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={layout.fontWeight || "Regular"}
              onValueChange={(value) => handleChange("fontWeight", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Thin">Thin</SelectItem>
                <SelectItem value="Light">Light</SelectItem>
                <SelectItem value="Regular">Regular</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Semibold">Semibold</SelectItem>
                <SelectItem value="Bold">Bold</SelectItem>
                <SelectItem value="Black">Black</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={layout.fontSize?.replace(/[^\d]/g, "") || "20"}
                onChange={(e) => handleChange("fontSize", `${e.target.value}px`)}
                className="h-8 flex-1"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>

          {/* Line Height and Letter Spacing */}
          <div className="grid grid-cols-2 gap-2">
            <SizeInput
              label="Height"
              value={layout.lineHeight}
              onChange={(value) => handleChange("lineHeight", value)}
              placeholder="Auto"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={layout.letterSpacing?.replace(/[^\d.-]/g, "") || "0"}
                onChange={(e) => handleChange("letterSpacing", `${e.target.value}px`)}
                className="h-8 flex-1"
                placeholder="0"
              />
              <span className="text-xs text-muted-foreground">Spacing</span>
            </div>
          </div>
        </Section>
      )}

      {/* Backgrounds Section */}
      <Section title="Backgrounds">
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-normal mb-2 block">Color</Label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-white" />
              <Input
                type="text"
                value={layout.backgroundColor || "FFFFFF"}
                onChange={(e) => handleChange("backgroundColor", `#${e.target.value.replace("#", "")}`)}
                className="h-8 flex-1 font-mono text-xs"
                placeholder="FFFFFF"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-normal mb-2 block">Clipping</Label>
            <Select
              value={layout.backgroundClip || "none"}
              onValueChange={(value) => handleChange("backgroundClip", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="padding-box">Padding Box</SelectItem>
                <SelectItem value="border-box">Border Box</SelectItem>
                <SelectItem value="content-box">Content Box</SelectItem>
                <SelectItem value="text">Text</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Borders Section */}
      <Section title="Borders">
        {/* Border Radius Visual */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
              <CornerUpLeft className="absolute top-2 left-2 h-3 w-3 text-muted-foreground" />
              <Input
                type="number"
                value={borderRadius.top?.replace(/[^\d]/g, "") || "0"}
                onChange={(e) => {
                  const newRadius = { ...borderRadius, top: `${e.target.value}px`, left: `${e.target.value}px` };
                  handleChange("borderRadius", `${newRadius.top} ${newRadius.top} ${newRadius.bottom || "0"} ${newRadius.bottom || "0"}`);
                }}
                className="h-6 w-12 text-center text-xs"
                placeholder="0"
              />
            </div>
          </div>
          <div className="relative">
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
              <CornerUpRight className="absolute top-2 right-2 h-3 w-3 text-muted-foreground" />
              <Input
                type="number"
                value={borderRadius.top?.replace(/[^\d]/g, "") || "0"}
                onChange={(e) => {
                  const newRadius = { ...borderRadius, top: `${e.target.value}px`, right: `${e.target.value}px` };
                  handleChange("borderRadius", `${newRadius.top} ${newRadius.top} ${newRadius.bottom || "0"} ${newRadius.bottom || "0"}`);
                }}
                className="h-6 w-12 text-center text-xs"
                placeholder="0"
              />
            </div>
          </div>
          <div className="relative">
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
              <CornerDownLeft className="absolute bottom-2 left-2 h-3 w-3 text-muted-foreground" />
              <Input
                type="number"
                value={borderRadius.bottom?.replace(/[^\d]/g, "") || "0"}
                onChange={(e) => {
                  const newRadius = { ...borderRadius, bottom: `${e.target.value}px`, left: `${e.target.value}px` };
                  handleChange("borderRadius", `${borderRadius.top || "0"} ${borderRadius.top || "0"} ${newRadius.bottom} ${newRadius.bottom}`);
                }}
                className="h-6 w-12 text-center text-xs"
                placeholder="0"
              />
            </div>
          </div>
          <div className="relative">
            <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg h-20 flex items-center justify-center">
              <CornerDownRight className="absolute bottom-2 right-2 h-3 w-3 text-muted-foreground" />
              <Input
                type="number"
                value={borderRadius.bottom?.replace(/[^\d]/g, "") || "0"}
                onChange={(e) => {
                  const newRadius = { ...borderRadius, bottom: `${e.target.value}px`, right: `${e.target.value}px` };
                  handleChange("borderRadius", `${borderRadius.top || "0"} ${borderRadius.top || "0"} ${newRadius.bottom} ${newRadius.bottom}`);
                }}
                className="h-6 w-12 text-center text-xs"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Border Style */}
        <div className="flex items-center justify-between">
          <Label className="text-xs font-normal">Border Style</Label>
          <div className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-muted-foreground" />
            <Select
              value={layout.borderStyle || "solid"}
              onValueChange={(value) => handleChange("borderStyle", value)}
            >
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
                <SelectItem value="double">Double</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Border Width */}
        {layout.borderStyle && layout.borderStyle !== "none" && (
          <div className="flex items-center justify-between mt-3">
            <Label className="text-xs font-normal">Border Width</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={layout.borderWidth?.replace(/[^\d]/g, "") || "1"}
                onChange={(e) => handleChange("borderWidth", `${e.target.value}px`)}
                className="h-8 w-16 text-center"
                placeholder="1"
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
          </div>
        )}

        {/* Border Color */}
        {layout.borderStyle && layout.borderStyle !== "none" && (
          <div className="flex items-center justify-between mt-3">
            <Label className="text-xs font-normal">Border Color</Label>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded border border-border" 
                style={{ backgroundColor: layout.borderColor || "#000000" }}
              />
              <Input
                type="text"
                value={(layout.borderColor || "#000000").replace("#", "")}
                onChange={(e) => handleChange("borderColor", `#${e.target.value.replace("#", "")}`)}
                className="h-8 w-24 font-mono text-xs"
                placeholder="000000"
              />
            </div>
          </div>
        )}
      </Section>

      {/* Effects Section */}
      <Section title="Effects">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-normal mb-2 block">Opacity</Label>
            <div className="flex items-center gap-3">
              <Slider
                value={[(layout.opacity || 1) * 100]}
                onValueChange={([value]) => handleChange("opacity", value / 100)}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-xs w-10 text-right">{Math.round((layout.opacity || 1) * 100)}%</span>
            </div>
          </div>

          <div>
            <Label className="text-xs font-normal mb-2 block">Blend Mode</Label>
            <Select
              value={layout.mixBlendMode || "normal"}
              onValueChange={(value) => handleChange("mixBlendMode", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
                <SelectItem value="darken">Darken</SelectItem>
                <SelectItem value="lighten">Lighten</SelectItem>
                <SelectItem value="color-dodge">Color Dodge</SelectItem>
                <SelectItem value="color-burn">Color Burn</SelectItem>
                <SelectItem value="hard-light">Hard Light</SelectItem>
                <SelectItem value="soft-light">Soft Light</SelectItem>
                <SelectItem value="difference">Difference</SelectItem>
                <SelectItem value="exclusion">Exclusion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Layout Section */}
      <Section title="Layout">
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-normal mb-2 block">Display</Label>
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
                <SelectItem value="inline-flex">Inline Flex</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {layout.display === "flex" && (
            <>
              <div>
                <Label className="text-xs font-normal mb-2 block">Direction</Label>
                <Select
                  value={layout.flexDirection || "row"}
                  onValueChange={(value) => handleChange("flexDirection", value)}
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

              <div>
                <Label className="text-xs font-normal mb-2 block">Align Items</Label>
                <Select
                  value={layout.alignItems || "stretch"}
                  onValueChange={(value) => handleChange("alignItems", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                    <SelectItem value="baseline">Baseline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-normal mb-2 block">Justify Content</Label>
                <Select
                  value={layout.justifyContent || "flex-start"}
                  onValueChange={(value) => handleChange("justifyContent", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                    <SelectItem value="space-evenly">Space Evenly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-normal mb-2 block">Gap</Label>
                <Input
                  type="number"
                  value={layout.gap?.replace(/[^\d]/g, "") || "0"}
                  onChange={(e) => handleChange("gap", e.target.value ? `${e.target.value}px` : "0")}
                  className="h-8"
                  placeholder="0"
                />
              </div>
            </>
          )}

          <div>
            <Label className="text-xs font-normal mb-2 block">Position</Label>
            <Select
              value={layout.position || "static"}
              onValueChange={(value) => handleChange("position", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="relative">Relative</SelectItem>
                <SelectItem value="absolute">Absolute</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="sticky">Sticky</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>
    </div>
  );
}