"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";
import { AboutContentUpdate } from "./types";
import { getBusinessCategoryTheme } from "../../core/business-category-themes";

interface AboutSectionProps {
  type: string;
  title: string;
  content?: string;
  image?: string;
  imagePosition?: "left" | "right";
  column1?: string;
  column2?: string;
  timeline?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  features?: Array<{ icon?: string; title: string; description: string }>;
  stats?: Array<{ value: string; label: string }>;
  editMode?: boolean;
  onUpdate?: (content: AboutContentUpdate) => void;
  accentColor?: string;
  businessCategory?: string;
  styleOverrides?: React.CSSProperties;
}

export function AboutSection({
  type,
  title,
  content,
  image,
  imagePosition = "right",
  column1,
  column2,
  timeline,
  features,
  stats,
  editMode,
  onUpdate,
  accentColor = "#3b82f6",
  businessCategory,
  styleOverrides,
}: AboutSectionProps) {
  const categoryTheme = getBusinessCategoryTheme(businessCategory);
  const themeColors = categoryTheme.colors;

  // Use theme values with fallbacks
  const finalAccentColor = accentColor || themeColors.primary;
  const handleContentEdit = (field: string, value: unknown) => {
    if (onUpdate) {
      onUpdate({
        title,
        content,
        image,
        imagePosition,
        column1,
        column2,
        timeline,
        [field]: value,
      });
    }
  };

  // Text with side image
  if (type === "about-section") {
    return (
      <div
        className="py-16 md:py-24"
      >
        <div className="container mx-auto px-6">
          <div
            className={cn(
              "grid md:grid-cols-2 gap-12 items-center",
              imagePosition === "left" && "md:flex-row-reverse",
            )}
          >
            <div
              className={cn(
                "space-y-6",
                imagePosition === "left" ? "md:order-2" : "md:order-1",
              )}
            >
              <h2
                className="text-3xl md:text-5xl font-bold"
                style={{ color: themeColors.textPrimary }}
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit("title", e.currentTarget.textContent || "")
                }
              >
                {title}
              </h2>
              <div
                className="w-20 h-1 rounded-full"
                style={{ backgroundColor: finalAccentColor }}
              />
              <p
                className="text-lg leading-relaxed"
                style={{ color: themeColors.textSecondary }}
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "content",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {content}
              </p>
              {stats && stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center md:text-left">
                      <div
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{ color: accentColor }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className={cn(
                "relative",
                imagePosition === "left" ? "md:order-1" : "md:order-2",
              )}
            >
              {image && (
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={image}
                    alt="About us"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                  <div
                    className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-20"
                    style={{ backgroundColor: accentColor }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // About with Features
  if (type === "about-features") {
    return (
      <div className="py-16 md:py-24" style={styleOverrides}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("title", e.currentTarget.textContent || "")
              }
            >
              {title}
            </h2>
            <p
              className="text-lg text-muted-foreground"
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) =>
                handleContentEdit("content", e.currentTarget.textContent || "")
              }
            >
              {content}
            </p>
          </div>
          {features && features.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-6 rounded-xl transition-all duration-300",
                    "hover:shadow-lg hover:scale-105",
                    "bg-card border border-border",
                  )}
                >
                  {feature.icon && (
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${accentColor}20` }}
                    >
                      <span className="text-2xl" style={{ color: accentColor }}>
                        {feature.icon}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Two column text
  if (type === "about-columns") {
    return (
      <div className="py-16 md:py-24" style={styleOverrides}>
        <div className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-12"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-4">
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "column1",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {column1}
              </p>
            </div>
            <div className="space-y-4">
              <p
                className="text-lg text-muted-foreground leading-relaxed"
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleContentEdit(
                    "column2",
                    e.currentTarget.textContent || "",
                  )
                }
              >
                {column2}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Timeline
  if (type === "about-timeline" && timeline) {
    return (
      <div className="py-16 md:py-24" style={styleOverrides}>
        <div className="container mx-auto px-6">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-16"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20" />

              {timeline.map((item, index) => (
                <div
                  key={index}
                  className="relative flex items-start mb-12 group"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-8 w-4 h-4 rounded-full -translate-x-1/2 group-hover:scale-125 transition-transform duration-300"
                    style={{ backgroundColor: accentColor }}
                  />

                  <div className="ml-20 p-6 rounded-xl bg-card border border-border hover:shadow-lg transition-all duration-300">
                    <div
                      className="text-sm font-bold mb-2 uppercase tracking-wider"
                      style={{ color: accentColor }}
                    >
                      {item.year}
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal about
  return (
    <div className="py-16 md:py-24" style={styleOverrides}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className={cn(
              "text-3xl md:text-5xl font-bold mb-6",
              "bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent",
            )}
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("title", e.currentTarget.textContent || "")
            }
          >
            {title}
          </h2>
          <div
            className="w-24 h-1 rounded-full mx-auto mb-8"
            style={{ backgroundColor: accentColor }}
          />
          <p
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            contentEditable={editMode}
            suppressContentEditableWarning
            onBlur={(e) =>
              handleContentEdit("content", e.currentTarget.textContent || "")
            }
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}
