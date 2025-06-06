"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TypographyEditorProps {
  value: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    lineHeight?: number;
    letterSpacing?: number;
    textAlign?: string;
    color?: string;
    textTransform?: string;
  };
  onChange: (value: any) => void;
  className?: string;
}

const FONT_FAMILIES = [
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: "Open Sans, sans-serif" },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Source Sans Pro", value: "Source Sans Pro, sans-serif" },
  { label: "Oswald", value: "Oswald, sans-serif" },
  { label: "Raleway", value: "Raleway, sans-serif" },
  { label: "PT Sans", value: "PT Sans, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Merriweather", value: "Merriweather, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "Times New Roman, serif" },
];

const FONT_WEIGHTS = [
  { label: "Thin", value: "100" },
  { label: "Extra Light", value: "200" },
  { label: "Light", value: "300" },
  { label: "Normal", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
  { label: "Black", value: "900" },
];

export function TypographyEditor({ value, onChange, className }: TypographyEditorProps) {
  const [activeStyles, setActiveStyles] = useState({
    bold: value.fontWeight === "700" || value.fontWeight === "bold",
    italic: false, // Would need to track this separately
    underline: false, // Would need to track this separately
  });

  const handleChange = (field: string, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const toggleStyle = (style: string) => {
    const newActiveStyles = { ...activeStyles, [style]: !activeStyles[style] };
    setActiveStyles(newActiveStyles);

    if (style === "bold") {
      handleChange("fontWeight", newActiveStyles.bold ? "700" : "400");
    }
    // Handle other styles as needed
  };

  const setAlignment = (align: string) => {
    handleChange("textAlign", align);
  };

  return (
    <div className={cn("space-y-4 p-4 bg-white border rounded-lg shadow-sm", className)}>
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Typography</h3>
        
        {/* Font Family */}
        <div className="space-y-2">
          <Label className="text-xs">Font Family</Label>
          <Select
            value={value.fontFamily}
            onValueChange={(val) => handleChange("fontFamily", val)}
          >
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <Label className="text-xs">Font Size</Label>
          <div className="flex items-center space-x-2">
            <Slider
              value={[value.fontSize || 16]}
              onValueChange={([val]) => handleChange("fontSize", val)}
              min={8}
              max={72}
              step={1}
              className="flex-1"
            />
            <Input
              type="number"
              value={value.fontSize || 16}
              onChange={(e) => handleChange("fontSize", parseInt(e.target.value))}
              className="w-16 h-8"
              min="8"
              max="72"
            />
          </div>
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <Label className="text-xs">Font Weight</Label>
          <Select
            value={value.fontWeight || "400"}
            onValueChange={(val) => handleChange("fontWeight", val)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map((weight) => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <Label className="text-xs">Line Height</Label>
          <div className="flex items-center space-x-2">
            <Slider
              value={[value.lineHeight || 1.5]}
              onValueChange={([val]) => handleChange("lineHeight", val)}
              min={0.8}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <Input
              type="number"
              value={value.lineHeight || 1.5}
              onChange={(e) => handleChange("lineHeight", parseFloat(e.target.value))}
              className="w-16 h-8"
              min="0.8"
              max="3"
              step="0.1"
            />
          </div>
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <Label className="text-xs">Letter Spacing</Label>
          <div className="flex items-center space-x-2">
            <Slider
              value={[value.letterSpacing || 0]}
              onValueChange={([val]) => handleChange("letterSpacing", val)}
              min={-2}
              max={5}
              step={0.1}
              className="flex-1"
            />
            <Input
              type="number"
              value={value.letterSpacing || 0}
              onChange={(e) => handleChange("letterSpacing", parseFloat(e.target.value))}
              className="w-16 h-8"
              min="-2"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <Label className="text-xs">Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              value={value.color || "#000000"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="w-12 h-8 p-1"
            />
            <Input
              type="text"
              value={value.color || "#000000"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="flex-1 h-8"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Style Toggles */}
        <div className="space-y-2">
          <Label className="text-xs">Style</Label>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={activeStyles.bold ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => toggleStyle("bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={activeStyles.italic ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => toggleStyle("italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={activeStyles.underline ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => toggleStyle("underline")}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Text Alignment */}
        <div className="space-y-2">
          <Label className="text-xs">Alignment</Label>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={value.textAlign === "left" ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => setAlignment("left")}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={value.textAlign === "center" ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => setAlignment("center")}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={value.textAlign === "right" ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => setAlignment("right")}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={value.textAlign === "justify" ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => setAlignment("justify")}
            >
              <AlignJustify className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <Label className="text-xs">Transform</Label>
          <Select
            value={value.textTransform || "none"}
            onValueChange={(val) => handleChange("textTransform", val)}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="lowercase">lowercase</SelectItem>
              <SelectItem value="capitalize">Capitalize</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}