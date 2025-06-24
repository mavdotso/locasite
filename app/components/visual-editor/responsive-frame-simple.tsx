"use client";

import React from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import { cn } from "@/app/lib/utils";

interface ResponsiveFrameProps {
  children: React.ReactNode;
  width?: string | number;
  className?: string;
  showGrid?: boolean;
}

// Inner component to handle iframe content with hooks
function FrameInner({ 
  children, 
  doc, 
  showGrid 
}: { 
  children: React.ReactNode; 
  doc: Document | null; 
  showGrid: boolean;
}) {
  React.useEffect(() => {
    if (!doc) return;

    // Copy CSS variables
    const rootStyles = window.getComputedStyle(document.documentElement);
    Array.from(rootStyles)
      .filter(prop => prop.startsWith('--'))
      .forEach(prop => {
        doc.documentElement.style.setProperty(
          prop,
          rootStyles.getPropertyValue(prop)
        );
      });

    // Copy dark mode class
    if (document.documentElement.classList.contains('dark')) {
      doc.documentElement.classList.add('dark');
    }

    // Add grid overlay if needed
    if (showGrid && doc.body) {
      doc.body.style.backgroundImage = `
        linear-gradient(to right, rgba(229, 229, 229, 0.5) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(229, 229, 229, 0.5) 1px, transparent 1px)
      `;
      doc.body.style.backgroundSize = '20px 20px';
    }
  }, [doc, showGrid]);

  return <div className="min-h-screen">{children}</div>;
}

export default function ResponsiveFrame({ 
  children, 
  width = "100%",
  className,
  showGrid = false
}: ResponsiveFrameProps) {
  
  // Initial HTML content for the iframe
  const initialContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_parent">
        <script src="https://cdn.tailwindcss.com"></script>
        ${Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
          .map(link => link.outerHTML)
          .join('\n')}
        ${Array.from(document.querySelectorAll('style'))
          .map(style => `<style>${style.innerHTML}</style>`)
          .join('\n')}
      </head>
      <body>
        <div></div>
      </body>
    </html>
  `;

  return (
    <Frame
      initialContent={initialContent}
      className={cn("w-full h-full border-0", className)}
      style={{ width, height: "100%", minHeight: "100vh" }}
      mountTarget="body"
    >
      <FrameContextConsumer>
        {({ document: doc }) => (
          <FrameInner doc={doc} showGrid={showGrid}>
            {children}
          </FrameInner>
        )}
      </FrameContextConsumer>
    </Frame>
  );
}