"use client";

import React from "react";
import { LayoutOptions } from "@/app/types/visual-editor";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  ChevronDown,
  Eye,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
} from "lucide-react";
import { cn } from "@/app/lib/utils";

interface LayoutControlsProps {
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
    <div className="border-b border-border/50 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            !isOpen && "-rotate-90",
          )}
        />
      </button>
      {isOpen && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  );
}

interface SizeControlProps {
  label: string;
  sublabel: string;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SizeControl({
  label,
  sublabel,
  value = "",
  onChange,
  placeholder = "Auto",
}: SizeControlProps) {
  const isAuto = !value || value === "auto" || value === "Auto";
  const isNone = value === "none" || value === "None";
  const numericValue = isAuto || isNone ? "" : value.replace(/[^\d.-]/g, "");

  const handleToggle = () => {
    if (label === "Auto" || label === "None") {
      // For toggle buttons
      if (isAuto && label === "None") {
        onChange("none");
      } else if (isNone && label === "Auto") {
        onChange("auto");
      } else if (!isAuto && !isNone && label === "Auto") {
        onChange("auto");
      } else if (!isAuto && !isNone && label === "None") {
        onChange("none");
      }
    } else {
      // For input fields - enable/disable
      if (isAuto || isNone) {
        onChange("0px");
      }
    }
  };

  const isToggleButton = label === "Auto" || label === "None";
  const isActive = (label === "Auto" && isAuto) || (label === "None" && isNone);

  if (isToggleButton) {
    return (
      <Button
        type="button"
        variant={isActive ? "secondary" : "outline"}
        size="sm"
        onClick={handleToggle}
        className="h-9 px-4 flex-1 rounded-md"
      >
        <span className="font-normal">{label}</span>
        <span className="ml-2 text-xs text-muted-foreground">{sublabel}</span>
      </Button>
    );
  }

  return (
    <div className="flex-1 relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className="h-9 w-full rounded-md justify-between px-3"
        disabled={isAuto || isNone}
      >
        <span className="font-normal text-muted-foreground">
          {isAuto || isNone ? placeholder : numericValue || "0"}
        </span>
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      </Button>
    </div>
  );
}

// Parse spacing to individual values
function parseSpacing(spacing?: string) {
  if (!spacing || spacing === "0")
    return { top: 0, right: 0, bottom: 0, left: 0 };
  const parts = spacing.split(" ").map((p) => parseInt(p) || 0);
  if (parts.length === 1) {
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  } else if (parts.length === 2) {
    return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  } else if (parts.length === 4) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

export default function LayoutControls({
  layout,
  onChange,
  showTypography = false,
}: LayoutControlsProps) {
  const handleChange = (key: keyof LayoutOptions, value: unknown) => {
    onChange({
      ...layout,
      [key]: value,
    });
  };

  // Padding box model control
  const padding = parseSpacing(layout.padding);
  const handlePaddingChange = (
    side: "top" | "right" | "bottom" | "left",
    value: string,
  ) => {
    const newPadding = { ...padding, [side]: parseInt(value) || 0 };
    handleChange(
      "padding",
      `${newPadding.top}px ${newPadding.right}px ${newPadding.bottom}px ${newPadding.left}px`,
    );
  };

  // Margin box model control
  const margin = parseSpacing(layout.margin);
  const handleMarginChange = (
    side: "top" | "right" | "bottom" | "left",
    value: string,
  ) => {
    const newMargin = { ...margin, [side]: parseInt(value) || 0 };
    handleChange(
      "margin",
      `${newMargin.top}px ${newMargin.right}px ${newMargin.bottom}px ${newMargin.left}px`,
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="pb-4">
        {/* Spacing Section (Padding/Margin) - Always visible at top */}
        <div className="p-4 border-b border-border/50 space-y-6">
          {/* Padding Visual Box */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-3 block">
              Padding
            </Label>
            <div className="relative">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-12 bg-muted/20">
                {/* Top */}
                <Input
                  type="number"
                  value={padding.top}
                  onChange={(e) => handlePaddingChange("top", e.target.value)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 h-8 w-16 text-center text-sm"
                  placeholder="0"
                />
                {/* Right */}
                <Input
                  type="number"
                  value={padding.right}
                  onChange={(e) => handlePaddingChange("right", e.target.value)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-16 text-center text-sm"
                  placeholder="0"
                />
                {/* Bottom */}
                <Input
                  type="number"
                  value={padding.bottom}
                  onChange={(e) =>
                    handlePaddingChange("bottom", e.target.value)
                  }
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 h-8 w-16 text-center text-sm"
                  placeholder="0"
                />
                {/* Left */}
                <Input
                  type="number"
                  value={padding.left}
                  onChange={(e) => handlePaddingChange("left", e.target.value)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-16 text-center text-sm"
                  placeholder="0"
                />
                {/* Inner content box */}
                <div className="bg-background rounded h-12 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Content</span>
                </div>
              </div>
            </div>
          </div>

          {/* Margin Visual Box */}
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-3 block">
              Margin
            </Label>
            <div className="relative">
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-12">
                {/* Top */}
                <Input
                  type="number"
                  value={margin.top}
                  onChange={(e) => handleMarginChange("top", e.target.value)}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-16 text-center text-sm bg-background"
                  placeholder="0"
                />
                {/* Right */}
                <Input
                  type="number"
                  value={margin.right}
                  onChange={(e) => handleMarginChange("right", e.target.value)}
                  className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-16 text-center text-sm bg-background"
                  placeholder="0"
                />
                {/* Bottom */}
                <Input
                  type="number"
                  value={margin.bottom}
                  onChange={(e) => handleMarginChange("bottom", e.target.value)}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 h-8 w-16 text-center text-sm bg-background"
                  placeholder="0"
                />
                {/* Left */}
                <Input
                  type="number"
                  value={margin.left}
                  onChange={(e) => handleMarginChange("left", e.target.value)}
                  className="absolute -left-4 top-1/2 -translate-y-1/2 h-8 w-16 text-center text-sm bg-background"
                  placeholder="0"
                />
                {/* Inner box representing element */}
                <div className="bg-muted rounded h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Size Section */}
        <Section title="Size">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <SizeControl
                label="Auto"
                sublabel="Width"
                value={layout.width}
                onChange={(value) => handleChange("width", value)}
              />
              <SizeControl
                label="Auto"
                sublabel="Height"
                value={layout.height}
                onChange={(value) => handleChange("height", value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SizeControl
                label="0"
                sublabel="Min W"
                value={layout.minWidth}
                onChange={(value) => handleChange("minWidth", value)}
                placeholder="0"
              />
              <SizeControl
                label="0"
                sublabel="Min H"
                value={layout.minHeight}
                onChange={(value) => handleChange("minHeight", value)}
                placeholder="0"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <SizeControl
                label="None"
                sublabel="Max W"
                value={layout.maxWidth}
                onChange={(value) => handleChange("maxWidth", value)}
              />
              <SizeControl
                label="None"
                sublabel="Max H"
                value={layout.maxHeight}
                onChange={(value) => handleChange("maxHeight", value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <Label className="text-xs font-normal text-muted-foreground mb-2 block">
              Overflow
            </Label>
            <Select
              value={layout.overflow || "visible"}
              onValueChange={(value) => handleChange("overflow", value)}
            >
              <SelectTrigger className="h-9">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
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
            {/* Text Alignment - 4 buttons in a row */}
            <div className="grid grid-cols-4 gap-2">
              <Button
                type="button"
                variant={layout.textAlign === "left" ? "secondary" : "outline"}
                size="sm"
                className="h-10 p-0 rounded-md"
                onClick={() => handleChange("textAlign", "left")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={
                  layout.textAlign === "center" ? "secondary" : "outline"
                }
                size="sm"
                className="h-10 p-0 rounded-md"
                onClick={() => handleChange("textAlign", "center")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={layout.textAlign === "right" ? "secondary" : "outline"}
                size="sm"
                className="h-10 p-0 rounded-md"
                onClick={() => handleChange("textAlign", "right")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={
                  layout.textAlign === "justify" ? "secondary" : "outline"
                }
                size="sm"
                className="h-10 p-0 rounded-md"
                onClick={() => handleChange("textAlign", "justify")}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </div>

            {/* Font Family */}
            <Select
              value={layout.fontFamily || "Roboto"}
              onValueChange={(value) => handleChange("fontFamily", value)}
            >
              <SelectTrigger className="h-10 bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Roboto">Roboto</SelectItem>
                <SelectItem value="Inter">Inter</SelectItem>
                <SelectItem value="system-ui">System UI</SelectItem>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="monospace">Monospace</SelectItem>
              </SelectContent>
            </Select>

            {/* Font Weight and Size - 2 columns */}
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={layout.fontWeight || "Regular"}
                onValueChange={(value) => handleChange("fontWeight", value)}
              >
                <SelectTrigger className="h-10 bg-muted/50">
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

              <div className="flex items-center bg-muted/50 rounded-md px-3 h-10">
                <Input
                  type="number"
                  value={layout.fontSize?.replace(/[^\d]/g, "") || "20"}
                  onChange={(e) =>
                    handleChange("fontSize", `${e.target.value}px`)
                  }
                  className="h-full border-0 bg-transparent p-0 text-center flex-1 focus-visible:ring-0"
                  placeholder="20"
                />
                <span className="text-sm text-muted-foreground ml-2">px</span>
              </div>
            </div>

            {/* Line Height and Letter Spacing - 2 columns */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 justify-between px-3 bg-muted/50 border-0"
                onClick={() => {
                  const current = layout.lineHeight;
                  handleChange(
                    "lineHeight",
                    current === "auto" ? "1.5" : "auto",
                  );
                }}
              >
                <span className="font-normal">
                  {layout.lineHeight === "auto"
                    ? "Auto"
                    : layout.lineHeight || "Auto"}
                </span>
                <span className="text-sm text-muted-foreground">Height</span>
              </Button>

              <div className="flex items-center bg-muted/50 rounded-md px-3 h-10">
                <Input
                  type="number"
                  value={layout.letterSpacing?.replace(/[^\d.-]/g, "") || "0"}
                  onChange={(e) =>
                    handleChange("letterSpacing", `${e.target.value}px`)
                  }
                  className="h-full border-0 bg-transparent p-0 text-center flex-1 focus-visible:ring-0"
                  placeholder="0"
                />
                <span className="text-sm text-muted-foreground ml-2">
                  Spacing
                </span>
              </div>
            </div>
          </Section>
        )}

        {/* Backgrounds Section */}
        <Section title="Backgrounds">
          <div className="space-y-3">
            <div>
              <Label className="text-xs font-normal text-muted-foreground mb-2 block">
                Color
              </Label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-border cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: layout.backgroundColor || "#FFFFFF",
                  }}
                  onClick={() => {
                    // You could open a color picker here
                  }}
                />
                <Input
                  type="text"
                  value={(layout.backgroundColor || "#FFFFFF").replace("#", "")}
                  onChange={(e) =>
                    handleChange(
                      "backgroundColor",
                      `#${e.target.value.replace("#", "")}`,
                    )
                  }
                  className="h-9 flex-1 font-mono text-sm uppercase"
                  placeholder="FFFFFF"
                  maxLength={6}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-normal text-muted-foreground mb-2 block">
                Clipping
              </Label>
              <Select
                value={layout.backgroundClip || "None"}
                onValueChange={(value) =>
                  handleChange(
                    "backgroundClip",
                    value === "None" ? undefined : value,
                  )
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="padding-box">Padding Box</SelectItem>
                  <SelectItem value="border-box">Border Box</SelectItem>
                  <SelectItem value="content-box">Content Box</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        {/* Borders Section */}
        <Section title="Borders">
          {/* Border Radius with corner icons - 2x2 grid */}
          <div className="grid grid-cols-2 gap-2">
            {/* Top Left */}
            <div className="relative bg-muted/50 rounded-md h-10">
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 8 Q2 2, 8 2" />
              </svg>
              <Input
                type="number"
                value={
                  layout.borderRadius?.split(" ")[0]?.replace(/[^\d]/g, "") ||
                  "0"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const current = layout.borderRadius
                    ?.split(" ")
                    .map((v) => v.replace(/[^\d]/g, "")) || [
                    "0",
                    "0",
                    "0",
                    "0",
                  ];
                  handleChange(
                    "borderRadius",
                    `${val}px ${current[1] || "0"}px ${current[2] || "0"}px ${current[3] || "0"}px`,
                  );
                }}
                className="h-full border-0 bg-transparent text-center pl-8 pr-3 focus-visible:ring-0"
                placeholder="0"
              />
            </div>

            {/* Top Right */}
            <div className="relative bg-muted/50 rounded-md h-10">
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 2 Q14 2, 14 8" />
              </svg>
              <Input
                type="number"
                value={
                  layout.borderRadius?.split(" ")[1]?.replace(/[^\d]/g, "") ||
                  "0"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const current = layout.borderRadius
                    ?.split(" ")
                    .map((v) => v.replace(/[^\d]/g, "")) || [
                    "0",
                    "0",
                    "0",
                    "0",
                  ];
                  handleChange(
                    "borderRadius",
                    `${current[0] || "0"}px ${val}px ${current[2] || "0"}px ${current[3] || "0"}px`,
                  );
                }}
                className="h-full border-0 bg-transparent text-center pl-8 pr-3 focus-visible:ring-0"
                placeholder="0"
              />
            </div>

            {/* Bottom Left */}
            <div className="relative bg-muted/50 rounded-md h-10">
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2 8 Q2 14, 8 14" />
              </svg>
              <Input
                type="number"
                value={
                  layout.borderRadius?.split(" ")[3]?.replace(/[^\d]/g, "") ||
                  "0"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const current = layout.borderRadius
                    ?.split(" ")
                    .map((v) => v.replace(/[^\d]/g, "")) || [
                    "0",
                    "0",
                    "0",
                    "0",
                  ];
                  handleChange(
                    "borderRadius",
                    `${current[0] || "0"}px ${current[1] || "0"}px ${current[2] || "0"}px ${val}px`,
                  );
                }}
                className="h-full border-0 bg-transparent text-center pl-8 pr-3 focus-visible:ring-0"
                placeholder="0"
              />
            </div>

            {/* Bottom Right */}
            <div className="relative bg-muted/50 rounded-md h-10">
              <svg
                className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 14 Q14 14, 14 8" />
              </svg>
              <Input
                type="number"
                value={
                  layout.borderRadius?.split(" ")[2]?.replace(/[^\d]/g, "") ||
                  "0"
                }
                onChange={(e) => {
                  const val = e.target.value;
                  const current = layout.borderRadius
                    ?.split(" ")
                    .map((v) => v.replace(/[^\d]/g, "")) || [
                    "0",
                    "0",
                    "0",
                    "0",
                  ];
                  handleChange(
                    "borderRadius",
                    `${current[0] || "0"}px ${current[1] || "0"}px ${val}px ${current[3] || "0"}px`,
                  );
                }}
                className="h-full border-0 bg-transparent text-center pl-8 pr-3 focus-visible:ring-0"
                placeholder="0"
              />
            </div>
          </div>

          {/* Border Style */}
          <div className="mt-4">
            <Label className="text-xs font-normal text-muted-foreground mb-2 block">
              Border Style
            </Label>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-muted-foreground" />
              <Select
                value={layout.borderStyle || "solid"}
                onValueChange={(value) => handleChange("borderStyle", value)}
              >
                <SelectTrigger className="h-10 flex-1 bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="solid">Solid</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>
      </div>
    </ScrollArea>
  );
}
