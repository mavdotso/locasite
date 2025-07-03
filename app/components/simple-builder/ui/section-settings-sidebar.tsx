"use client";

import React from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

import { Palette, Type, Image, Layout } from "lucide-react";
import { SimpleComponentData } from "../types/simple-builder";
import type { SimpleStyleOptions } from "../types/simple-builder";
import { getVariationById } from "../sections/section-variations";

interface SectionSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sectionData?: SimpleComponentData;
  variationId?: string;
  onUpdate: (data: SimpleComponentData) => void;
}

export function SectionSettingsSidebar({
  isOpen,
  onClose,
  sectionData,
  variationId,
  onUpdate,
}: SectionSettingsSidebarProps) {
  const [localData, setLocalData] = React.useState<SimpleComponentData | null>(
    null,
  );

  React.useEffect(() => {
    if (sectionData) {
      setLocalData(JSON.parse(JSON.stringify(sectionData))); // Deep clone
    }
  }, [sectionData]);

  if (!localData || !variationId) return null;

  const variation = getVariationById(variationId);
  if (!variation) return null;

  const handleContentChange = (path: string, value: unknown) => {
    if (!localData) return;

    const newData = { ...localData };
    const keys = path.split(".");
    let current: Record<string, unknown> = newData as unknown as Record<
      string,
      unknown
    >;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }

    current[keys[keys.length - 1]] = value;
    setLocalData(newData);
  };

  const handleStyleChange = (key: keyof SimpleStyleOptions, value: unknown) => {
    if (!localData) return;

    setLocalData({
      ...localData,
      style: {
        ...localData.style,
        [key]: value,
      },
    });
  };

  const handleSave = () => {
    if (localData) {
      onUpdate(localData);
      onClose();
    }
  };

  const getContentValue = (path: string): unknown => {
    if (!localData) return "";

    const keys = path.split(".");
    let current: unknown = localData;

    for (const key of keys) {
      if (current && typeof current === "object" && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return "";
      }
    }

    return current;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Section Settings</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="content" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Style
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4 mt-4">
            {variation.editableFields.map((field) => {
              const value = getContentValue(field);
              const fieldName = field.split(".").pop() || field;

              // Handle different field types
              if (fieldName.includes("image") || fieldName.includes("Image")) {
                return (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="flex items-center gap-2">
                      <Image className="h-4 w-4" aria-label="Image field" />
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      type="url"
                      value={String(value)}
                      onChange={(e) =>
                        handleContentChange(field, e.target.value)
                      }
                      placeholder="Enter image URL"
                    />
                  </div>
                );
              }

              if (
                fieldName.includes("content") ||
                fieldName.includes("description")
              ) {
                return (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                    </Label>
                    <Textarea
                      id={field}
                      value={String(value)}
                      onChange={(e) =>
                        handleContentChange(field, e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                );
              }

              // Default to input
              return (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>
                    {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                  </Label>
                  <Input
                    id={field}
                    value={String(value)}
                    onChange={(e) => handleContentChange(field, e.target.value)}
                  />
                </div>
              );
            })}
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={localData.style?.backgroundColor || "#ffffff"}
                onChange={(e) =>
                  handleStyleChange("backgroundColor", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <Input
                type="color"
                value={localData.style?.textColor || "#000000"}
                onChange={(e) => handleStyleChange("textColor", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <Select
                value={localData.style?.textAlign || "left"}
                onValueChange={(value) => handleStyleChange("textAlign", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={localData.style?.fontSize || "medium"}
                onValueChange={(value) => handleStyleChange("fontSize", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                  <SelectItem value="xlarge">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Padding</Label>
              <Select
                value={localData.style?.padding || "4rem 2rem"}
                onValueChange={(value) => handleStyleChange("padding", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2rem 1rem">Small</SelectItem>
                  <SelectItem value="4rem 2rem">Medium</SelectItem>
                  <SelectItem value="6rem 3rem">Large</SelectItem>
                  <SelectItem value="8rem 4rem">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Margin</Label>
              <Select
                value={localData.style?.margin || "0"}
                onValueChange={(value) => handleStyleChange("margin", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1rem 0">Small</SelectItem>
                  <SelectItem value="2rem 0">Medium</SelectItem>
                  <SelectItem value="4rem 0">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleSave} className="flex-1">
            Save Changes
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
