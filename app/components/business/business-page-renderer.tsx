'use client';

import React from 'react';
import { Doc } from '@/convex/_generated/dataModel';
import { componentConfigs } from '@/app/components/visual-editor/config/components';
import { ComponentData } from '@/app/components/visual-editor/types';
import BusinessPageContent from './business-page-content';
import { Section } from '@/app/types/businesses';

interface BusinessPageRendererProps {
  business: Doc<'businesses'>;
  pageContent: string;
}

export default function BusinessPageRenderer({ 
  business, 
  pageContent 
}: BusinessPageRendererProps) {
  // Parse the page content
  let parsedContent: { components?: ComponentData[]; sections?: Section[] };
  try {
    parsedContent = JSON.parse(pageContent);
  } catch (e) {
    console.error("Failed to parse page content", e);
    // Return default content if parsing fails
    return <BusinessPageContent initialBusiness={business} content={{ sections: [] }} />;
  }

  // Check if it's the new component-based format
  if (parsedContent.components && Array.isArray(parsedContent.components)) {
    return (
      <main className="flex-grow">
        {parsedContent.components.map((component: ComponentData) => {
          const config = componentConfigs[component.type];
          if (!config) return null;

          // Pass business data to components that need it
          const componentProps = {
            ...component.props,
            business
          };

          return (
            <div key={component.id}>
              {config.render(componentProps, false, business)}
            </div>
          );
        })}
      </main>
    );
  }

  // Fall back to the old section-based format
  return <BusinessPageContent initialBusiness={business} content={parsedContent} />;
}