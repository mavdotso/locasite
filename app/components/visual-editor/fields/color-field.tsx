"use client";

import React from "react";
import { ColorField as ColorFieldType } from "../core/types";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/lib/utils";

interface ColorFieldProps {
  field: ColorFieldType;
  value: string;
  onChange: (value: string) => void;
}

const defaultPresets = [
  "#000000", "#ffffff", "#f87171", "#fb923c", "#fbbf24", 
  "#a3e635", "#34d399", "#22d3ee", "#60a5fa", "#a78bfa",
  "#e879f9", "#fb7185"
];

export default function ColorField({ field, value, onChange }: ColorFieldProps) {
  const presets = field.presets || defaultPresets;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.label}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-lg border-2 border-border"
            style={{ backgroundColor: value || field.defaultValue || "#000000" }}
          />
          <Input
            id={field.label}
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            pattern="^#[0-9A-Fa-f]{6}$"
            className="font-mono"
          />
        </div>
        
        {presets.length > 0 && (
          <div className="grid grid-cols-6 gap-2">
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange(color)}
                className={cn(
                  "w-full h-8 rounded border-2 transition-all",
                  value === color 
                    ? "border-primary scale-110" 
                    : "border-border hover:border-primary/50"
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}