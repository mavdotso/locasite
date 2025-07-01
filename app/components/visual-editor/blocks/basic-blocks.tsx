import React from "react";
import { ComponentConfig, BusinessData } from "@/app/types/visual-editor";
import {
  Type,
  Square,
  Video,
  Image as ImageIcon,
  Minus,
  Space,
  Star,
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  User,
  Users,
  Briefcase,
  Building,
  Home,
  Shield,
  Award,
  CheckCircle,
  Info,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Share2,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  X,
  CreditCard,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";
import Link from "next/link";
import Image from "next/image";

// TODO: Future refactoring to split this large file into smaller modules

// Simple text component without inline editing
const TextBlockComponent = (props: {
  content?: string;
  variant?: string;
  align?: string;
  mobileAlign?: string;
  color?: string;
  editMode?: boolean;
  onUpdate?: (newProps: Record<string, unknown>) => void;
}) => {
  const { content, variant, align, mobileAlign, color } = props;

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  };

  const textAlign =
    alignClasses[align as keyof typeof alignClasses] || "text-left";
  const mobileTextAlign =
    alignClasses[mobileAlign as keyof typeof alignClasses] || textAlign;

  const variantClasses = {
    h1: "text-2xl sm:text-3xl lg:text-4xl font-bold",
    h2: "text-xl sm:text-2xl lg:text-3xl font-bold",
    h3: "text-lg sm:text-xl lg:text-2xl font-semibold",
    h4: "text-base sm:text-lg lg:text-xl font-semibold",
    paragraph: "text-sm sm:text-base",
    lead: "text-base sm:text-lg lg:text-xl text-muted-foreground",
    small: "text-xs sm:text-sm",
    muted: "text-sm sm:text-base text-muted-foreground",
  };

  const className = cn(
    variantClasses[variant as keyof typeof variantClasses] ||
      variantClasses.paragraph,
    mobileTextAlign !== textAlign
      ? cn(mobileTextAlign, `sm:${textAlign}`)
      : textAlign,
  );

  const style = color ? { color } : undefined;

  const Component = variant?.startsWith("h")
    ? (variant as keyof React.JSX.IntrinsicElements)
    : "p";

  // For TypeScript, we need to handle the component type properly
  const textContent = content || "Click to edit this text...";
  const finalClassName = cn(
    className,
    !content && !color && "text-muted-foreground italic",
  );

  if (Component === "h1") {
    return (
      <h1 className={finalClassName} style={style}>
        {textContent}
      </h1>
    );
  } else if (Component === "h2") {
    return (
      <h2 className={finalClassName} style={style}>
        {textContent}
      </h2>
    );
  } else if (Component === "h3") {
    return (
      <h3 className={finalClassName} style={style}>
        {textContent}
      </h3>
    );
  } else if (Component === "h4") {
    return (
      <h4 className={finalClassName} style={style}>
        {textContent}
      </h4>
    );
  } else {
    return (
      <p className={finalClassName} style={style}>
        {textContent}
      </p>
    );
  }
};

