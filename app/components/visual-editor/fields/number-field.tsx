"use client";

import React from "react";
import { NumberField as NumberFieldType } from "../core/types";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Slider } from "@/app/components/ui/slider";

interface NumberFieldProps {
  field: NumberFieldType;
  value: number;
  onChange: (value: number) => void;
}

export default function NumberField({ field, value, onChange }: NumberFieldProps) {
  const currentValue = value ?? field.defaultValue ?? 0;
  const min = field.min ?? 0;
  const max = field.max ?? 100;
  const step = field.step ?? 1;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.label}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      {field.showSlider ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Slider
              value={[currentValue]}
              onValueChange={([val]) => onChange(val)}
              min={min}
              max={max}
              step={step}
              className="flex-1"
            />
            <Input
              type="number"
              value={currentValue}
              onChange={(e) => onChange(Number(e.target.value))}
              min={min}
              max={max}
              step={step}
              className="w-20"
            />
          </div>
        </div>
      ) : (
        <Input
          id={field.label}
          type="number"
          value={currentValue}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={field.placeholder}
          min={min}
          max={max}
          step={step}
          required={field.required}
        />
      )}
    </div>
  );
}