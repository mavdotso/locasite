"use client";

import React, { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Link, Unlink } from "lucide-react";

interface SpacingControlProps {
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  onChange: (type: "padding" | "margin", values: { top?: string; right?: string; bottom?: string; left?: string }) => void;
}

interface SpacingInputProps {
  label: string;
  values: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  onChange: (values: { top?: string; right?: string; bottom?: string; left?: string }) => void;
}

function SpacingInput({ label, values, onChange }: SpacingInputProps) {
  const [isLinked, setIsLinked] = useState(
    values.top === values.right && 
    values.top === values.bottom && 
    values.top === values.left
  );

  const handleValueChange = (side: "top" | "right" | "bottom" | "left", value: string) => {
    if (isLinked) {
      onChange({
        top: value,
        right: value,
        bottom: value,
        left: value
      });
    } else {
      onChange({
        ...values,
        [side]: value
      });
    }
  };

  const toggleLink = () => {
    if (!isLinked) {
      // When linking, use the top value for all sides
      const linkedValue = values.top || "0";
      onChange({
        top: linkedValue,
        right: linkedValue,
        bottom: linkedValue,
        left: linkedValue
      });
    }
    setIsLinked(!isLinked);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium">{label}</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleLink}
          className="h-6 w-6 p-0"
        >
          {isLinked ? (
            <Link className="h-3 w-3" />
          ) : (
            <Unlink className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      <div className="relative">
        {/* Visual Box Model */}
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-md p-4">
          <div className="grid grid-cols-3 gap-1">
            <div />
            <Input
              type="number"
              value={values.top?.replace(/\D/g, "") || ""}
              onChange={(e) => handleValueChange("top", e.target.value)}
              placeholder="0"
              className="h-7 text-xs text-center"
            />
            <div />
            
            <Input
              type="number"
              value={values.left?.replace(/\D/g, "") || ""}
              onChange={(e) => handleValueChange("left", e.target.value)}
              placeholder="0"
              className="h-7 text-xs text-center"
            />
            <div className="h-7 bg-muted rounded flex items-center justify-center">
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <Input
              type="number"
              value={values.right?.replace(/\D/g, "") || ""}
              onChange={(e) => handleValueChange("right", e.target.value)}
              placeholder="0"
              className="h-7 text-xs text-center"
            />
            
            <div />
            <Input
              type="number"
              value={values.bottom?.replace(/\D/g, "") || ""}
              onChange={(e) => handleValueChange("bottom", e.target.value)}
              placeholder="0"
              className="h-7 text-xs text-center"
            />
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SpacingControl({ 
  padding = {}, 
  margin = {},
  onChange 
}: SpacingControlProps) {
  return (
    <div className="space-y-4">
      <SpacingInput 
        label="Padding" 
        values={padding} 
        onChange={(values) => onChange("padding", values)} 
      />
      <SpacingInput 
        label="Margin" 
        values={margin} 
        onChange={(values) => onChange("margin", values)} 
      />
    </div>
  );
}