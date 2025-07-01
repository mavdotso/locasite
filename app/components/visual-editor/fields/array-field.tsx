"use client";

import React from "react";
import { ArrayField as ArrayFieldType } from "../core/types";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Plus, X } from "lucide-react";
import ImageField from "./image-field";
import { Id } from "@/convex/_generated/dataModel";

interface ArrayFieldProps {
  field: ArrayFieldType;
  value: unknown[];
  onChange: (value: unknown[]) => void;
  businessId: Id<"businesses">;
}

export default function ArrayField({ field, value, onChange, businessId }: ArrayFieldProps) {
  const items = value || field.defaultValue || [];

  const addItem = () => {
    if (field.maxItems && items.length >= field.maxItems) return;
    
    // For accordion/tabs items, create proper object structure
    let defaultValue;
    if (field.label === "Accordion Items") {
      defaultValue = { title: "New Section", content: "Content goes here" };
    } else if (field.label === "Tabs") {
      defaultValue = { label: "New Tab", content: "Tab content goes here" };
    } else {
      defaultValue = field.itemType.defaultValue || "";
    }
    
    onChange([...items, defaultValue]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index: number, newValue: unknown) => {
    const newItems = [...items];
    newItems[index] = newValue;
    onChange(newItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          disabled={!!field.maxItems && items.length >= field.maxItems}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              {field.itemType.type === "image" ? (
                <ImageField
                  field={field.itemType}
                  value={item as string || ""}
                  onChange={(val) => updateItem(index, val)}
                  businessId={businessId}
                />
              ) : field.label === "Accordion Items" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={typeof item === 'object' && item !== null ? (item as { title?: string; content?: string }).title || "" : ""}
                    onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : {}), title: e.target.value })}
                    placeholder="Section title"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <textarea
                    value={typeof item === 'object' && item !== null ? (item as { title?: string; content?: string }).content || "" : ""}
                    onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : { title: "" }), content: e.target.value })}
                    placeholder="Section content"
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                  />
                </div>
              ) : field.label === "Tabs" ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={typeof item === 'object' && item !== null ? (item as { label?: string; content?: string }).label || "" : ""}
                    onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : {}), label: e.target.value })}
                    placeholder="Tab label"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <textarea
                    value={typeof item === 'object' && item !== null ? (item as { label?: string; content?: string }).content || "" : ""}
                    onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : { label: "" }), content: e.target.value })}
                    placeholder="Tab content"
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                  />
                </div>
              ) : field.label === "Featured Reviews" ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={typeof item === 'object' && item !== null ? (item as { author?: string; rating?: number; text?: string; date?: string }).author || "" : ""}
                      onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : {}), author: e.target.value })}
                      placeholder="Author name"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      value={typeof item === 'object' && item !== null ? (item as { author?: string; rating?: number; text?: string; date?: string }).rating || 5 : 5}
                      onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : { author: "" }), rating: parseInt(e.target.value) || 5 })}
                      placeholder="Rating (1-5)"
                      min="1"
                      max="5"
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <textarea
                    value={typeof item === 'object' && item !== null ? (item as { author?: string; rating?: number; text?: string; date?: string }).text || "" : ""}
                    onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : { author: "", rating: 5 }), text: e.target.value })}
                    placeholder="Review text"
                    className="w-full px-3 py-2 border rounded-md"
                    rows={2}
                  />
                  <input
                    type="text"
                    value={typeof item === 'object' && item !== null ? (item as { author?: string; rating?: number; text?: string; date?: string }).date || "" : ""}
                    onChange={(e) => updateItem(index, { ...(typeof item === 'object' ? item : { author: "", rating: 5, text: "" }), date: e.target.value })}
                    placeholder="Date (e.g., 2 weeks ago)"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={item as string || ""}
                  onChange={(e) => updateItem(index, e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                />
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="mt-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <p className="text-sm text-muted-foreground">
              No items yet. Click &quot;Add&quot; to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}