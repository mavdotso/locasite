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
import ReviewsSection from "./components/reviews-section";

interface SectionRendererProps {
  data: SimpleComponentData;
  editMode?: boolean;
  onUpdate?: (newData: SimpleComponentData) => void;
  businessData?: Record<string, unknown>; // Business data for template variable replacement
  businessCategory?: string; // Business category for theming
  businessId?: string; // Business ID for contact form submissions
}

// Map of section types to their components
const sectionComponents = {
  // Header variations
  "header-section": HeaderSection,
  "header-classic": HeaderSection,
  "header-centered": HeaderSection,
  "header-minimal": HeaderSection,

  // Hero variations
  "hero-section": HeroSection,
  "hero-split": HeroSection,
  "hero-minimal": HeroSection,

  // About variations
  "about-section": AboutSection,
  "about-features": AboutSection,
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

  // Reviews variations
  "reviews-section": ReviewsSection,
};

export function SectionRenderer({
  data,
  editMode = false,
  onUpdate,
  businessData,
  businessCategory,
  businessId,
}: SectionRendererProps) {
  const Component = sectionComponents[
    data.type as keyof typeof sectionComponents
  ] as React.ComponentType<Record<string, unknown>>;

  if (!Component) {
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
    textAlign: data.style?.textAlign,
  };

  const sectionClasses = cn("simple-section", `section-${data.type}`);

  return (
    <section
      id={data.id}
      className={sectionClasses}
      style={sectionStyle}
      data-section-id={data.id}
    >
      <Component
        {...(processedContent as Record<string, unknown>)}
        type={data.type}
        editMode={editMode}
        businessCategory={businessCategory}
        styleOverrides={{
          backgroundColor: data.style?.backgroundColor,
          color: data.style?.textColor,
          textAlign: data.style?.textAlign,
        }}
        onContentUpdate={(newContent: Record<string, unknown>) => {
          if (onUpdate) {
            onUpdate({
              ...data,
              content: newContent,
            });
          }
        }}
        businessId={businessId}
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
