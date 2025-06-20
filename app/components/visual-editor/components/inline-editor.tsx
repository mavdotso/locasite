"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/app/lib/utils";

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  component?: keyof JSX.IntrinsicElements;
}

export default function InlineEditor({
  value,
  onChange,
  isEditing,
  onStartEdit,
  onEndEdit,
  className,
  placeholder = "Click to edit...",
  multiline = false,
  component: Component = multiline ? "div" : "span"
}: InlineEditorProps) {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const ref = multiline ? textareaRef : inputRef;
    if (isEditing && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [isEditing, multiline]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setLocalValue(value); // Reset to original value
      onEndEdit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    onChange(localValue);
    onEndEdit();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      e.preventDefault();
      e.stopPropagation();
      onStartEdit();
    }
  };

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={textareaRef}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            className,
            "outline-none ring-2 ring-primary ring-offset-2 rounded px-1 py-0.5",
            "min-w-[50px] w-full resize-none bg-transparent",
            "font-inherit"
          )}
          placeholder={placeholder}
          rows={3}
        />
      );
    }
    
    return (
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          className,
          "outline-none ring-2 ring-primary ring-offset-2 rounded px-1",
          "min-w-[50px] bg-transparent",
          "font-inherit"
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <Component
      onClick={handleClick}
      className={cn(
        className,
        "cursor-text hover:bg-muted/20 rounded px-1 transition-colors",
        !value && "text-muted-foreground italic"
      )}
    >
      {value || placeholder}
    </Component>
  );
}