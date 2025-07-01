"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/app/lib/utils";
import { HeroContentUpdate } from "./types";

interface HeroSectionProps {
  type: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  image?: string;
  imageAlt?: string;
  editMode?: boolean;
  onUpdate?: (content: HeroContentUpdate) => void;
}

export function HeroSection({
  type,
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  overlay,
  overlayOpacity = 0.5,
  image,
  imageAlt,
  editMode,
  onUpdate,
}: HeroSectionProps) {
  const handleContentEdit = (field: string, value: string) => {
    if (onUpdate) {
      onUpdate({
        title,
        subtitle,
        ctaText,
        ctaLink,
        backgroundImage,
        overlay,
        overlayOpacity,
        image,
        imageAlt,
        [field]: value,
      });
    }
  };

  // Render based on hero type
  if (type === "hero-section") {
    // Center hero with background
    return (
      <div className="relative min-h-[600px] flex items-center justify-center">
        {backgroundImage && (
          <>
            <Image
              src={backgroundImage}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
            {overlay && (
              <div
                className="absolute inset-0 bg-black"
                style={{ opacity: overlayOpacity }}
              />
            )}
          </>
        )}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-xl md:text-2xl mb-8 opacity-90"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("subtitle", e.currentTarget.textContent || "")
              }
            >
              {subtitle}
            </p>
          )}
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className={cn(
                "inline-block px-8 py-3 text-lg font-medium rounded-md",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "transition-colors",
              )}
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (type === "hero-split") {
    // Split screen hero
    return (
      <div className="grid md:grid-cols-2 min-h-[600px]">
        <div className="flex items-center justify-center p-8 md:p-12">
          <div className="max-w-lg">
            <h1
              className="text-3xl md:text-5xl font-bold mb-4"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("title", e.currentTarget.textContent || "")
              }
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-lg md:text-xl mb-8 text-muted-foreground"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "subtitle",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {subtitle}
              </p>
            )}
            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className={cn(
                  "inline-block px-6 py-3 font-medium rounded-md",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "transition-colors",
                )}
              >
                {ctaText}
              </Link>
            )}
          </div>
        </div>
        <div className="relative min-h-[400px] md:min-h-full">
          {image && (
            <Image
              src={image}
              alt={imageAlt || "Hero image"}
              fill
              className="object-cover"
            />
          )}
        </div>
      </div>
    );
  }

  // Minimal hero (default)
  return (
    <div className="text-center py-16 md:py-24">
      <h1
        className="text-3xl md:text-5xl font-bold mb-4"
        contentEditable={editMode}
        suppressContentEditableWarning
        onBlur={(e) =>
          handleContentEdit("title", e.currentTarget.textContent || "")
        }
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-lg md:text-xl mb-8 text-muted-foreground max-w-2xl mx-auto"
          contentEditable={editMode}
          suppressContentEditableWarning
          onBlur={(e) =>
            handleContentEdit("subtitle", e.currentTarget.textContent || "")
          }
        >
          {subtitle}
        </p>
      )}
      {ctaText && ctaLink && (
        <Link
          href={ctaLink}
          className={cn(
            "inline-block px-6 py-3 font-medium rounded-md",
            "border border-border hover:bg-accent",
            "transition-colors",
          )}
        >
          {ctaText}
        </Link>
      )}
    </div>
  );
}
