"use client";

import React from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { allComponentConfigs as componentConfigs } from "@/app/components/visual-editor/config/all-components";
import { ComponentData } from "@/app/types/visual-editor";
import { useAnalytics } from "@/app/hooks/use-analytics";

interface BusinessPageRendererProps {
  business: Doc<"businesses">;
  pageContent: string;
}

export default function BusinessPageRenderer({
  business,
  pageContent,
}: BusinessPageRendererProps) {
  // Initialize analytics tracking
  useAnalytics({
    businessId: business._id,
    domainId: business.domainId,
    enabled: true,
  });

  // Parse the page content
  let parsedContent: { components?: ComponentData[] };
  try {
    parsedContent = JSON.parse(pageContent);
  } catch (e) {
    console.error("Failed to parse page content", e);
    // Return empty content if parsing fails
    return <main className="flex-grow"></main>;
  }

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

  // Render component-based format
  if (parsedContent.components && Array.isArray(parsedContent.components)) {
    return (
      <main className="flex-grow">
        {parsedContent.components.map((component: ComponentData) => (
          <div key={component.id}>{renderComponent(component)}</div>
        ))}
      </main>
    );
  }

  // Return empty content if no components found
  return <main className="flex-grow"></main>;
}
