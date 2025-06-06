"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InlineEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
  editable?: boolean;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
}

export function InlineEditor({
  value,
  onChange,
  onBlur,
  className,
  placeholder = "Click to edit...",
  multiline = false,
  editable = true,
  tag: Tag = "span",
}: InlineEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (editable && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== value) {
      onChange(localValue);
    }
    onBlur?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (!editable) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: localValue,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
        setLocalValue(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: cn(
        "outline-none bg-transparent border-2 border-primary rounded px-2 py-1",
        className
      ),
    };

    if (multiline) {
      return (
        <textarea
          {...commonProps}
          rows={3}
          className={cn(commonProps.className, "resize-none w-full")}
        />
      );
    }

    return <input {...commonProps} type="text" />;
  }

  return (
    <Tag
      className={cn(
        "cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors",
        !value && "text-muted-foreground italic",
        className
      )}
      onClick={handleClick}
    >
      {value || placeholder}
    </Tag>
  );
}