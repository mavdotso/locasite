"use client";

import { useState } from "react";
import { cn } from "@/app/lib/utils";

interface EditableTextSectionProps {
  content?: string;
  title?: string;
  onContentChange?: (value: string) => void;
  onTitleChange?: (value: string) => void;
  isEditing?: boolean;
  className?: string;
}

export default function EditableTextSection({ 
  content, 
  title,
  onContentChange,
  onTitleChange,
  isEditing = false,
  className 
}: EditableTextSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = (e: React.MouseEvent, onChange?: (value: string) => void) => {
    if (!isEditing || !onChange) return;
    
    const element = e.target as HTMLElement;
    element.contentEditable = 'true';
    element.focus();
    
    // Select all text
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const handleBlur = (e: React.FocusEvent, onChange?: (value: string) => void, originalValue?: string) => {
    const element = e.target as HTMLElement;
    element.contentEditable = 'false';
    const newValue = element.innerText;
    if (onChange && newValue !== originalValue) {
      onChange(newValue);
    }
  };

  return (
    <section 
      className={cn("py-16 bg-background", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4">
        {title && (
          <h2 
            className={cn(
              "text-3xl font-bold text-center mb-12 transition-all",
              isEditing && isHovered && "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1 cursor-text"
            )}
            onClick={(e) => handleEdit(e, onTitleChange)}
            onBlur={(e) => handleBlur(e, onTitleChange, title)}
            suppressContentEditableWarning={true}
          >
            {title}
          </h2>
        )}
        
        <div 
          className={cn(
            "max-w-4xl mx-auto prose prose-lg text-muted-foreground leading-relaxed transition-all",
            isEditing && isHovered && "hover:ring-2 hover:ring-blue-400 rounded p-4 cursor-text"
          )}
          onClick={(e) => handleEdit(e, onContentChange)}
          onBlur={(e) => handleBlur(e, onContentChange, content)}
          suppressContentEditableWarning={true}
        >
          {content || (isEditing ? "Click to edit content..." : "")}
        </div>
      </div>
    </section>
  );
}