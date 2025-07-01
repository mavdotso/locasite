"use client";

import React from "react";
import { PageData, ComponentData, BusinessData } from "@/app/types/visual-editor";
import { allComponentConfigs } from "../config/all-components";

interface VisualEditorRendererProps {
  pageData: PageData;
  business?: BusinessData;
}

function renderComponent(
  component: ComponentData,
  business?: BusinessData,
): React.ReactNode {
  const config = allComponentConfigs[component.type];

  if (!config) {
    // Component type not found - render nothing
    return null;
  }

  // Render children first if they exist
  const children =
    component.children?.map((child) => renderComponent(child, business)) || [];

  // Call the component's render function
  return React.createElement(
    React.Fragment,
    { key: component.id },
    config.render(component.props, false, business, children),
  );
}

export function VisualEditorRenderer({
  pageData,
  business,
}: VisualEditorRendererProps) {
  if (!pageData?.components) {
    return <div>No content available</div>;
  }

  return (
    <div className="visual-editor-renderer">
      {pageData.components.map((component) =>
        renderComponent(component, business),
      )}
    </div>
  );
}
