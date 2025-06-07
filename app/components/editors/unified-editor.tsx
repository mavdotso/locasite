"use client";

import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DirectPreview } from "@/components/editors/direct-preview";
import FullyInlineBuilder from "@/components/editors/fully-inline-builder";
import { Preloaded, usePreloadedQuery, useQuery } from "convex/react";


interface UnifiedEditorProps {
  businessId: Id<"businesses">;
  preloadedBusiness: Preloaded<typeof api.businesses.getById>;
  pageId?: Id<"pages">;
}

export function UnifiedEditor({ businessId, preloadedBusiness, pageId }: UnifiedEditorProps) {
  const [useVisualBuilder] = useState(true);
  const business = usePreloadedQuery(preloadedBusiness);
  
  // Get the homepage if no pageId is provided
  const pages = useQuery(api.pages.listByDomain, business?.domainId ? { domainId: business.domainId } : "skip");
  const homePage = pages?.find(p => p.slug === "home");
  const currentPageId = pageId || homePage?._id;
  
  // Always use the inline builder even if no page exists
  const shouldUseInlineBuilder = true;

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <div className="min-h-screen">
      {shouldUseInlineBuilder ? (
        <FullyInlineBuilder 
          businessId={businessId} 
          pageId={currentPageId}
          initialContent={homePage?.content || '{"title": "Your Business Page", "sections": []}'}
        />
      ) : (
        <DirectPreview businessId={businessId} />
      )}
    </div>
  );
}