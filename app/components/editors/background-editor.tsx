"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BackgroundSettings {
  type?: "color" | "image" | "gradient";
  color?: string;
  image?: string;
  size?: string;
  position?: string;
  repeat?: string;
  gradient?: {
    type: "linear" | "radial";
    direction?: string;
    colors: Array<{ color: string; position: number }>;
  };
  overlay?: {
    color: string;
    opacity: number;
  };
}
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { 
  Upload,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BackgroundEditorProps {
  value: BackgroundSettings;
  onChange: (value: BackgroundSettings) => void;
  className?: string;
}

const PRESET_COLORS = [
  "#ffffff", "#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd",
  "#6c757d", "#495057", "#343a40", "#212529", "#000000", "#ff0000",
  "#ff8c00", "#ffd700", "#00ff00", "#00ffff", "#0000ff", "#8b00ff",
  "#ff1493", "#ff69b4", "#ff6347", "#ff4500", "#32cd32", "#1e90ff"
];

const PRESET_GRADIENTS = [
  {
    name: "Sunset",
    value: "linear-gradient(45deg, #ff6b6b 0%, #ffa500 100%)"
  },
  {
    name: "Ocean",
    value: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
  },
  {
    name: "Forest",
    value: "linear-gradient(45deg, #11998e 0%, #38ef7d 100%)"
  },
  {
    name: "Purple Rain",
    value: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)"
  }
];

export function BackgroundEditor({ value, onChange, className }: BackgroundEditorProps) {
  const [activeTab, setActiveTab] = useState(value.type || "color");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, newValue: unknown) => {
    onChange({ ...value, [field]: newValue });
  };

  const handleTypeChange = (type: string) => {
    setActiveTab(type as "color" | "image" | "gradient");
    onChange({ ...value, type: type as "color" | "image" | "gradient" });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onChange({
          ...value,
          type: "image",
          image: imageUrl
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onChange({
      ...value,
      image: undefined
    });
  };

  return (
    <div className={cn("space-y-4 p-4 bg-white border rounded-lg shadow-sm", className)}>
      <h3 className="font-medium text-sm">Background</h3>
      
      <Tabs value={activeTab} onValueChange={handleTypeChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="color" className="text-xs">Color</TabsTrigger>
          <TabsTrigger value="image" className="text-xs">Image</TabsTrigger>
          <TabsTrigger value="gradient" className="text-xs">Gradient</TabsTrigger>
        </TabsList>

        <TabsContent value="color" className="space-y-3 mt-4">
          <div className="space-y-2">
            <Label className="text-xs">Background Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="color"
                value={value.color || "#ffffff"}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={value.color || "#ffffff"}
                onChange={(e) => handleChange("color", e.target.value)}
                className="flex-1 h-8"
                placeholder="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Preset Colors</Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  className={cn(
                    "w-8 h-8 rounded border-2 transition-all",
                    value.color === color ? "border-blue-500 scale-110" : "border-muted hover:border-muted-foreground"
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange("color", color)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="image" className="space-y-3 mt-4">
          {!value.image ? (
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-24 border-dashed"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Upload Image</p>
                </div>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={value.image}
                  alt="Background"
                  className="w-full h-24 object-cover rounded border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={removeImage}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Size</Label>
                <Select
                  value={value.size || "cover"}
                  onValueChange={(val) => handleChange("size", val)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="100% 100%">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Position</Label>
                <Select
                  value={value.position || "center"}
                  onValueChange={(val) => handleChange("position", val)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="top left">Top Left</SelectItem>
                    <SelectItem value="top right">Top Right</SelectItem>
                    <SelectItem value="bottom left">Bottom Left</SelectItem>
                    <SelectItem value="bottom right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Repeat</Label>
                <Select
                  value={value.repeat || "no-repeat"}
                  onValueChange={(val) => handleChange("repeat", val)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-repeat">No Repeat</SelectItem>
                    <SelectItem value="repeat">Repeat</SelectItem>
                    <SelectItem value="repeat-x">Repeat X</SelectItem>
                    <SelectItem value="repeat-y">Repeat Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {value.image && (
            <div className="space-y-2">
              <Label className="text-xs">Overlay</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={value.overlay?.color || "#000000"}
                    onChange={(e) => handleChange("overlay", { 
                      ...value.overlay, 
                      color: e.target.value 
                    })}
                    className="w-12 h-8 p-1"
                  />
                  <Label className="text-xs">Opacity</Label>
                  <Slider
                    value={[value.overlay?.opacity || 0]}
                    onValueChange={([val]) => handleChange("overlay", { 
                      ...value.overlay, 
                      opacity: val 
                    })}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{value.overlay?.opacity || 0}%</span>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="gradient" className="space-y-3 mt-4">
          <div className="space-y-2">
            <Label className="text-xs">Preset Gradients</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_GRADIENTS.map((gradient) => (
                <button
                  key={gradient.name}
                  className="h-12 rounded border text-xs text-white font-medium hover:border-blue-500 transition-colors"
                  style={{ background: gradient.value }}
                  onClick={() => handleChange("gradient", gradient.value)}
                >
                  {gradient.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Custom Gradient</Label>
            <p className="text-xs text-muted-foreground">
              Advanced gradient editor coming soon...
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}