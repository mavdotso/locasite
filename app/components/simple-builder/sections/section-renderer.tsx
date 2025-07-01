"use client";

import React from "react";
import { SimpleComponentData } from "../types/simple-builder";
import { cn } from "@/app/lib/utils";

// Import section components
import { HeaderSection } from "./components/header-section";
import { HeroSection } from "./components/hero-section";
import { AboutSection } from "./components/about-section";
import { ServicesSection } from "./components/services-section";
import { GallerySection } from "./components/gallery-section";
import { ContactSection } from "./components/contact-section";

interface SectionRendererProps {
  data: SimpleComponentData;
  editMode?: boolean;
  onUpdate?: (newData: SimpleComponentData) => void;
  businessData?: Record<string, unknown>; // Business data for template variable replacement
}

// Map of section types to their components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sectionComponents: Record<string, React.ComponentType<any>> = {
  // Header variations
  "header-classic": HeaderSection,
  "header-centered": HeaderSection,
  "header-minimal": HeaderSection,

  // Hero variations
  "hero-section": HeroSection,
  "hero-split": HeroSection,
  "hero-minimal": HeroSection,

  // About variations
  "about-section": AboutSection,
  "about-columns": AboutSection,
  "about-timeline": AboutSection,

  // Services variations
  "services-grid": ServicesSection,
  "services-list": ServicesSection,
  "services-pricing": ServicesSection,

  // Gallery variations
  "gallery-grid": GallerySection,
  "gallery-masonry": GallerySection,
  "gallery-before-after": GallerySection,

  // Contact variations
  "contact-form-map": ContactSection,
  "contact-cards": ContactSection,
  "contact-social": ContactSection,
};

export function SectionRenderer({
  data,
  editMode = false,
  onUpdate,
  businessData,
}: SectionRendererProps) {
  const Component = sectionComponents[data.type];

  if (!Component) {
    console.warn(`Unknown section type: ${data.type}`);
    return (
      <div className="p-8 text-center bg-muted">
        <p className="text-muted-foreground">
          Unknown section type: {data.type}
        </p>
      </div>
    );
  }

  // Replace template variables with business data
  const processedContent = processTemplateVariables(data.content, businessData);

  // Apply styles
  const sectionStyle: React.CSSProperties = {
    backgroundColor: data.style?.backgroundColor,
    color: data.style?.textColor,
    padding: data.style?.padding,
    margin: data.style?.margin,
    textAlign: data.style?.textAlign,
  };

  return (
    <section
      className={cn("simple-section", `section-${data.type}`)}
      style={sectionStyle}
      data-section-id={data.id}
    >
      <Component
        {...processedContent}
        type={data.type}
        editMode={editMode}
        onUpdate={(newContent: Record<string, unknown>) => {
          if (onUpdate) {
            onUpdate({
              ...data,
              content: newContent,
            });
          }
        }}
      />
    </section>
  );
}

// Helper function to replace template variables
function processTemplateVariables(
  content: Record<string, unknown>,
  businessData?: Record<string, unknown>,
): Record<string, unknown> {
  if (!businessData) return content;

  const processed: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(content)) {
    if (typeof value === "string") {
      // Replace template variables like {businessName}
      processed[key] = value.replace(/\{(\w+)\}/g, (match, variable) => {
        return String(businessData[variable] || match);
      });
    } else if (Array.isArray(value)) {
      processed[key] = value.map((item) =>
        typeof item === "object"
          ? processTemplateVariables(
              item as Record<string, unknown>,
              businessData,
            )
          : item,
      );
    } else if (typeof value === "object" && value !== null) {
      processed[key] = processTemplateVariables(
        value as Record<string, unknown>,
        businessData,
      );
    } else {
      processed[key] = value;
    }
  }

  return processed;
}
