"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { SectionRenderer } from "@/app/components/simple-builder/sections/section-renderer";
import type {
  SimplePageData,
  SectionInstance,
} from "@/app/components/simple-builder/types/simple-builder";
import { getVariationById } from "@/app/components/simple-builder/sections/section-variations";
import { getPresetByType } from "@/app/components/simple-builder/sections/business-presets";

interface SitePreviewFrameProps {
  business: Doc<"businesses">;
  pageContent: string | null;
}

// Helper: detect business type for preset selection
function detectBusinessType(business: {
  category?: string;
  description?: string;
  name?: string;
}):
  | "restaurant"
  | "salon"
  | "medical"
  | "professional"
  | "retail"
  | "automotive" {
  const category = business.category?.toLowerCase() || "";
  const description = business.description?.toLowerCase() || "";
  const name = business.name?.toLowerCase() || "";

  if (
    category.includes("restaurant") ||
    category.includes("food") ||
    category.includes("cafe") ||
    description.includes("restaurant") ||
    description.includes("dining") ||
    name.includes("restaurant") ||
    name.includes("cafe")
  )
    return "restaurant";

  if (
    category.includes("beauty") ||
    category.includes("salon") ||
    category.includes("spa") ||
    description.includes("salon") ||
    description.includes("beauty") ||
    name.includes("salon") ||
    name.includes("spa")
  )
    return "salon";

  if (
    category.includes("medical") ||
    category.includes("health") ||
    category.includes("clinic") ||
    description.includes("medical") ||
    description.includes("doctor") ||
    name.includes("clinic") ||
    name.includes("medical")
  )
    return "medical";

  if (
    category.includes("retail") ||
    category.includes("store") ||
    category.includes("shop") ||
    description.includes("retail") ||
    description.includes("store") ||
    name.includes("shop") ||
    name.includes("store")
  )
    return "retail";

  if (
    category.includes("auto") ||
    category.includes("car") ||
    category.includes("mechanic") ||
    description.includes("auto") ||
    description.includes("repair") ||
    name.includes("auto") ||
    name.includes("mechanic")
  )
    return "automotive";

  return "professional";
}

// Generate unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Resolves the page content to render. If the business already has page content
 * stored in the database (simple mode), use it. Otherwise, generate fallback
 * content from a business-type preset.
 */
function resolvePageContent(
  business: Doc<"businesses">,
  rawPageContent: string | null,
): string {
  if (rawPageContent) {
    try {
      const parsed = JSON.parse(rawPageContent);
      if (parsed.mode === "simple" && parsed.sections) {
        return rawPageContent;
      }
    } catch {
      // Invalid JSON -- fall through to generate defaults
    }
  }

  // Generate default content from preset
  const businessType = detectBusinessType(business);
  const preset = getPresetByType(businessType);

  const initialData: SimplePageData = {
    title: business.name || "Welcome",
    sections: [],
    theme: {
      colors: {
        primary: "#000000",
        secondary: "#666666",
        accent: "#0066cc",
        background: "#ffffff",
        text: "#333333",
        muted: "#f5f5f5",
      },
      fonts: {
        heading: "Inter",
        body: "Inter",
      },
      spacing: {
        section: "80px",
        element: "40px",
      },
    },
  };

  if (preset) {
    initialData.sections = preset.sections
      .map((sectionConfig, index) => {
        const variation = getVariationById(sectionConfig.variationId);
        if (!variation) return null;
        return {
          id: generateId(),
          variationId: sectionConfig.variationId,
          order: index,
          data: JSON.parse(JSON.stringify(variation.template)),
        } as SectionInstance;
      })
      .filter(Boolean) as SectionInstance[];

    initialData.theme = preset.theme;
  } else {
    const defaultVariations = [
      "hero-center-bg",
      "about-text-image",
      "services-3-column",
      "contact-form-map",
    ];
    initialData.sections = defaultVariations
      .map((varId, index) => {
        const v = getVariationById(varId);
        if (!v) return null;
        return {
          id: generateId(),
          variationId: varId,
          order: index,
          data: v.template,
        } as SectionInstance;
      })
      .filter(Boolean) as SectionInstance[];
  }

  return JSON.stringify({
    mode: "simple" as const,
    title: initialData.title,
    sections: initialData.sections,
    theme: initialData.theme,
  });
}

export function SitePreviewFrame({
  business,
  pageContent,
}: SitePreviewFrameProps) {
  const resolvedContent = resolvePageContent(business, pageContent);

  let parsedContent: {
    mode?: "simple" | "pro";
    sections?: SectionInstance[];
    theme?: SimplePageData["theme"];
  };

  try {
    parsedContent = JSON.parse(resolvedContent);
  } catch {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        Unable to load preview.
      </div>
    );
  }

  // Prepare business data for template variable replacement
  const businessData: Record<string, string> = {
    businessName: business.name || "",
    businessAddress: business.address || "",
    businessPhone: business.phone || "",
    businessEmail: business.email || "",
    businessDescription: business.description || "",
    businessHours: Array.isArray(business.hours)
      ? business.hours.join(", ")
      : "",
    businessWebsite: business.website || "",
    businessPhotos: Array.isArray(business.photos)
      ? business.photos.join(",")
      : "",
    businessMainPhoto: business.photos?.[0] || "",
  };

  if (!parsedContent.sections || parsedContent.sections.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        No content to preview.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/60 shadow-sm bg-background">
      {/* Apply theme CSS variables */}
      {parsedContent.theme && (
        <style jsx global>{`
          .site-preview-frame :root,
          .site-preview-frame {
            --simple-primary: ${parsedContent.theme.colors.primary};
            --simple-secondary: ${parsedContent.theme.colors.secondary};
            --simple-accent: ${parsedContent.theme.colors.accent};
            --simple-background: ${parsedContent.theme.colors.background};
            --simple-text: ${parsedContent.theme.colors.text};
            --simple-muted: ${parsedContent.theme.colors.muted};
            --simple-font-heading: ${parsedContent.theme.fonts.heading};
            --simple-font-body: ${parsedContent.theme.fonts.body};
          }
          .site-preview-frame .simple-section {
            font-family: var(--simple-font-body);
          }
          .site-preview-frame .simple-section h1,
          .site-preview-frame .simple-section h2,
          .site-preview-frame .simple-section h3,
          .site-preview-frame .simple-section h4,
          .site-preview-frame .simple-section h5,
          .site-preview-frame .simple-section h6 {
            font-family: var(--simple-font-heading);
          }
        `}</style>
      )}

      <div className="site-preview-frame max-h-[70vh] overflow-y-auto">
        {parsedContent.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionRenderer
              key={section.id}
              data={section.data}
              businessData={businessData}
              businessId={business._id}
              editMode={false}
            />
          ))}
      </div>
    </div>
  );
}
