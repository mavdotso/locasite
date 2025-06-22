"use client";

import React from "react";
import { Label } from "@/app/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface TypographyControlProps {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textAlign?: string;
  onChange: (property: string, value: string) => void;
}

const fontFamilies = [
  { value: "font-sans", label: "Sans Serif" },
  { value: "font-serif", label: "Serif" },
  { value: "font-mono", label: "Monospace" },
];

const fontSizes = [
  { value: "text-xs", label: "Extra Small" },
  { value: "text-sm", label: "Small" },
  { value: "text-base", label: "Base" },
  { value: "text-lg", label: "Large" },
  { value: "text-xl", label: "Extra Large" },
  { value: "text-2xl", label: "2X Large" },
  { value: "text-3xl", label: "3X Large" },
  { value: "text-4xl", label: "4X Large" },
];

export default function TypographyControl({
  fontFamily = "font-sans",
  fontSize = "text-base",
  fontWeight = "normal",
  fontStyle = "normal",
  textDecoration = "none",
  textAlign = "left",
  onChange
}: TypographyControlProps) {
  const isBold = fontWeight === "bold" || fontWeight === "700";
  const isItalic = fontStyle === "italic";
  const isUnderline = textDecoration === "underline";

  const handleStyleToggle = (styles: string[]) => {
    if (styles.includes("bold")) {
      onChange("fontWeight", isBold ? "normal" : "bold");
    }
    if (styles.includes("italic")) {
      onChange("fontStyle", isItalic ? "normal" : "italic");
    }
    if (styles.includes("underline")) {
      onChange("textDecoration", isUnderline ? "none" : "underline");
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs font-medium mb-2 block">Typography</Label>
        
        {/* Font Family & Size */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <Select value={fontFamily} onValueChange={(value) => onChange("fontFamily", value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value} className="text-xs">
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={fontSize} onValueChange={(value) => onChange("fontSize", value)}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size.value} value={size.value} className="text-xs">
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Style Buttons */}
        <div className="flex gap-1 mb-2">
          <ToggleGroup 
            type="multiple" 
            value={[
              ...(isBold ? ["bold"] : []),
              ...(isItalic ? ["italic"] : []),
              ...(isUnderline ? ["underline"] : [])
            ]}
            onValueChange={handleStyleToggle}
            className="h-8"
          >
            <ToggleGroupItem 
              value="bold" 
              className="h-8 w-8 p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Bold className="h-3 w-3" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="italic" 
              className="h-8 w-8 p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Italic className="h-3 w-3" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="underline" 
              className="h-8 w-8 p-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Underline className="h-3 w-3" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Alignment */}
        <ToggleGroup 
          type="single" 
          value={textAlign}
          onValueChange={(value) => onChange("textAlign", value)}
          className="h-8 w-full"
        >
          <ToggleGroupItem 
            value="left" 
            className="h-8 flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <AlignLeft className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="center" 
            className="h-8 flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <AlignCenter className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="right" 
            className="h-8 flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <AlignRight className="h-3 w-3" />
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="justify" 
            className="h-8 flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <AlignJustify className="h-3 w-3" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}