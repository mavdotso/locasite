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
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

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

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || "";
    setLocalValue(newValue);
    onChange(newValue); // Update immediately
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
    return (
      <Component
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          className,
          "outline-none ring-2 ring-primary ring-offset-2 rounded px-1",
          "min-w-[50px] min-h-[1em]",
          !localValue && "text-muted-foreground italic"
        )}
      >
        {localValue || placeholder}
      </Component>
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