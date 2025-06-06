"use client";

import { useEffect, useState } from "react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { EditModeProvider } from "@/components/providers/edit-mode-provider";
import BusinessPageContent from "@/components/business/business-page-content";
import { Doc } from "@/convex/_generated/dataModel";

interface BusinessPreviewWrapperProps {
  businessId: Id<"businesses">;
  preloadedBusiness: Preloaded<typeof api.businesses.getByIdWithDraft>;
}

export function BusinessPreviewWrapper({
  businessId,
  preloadedBusiness,
}: BusinessPreviewWrapperProps) {
  const business = usePreloadedQuery(preloadedBusiness);
  const [isEditMode, setIsEditMode] = useState(false);

  // Listen for edit mode messages from parent window
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "SET_EDIT_MODE") {
        setIsEditMode(event.data.enabled);
      }
    };

    window.addEventListener("message", handleMessage);
    
    // Tell parent we're ready
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*");

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (!business) {
    return <div>Business not found</div>;
  }

  // Create default page content structure
  const defaultContent = {
    sections: [
      {
        type: "hero" as const,
        title: business.name,
        subtitle: business.description,
        image: business.photos?.[0]
      },
      {
        type: "info" as const,
        address: business.address,
        phone: business.phone,
        email: business.email,
        website: business.website,
        hours: business.hours
      },
      {
        type: "about" as const,
        content: business.description || ""
      },
      {
        type: "gallery" as const,
        images: business.photos || []
      },
      {
        type: "reviews" as const,
        reviews: business.reviews || []
      },
      {
        type: "contact" as const
      }
    ]
  };

  return (
    <EditModeProvider businessId={businessId} initialEditMode={isEditMode}>
      <BusinessPageContent
        initialBusiness={business as Doc<"businesses">}
        content={defaultContent}
      />
    </EditModeProvider>
  );
}