'use client';

import React from 'react';
import { PageData, ComponentData } from './types';
import { allComponentConfigs } from './config/all-components';

interface VisualEditorRendererProps {
  pageData: PageData;
  business?: unknown;
}

function renderComponent(component: ComponentData, business?: unknown): React.ReactNode {
  const config = allComponentConfigs[component.type];
  
  if (!config) {
    console.warn(`Component type "${component.type}" not found`);
    return null;
  }

  // Render children first if they exist
  const children = component.children?.map((child) => 
    renderComponent(child, business)
  ) || [];

  // Call the component's render function
  return React.createElement(
    React.Fragment,
    { key: component.id },
    config.render(component.props, false, business, children)
  );
}

export function VisualEditorRenderer({ pageData, business }: VisualEditorRendererProps) {
  if (!pageData?.components) {
    return <div>No content available</div>;
  }

  return (
    <div className="visual-editor-renderer">
      {pageData.components.map((component) => 
        renderComponent(component, business)
      )}
    </div>
  );
}