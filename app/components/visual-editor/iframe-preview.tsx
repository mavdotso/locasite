"use client";

import React, { useEffect, useRef, useState } from "react";
import { PageData } from "./types";
import { componentConfigs } from "./config/components";
import { Doc } from "@/convex/_generated/dataModel";
import { getLayoutClasses } from "./utils/layout";

interface IframePreviewProps {
  pageData: PageData;
  business: Doc<"businesses">;
  theme?: Doc<"themes"> | null;
  width?: string;
  height?: string;
}

export default function IframePreview({ 
  pageData, 
  business,
  theme,
  width = "100%",
  height = "100%"
}: IframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!iframeRef.current || !isLoaded) return;

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;

    // Generate the HTML content for the iframe
    const html = generatePreviewHTML(pageData, business, theme);
    
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
  }, [pageData, business, theme, isLoaded]);

  return (
    <iframe
      ref={iframeRef}
      title="Page Preview"
      className="w-full h-full border-0"
      style={{ width, height }}
      onLoad={() => setIsLoaded(true)}
    />
  );
}

function generatePreviewHTML(
  pageData: PageData, 
  business: Doc<"businesses">,
  theme?: Doc<"themes"> | null
): string {
  // Build component HTML
  let componentsHTML = '';
  
  pageData.components.forEach((component) => {
    const config = componentConfigs[component.type];
    if (!config) return;

    // Get layout classes
    const layoutClasses = getLayoutClasses(component.layout);
    
    // For iframe preview, we need to render components as HTML strings
    // This is a simplified version - in production you'd want server-side rendering
    const componentHTML = `
      <div class="${layoutClasses}">
        <div data-component-type="${component.type}">
          <!-- Component content would be rendered here -->
          <div style="padding: 2rem; background: #f5f5f5; border-radius: 8px;">
            <h3>${component.type.replace(/Block$/, '')}</h3>
            ${component.props.title ? `<p>${component.props.title}</p>` : ''}
          </div>
        </div>
      </div>
    `;
    
    componentsHTML += componentHTML;
  });

  // Generate theme styles
  const themeStyles = theme ? generateThemeStyles(theme) : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${pageData.title} - Preview</title>
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Theme Styles -->
        <style>
          ${themeStyles}
          
          /* Base styles */
          body {
            margin: 0;
            padding: 0;
            font-family: system-ui, -apple-system, sans-serif;
          }
          
          /* Layout utility classes */
          .flex { display: flex; }
          .flex-col { flex-direction: column; }
          .flex-row { flex-direction: row; }
          .items-start { align-items: flex-start; }
          .items-center { align-items: center; }
          .items-end { align-items: flex-end; }
          .items-stretch { align-items: stretch; }
          .justify-start { justify-content: flex-start; }
          .justify-center { justify-content: center; }
          .justify-end { justify-content: flex-end; }
          .justify-between { justify-content: space-between; }
          .justify-around { justify-content: space-around; }
          .gap-2 { gap: 0.5rem; }
          .gap-4 { gap: 1rem; }
          .gap-8 { gap: 2rem; }
          .p-4 { padding: 1rem; }
          .p-8 { padding: 2rem; }
          .p-16 { padding: 4rem; }
          .m-4 { margin: 1rem; }
          .m-8 { margin: 2rem; }
          .m-16 { margin: 4rem; }
          .w-full { width: 100%; }
        </style>
      </head>
      <body>
        <div style="min-height: 100vh;">
          <!-- Page Title -->
          <div style="padding: 2rem; border-bottom: 1px solid #e5e5e5;">
            <h1 style="font-size: 2rem; font-weight: bold;">${pageData.title}</h1>
          </div>
          
          <!-- Components -->
          <div>
            ${componentsHTML}
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateThemeStyles(theme: Doc<"themes">): string {
  const lightColors = theme.config?.colors?.light || {};
  
  return `
    :root {
      --color-primary: ${lightColors.primary || '#000000'};
      --color-primary-foreground: ${lightColors.primaryForeground || '#ffffff'};
      --color-secondary: ${lightColors.secondary || '#666666'};
      --color-secondary-foreground: ${lightColors.secondaryForeground || '#ffffff'};
      --color-accent: ${lightColors.accent || '#0066cc'};
      --color-accent-foreground: ${lightColors.accentForeground || '#ffffff'};
      --color-background: ${lightColors.background || '#ffffff'};
      --color-foreground: ${lightColors.foreground || '#000000'};
      --color-muted: ${lightColors.muted || '#f5f5f5'};
      --color-muted-foreground: ${lightColors.mutedForeground || '#666666'};
      --color-border: ${lightColors.border || '#e5e5e5'};
    }
    
    body {
      background-color: var(--color-background);
      color: var(--color-foreground);
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: var(--color-primary);
    }
    
    a {
      color: var(--color-accent);
    }
  `;
}