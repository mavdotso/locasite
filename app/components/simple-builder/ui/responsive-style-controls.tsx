"use client";

import React from "react";
import { cn } from "@/app/lib/utils";
import { Label } from "@/app/components/ui/label";

import { Switch } from "@/app/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
// Define DeviceType locally since responsive-preview was deleted
export type DeviceType = "mobile" | "tablet" | "desktop" | "fullwidth";

export interface ResponsiveStyles {
  mobile?: StyleSettings;
  tablet?: StyleSettings;
  desktop?: StyleSettings;
}

export interface StyleSettings {
  fontSize?: string;
  padding?: string;
  margin?: string;
  textAlign?: "left" | "center" | "right";
  hideOnDevice?: boolean;
  stackVertically?: boolean;
  columnGap?: string;
}

interface ResponsiveStyleControlsProps {
  currentDevice: DeviceType;
  styles: ResponsiveStyles;
  onStyleChangeAction: (device: DeviceType, styles: StyleSettings) => void;
  className?: string;
}

const FONT_SIZE_OPTIONS = [
  { value: "text-xs", label: "Extra Small" },
  { value: "text-sm", label: "Small" },
  { value: "text-base", label: "Base" },
  { value: "text-lg", label: "Large" },
  { value: "text-xl", label: "Extra Large" },
  { value: "text-2xl", label: "2X Large" },
];

const SPACING_OPTIONS = [
  { value: "0", label: "None" },
  { value: "2", label: "0.5rem" },
  { value: "4", label: "1rem" },
  { value: "6", label: "1.5rem" },
  { value: "8", label: "2rem" },
  { value: "12", label: "3rem" },
  { value: "16", label: "4rem" },
];

export function ResponsiveStyleControls({
  currentDevice,
  styles,
  onStyleChangeAction,
  className,
}: ResponsiveStyleControlsProps) {
  if (currentDevice === "fullwidth") return null;

  const deviceKey = currentDevice as keyof ResponsiveStyles;
  const currentStyles = styles[deviceKey] || {};

  const updateStyle = (
    key: keyof StyleSettings,
    value: string | number | boolean | undefined,
  ) => {
    onStyleChangeAction(currentDevice, {
      ...currentStyles,
      [key]: value,
    });
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h3 className="text-sm font-medium mb-4">
          {currentDevice.charAt(0).toUpperCase() + currentDevice.slice(1)}{" "}
          Styles
        </h3>

        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="space-y-4">
            {/* Hide on Device */}
            <div className="flex items-center justify-between">
              <Label htmlFor="hide-on-device">Hide on {currentDevice}</Label>
              <Switch
                id="hide-on-device"
                checked={currentStyles.hideOnDevice || false}
                onCheckedChange={(checked) =>
                  updateStyle("hideOnDevice", checked)
                }
              />
            </div>

            {/* Stack Vertically (for mobile/tablet) */}
            {(currentDevice === "mobile" || currentDevice === "tablet") && (
              <div className="flex items-center justify-between">
                <Label htmlFor="stack-vertically">Stack Vertically</Label>
                <Switch
                  id="stack-vertically"
                  checked={currentStyles.stackVertically || false}
                  onCheckedChange={(checked) =>
                    updateStyle("stackVertically", checked)
                  }
                />
              </div>
            )}

            {/* Column Gap */}
            <div className="space-y-2">
              <Label htmlFor="column-gap">Column Gap</Label>
              <Select
                value={currentStyles.columnGap || "4"}
                onValueChange={(value) => updateStyle("columnGap", value)}
              >
                <SelectTrigger id="column-gap">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPACING_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="typography" className="space-y-4">
            {/* Font Size */}
            <div className="space-y-2">
              <Label htmlFor="font-size">Font Size</Label>
              <Select
                value={currentStyles.fontSize || "text-base"}
                onValueChange={(value) => updateStyle("fontSize", value)}
              >
                <SelectTrigger id="font-size">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Text Alignment */}
            <div className="space-y-2">
              <Label htmlFor="text-align">Text Alignment</Label>
              <Select
                value={currentStyles.textAlign || "left"}
                onValueChange={(value: "left" | "center" | "right") =>
                  updateStyle("textAlign", value)
                }
              >
                <SelectTrigger id="text-align">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4">
            {/* Padding */}
            <div className="space-y-2">
              <Label htmlFor="padding">Padding</Label>
              <Select
                value={currentStyles.padding || "4"}
                onValueChange={(value) => updateStyle("padding", value)}
              >
                <SelectTrigger id="padding">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPACING_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Margin */}
            <div className="space-y-2">
              <Label htmlFor="margin">Margin</Label>
              <Select
                value={currentStyles.margin || "0"}
                onValueChange={(value) => updateStyle("margin", value)}
              >
                <SelectTrigger id="margin">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPACING_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Responsive Breakpoint Info */}
      <div className="p-3 bg-muted rounded-lg text-sm">
        <p className="font-medium mb-1">Breakpoint Info:</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• Mobile: &lt; 640px</li>
          <li>• Tablet: 640px - 1024px</li>
          <li>• Desktop: &gt; 1024px</li>
        </ul>
      </div>
    </div>
  );
}
