"use client";

import React from "react";
import { TextField as TextFieldType } from "../core/types";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface TextFieldProps {
  field: TextFieldType;
  value: string;
  onChange: (value: string) => void;
}

export default function TextField({ field, value, onChange }: TextFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.label}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={field.label}
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        maxLength={field.maxLength}
        required={field.required}
      />
    </div>
  );
}