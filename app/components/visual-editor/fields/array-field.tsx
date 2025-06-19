"use client";

import React from "react";
import { ArrayField as ArrayFieldType } from "../types";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Plus, X } from "lucide-react";
import ImageField from "./image-field";

interface ArrayFieldProps {
  field: ArrayFieldType;
  value: unknown[];
  onChange: (value: unknown[]) => void;
  businessId: string;
}

export default function ArrayField({ field, value, onChange, businessId }: ArrayFieldProps) {
  const items = value || field.defaultValue || [];

  const addItem = () => {
    if (field.maxItems && items.length >= field.maxItems) return;
    
    const defaultValue = field.itemType.defaultValue || "";
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
          disabled={field.maxItems && items.length >= field.maxItems}
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
                  value={item}
                  onChange={(val) => updateItem(index, val)}
                  businessId={businessId}
                />
              ) : (
                <input
                  type="text"
                  value={item}
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