"use client";

import React, { useState, useEffect, useRef } from "react";
import Frame, { FrameContextConsumer } from "react-frame-component";
import { cn } from "@/app/lib/utils";

interface FrameProps {
  children: React.ReactNode;
  width?: string | number;
  className?: string;
}

function FrameInner({
  children,
  doc,
  onReady,
}: {
  children: React.ReactNode;
  doc: Document | null | undefined;
  onReady: () => void;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!doc) return;

    const timer = setTimeout(() => {
      try {
        const rootStyles = window.getComputedStyle(document.documentElement);
        const cssProps = Array.from(rootStyles).filter((prop) =>
          prop.startsWith("--"),
        );

        requestAnimationFrame(() => {
          cssProps.forEach((prop) => {
            doc.documentElement.style.setProperty(
              prop,
              rootStyles.getPropertyValue(prop),
            );
          });

          if (document.documentElement.classList.contains("dark")) {
            doc.documentElement.classList.add("dark");
          } else {
            doc.documentElement.classList.remove("dark");
          }

          if (doc.body) {
            doc.body.style.backgroundImage = "none";
          }

          setIsReady(true);
          onReady();
        });
      } catch {
        setIsReady(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [doc, onReady]);

  return (
    <div
      className="min-h-screen"
      style={{ opacity: isReady ? 1 : 0, transition: "opacity 0.2s" }}
    >
      {children}
    </div>
  );
}

export default function PreviewFrame({
  children,
  width = "100%",
  className,
}: FrameProps) {
  const [frameKey] = useState(0);
  const [isFrameReady, setIsFrameReady] = useState(false);
  const mountedRef = useRef(true);

  const initialContent = React.useMemo(() => {
    const styles = Array.from(document.querySelectorAll("style"))
      .map((style) => `<style>${style.innerHTML}</style>`)
      .join("\n");

    const links = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]'),
    )
      .map((link) => {
        const href = (link as HTMLLinkElement).href;
        return `<link rel="stylesheet" href="${href}">`;
      })
      .join("\n");

    const tailwindScript =
      process.env.NODE_ENV === "development"
        ? '<script src="https://cdn.tailwindcss.com"></script>'
        : "";

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_parent">
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${tailwindScript}
          ${links}
          ${styles}
          <style>
            body {
              margin: 0;
              padding: 0;
              min-height: 100vh;
              font-family: inherit;
            }
            * {
              box-sizing: border-box;
            }
            @layer base, components, utilities;
          </style>
        </head>
        <body>
          <div id="frame-root"></div>
        </body>
      </html>
    `;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const frameStyle = React.useMemo(
    () => ({
      width: width === "100%" ? "100%" : width,
      maxWidth: width === "100%" ? "100%" : width,
      height: "100%",
      transition: "width 0.3s ease-out, max-width 0.3s ease-out",
    }),
    [width],
  );

  const handleReady = React.useCallback(() => {
    if (mountedRef.current) {
      setIsFrameReady(true);
    }
  }, []);

  return (
    <div className="relative w-full h-full flex justify-center">
      {!isFrameReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-muted-foreground">Loading preview...</div>
        </div>
      )}
      <Frame
        key={frameKey}
        initialContent={initialContent}
        className={cn("h-full border-0", className)}
        style={frameStyle}
        mountTarget="#frame-root"
      >
        <FrameContextConsumer>
          {({ document: doc }) => (
            <FrameInner doc={doc} onReady={handleReady}>
              {children}
            </FrameInner>
          )}
        </FrameContextConsumer>
      </Frame>
    </div>
  );
}