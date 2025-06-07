"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Upload, X } from "lucide-react";

interface EditableHeroProps {
  title?: string;
  subtitle?: string;
  image?: string;
  onTitleChange?: (value: string) => void;
  onSubtitleChange?: (value: string) => void;
  _onImageChange?: (url: string) => void;
  onImageRemove?: () => void;
  isEditing?: boolean;
  className?: string;
}

export default function EditableHero({ 
  title, 
  subtitle, 
  image, 
  onTitleChange,
  onSubtitleChange,
  _onImageChange,
  onImageRemove,
  isEditing = false,
  className 
}: EditableHeroProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleTitleClick = (e: React.MouseEvent) => {
    if (!isEditing) return;
    
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

  const handleTitleBlur = (e: React.FocusEvent) => {
    const element = e.target as HTMLElement;
    element.contentEditable = 'false';
    const newValue = element.innerText;
    if (onTitleChange && newValue !== title) {
      onTitleChange(newValue);
    }
  };

  const handleSubtitleBlur = (e: React.FocusEvent) => {
    const element = e.target as HTMLElement;
    element.contentEditable = 'false';
    const newValue = element.innerText;
    if (onSubtitleChange && newValue !== subtitle) {
      onSubtitleChange(newValue);
    }
  };

  return (
    <section 
      className={cn(
        "relative bg-gradient-to-r from-foreground to-foreground/90 text-white overflow-hidden min-h-[60vh] flex items-center",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image */}
      {image && (
        <div className="absolute inset-0 w-full h-full">
          <Image 
            height={800} 
            width={2500} 
            src={image} 
            alt={title || ''} 
            className="opacity-60 w-full h-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"></div>
          
          {/* Remove image button */}
          {isEditing && isHovered && onImageRemove && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={onImageRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Content */}
      <div className="z-10 relative mx-auto px-4 py-32 text-center container">
        <h1 
          className={cn(
            "drop-shadow-md mb-6 font-bold text-4xl md:text-6xl tracking-tight transition-all",
            isEditing && "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1 cursor-text"
          )}
          onClick={handleTitleClick}
          onBlur={handleTitleBlur}
          suppressContentEditableWarning={true}
        >
          {title || (isEditing ? "Click to edit title" : "")}
        </h1>
        
        <p 
          className={cn(
            "mx-auto max-w-2xl text-white/90 text-xl md:text-2xl leading-relaxed transition-all",
            isEditing && "hover:ring-2 hover:ring-blue-400 rounded px-2 py-1 cursor-text"
          )}
          onClick={handleTitleClick}
          onBlur={handleSubtitleBlur}
          suppressContentEditableWarning={true}
        >
          {subtitle || (isEditing ? "Click to edit subtitle" : "")}
        </p>

        {/* Upload image button */}
        {isEditing && !image && isHovered && (
          <div className="mt-8">
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Background Image
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}