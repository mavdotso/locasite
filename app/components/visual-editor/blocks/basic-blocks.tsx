import React, { useState, useRef } from "react";
import { ComponentConfig } from "../types";
import { 
  Type, 
  Image as ImageIcon, 
  Square, 
  Minus,
  Video,
  Space
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import InlineEditor from "../components/inline-editor";

// We need to create a wrapper component for inline editing
const TextBlockComponent = (props: {
  content?: string;
  variant?: string;
  align?: string;
  editMode?: boolean;
  onUpdate?: (newProps: Record<string, unknown>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const { content, variant, align, editMode, onUpdate } = props;
  
  const textAlign = align === "justify" ? "text-justify" : `text-${align}`;
  
  const variantClasses = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-semibold",
    paragraph: "text-base",
    lead: "text-xl text-muted-foreground",
    small: "text-sm",
    muted: "text-base text-muted-foreground"
  };
  
  const className = cn(
    variantClasses[variant as keyof typeof variantClasses] || variantClasses.paragraph,
    textAlign
  );
  
  const Component = variant?.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';
  
  const handleClick = (e: React.MouseEvent) => {
    if (!editMode) return;
    
    if (hasBeenClicked) {
      // Second click - start editing
      e.stopPropagation();
      e.preventDefault();
      setIsEditing(true);
    } else {
      // First click - mark as clicked but DON'T stop propagation
      // This allows the click to bubble up to the ComponentWrapper for selection
      setHasBeenClicked(true);
      // Reset after a delay
      setTimeout(() => setHasBeenClicked(false), 2000);
    }
  };
  
  // In edit mode
  if (editMode) {
    if (isEditing) {
      return (
        <InlineEditor
          value={content || ""}
          onChange={(newContent) => {
            if (onUpdate) {
              onUpdate({ content: newContent, variant, align });
            }
          }}
          isEditing={true}
          onStartEdit={() => {}}
          onEndEdit={() => {
            setIsEditing(false);
            setHasBeenClicked(false);
          }}
          className={className}
          placeholder="Enter your text..."
          multiline={variant === 'paragraph' || variant === 'lead' || variant === 'muted'}
          component={Component}
        />
      );
    }
    
    // Show clickable text when not editing
    return (
      <Component 
        className={cn(
          className, 
          "cursor-text hover:bg-muted/10 rounded px-1 transition-colors",
          !content && "text-muted-foreground italic"
        )}
        onClick={handleClick}
      >
        {content || "Click to select, click again to edit..."}
      </Component>
    );
  }
  
  return (
    <Component className={cn(className, !content && "text-muted-foreground italic")}>
      {content || "Click to edit this text..."}
    </Component>
  );
};

// Text Block - Editable text with formatting options
export const TextBlock: ComponentConfig = {
  fields: {
    content: {
      type: "textarea",
      label: "Content",
      defaultValue: "Click to edit this text...",
      required: true,
      rows: 3
    },
    variant: {
      type: "select",
      label: "Text Style",
      defaultValue: "paragraph",
      options: [
        { value: "h1", label: "Heading 1" },
        { value: "h2", label: "Heading 2" },
        { value: "h3", label: "Heading 3" },
        { value: "h4", label: "Heading 4" },
        { value: "paragraph", label: "Paragraph" },
        { value: "lead", label: "Lead Text" },
        { value: "small", label: "Small Text" },
        { value: "muted", label: "Muted Text" }
      ]
    },
    align: {
      type: "select",
      label: "Alignment",
      defaultValue: "left",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
        { value: "justify", label: "Justify" }
      ]
    }
  },
  render: (props, editMode, _business, _children, onUpdate) => {
    return (
      <TextBlockComponent
        {...props as { content?: string; variant?: string; align?: string }}
        editMode={editMode}
        onUpdate={onUpdate}
      />
    );
  },
  icon: Type,
  category: "Basic",
  inline: true
};

// Image Block - Single image with caption
export const ImageBlock: ComponentConfig = {
  fields: {
    src: {
      type: "image",
      label: "Image",
      accept: "image/*",
      required: true
    },
    alt: {
      type: "text",
      label: "Alt Text",
      defaultValue: "",
      placeholder: "Describe the image for accessibility"
    },
    caption: {
      type: "text",
      label: "Caption",
      defaultValue: "",
      placeholder: "Optional image caption"
    },
    width: {
      type: "select",
      label: "Width",
      defaultValue: "full",
      options: [
        { value: "full", label: "Full Width" },
        { value: "wide", label: "Wide" },
        { value: "normal", label: "Normal" },
        { value: "narrow", label: "Narrow" }
      ]
    },
    rounded: {
      type: "select",
      label: "Border Radius",
      defaultValue: "md",
      options: [
        { value: "none", label: "None" },
        { value: "sm", label: "Small" },
        { value: "md", label: "Medium" },
        { value: "lg", label: "Large" },
        { value: "full", label: "Full" }
      ]
    }
  },
  render: (props) => {
    const { src, alt, caption, width, rounded } = props as {
      src?: string;
      alt?: string;
      caption?: string;
      width?: string;
      rounded?: string;
    };
    
    if (!src) {
      return (
        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
        </div>
      );
    }
    
    const widthClasses = {
      full: "w-full",
      wide: "w-full max-w-4xl mx-auto",
      normal: "w-full max-w-2xl mx-auto",
      narrow: "w-full max-w-lg mx-auto"
    };
    
    const roundedClasses = {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full"
    };
    
    return (
      <figure className={widthClasses[width as keyof typeof widthClasses] || widthClasses.full}>
        <img 
          src={src} 
          alt={alt || ""} 
          className={cn("w-full h-auto", roundedClasses[rounded as keyof typeof roundedClasses] || roundedClasses.md)}
        />
        {caption && (
          <figcaption className="text-sm text-muted-foreground text-center mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
  icon: ImageIcon,
  category: "Basic"
};

// Button Block - Customizable button
export const ButtonBlock: ComponentConfig = {
  fields: {
    text: {
      type: "text",
      label: "Button Text",
      defaultValue: "Click Me",
      required: true
    },
    link: {
      type: "text",
      label: "Link URL",
      defaultValue: "#",
      placeholder: "https://example.com or #section"
    },
    variant: {
      type: "select",
      label: "Style",
      defaultValue: "default",
      options: [
        { value: "default", label: "Default" },
        { value: "destructive", label: "Destructive" },
        { value: "outline", label: "Outline" },
        { value: "secondary", label: "Secondary" },
        { value: "ghost", label: "Ghost" },
        { value: "link", label: "Link" }
      ]
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "default",
      options: [
        { value: "sm", label: "Small" },
        { value: "default", label: "Default" },
        { value: "lg", label: "Large" }
      ]
    },
    fullWidth: {
      type: "select",
      label: "Width",
      defaultValue: "auto",
      options: [
        { value: "auto", label: "Auto" },
        { value: "full", label: "Full Width" }
      ]
    }
  },
  render: (props) => {
    const { text, link, variant, size, fullWidth } = props as {
      text?: string;
      link?: string;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      size?: "sm" | "default" | "lg";
      fullWidth?: string;
    };
    
    const button = (
      <Button 
        variant={variant || "default"} 
        size={size || "default"}
        className={fullWidth === "full" ? "w-full" : ""}
        asChild={!!link && link !== "#"}
      >
        {link && link !== "#" ? (
          <a href={link} target={link.startsWith("http") ? "_blank" : undefined}>
            {text || "Button"}
          </a>
        ) : (
          <span>{text || "Button"}</span>
        )}
      </Button>
    );
    
    return fullWidth === "full" ? button : <div className="inline-block">{button}</div>;
  },
  icon: Square,
  category: "Basic",
  inline: true
};

// Spacer Block - Adjustable vertical spacing
export const SpacerBlock: ComponentConfig = {
  fields: {
    height: {
      type: "number",
      label: "Height (px)",
      defaultValue: 40,
      min: 10,
      max: 200,
      step: 10,
      showSlider: true
    }
  },
  render: (props) => {
    const { height } = props as { height?: number };
    return <div style={{ height: `${height || 40}px` }} className="w-full" />;
  },
  icon: Space,
  category: "Basic"
};

// Divider Block - Horizontal line separator
export const DividerBlock: ComponentConfig = {
  fields: {
    style: {
      type: "select",
      label: "Style",
      defaultValue: "solid",
      options: [
        { value: "solid", label: "Solid" },
        { value: "dashed", label: "Dashed" },
        { value: "dotted", label: "Dotted" }
      ]
    },
    width: {
      type: "select",
      label: "Width",
      defaultValue: "full",
      options: [
        { value: "full", label: "Full Width" },
        { value: "wide", label: "Wide" },
        { value: "normal", label: "Normal" },
        { value: "narrow", label: "Narrow" }
      ]
    },
    opacity: {
      type: "number",
      label: "Opacity (%)",
      defaultValue: 20,
      min: 10,
      max: 100,
      step: 10,
      showSlider: true
    }
  },
  render: (props) => {
    const { style, width, opacity } = props as {
      style?: string;
      width?: string;
      opacity?: number;
    };
    
    const widthClasses = {
      full: "w-full",
      wide: "w-3/4",
      normal: "w-1/2",
      narrow: "w-1/4"
    };
    
    return (
      <div className="flex justify-center py-4">
        <hr 
          className={cn(
            "border-t border-border",
            widthClasses[width as keyof typeof widthClasses] || widthClasses.full
          )}
          style={{
            borderStyle: style || "solid",
            opacity: (opacity || 20) / 100
          }}
        />
      </div>
    );
  },
  icon: Minus,
  category: "Basic"
};

// Video Block - Embed videos
export const VideoBlock: ComponentConfig = {
  fields: {
    url: {
      type: "text",
      label: "Video URL",
      placeholder: "YouTube or Vimeo URL",
      required: true
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      defaultValue: "16:9",
      options: [
        { value: "16:9", label: "16:9 (Widescreen)" },
        { value: "4:3", label: "4:3 (Standard)" },
        { value: "1:1", label: "1:1 (Square)" },
        { value: "9:16", label: "9:16 (Vertical)" }
      ]
    }
  },
  render: (props) => {
    const { url, aspectRatio } = props as { url?: string; aspectRatio?: string };
    
    if (!url) {
      return (
        <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
          <Video className="w-12 h-12 text-muted-foreground" />
        </div>
      );
    }
    
    // Extract video ID from YouTube or Vimeo URL
    let embedUrl = "";
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    
    const aspectRatios = {
      "16:9": "aspect-video",
      "4:3": "aspect-[4/3]",
      "1:1": "aspect-square",
      "9:16": "aspect-[9/16]"
    };
    
    return embedUrl ? (
      <div className={cn("w-full", aspectRatios[aspectRatio as keyof typeof aspectRatios] || aspectRatios["16:9"])}>
        <iframe
          src={embedUrl}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      <div className="p-4 bg-muted rounded-lg text-center">
        <p className="text-sm text-muted-foreground">Invalid video URL</p>
      </div>
    );
  },
  icon: Video,
  category: "Media"
};