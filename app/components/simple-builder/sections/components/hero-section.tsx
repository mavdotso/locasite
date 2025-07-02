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
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  backgroundImage?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  overlayGradient?: string;
  image?: string;
  imageAlt?: string;
  editMode?: boolean;
  onUpdate?: (content: HeroContentUpdate) => void;
  decorativeElement?: "dots" | "waves" | "circles" | "none";
  accentColor?: string;
}

export function HeroSection({
  type,
  title,
  subtitle,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  backgroundImage,
  overlay,
  overlayOpacity = 0.5,
  overlayGradient,
  image,
  imageAlt,
  editMode,
  onUpdate,
  decorativeElement = "none",
  accentColor = "#3b82f6",
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

  // Decorative elements
  const renderDecorativeElement = () => {
    switch (decorativeElement) {
      case "dots":
        return (
          <div className="absolute top-10 right-10 opacity-10">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <pattern
                id="dots"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="2" fill={accentColor} />
              </pattern>
              <rect width="120" height="120" fill="url(#dots)" />
            </svg>
          </div>
        );
      case "waves":
        return (
          <div className="absolute bottom-0 left-0 right-0 opacity-10">
            <svg viewBox="0 0 1440 320" className="w-full">
              <path
                fill={accentColor}
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        );
      case "circles":
        return (
          <>
            <div
              className="absolute top-20 left-20 w-64 h-64 rounded-full opacity-5"
              style={{ backgroundColor: accentColor }}
            />
            <div
              className="absolute bottom-20 right-20 w-96 h-96 rounded-full opacity-5"
              style={{ backgroundColor: accentColor }}
            />
          </>
        );
      default:
        return null;
    }
  };

  // Center Hero with Background
  if (type === "hero-section") {
    // Check if we have a real image URL (not a template variable or placeholder)
    const hasRealImage =
      backgroundImage &&
      !backgroundImage.includes("{") &&
      !backgroundImage.includes("placeholder") &&
      (backgroundImage.startsWith("http") || backgroundImage.startsWith("/"));

    return (
      <div className="relative min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Layer */}
        {hasRealImage ? (
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
                className="absolute inset-0"
                style={{
                  background: overlayGradient || "rgba(0,0,0,0.4)",
                  opacity: overlayGradient ? 1 : overlayOpacity,
                }}
              />
            )}
          </>
        ) : (
          // Beautiful gradient background as fallback
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        )}

        {renderDecorativeElement()}

        {/* Content Layer */}
        <div
          className={cn(
            "relative z-10 text-center max-w-5xl mx-auto px-6 py-12",
            hasRealImage && overlay ? "text-white" : "text-foreground",
          )}
        >
          <h1
            className={cn(
              "text-5xl md:text-7xl font-bold mb-6",
              "leading-tight tracking-tight",
              "animate-fadeInUp",
            )}
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
              className={cn(
                "text-xl md:text-2xl mb-10 max-w-3xl mx-auto",
                "leading-relaxed",
                hasRealImage && overlay
                  ? "opacity-90"
                  : "text-muted-foreground",
                "animate-fadeInUp animation-delay-100",
              )}
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("subtitle", e.currentTarget.textContent || "")
              }
            >
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-200">
            {ctaText && ctaLink && (
              <Link
                href={ctaLink}
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "transition-all duration-300 transform hover:scale-105",
                  "shadow-lg hover:shadow-xl",
                )}
              >
                {ctaText}
              </Link>
            )}
            {secondaryCtaText && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className={cn(
                  "inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg",
                  hasRealImage && overlay
                    ? "bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white/30"
                    : "bg-background border-2 border-border hover:bg-accent",
                  "transition-all duration-300",
                )}
              >
                {secondaryCtaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Split Screen Hero
  if (type === "hero-split") {
    return (
      <div className="grid lg:grid-cols-2 min-h-[700px] overflow-hidden">
        <div className="flex items-center justify-center p-8 md:p-16 lg:p-20 order-2 lg:order-1">
          <div className="max-w-xl w-full">
            <h1
              className={cn(
                "text-4xl md:text-6xl font-bold mb-6",
                "leading-tight tracking-tight",
                "animate-slideInLeft",
              )}
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
                className={cn(
                  "text-lg md:text-xl mb-8 text-muted-foreground",
                  "leading-relaxed",
                  "animate-slideInLeft animation-delay-100",
                )}
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
            <div className="flex flex-col sm:flex-row gap-4 animate-slideInLeft animation-delay-200">
              {ctaText && ctaLink && (
                <Link
                  href={ctaLink}
                  className={cn(
                    "inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    "transition-all duration-300 transform hover:scale-105",
                    "shadow-md hover:shadow-lg",
                  )}
                >
                  {ctaText}
                </Link>
              )}
              {secondaryCtaText && secondaryCtaLink && (
                <Link
                  href={secondaryCtaLink}
                  className={cn(
                    "inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg",
                    "border-2 border-border hover:bg-accent",
                    "transition-all duration-300",
                  )}
                >
                  {secondaryCtaText}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="relative min-h-[400px] lg:min-h-full order-1 lg:order-2">
          {image && (
            <Image
              src={image}
              alt={imageAlt || "Hero image"}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent opacity-20" />
        </div>
      </div>
    );
  }

  // Minimal Hero (default)
  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      {renderDecorativeElement()}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1
          className={cn(
            "text-4xl md:text-6xl font-bold mb-6",
            "leading-tight tracking-tight",
            "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",
            "animate-fadeIn",
          )}
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
            className={cn(
              "text-lg md:text-xl mb-10 text-muted-foreground max-w-2xl mx-auto",
              "leading-relaxed",
              "animate-fadeIn animation-delay-100",
            )}
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("subtitle", e.currentTarget.textContent || "")
            }
          >
            {subtitle}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn animation-delay-200">
          {ctaText && ctaLink && (
            <Link
              href={ctaLink}
              className={cn(
                "inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full",
                "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
                "hover:shadow-lg transition-all duration-300 transform hover:scale-105",
              )}
            >
              {ctaText}
            </Link>
          )}
          {secondaryCtaText && secondaryCtaLink && (
            <Link
              href={secondaryCtaLink}
              className={cn(
                "inline-flex items-center justify-center px-8 py-4 font-semibold rounded-full",
                "border-2 border-border hover:border-primary hover:text-primary",
                "transition-all duration-300",
              )}
            >
              {secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
