"use client";

import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { VisualEditorRenderer } from "@/app/components/visual-editor/visual-editor-renderer";
// Using simple loading div instead of skeleton

interface BusinessPreviewWrapperProps {
  businessId: Id<"businesses">;
  preloadedBusiness: Preloaded<typeof api.businesses.getByIdWithDraft>;
}

export function BusinessPreviewWrapper({
  businessId,
  preloadedBusiness,
}: BusinessPreviewWrapperProps) {
  const business = usePreloadedQuery(preloadedBusiness);
  
  // Get the domain for this business
  const domain = useQuery(api.domains.getByBusinessId, business ? { businessId } : "skip");
  
  // Get the homepage for this domain
  const page = useQuery(api.pages.getHomepageByDomain, domain ? { domainId: domain._id } : "skip");

  if (!business) {
    return <div>Business not found</div>;
  }

  if (!domain || !page) {
    return (
      <div className="space-y-4">
        <div className="h-16 w-full bg-muted animate-pulse rounded" />
        <div className="h-96 w-full bg-muted animate-pulse rounded" />
        <div className="h-64 w-full bg-muted animate-pulse rounded" />
        <div className="h-32 w-full bg-muted animate-pulse rounded" />
      </div>
    );
  }

  // Parse the page content
  let pageData;
  try {
    pageData = JSON.parse(page.content);
  } catch (error) {
    console.error("Failed to parse page content:", error);
    return <div>Error loading page content</div>;
  }

  return (
    <VisualEditorRenderer 
      pageData={pageData} 
      business={business}
    />
  );
}