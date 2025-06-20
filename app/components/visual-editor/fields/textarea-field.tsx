"use client";

import React from "react";
import { TextareaField as TextareaFieldType } from "../types";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";

interface TextareaFieldProps {
  field: TextareaFieldType;
  value: string;
  onChange: (value: string) => void;
}

export default function TextareaField({ field, value, onChange }: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.label}>
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={field.label}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        rows={field.rows || 4}
        required={field.required}
        className="resize-none"
      />
    </div>
  );
}