// Text Block - Editable text with formatting options
export const TextBlock: ComponentConfig = {
  fields: {
    content: {
      type: "textarea",
      label: "Content",
      defaultValue: "Click to edit this text...",
      required: true,
      rows: 3,
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
        { value: "muted", label: "Muted Text" },
      ],
    },
    align: {
      type: "select",
      label: "Alignment",
      defaultValue: "left",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
        { value: "justify", label: "Justify" },
      ],
    },
    mobileAlign: {
      type: "select",
      label: "Mobile Alignment",
      defaultValue: "same",
      options: [
        { value: "same", label: "Same as Desktop" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
    color: {
      type: "color",
      label: "Text Color",
      defaultValue: "",
      presets: [
        "#000000", // Black
        "#374151", // Gray 700
        "#6B7280", // Gray 500
        "#DC2626", // Red 600
        "#2563EB", // Blue 600
        "#16A34A", // Green 600
        "#CA8A04", // Yellow 600
        "#9333EA", // Purple 600
      ],
    },
  },
  render: (props, editMode, _business, _children, onUpdate) => {
    const { mobileAlign, ...otherProps } = props as {
      mobileAlign?: string;
      [key: string]: unknown;
    };
    const finalMobileAlign =
      mobileAlign === "same" ? (otherProps.align as string) : mobileAlign;

    return (
      <TextBlockComponent
        {...(otherProps as {
          content?: string;
          variant?: string;
          align?: string;
          color?: string;
        })}
        mobileAlign={finalMobileAlign}
        editMode={editMode}
        onUpdate={onUpdate}
      />
    );
  },
  icon: Type,
  category: "Basic",
  inline: true,
};

// Image Block - Single image with caption
export const ImageBlock: ComponentConfig = {
  fields: {
    src: {
      type: "image",
      label: "Image",
      accept: "image/*",
      required: true,
    },
    alt: {
      type: "text",
      label: "Alt Text",
      defaultValue: "",
      placeholder: "Describe the image for accessibility",
    },
    caption: {
      type: "text",
      label: "Caption",
      defaultValue: "",
      placeholder: "Optional image caption",
    },
    width: {
      type: "select",
      label: "Width",
      defaultValue: "full",
      options: [
        { value: "full", label: "Full Width" },
        { value: "wide", label: "Wide" },
        { value: "normal", label: "Normal" },
        { value: "narrow", label: "Narrow" },
      ],
    },
    mobileWidth: {
      type: "select",
      label: "Mobile Width",
      defaultValue: "full",
      options: [
        { value: "same", label: "Same as Desktop" },
        { value: "full", label: "Full Width" },
        { value: "normal", label: "Normal" },
        { value: "narrow", label: "Narrow" },
      ],
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      defaultValue: "auto",
      options: [
        { value: "auto", label: "Auto (Original)" },
        { value: "1:1", label: "Square (1:1)" },
        { value: "16:9", label: "Widescreen (16:9)" },
        { value: "4:3", label: "Standard (4:3)" },
        { value: "3:2", label: "Classic (3:2)" },
        { value: "21:9", label: "Ultrawide (21:9)" },
      ],
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
        { value: "full", label: "Full" },
      ],
    },
  },
  render: (props) => {
    const { src, alt, caption, width, mobileWidth, rounded, aspectRatio } =
      props as {
        src?: string;
        alt?: string;
        caption?: string;
        width?: string;
        mobileWidth?: string;
        rounded?: string;
        aspectRatio?: string;
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
      narrow: "w-full max-w-lg mx-auto",
    };

    const mobileWidthClasses = {
      full: "w-full",
      normal: "w-full max-w-sm mx-auto",
      narrow: "w-full max-w-xs mx-auto",
    };

    const aspectRatioClasses = {
      auto: "",
      "1:1": "aspect-square",
      "16:9": "aspect-video",
      "4:3": "aspect-[4/3]",
      "3:2": "aspect-[3/2]",
      "21:9": "aspect-[21/9]",
    };

    const roundedClasses = {
      none: "",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };

    const effectiveMobileWidth = mobileWidth === "same" ? width : mobileWidth;
    const desktopClass =
      widthClasses[width as keyof typeof widthClasses] || widthClasses.full;
    const mobileClass =
      mobileWidthClasses[
        effectiveMobileWidth as keyof typeof mobileWidthClasses
      ];

    const containerClass =
      effectiveMobileWidth === width
        ? desktopClass
        : cn(
            mobileClass,
            desktopClass
              .replace("w-full", "sm:w-full")
              .replace("max-w-", "sm:max-w-"),
          );

    return (
      <figure className={containerClass}>
        <div
          className={cn(
            "relative overflow-hidden",
            aspectRatioClasses[
              aspectRatio as keyof typeof aspectRatioClasses
            ] || "",
            roundedClasses[rounded as keyof typeof roundedClasses] ||
              roundedClasses.md,
          )}
        >
          <Image
            src={src}
            alt={alt || ""}
            width={800}
            height={600}
            className={cn(
              "w-full h-auto",
              aspectRatio !== "auto" &&
                "absolute inset-0 w-full h-full object-cover",
            )}
          />
        </div>
        {caption && (
          <figcaption className="text-sm text-muted-foreground text-center mt-2">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
  icon: ImageIcon,
  category: "Basic",
};

// Logo Block - Business logo with customizable size
export const LogoBlock: ComponentConfig = {
  fields: {
    logoImage: {
      type: "image",
      label: "Logo Image",
      defaultValue: "",
      placeholder: "Upload logo (PNG, JPG, SVG)",
    },
    useBusinessName: {
      type: "select",
      label: "Use Business Name as Fallback",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    customText: {
      type: "text",
      label: "Custom Text (if no logo)",
      defaultValue: "",
      placeholder: "Your Business Name",
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
        { value: "xlarge", label: "Extra Large" },
      ],
    },
    align: {
      type: "select",
      label: "Alignment",
      defaultValue: "left",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
    link: {
      type: "text",
      label: "Link URL",
      defaultValue: "/",
      placeholder: "/ or https://example.com",
    },
  },
  render: (props, editMode, business) => {
    const { logoImage, useBusinessName, customText, size, align, link } =
      props as {
        logoImage?: string;
        useBusinessName?: string;
        customText?: string;
        size?: string;
        align?: string;
        link?: string;
      };
    const businessData = business as Doc<"businesses"> | undefined;

    const alignClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    const sizeClasses = {
      small: "h-8",
      medium: "h-12",
      large: "h-16",
      xlarge: "h-20",
    };

    const textSizeClasses = {
      small: "text-lg",
      medium: "text-xl",
      large: "text-2xl",
      xlarge: "text-3xl",
    };

    // Determine what to show
    let logoContent;
    if (logoImage) {
      // Show uploaded logo image
      logoContent = (
        <Image
          src={logoImage}
          alt={businessData?.name || customText || "Logo"}
          width={200}
          height={100}
          className={cn(
            "w-auto",
            sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium,
          )}
        />
      );
    } else {
      // Show text fallback
      const displayText =
        customText ||
        (useBusinessName === "yes" ? businessData?.name : "") ||
        "Business Name";
      logoContent = (
        <div
          className={cn(
            "font-bold text-foreground",
            textSizeClasses[size as keyof typeof textSizeClasses] ||
              textSizeClasses.medium,
          )}
        >
          {displayText}
        </div>
      );
    }

    const handleClick = (e: React.MouseEvent) => {
      if (editMode) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <div
        className={cn(
          "flex",
          alignClasses[align as keyof typeof alignClasses] || alignClasses.left,
        )}
      >
        {link && !editMode ? (
          <Link href={link} className="inline-block">
            {logoContent}
          </Link>
        ) : link && editMode ? (
          <div className="inline-block cursor-pointer" onClick={handleClick}>
            {logoContent}
          </div>
        ) : (
          logoContent
        )}
      </div>
    );
  },
  icon: Building,
  category: "Basic",
};

// Button Block - Customizable button
export const ButtonBlock: ComponentConfig = {
  fields: {
    text: {
      type: "text",
      label: "Button Text",
      defaultValue: "Click Me",
      required: true,
    },
    link: {
      type: "text",
      label: "Link URL",
      defaultValue: "#",
      placeholder: "https://example.com or #section",
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
        { value: "link", label: "Link" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "default",
      options: [
        { value: "sm", label: "Small" },
        { value: "default", label: "Default" },
        { value: "lg", label: "Large" },
      ],
    },
    fullWidth: {
      type: "select",
      label: "Width",
      defaultValue: "auto",
      options: [
        { value: "auto", label: "Auto" },
        { value: "full", label: "Full Width" },
      ],
    },
    align: {
      type: "select",
      label: "Alignment",
      defaultValue: "left",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
    mobileFullWidth: {
      type: "select",
      label: "Mobile Full Width",
      defaultValue: "no",
      options: [
        { value: "no", label: "No" },
        { value: "yes", label: "Yes" },
      ],
    },
    mobileAlign: {
      type: "select",
      label: "Mobile Alignment",
      defaultValue: "same",
      options: [
        { value: "same", label: "Same as Desktop" },
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
  },
  render: (props, editMode) => {
    const {
      text,
      link,
      variant,
      size,
      fullWidth,
      align,
      mobileFullWidth,
      mobileAlign,
    } = props as {
      text?: string;
      link?: string;
      variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
      size?: "sm" | "default" | "lg";
      fullWidth?: string;
      align?: string;
      mobileFullWidth?: string;
      mobileAlign?: string;
    };

    const handleClick = (e: React.MouseEvent) => {
      if (editMode) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const button = (
      <Button
        variant={variant || "default"}
        size={size || "default"}
        className={cn(
          fullWidth === "full" ? "w-full" : "",
          mobileFullWidth === "yes" &&
            fullWidth !== "full" &&
            "w-full sm:w-auto",
        )}
        asChild={!!link && link !== "#" && !editMode}
        onClick={editMode ? handleClick : undefined}
      >
        {link && link !== "#" && !editMode ? (
          <a
            href={link}
            target={link.startsWith("http") ? "_blank" : undefined}
          >
            {text || "Button"}
          </a>
        ) : (
          <span>{text || "Button"}</span>
        )}
      </Button>
    );

    if (fullWidth === "full") {
      return button;
    }

    const alignClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    const effectiveMobileAlign = mobileAlign === "same" ? align : mobileAlign;
    const desktopAlign =
      alignClasses[align as keyof typeof alignClasses] || alignClasses.left;
    const mobileAlignClass =
      alignClasses[effectiveMobileAlign as keyof typeof alignClasses] ||
      desktopAlign;

    const containerClass =
      effectiveMobileAlign === align
        ? desktopAlign
        : cn(mobileAlignClass, `sm:${desktopAlign}`);

    return <div className={containerClass}>{button}</div>;
  },
  icon: Square,
  category: "Basic",
  inline: true,
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
      showSlider: true,
    },
    mobileHeight: {
      type: "number",
      label: "Mobile Height (px)",
      defaultValue: 20,
      min: 10,
      max: 200,
      step: 10,
      showSlider: true,
    },
  },
  render: (props) => {
    const { height, mobileHeight } = props as {
      height?: number;
      mobileHeight?: number;
    };
    const desktopHeight = height || 40;
    const mobileHeightValue = mobileHeight || 20;

    return (
      <div className="w-full">
        <div
          className="block sm:hidden"
          style={{ height: `${mobileHeightValue}px` }}
        />
        <div
          className="hidden sm:block"
          style={{ height: `${desktopHeight}px` }}
        />
      </div>
    );
  },
  icon: Space,
  category: "Basic",
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
        { value: "dotted", label: "Dotted" },
      ],
    },
    width: {
      type: "select",
      label: "Width",
      defaultValue: "full",
      options: [
        { value: "full", label: "Full Width" },
        { value: "wide", label: "Wide" },
        { value: "normal", label: "Normal" },
        { value: "narrow", label: "Narrow" },
      ],
    },
    opacity: {
      type: "number",
      label: "Opacity (%)",
      defaultValue: 20,
      min: 10,
      max: 100,
      step: 10,
      showSlider: true,
    },
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
      narrow: "w-1/4",
    };

    return (
      <div className="flex justify-center py-4">
        <hr
          className={cn(
            "border-t border-border",
            widthClasses[width as keyof typeof widthClasses] ||
              widthClasses.full,
          )}
          style={{
            borderStyle: style || "solid",
            opacity: (opacity || 20) / 100,
          }}
        />
      </div>
    );
  },
  icon: Minus,
  category: "Basic",
};

// Video Block - Embed videos
export const VideoBlock: ComponentConfig = {
  fields: {
    url: {
      type: "text",
      label: "Video URL",
      placeholder: "YouTube or Vimeo URL",
      required: true,
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      defaultValue: "16:9",
      options: [
        { value: "16:9", label: "16:9 (Widescreen)" },
        { value: "4:3", label: "4:3 (Standard)" },
        { value: "1:1", label: "1:1 (Square)" },
        { value: "9:16", label: "9:16 (Vertical)" },
      ],
    },
  },
  render: (props) => {
    const { url, aspectRatio } = props as {
      url?: string;
      aspectRatio?: string;
    };

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
      const videoId = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      )?.[1];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }

    const aspectRatios = {
      "16:9": "aspect-video",
      "4:3": "aspect-[4/3]",
      "1:1": "aspect-square",
      "9:16": "aspect-[9/16]",
    };

    return embedUrl ? (
      <div
        className={cn(
          "w-full",
          aspectRatios[aspectRatio as keyof typeof aspectRatios] ||
            aspectRatios["16:9"],
        )}
      >
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
  category: "Basic",
};

// Icon Block - Display icons
export const IconBlock: ComponentConfig = {
  fields: {
    icon: {
      type: "select",
      label: "Icon",
      defaultValue: "star",
      options: [
        { value: "star", label: "Star" },
        { value: "heart", label: "Heart" },
        { value: "phone", label: "Phone" },
        { value: "mail", label: "Mail" },
        { value: "mapPin", label: "Map Pin" },
        { value: "clock", label: "Clock" },
        { value: "calendar", label: "Calendar" },
        { value: "user", label: "User" },
        { value: "users", label: "Users" },
        { value: "briefcase", label: "Briefcase" },
        { value: "building", label: "Building" },
        { value: "home", label: "Home" },
        { value: "shield", label: "Shield" },
        { value: "award", label: "Award" },
        { value: "checkCircle", label: "Check Circle" },
        { value: "info", label: "Info" },
        { value: "alertCircle", label: "Alert Circle" },
        { value: "arrowRight", label: "Arrow Right" },
        { value: "externalLink", label: "External Link" },
        { value: "download", label: "Download" },
        { value: "share", label: "Share" },
        { value: "globe", label: "Globe" },
        { value: "facebook", label: "Facebook" },
        { value: "twitter", label: "Twitter" },
        { value: "instagram", label: "Instagram" },
        { value: "linkedin", label: "LinkedIn" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small (16px)" },
        { value: "medium", label: "Medium (24px)" },
        { value: "large", label: "Large (32px)" },
        { value: "xlarge", label: "Extra Large (48px)" },
      ],
    },
    color: {
      type: "color",
      label: "Color",
      defaultValue: "",
    },
    align: {
      type: "select",
      label: "Alignment",
      defaultValue: "left",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
  },
  render: (props) => {
    const { icon, size, color, align } = props as {
      icon?: string;
      size?: string;
      color?: string;
      align?: string;
    };

    // Import all icons we might need
    const icons = {
      star: Star,
      heart: Heart,
      phone: Phone,
      mail: Mail,
      mapPin: MapPin,
      clock: Clock,
      calendar: Calendar,
      user: User,
      users: Users,
      briefcase: Briefcase,
      building: Building,
      home: Home,
      shield: Shield,
      award: Award,
      checkCircle: CheckCircle,
      info: Info,
      alertCircle: AlertCircle,
      arrowRight: ArrowRight,
      externalLink: ExternalLink,
      download: Download,
      share: Share2,
      globe: Globe,
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
    };

    const IconComponent = icons[icon as keyof typeof icons] || Star;

    const sizeClasses = {
      small: "w-4 h-4",
      medium: "w-6 h-6",
      large: "w-8 h-8",
      xlarge: "w-12 h-12",
    };

    const alignClasses = {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    };

    return (
      <div
        className={cn(
          "flex",
          alignClasses[align as keyof typeof alignClasses] || alignClasses.left,
        )}
      >
        <IconComponent
          className={cn(
            sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium,
            "flex-shrink-0",
          )}
          style={{ color: color || undefined }}
        />
      </div>
    );
  },
  icon: Star,
  category: "Basic",
  inline: true,
};

// Badge/Certification Block - Display trust badges and certifications
export const BadgeBlock: ComponentConfig = {
  fields: {
    type: {
      type: "select",
      label: "Badge Type",
      defaultValue: "certification",
      options: [
        { value: "certification", label: "Certification" },
        { value: "award", label: "Award" },
        { value: "membership", label: "Membership" },
        { value: "rating", label: "Rating" },
        { value: "verified", label: "Verified" },
        { value: "trusted", label: "Trusted" },
      ],
    },
    text: {
      type: "text",
      label: "Badge Text",
      defaultValue: "Certified Professional",
      required: true,
    },
    subtext: {
      type: "text",
      label: "Subtext",
      defaultValue: "",
      placeholder: "Optional additional info",
    },
    icon: {
      type: "select",
      label: "Icon",
      defaultValue: "shield",
      options: [
        { value: "shield", label: "Shield" },
        { value: "award", label: "Award" },
        { value: "checkCircle", label: "Check Circle" },
        { value: "star", label: "Star" },
        { value: "badge", label: "Badge" },
        { value: "ribbon", label: "Ribbon" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    color: {
      type: "select",
      label: "Color Scheme",
      defaultValue: "primary",
      options: [
        { value: "primary", label: "Primary" },
        { value: "success", label: "Success (Green)" },
        { value: "warning", label: "Warning (Yellow)" },
        { value: "info", label: "Info (Blue)" },
        { value: "neutral", label: "Neutral" },
      ],
    },
  },
  render: (props) => {
    const { text, subtext, icon, size, color } = props as {
      type?: string;
      text?: string;
      subtext?: string;
      icon?: string;
      size?: string;
      color?: string;
    };

    const icons = {
      shield: Shield,
      award: Award,
      checkCircle: CheckCircle,
      star: Star,
      badge: Award,
      ribbon: Award,
    };

    const IconComponent = icons[icon as keyof typeof icons] || Shield;

    const sizeClasses = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    };

    const colorClasses = {
      primary: "bg-primary/10 text-primary border-primary/20",
      success: "bg-green-500/10 text-green-700 border-green-500/20",
      warning: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
      info: "bg-blue-500/10 text-blue-700 border-blue-500/20",
      neutral: "bg-muted text-foreground border-border",
    };

    const iconSizes = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6",
    };

    return (
      <div className="inline-flex items-center">
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-2 rounded-lg border",
            sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.medium,
            colorClasses[color as keyof typeof colorClasses] ||
              colorClasses.primary,
          )}
        >
          <IconComponent
            className={
              iconSizes[size as keyof typeof iconSizes] || iconSizes.medium
            }
          />
          <div>
            <div className="font-medium">{text || "Badge"}</div>
            {subtext && <div className="text-xs opacity-80">{subtext}</div>}
          </div>
        </div>
      </div>
    );
  },
  icon: Shield,
  category: "Basic",
  inline: true,
};

// Review Stars Block - Display standalone rating stars
export const ReviewStarsBlock: ComponentConfig = {
  fields: {
    rating: {
      type: "number",
      label: "Rating",
      defaultValue: 5,
      min: 0,
      max: 5,
      step: 0.1,
      showSlider: true,
    },
    maxRating: {
      type: "number",
      label: "Max Rating",
      defaultValue: 5,
      min: 5,
      max: 10,
      step: 1,
    },
    showNumber: {
      type: "select",
      label: "Show Number",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    showCount: {
      type: "select",
      label: "Show Review Count",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    reviewCount: {
      type: "number",
      label: "Review Count",
      defaultValue: 0,
      min: 0,
      max: 9999,
      step: 1,
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    color: {
      type: "color",
      label: "Star Color",
      defaultValue: "#FBBF24",
      presets: [
        "#FBBF24", // Yellow
        "#F59E0B", // Amber
        "#EF4444", // Red
        "#10B981", // Green
        "#3B82F6", // Blue
        "#8B5CF6", // Purple
      ],
    },
  },
  render: (props) => {
    const {
      rating,
      maxRating,
      showNumber,
      showCount,
      reviewCount,
      size,
      color,
    } = props as {
      rating?: number;
      maxRating?: number;
      showNumber?: string;
      showCount?: string;
      reviewCount?: number;
      size?: string;
      color?: string;
    };

    const starSizes = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6",
    };

    const textSizes = {
      small: "text-sm",
      medium: "text-base",
      large: "text-lg",
    };

    const actualRating = rating || 0;
    const max = maxRating || 5;
    const fullStars = Math.floor(actualRating);
    const hasHalfStar = actualRating % 1 >= 0.5;

    return (
      <div className="inline-flex items-center gap-2">
        <div className="flex">
          {[...Array(max)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                starSizes[size as keyof typeof starSizes] || starSizes.medium,
                i < fullStars || (i === fullStars && hasHalfStar)
                  ? "fill-current"
                  : "fill-none stroke-current opacity-30",
              )}
              style={{ color: color || "#FBBF24" }}
            />
          ))}
        </div>
        {showNumber === "yes" && (
          <span
            className={cn(
              "font-medium",
              textSizes[size as keyof typeof textSizes] || textSizes.medium,
            )}
          >
            {actualRating.toFixed(1)}
          </span>
        )}
        {showCount === "yes" &&
          reviewCount !== undefined &&
          reviewCount > 0 && (
            <span
              className={cn(
                "text-muted-foreground",
                textSizes[size as keyof typeof textSizes] || textSizes.medium,
              )}
            >
              ({reviewCount} reviews)
            </span>
          )}
      </div>
    );
  },
  icon: Star,
  category: "Basic",
  inline: true,
};

// Business Hours Block - Compact hours display
export const BusinessHoursBlock: ComponentConfig = {
  fields: {
    layout: {
      type: "select",
      label: "Layout",
      defaultValue: "inline",
      options: [
        { value: "inline", label: "Inline" },
        { value: "list", label: "List" },
        { value: "compact", label: "Compact" },
      ],
    },
    showToday: {
      type: "select",
      label: "Highlight Today",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    showStatus: {
      type: "select",
      label: "Show Open/Closed Status",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
  },
  render: (props, _editMode, business) => {
    const { layout, showToday, showStatus } = props as {
      layout?: string;
      showToday?: string;
      showStatus?: string;
    };
    const businessData = business as Doc<"businesses"> | undefined;

    if (!businessData?.hours) {
      return (
        <div className="text-muted-foreground">
          <Clock className="w-4 h-4 inline mr-1" />
          Business hours not available
        </div>
      );
    }

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

    // Parse hours from array format to object format
    const parseHoursArray = (hoursArray?: string[]) => {
      if (!hoursArray || !Array.isArray(hoursArray)) return {};
      const hoursObj: Record<string, string> = {};
      hoursArray.forEach((hourStr) => {
        const dayMatch = hourStr.match(
          /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):\s*(.+)$/i,
        );
        if (dayMatch) {
          const day = dayMatch[1].toLowerCase();
          const hours = dayMatch[2];
          hoursObj[day] = hours;
        }
      });
      return hoursObj;
    };

    const hoursObj = parseHoursArray(businessData?.hours);

    // Check if currently open
    const isOpen = () => {
      const currentHours = hoursObj[today];
      if (!currentHours || currentHours.toLowerCase() === "closed")
        return false;

      // Simple check - would need more complex logic for actual implementation
      return true;
    };

    if (layout === "inline") {
      const todayHours = String(hoursObj[today] || "Closed");
      return (
        <div className="inline-flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>
            Today: <span className="font-medium">{todayHours}</span>
          </span>
          {showStatus === "yes" && (
            <span
              className={cn(
                "px-2 py-1 rounded text-xs font-medium",
                isOpen()
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {isOpen() ? "Open Now" : "Closed"}
            </span>
          )}
        </div>
      );
    }

    if (layout === "compact") {
      return (
        <div className="space-y-1">
          {days
            .slice(0, 5)
            .every((day) => hoursObj[day] === hoursObj["monday"]) ? (
            <div className="flex justify-between text-sm">
              <span>Mon-Fri</span>
              <span className="font-medium">
                {String(hoursObj["monday"] || "Closed")}
              </span>
            </div>
          ) : (
            days.slice(0, 5).map((day) => (
              <div key={day} className="flex justify-between text-sm">
                <span className="capitalize">{day.slice(0, 3)}</span>
                <span className="font-medium">
                  {String(hoursObj[day] || "Closed")}
                </span>
              </div>
            ))
          )}
          {days.slice(5).map((day) => (
            <div key={day} className="flex justify-between text-sm">
              <span className="capitalize">{day.slice(0, 3)}</span>
              <span className="font-medium">
                {String(
                  businessData.hours[day as keyof typeof businessData.hours] ||
                    "Closed",
                )}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // List layout (default)
    return (
      <div className="space-y-2">
        {days.map((day) => (
          <div
            key={day}
            className={cn(
              "flex justify-between",
              showToday === "yes" &&
                day === today &&
                "font-medium bg-muted px-2 py-1 rounded",
            )}
          >
            <span className="capitalize">{day}</span>
            <span>{String(hoursObj[day] || "Closed")}</span>
          </div>
        ))}
      </div>
    );
  },
  icon: Clock,
  category: "Basic",
};

// Social Media Links Block
export const SocialLinksBlock: ComponentConfig = {
  fields: {
    platforms: {
      type: "array",
      label: "Social Platforms",
      defaultValue: [
        { platform: "facebook", url: "https://facebook.com/yourbusiness" },
        { platform: "instagram", url: "https://instagram.com/yourbusiness" },
      ],
      itemType: {
        type: "text",
        label: "Platform",
        defaultValue: "facebook|https://facebook.com/yourbusiness",
      },
      maxItems: 10,
    },
    style: {
      type: "select",
      label: "Style",
      defaultValue: "icons",
      options: [
        { value: "icons", label: "Icons Only" },
        { value: "buttons", label: "Buttons" },
        { value: "colored", label: "Colored Icons" },
      ],
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    gap: {
      type: "select",
      label: "Gap",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
  },
  render: (props, editMode) => {
    const {
      platforms = [],
      style,
      size,
      gap,
    } = props as {
      platforms?: Array<{ platform: string; url: string } | string>;
      style?: string;
      size?: string;
      gap?: string;
    };

    const socialIcons = {
      facebook: Facebook,
      twitter: Twitter,
      instagram: Instagram,
      linkedin: Linkedin,
      youtube: Video,
      tiktok: Video,
      pinterest: Share2,
      whatsapp: Phone,
      email: Mail,
      website: Globe,
    };

    const socialColors = {
      facebook: "#1877F2",
      twitter: "#1DA1F2",
      instagram: "#E4405F",
      linkedin: "#0A66C2",
      youtube: "#FF0000",
      tiktok: "#000000",
      pinterest: "#E60023",
      whatsapp: "#25D366",
      email: "#EA4335",
      website: "#4285F4",
    };

    const sizeClasses = {
      small: "w-8 h-8",
      medium: "w-10 h-10",
      large: "w-12 h-12",
    };

    const iconSizeClasses = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6",
    };

    const gapClasses = {
      small: "gap-2",
      medium: "gap-3",
      large: "gap-4",
    };

    // Parse platforms
    const platformData = platforms.map((p) => {
      if (typeof p === "string") {
        const [platform, url] = p.split("|");
        return { platform, url };
      }
      return p;
    });

    const handleClick = (e: React.MouseEvent) => {
      if (editMode) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    return (
      <div
        className={cn(
          "flex flex-wrap items-center",
          gapClasses[gap as keyof typeof gapClasses] || gapClasses.medium,
        )}
      >
        {platformData.map((social, index) => {
          const Icon =
            socialIcons[social.platform as keyof typeof socialIcons] || Globe;
          const color =
            socialColors[social.platform as keyof typeof socialColors] ||
            "#000000";

          if (style === "buttons") {
            return (
              <Button
                key={index}
                variant="outline"
                size={(size as "sm" | "default" | "lg") || "default"}
                asChild={!editMode}
                onClick={editMode ? handleClick : undefined}
              >
                {!editMode ? (
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="capitalize">{social.platform}</span>
                  </a>
                ) : (
                  <>
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="capitalize">{social.platform}</span>
                  </>
                )}
              </Button>
            );
          }

          if (editMode) {
            return (
              <div
                key={index}
                onClick={handleClick}
                className={cn(
                  "flex items-center justify-center rounded-full transition-colors cursor-pointer",
                  sizeClasses[size as keyof typeof sizeClasses] ||
                    sizeClasses.medium,
                  style === "colored"
                    ? "text-white hover:opacity-80"
                    : "bg-muted hover:bg-muted-foreground/20",
                )}
                style={
                  style === "colored" ? { backgroundColor: color } : undefined
                }
              >
                <Icon
                  className={
                    iconSizeClasses[size as keyof typeof iconSizeClasses] ||
                    iconSizeClasses.medium
                  }
                />
              </div>
            );
          }

          return (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center rounded-full transition-colors",
                sizeClasses[size as keyof typeof sizeClasses] ||
                  sizeClasses.medium,
                style === "colored"
                  ? "text-white hover:opacity-80"
                  : "bg-muted hover:bg-muted-foreground/20",
              )}
              style={
                style === "colored" ? { backgroundColor: color } : undefined
              }
            >
              <Icon
                className={
                  iconSizeClasses[size as keyof typeof iconSizeClasses] ||
                  iconSizeClasses.medium
                }
              />
            </a>
          );
        })}
      </div>
    );
  },
  icon: Share2,
  category: "Basic",
  inline: true,
};

// Payment Methods Block
export const PaymentMethodsBlock: ComponentConfig = {
  fields: {
    methods: {
      type: "array",
      label: "Payment Methods",
      defaultValue: ["visa", "mastercard", "amex", "paypal"],
      itemType: {
        type: "select",
        label: "Method",
        options: [
          { value: "visa", label: "Visa" },
          { value: "mastercard", label: "Mastercard" },
          { value: "amex", label: "American Express" },
          { value: "discover", label: "Discover" },
          { value: "paypal", label: "PayPal" },
          { value: "applepay", label: "Apple Pay" },
          { value: "googlepay", label: "Google Pay" },
          { value: "cash", label: "Cash" },
          { value: "check", label: "Check" },
          { value: "venmo", label: "Venmo" },
          { value: "zelle", label: "Zelle" },
          { value: "bitcoin", label: "Bitcoin" },
        ],
      },
      maxItems: 12,
    },
    size: {
      type: "select",
      label: "Size",
      defaultValue: "medium",
      options: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    showLabel: {
      type: "select",
      label: "Show Label",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
  },
  render: (props) => {
    const {
      methods = [],
      size,
      showLabel,
    } = props as {
      methods?: string[];
      size?: string;
      showLabel?: string;
    };

    const sizeClasses = {
      small: "h-6",
      medium: "h-8",
      large: "h-10",
    };

    const paymentIcons = {
      visa: "💳",
      mastercard: "💳",
      amex: "💳",
      discover: "💳",
      paypal: "💰",
      applepay: "🍎",
      googlepay: "🪙",
      cash: "💵",
      check: "📝",
      venmo: "💸",
      zelle: "💱",
      bitcoin: "₿",
    };

    return (
      <div className="space-y-2">
        {showLabel === "yes" && (
          <p className="text-sm font-medium text-muted-foreground">
            We accept:
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          {methods.map((method, index) => (
            <div
              key={index}
              className={cn(
                "px-3 py-1.5 bg-muted rounded-md border flex items-center gap-2",
                sizeClasses[size as keyof typeof sizeClasses] ||
                  sizeClasses.medium,
              )}
            >
              <span className="text-lg">
                {paymentIcons[method as keyof typeof paymentIcons] || "💳"}
              </span>
              <span className="text-sm font-medium capitalize">
                {method.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  },
  icon: CreditCard,
  category: "Basic",
};

// List Block - Styled lists
export const ListBlock: ComponentConfig = {
  fields: {
    items: {
      type: "array",
      label: "List Items",
      defaultValue: ["First item", "Second item", "Third item"],
      itemType: {
        type: "text",
        label: "Item",
      },
      maxItems: 20,
    },
    style: {
      type: "select",
      label: "List Style",
      defaultValue: "bullet",
      options: [
        { value: "bullet", label: "Bullet Points" },
        { value: "number", label: "Numbered" },
        { value: "check", label: "Checkmarks" },
        { value: "arrow", label: "Arrows" },
        { value: "star", label: "Stars" },
      ],
    },
    columns: {
      type: "select",
      label: "Columns",
      defaultValue: "1",
      options: [
        { value: "1", label: "1 Column" },
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
      ],
    },
    spacing: {
      type: "select",
      label: "Spacing",
      defaultValue: "normal",
      options: [
        { value: "compact", label: "Compact" },
        { value: "normal", label: "Normal" },
        { value: "relaxed", label: "Relaxed" },
      ],
    },
  },
  render: (props) => {
    const {
      items = [],
      style,
      columns,
      spacing,
    } = props as {
      items?: string[];
      style?: string;
      columns?: string;
      spacing?: string;
    };

    const columnClasses = {
      "1": "",
      "2": "grid grid-cols-1 md:grid-cols-2 gap-4",
      "3": "grid grid-cols-1 md:grid-cols-3 gap-4",
    };

    const spacingClasses = {
      compact: "space-y-1",
      normal: "space-y-2",
      relaxed: "space-y-3",
    };

    const renderIcon = (style: string) => {
      switch (style) {
        case "check":
          return (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          );
        case "arrow":
          return <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />;
        case "star":
          return <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
        default:
          return null;
      }
    };

    const ListTag = style === "number" ? "ol" : "ul";
    const listClass = cn(
      columns !== "1"
        ? columnClasses[columns as keyof typeof columnClasses]
        : spacingClasses[spacing as keyof typeof spacingClasses] ||
            spacingClasses.normal,
      style === "number" && "list-decimal list-inside",
      style === "bullet" && "list-disc list-inside",
    );

    return (
      <ListTag className={listClass}>
        {items.map((item, index) => (
          <li
            key={index}
            className={cn(
              "flex items-start gap-2",
              (style === "bullet" || style === "number") && "list-item",
            )}
          >
            {(style === "check" || style === "arrow" || style === "star") &&
              renderIcon(style)}
            <span>{item}</span>
          </li>
        ))}
      </ListTag>
    );
  },
  icon: CheckCircle,
  category: "Basic",
};

// Gallery Grid Block - Image gallery with lightbox
export const GalleryGridBlock: ComponentConfig = {
  fields: {
    images: {
      type: "array",
      label: "Images",
      defaultValue: [],
      itemType: {
        type: "image",
        label: "Image",
      },
      maxItems: 20,
    },
    columns: {
      type: "select",
      label: "Columns",
      defaultValue: "3",
      options: [
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" },
        { value: "5", label: "5 Columns" },
        { value: "6", label: "6 Columns" },
      ],
    },
    gap: {
      type: "select",
      label: "Gap",
      defaultValue: "medium",
      options: [
        { value: "none", label: "None" },
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    },
    aspectRatio: {
      type: "select",
      label: "Aspect Ratio",
      defaultValue: "square",
      options: [
        { value: "square", label: "Square (1:1)" },
        { value: "landscape", label: "Landscape (4:3)" },
        { value: "portrait", label: "Portrait (3:4)" },
        { value: "wide", label: "Wide (16:9)" },
        { value: "auto", label: "Auto" },
      ],
    },
  },
  render: function GalleryBlockRender(props, _editMode, business) {
    const {
      images = [],
      columns = "3",
      gap = "medium",
      aspectRatio = "square",
    } = props as {
      images?: string[];
      columns?: string;
      gap?: string;
      aspectRatio?: string;
    };

    const [lightboxOpen, setLightboxOpen] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState(0);

    const businessData = business as Doc<"businesses"> | undefined;

    // Use business photos if no images provided
    const galleryImages =
      images.length > 0 ? images : businessData?.photos || [];

    if (galleryImages.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No images in gallery</p>
        </div>
      );
    }

    const gapClasses = {
      none: "gap-0",
      small: "gap-2",
      medium: "gap-4",
      large: "gap-6",
    };

    const aspectClasses = {
      square: "aspect-square",
      landscape: "aspect-[4/3]",
      portrait: "aspect-[3/4]",
      wide: "aspect-video",
      auto: "",
    };

    const openLightbox = (index: number) => {
      setCurrentImage(index);
      setLightboxOpen(true);
    };

    return (
      <>
        <div
          className={cn(
            "grid",
            gapClasses[gap as keyof typeof gapClasses],
            columns === "2" && "grid-cols-2",
            columns === "3" && "grid-cols-2 md:grid-cols-3",
            columns === "4" && "grid-cols-2 md:grid-cols-4",
            columns === "5" && "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
            columns === "6" && "grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
          )}
        >
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                "relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity",
                aspectClasses[aspectRatio as keyof typeof aspectClasses],
              )}
              onClick={() => openLightbox(index)}
            >
              {aspectRatio === "auto" ? (
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              ) : (
                <Image
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background"
              >
                <X className="w-6 h-6" />
              </button>

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentImage(
                        (prev) =>
                          (prev - 1 + galleryImages.length) %
                          galleryImages.length,
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentImage(
                        (prev) => (prev + 1) % galleryImages.length,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <Image
                src={galleryImages[currentImage]}
                alt={`Gallery image ${currentImage + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </>
    );
  },
  icon: ImageIcon,
  category: "Basic",
};

// Alert/Notice Block
export const AlertBlock: ComponentConfig = {
  fields: {
    type: {
      type: "select",
      label: "Alert Type",
      defaultValue: "info",
      options: [
        { value: "info", label: "Info" },
        { value: "success", label: "Success" },
        { value: "warning", label: "Warning" },
        { value: "error", label: "Error" },
        { value: "announcement", label: "Announcement" },
      ],
    },
    title: {
      type: "text",
      label: "Title",
      defaultValue: "Important Notice",
    },
    message: {
      type: "textarea",
      label: "Message",
      defaultValue: "This is an important message for our customers.",
      rows: 2,
      required: true,
    },
    showIcon: {
      type: "select",
      label: "Show Icon",
      defaultValue: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    dismissible: {
      type: "select",
      label: "Dismissible",
      defaultValue: "no",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
  },
  render: function AlertBlockRender(props, editMode) {
    const [dismissed, setDismissed] = React.useState(false);

    const { type, title, message, showIcon, dismissible } = props as {
      type?: string;
      title?: string;
      message?: string;
      showIcon?: string;
      dismissible?: string;
    };

    if (dismissed && !editMode) return null;

    const typeConfig = {
      info: {
        icon: Info,
        className: "bg-blue-50 border-blue-200 text-blue-800",
        iconClassName: "text-blue-600",
      },
      success: {
        icon: CheckCircle,
        className: "bg-green-50 border-green-200 text-green-800",
        iconClassName: "text-green-600",
      },
      warning: {
        icon: AlertCircle,
        className: "bg-yellow-50 border-yellow-200 text-yellow-800",
        iconClassName: "text-yellow-600",
      },
      error: {
        icon: AlertCircle,
        className: "bg-red-50 border-red-200 text-red-800",
        iconClassName: "text-red-600",
      },
      announcement: {
        icon: Sparkles,
        className: "bg-primary/10 border-primary/20 text-primary",
        iconClassName: "text-primary",
      },
    };

    const config =
      typeConfig[type as keyof typeof typeConfig] || typeConfig.info;
    const Icon = config.icon;

    return (
      <div
        className={cn(
          "relative flex gap-3 p-4 rounded-lg border",
          config.className,
        )}
      >
        {showIcon === "yes" && (
          <Icon
            className={cn("w-5 h-5 flex-shrink-0 mt-0.5", config.iconClassName)}
          />
        )}
        <div className="flex-1">
          {title && <h4 className="font-medium mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {dismissible === "yes" && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  },
  icon: AlertCircle,
  category: "Basic",
};

// Navigation Component
const NavigationComponent = ({
  showSections,
  customLinks,
  style,
  align,
  editMode,
}: {
  showSections?: string;
  customLinks?: Array<{ text: string; link: string }>;
  style?: string;
  align?: string;
  editMode?: boolean;
}) => {
  // Default navigation items - these would be populated from actual page sections
  const defaultSections = [
    { text: "About", link: "#about" },
    { text: "Services", link: "#services" },
    { text: "Gallery", link: "#gallery" },
    { text: "Reviews", link: "#reviews" },
    { text: "Contact", link: "#contact" },
  ];

  const sections =
    showSections === "custom" && customLinks?.length
      ? customLinks
      : defaultSections;

  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  // Mobile menu state
  const [isOpen, setIsOpen] = React.useState(false);

  if (style === "mobile" || style === "dropdown") {
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            if (!editMode) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className={cn(
            "p-2 rounded-md hover:bg-muted transition-colors",
            alignmentClasses[align as keyof typeof alignmentClasses],
          )}
        >
          <Menu className="w-6 h-6" />
        </button>

        {isOpen && !editMode && (
          <div className="absolute top-full mt-2 bg-background border rounded-md shadow-lg p-2 min-w-[200px] z-50">
            {sections.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="block px-4 py-2 hover:bg-muted rounded-md transition-colors"
                onClick={(e) => {
                  if (editMode) e.preventDefault();
                  setIsOpen(false);
                }}
              >
                {item.text}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Horizontal navigation
  return (
    <nav
      className={cn(
        "flex flex-wrap gap-6",
        alignmentClasses[align as keyof typeof alignmentClasses],
      )}
    >
      {sections.map((item, index) => (
        <a
          key={index}
          href={item.link}
          className="text-sm font-medium hover:text-primary transition-colors"
          onClick={(e) => {
            if (editMode) e.preventDefault();
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
};

// Navigation Block
export const NavigationBlock: ComponentConfig = {
  fields: {
    showSections: {
      type: "select",
      label: "Show Page Sections",
      defaultValue: "auto",
      options: [
        { value: "auto", label: "Automatic (All Sections)" },
        { value: "custom", label: "Custom Selection" },
      ],
    },
    hiddenSections: {
      type: "array",
      label: "Hidden Sections",
      defaultValue: [],
      itemType: {
        type: "text",
        label: "Section ID",
      },
      hidden: true,
    },
    customLinks: {
      type: "array",
      label: "Custom Links",
      defaultValue: [],
      itemType: {
        type: "text",
        label: "Link",
      },
    },
    style: {
      type: "select",
      label: "Navigation Style",
      defaultValue: "horizontal",
      options: [
        { value: "horizontal", label: "Horizontal" },
        { value: "dropdown", label: "Dropdown Menu" },
        { value: "mobile", label: "Mobile Menu (Hamburger)" },
      ],
    },
    align: {
      type: "select",
      label: "Alignment",
      defaultValue: "center",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
  },
  render: (props, editMode) => {
    return <NavigationComponent {...props} editMode={editMode} />;
  },
  icon: Menu,
  category: "Basic",
};

// Contact Form Block - Composed from basic blocks
export const ContactFormBlock: ComponentConfig = {
  fields: {
    title: {
      type: "text",
      label: "Form Title",
      defaultValue: "Get in Touch",
    },
    subtitle: {
      type: "text",
      label: "Form Subtitle",
      defaultValue: "We'd love to hear from you",
    },
    submitText: {
      type: "text",
      label: "Submit Button Text",
      defaultValue: "Send Message",
    },
  },
  isTemplate: true,
  template: (_business?: BusinessData) => {
    return [
      {
        type: "CardBlock",
        props: {
          title: "Get in Touch",
          description: "We'd love to hear from you",
          variant: "default",
        },
        children: [
          {
            type: "ColumnsBlock",
            props: {
              columns: "2",
              gap: "medium",
              mobileColumns: "1",
            },
            children: [
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "TextBlock",
                    props: {
                      content: "Name *",
                      variant: "small",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 8 },
                  },
                  {
                    type: "AlertBlock",
                    props: {
                      type: "info",
                      title: "",
                      message: "Name input field would be here",
                      showIcon: "no",
                      dismissible: "no",
                    },
                  },
                ],
              },
              {
                type: "ColumnContentBlock",
                props: {},
                children: [
                  {
                    type: "TextBlock",
                    props: {
                      content: "Email *",
                      variant: "small",
                      align: "left",
                    },
                  },
                  {
                    type: "SpacerBlock",
                    props: { height: 8 },
                  },
                  {
                    type: "AlertBlock",
                    props: {
                      type: "info",
                      title: "",
                      message: "Email input field would be here",
                      showIcon: "no",
                      dismissible: "no",
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "SpacerBlock",
            props: { height: 16 },
          },
          {
            type: "TextBlock",
            props: {
              content: "Message *",
              variant: "small",
              align: "left",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 8 },
          },
          {
            type: "AlertBlock",
            props: {
              type: "info",
              title: "",
              message: "Message textarea would be here",
              showIcon: "no",
              dismissible: "no",
            },
          },
          {
            type: "SpacerBlock",
            props: { height: 24 },
          },
          {
            type: "ButtonBlock",
            props: {
              text: "Send Message",
              variant: "default",
              size: "lg",
              fullWidth: "full",
              align: "left",
            },
          },
        ],
      },
    ];
  },
  render: (props, _editMode, _business) => {
    const { title, subtitle } = props as { title?: string; subtitle?: string };

    return (
      <div className="p-8 text-center bg-muted rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          {title || "Contact Form Template"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {subtitle ||
            "This is a template - drag and drop to expand into full contact form"}
        </p>
      </div>
    );
  },
  icon: Mail,
  category: "Basic",
};
