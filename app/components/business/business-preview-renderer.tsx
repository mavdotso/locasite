"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import {
  SimplePageData,
  SectionInstance,
} from "@/app/components/simple-builder/types/simple-builder";
import { SectionRenderer } from "@/app/components/simple-builder/sections/section-renderer";

interface BusinessPreviewRendererProps {
  business: Doc<"businesses">;
  pageContent: string;
}

export default function BusinessPreviewRenderer({
  business,
  pageContent,
}: BusinessPreviewRendererProps) {
  // Parse the page content
  let parsedContent: {
    mode?: "simple" | "pro";
    sections?: SectionInstance[];
    theme?: SimplePageData["theme"];
  };

  try {
    parsedContent = JSON.parse(pageContent);
  } catch (e) {
    console.error("Failed to parse page content", e);
    return <main className="flex-grow"></main>;
  }

  // Prepare business data for template variable replacement
  const businessData = {
    businessName: business.name,
    businessAddress: business.address,
    businessPhone: business.phone,
    businessEmail: business.email,
    businessDescription: business.description,
    businessHours: business.hours,
    businessWebsite: business.website,
    businessPhotos: business.photos,
    businessMainPhoto: business.photos?.[0],
  };

  // Only render simple mode sections
  if (parsedContent.sections) {
    return (
      <main className="flex-grow">
        {/* Apply theme if available */}
        {parsedContent.theme && (
          <style jsx global>{`
            :root {
              --simple-primary: ${parsedContent.theme.colors.primary};
              --simple-secondary: ${parsedContent.theme.colors.secondary};
              --simple-accent: ${parsedContent.theme.colors.accent};
              --simple-background: ${parsedContent.theme.colors.background};
              --simple-text: ${parsedContent.theme.colors.text};
              --simple-muted: ${parsedContent.theme.colors.muted};
              --simple-font-heading: ${parsedContent.theme.fonts.heading};
              --simple-font-body: ${parsedContent.theme.fonts.body};
            }
            .simple-section {
              font-family: var(--simple-font-body);
            }
            .simple-section h1,
            .simple-section h2,
            .simple-section h3,
            .simple-section h4,
            .simple-section h5,
            .simple-section h6 {
              font-family: var(--simple-font-heading);
            }
          `}</style>
        )}

        {/* Render sections */}
        {parsedContent.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionRenderer
              key={section.id}
              data={section.data}
              businessData={businessData}
              editMode={false}
            />
          ))}
      </main>
    );
  }

  // No content to render
  return <main className="flex-grow"></main>;
}
