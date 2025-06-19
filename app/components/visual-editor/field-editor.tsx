"use client";

import React from "react";
import { ComponentData } from "./types";
import { componentConfigs } from "./config/components";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import TextField from "./fields/text-field";
import TextareaField from "./fields/textarea-field";
import ImageField from "./fields/image-field";
import ColorField from "./fields/color-field";
import SelectField from "./fields/select-field";
import NumberField from "./fields/number-field";
import ArrayField from "./fields/array-field";
import LayoutControls from "./layout-controls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutOptions } from "./types";

interface FieldEditorProps {
  component: ComponentData | null;
  onUpdate: (props: Record<string, unknown>) => void;
  onUpdateLayout: (layout: LayoutOptions) => void;
  onClose: () => void;
  businessId: string;
}

export default function FieldEditor({ 
  component, 
  onUpdate,
  onUpdateLayout, 
  onClose,
  businessId 
}: FieldEditorProps) {
  if (!component) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground text-center">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

  const config = componentConfigs[component.type];
  if (!config) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">
          Unknown component type: {component.type}
        </p>
      </div>
    );
  }

  const handleFieldChange = (fieldName: string, value: unknown) => {
    onUpdate({
      ...component.props,
      [fieldName]: value
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-sm">
            Edit {component.type.replace(/Block$/, "")}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Customize component
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
          <TabsTrigger value="layout" className="flex-1">Layout</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {Object.entries(config.fields).map(([fieldName, field]) => {
            const value = component.props[fieldName] ?? field.defaultValue;

            switch (field.type) {
              case "text":
                return (
                  <TextField
                    key={fieldName}
                    field={field}
                    value={value as string || ""}
                    onChange={(val) => handleFieldChange(fieldName, val)}
                  />
                );

              case "textarea":
                return (
                  <TextareaField
                    key={fieldName}
                    field={field}
                    value={value as string || ""}
                    onChange={(val) => handleFieldChange(fieldName, val)}
                  />
                );

              case "image":
                return (
                  <ImageField
                    key={fieldName}
                    field={field}
                    value={value as string || ""}
                    onChange={(val) => handleFieldChange(fieldName, val)}
                    businessId={businessId}
                  />
                );

              case "color":
                return (
                  <ColorField
                    key={fieldName}
                    field={field}
                    value={value as string || ""}
                    onChange={(val) => handleFieldChange(fieldName, val)}
                  />
                );

              case "select":
                return (
                  <SelectField
                    key={fieldName}
                    field={field}
                    value={value as string || ""}
                    onChange={(val) => handleFieldChange(fieldName, val)}
                  />
                );

              case "number":
                return (
                  <NumberField
                    key={fieldName}
                    field={field}
                    value={value as number || 0}
                    onChange={(val) => handleFieldChange(fieldName, val)}
                  />
                );

              case "array":
                return (
                  <ArrayField
                    key={fieldName}
                    field={field}
                    value={value as unknown[] || []}
                    onChange={(val) => handleFieldChange(fieldName, val)}
                    businessId={businessId}
                  />
                );

              default:
                return null;
            }
          })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layout" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <LayoutControls
              layout={component.layout || {}}
              onChange={onUpdateLayout}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}