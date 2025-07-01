"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { allComponentConfigs as componentConfigs } from "@/app/components/visual-editor/config/all-components";
import { ComponentData } from "@/app/types/visual-editor";
import {
  SimplePageData,
  SectionInstance,
} from "@/app/components/simple-builder/types/simple-builder";
import { SectionRenderer } from "@/app/components/simple-builder/sections/section-renderer";
import { useAnalytics } from "@/app/hooks/use-analytics";

interface BusinessPageRendererProps {
  business: Doc<"businesses">;
  pageContent: string;
  mode?: "simple" | "pro"; // Optional mode override
}

export default function BusinessPageRenderer({
  business,
  pageContent,
  mode,
}: BusinessPageRendererProps) {
  // Initialize analytics tracking
  useAnalytics({
    businessId: business._id,
    domainId: business.domainId,
    enabled: true,
  });

  // Parse the page content
  let parsedContent: {
    mode?: "simple" | "pro";
    components?: ComponentData[];
    sections?: SectionInstance[];
    theme?: SimplePageData["theme"];
  };

  try {
    parsedContent = JSON.parse(pageContent);
  } catch (e) {
    console.error("Failed to parse page content", e);
    return <main className="flex-grow"></main>;
  }

  // Determine which mode to use
  const renderMode = mode || parsedContent.mode || "simple";

  // Prepare business data for template variable replacement
  const businessData = {
    businessName: business.name,
    businessAddress: business.address,
    businessPhone: business.phone,
    businessEmail: business.email,
    businessDescription: business.description,
    businessHours: business.hours,
    businessWebsite: business.website,
    // Add more business fields as needed
  };

  // Render Simple Mode
  if (renderMode === "simple" && parsedContent.sections) {
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

  // Render Pro Mode (existing visual editor components)
  if (parsedContent.components) {
    // Recursive function to render components with their children
    const renderComponent = (component: ComponentData): React.ReactNode => {
      const config = componentConfigs[component.type];
      if (!config) return null;

      // Pass business data to components that need it
      const componentProps = {
        ...component.props,
        business,
      };

      // Render children if component accepts them
      let children: React.ReactNode = null;
      if (
        config.acceptsChildren &&
        component.children &&
        component.children.length > 0
      ) {
        // For ColumnsBlock, we need to handle column distribution
        if (component.type === "ColumnsBlock") {
          const columnCount = parseInt(
            (component.props.columns as string) || "2",
          );
          const columnContents: React.ReactNode[][] = Array(columnCount)
            .fill(null)
            .map(() => []);

          // Distribute children to columns based on metadata
          component.children.forEach((child, index) => {
            const columnIndex =
              child.metadata?.columnIndex !== undefined
                ? (child.metadata.columnIndex as number)
                : index % columnCount;

            // Ensure columnIndex is within bounds
            const safeColumnIndex = Math.min(
              Math.max(0, columnIndex),
              columnCount - 1,
            );
            columnContents[safeColumnIndex].push(
              <React.Fragment key={child.id}>
                {renderComponent(child)}
              </React.Fragment>,
            );
          });

          // Pass the distributed children to ColumnsBlock
          children = columnContents.map((colChildren, colIndex) => (
            <div key={colIndex} className="column-content">
              {colChildren.length > 0 ? colChildren : null}
            </div>
          ));
        } else {
          // For other container components, just render children normally
          children = component.children.map((child) => (
            <React.Fragment key={child.id}>
              {renderComponent(child)}
            </React.Fragment>
          ));
        }
      }

      return config.render(componentProps, false, business, children);
    };

    return (
      <main className="flex-grow">
        {parsedContent.components.map((component) => (
          <React.Fragment key={component.id}>
            {renderComponent(component)}
          </React.Fragment>
        ))}
      </main>
    );
  }

  // No content to render
  return <main className="flex-grow"></main>;
}
