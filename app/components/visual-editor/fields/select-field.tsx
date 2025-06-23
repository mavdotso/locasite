"use client";

import React from "react";
import { SelectField as SelectFieldType } from "../types";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface SelectFieldProps {
  field: SelectFieldType;
  value: string;
  onChange: (value: string) => void;
}

export default function SelectField({ field, value, onChange }: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.label}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select
        value={value || field.defaultValue || ""}
        onValueChange={onChange}
      >
        <SelectTrigger id={field.label}>
          <SelectValue placeholder={field.placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}