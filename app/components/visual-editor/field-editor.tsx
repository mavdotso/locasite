"use client";

import React from "react";
import { ComponentData } from "./types";
import { allComponentConfigs as componentConfigs } from "./config/all-components";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { LayoutOptions, Field } from "./types";

interface FieldEditorProps {
  component: ComponentData | null;
  onUpdate: (props: Record<string, unknown>) => void;
  onUpdateLayout: (layout: LayoutOptions) => void;
  onClose: () => void;
  businessId: string;
}

interface FieldSection {
  title: string;
  fields: string[];
}

// Group fields into logical sections
function getFieldSections(fields: Record<string, Field>): FieldSection[] {
  const sections: FieldSection[] = [];
  const fieldNames = Object.keys(fields);
  
  // Content fields
  const contentFields = fieldNames.filter(name => 
    ['content', 'text', 'title', 'description', 'caption', 'label', 'subtext', 'message'].includes(name)
  );
  if (contentFields.length > 0) {
    sections.push({ title: "Content", fields: contentFields });
  }
  
  // Media fields
  const mediaFields = fieldNames.filter(name => 
    ['src', 'image', 'backgroundImage', 'logoImage', 'url', 'video'].includes(name)
  );
  if (mediaFields.length > 0) {
    sections.push({ title: "Media", fields: mediaFields });
  }
  
  // Style fields
  const styleFields = fieldNames.filter(name => 
    ['variant', 'style', 'size', 'color', 'backgroundColor', 'textColor', 'align', 'direction'].includes(name)
  );
  if (styleFields.length > 0) {
    sections.push({ title: "Style", fields: styleFields });
  }
  
  // Layout fields
  const layoutFields = fieldNames.filter(name => 
    ['width', 'height', 'padding', 'margin', 'gap', 'columns', 'fullWidth', 'aspectRatio'].includes(name)
  );
  if (layoutFields.length > 0) {
    sections.push({ title: "Layout", fields: layoutFields });
  }
  
  // Other fields
  const usedFields = new Set([...contentFields, ...mediaFields, ...styleFields, ...layoutFields]);
  const otherFields = fieldNames.filter(name => !usedFields.has(name) && !fields[name].hidden);
  if (otherFields.length > 0) {
    sections.push({ title: "Other", fields: otherFields });
  }
  
  return sections;
}

export default function FieldEditor({ 
  component, 
  onUpdate,
  onUpdateLayout, 
  onClose,
  businessId 
}: FieldEditorProps) {
  // Get config and sections before any conditional returns
  const config = component ? componentConfigs[component.type] : null;
  const fieldSections = config ? getFieldSections(config.fields) : [];

  if (!component) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <p className="text-sm text-muted-foreground text-center">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

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

  const renderField = (fieldName: string) => {
    const field = config.fields[fieldName];
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
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div>
          <h3 className="font-semibold text-base">
            {component.type.replace(/Block$/, "")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Component Properties
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="properties" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full rounded-none border-b h-10 flex-shrink-0">
          <TabsTrigger value="properties" className="flex-1 data-[state=active]:shadow-none">
            Properties
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex-1 data-[state=active]:shadow-none">
            Layout
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 mt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {fieldSections.map((section) => {
                return (
                  <div
                    key={section.title}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-medium text-muted-foreground">{section.title}</h4>
                    <div className="space-y-4">
                      {section.fields.map(fieldName => renderField(fieldName))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layout" className="flex-1 mt-0 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">
            <LayoutControls
              layout={component.layout || {}}
              onChange={onUpdateLayout}
              showTypography={component.type === "TextBlock"}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}