"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EditModeProvider } from "@/components/providers/edit-mode-provider";
import { EditToolbar } from "@/components/editors/edit-toolbar";
import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Preloaded, usePreloadedQuery } from "convex/react";

type ViewportSize = "desktop" | "tablet" | "mobile";

interface UnifiedEditorProps {
  businessId: Id<"businesses">;
  preloadedBusiness: Preloaded<typeof api.businesses.getById>;
}

export function UnifiedEditor({ businessId, preloadedBusiness }: UnifiedEditorProps) {
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");
  const business = usePreloadedQuery(preloadedBusiness);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Send edit mode state to iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "PREVIEW_READY" && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(
          { type: "SET_EDIT_MODE", enabled: true },
          "*"
        );
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!business) {
    return <div>Business not found</div>;
  }

  const viewportWidths = {
    desktop: "100%",
    tablet: "768px",
    mobile: "375px",
  };

  return (
    <EditModeProvider businessId={businessId} initialEditMode={true}>
      <div className="flex h-screen overflow-hidden bg-muted">
        {/* Viewport Controls */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-background rounded-lg shadow-md p-1 flex gap-1">
          <Button
            variant={viewportSize === "desktop" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewportSize("desktop")}
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "tablet" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewportSize("tablet")}
          >
            <Tablet className="h-4 w-4" />
          </Button>
          <Button
            variant={viewportSize === "mobile" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewportSize("mobile")}
          >
            <Smartphone className="h-4 w-4" />
          </Button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex items-center justify-center p-4 pb-20">
          <div
            className={cn(
              "bg-background rounded-lg shadow-2xl overflow-hidden transition-all duration-300",
              viewportSize === "mobile" && "border-8 border-foreground/10 rounded-[2rem]"
            )}
            style={{
              width: viewportWidths[viewportSize],
              maxWidth: "100%",
              height: "100%",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`/preview/${businessId}`}
              className="w-full h-full"
              style={{
                border: "none",
              }}
            />
          </div>
        </div>

        {/* Edit Toolbar */}
        <EditToolbar />
      </div>
    </EditModeProvider>
  );
}