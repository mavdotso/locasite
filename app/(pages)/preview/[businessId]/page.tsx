"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { SitePreviewFrame } from "@/app/components/preview/site-preview-frame";
import { PreviewActionBar } from "@/app/components/preview/preview-action-bar";

export default function PreviewPage() {
  const params = useParams<{ businessId: string }>();
  const router = useRouter();
  const businessId = params.businessId as Id<"businesses">;

  // Fetch business, domain, page, and theme in one compound query (no auth required)
  const previewData = useQuery(
    api.businessesWithDomain.getBusinessPreviewData,
    { businessId },
  );

  // Loading state
  if (previewData === undefined) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading your preview...
          </p>
        </div>
      </div>
    );
  }

  // Business not found
  if (previewData === null || !previewData.business) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-lg font-semibold text-foreground">
            Business not found
          </h1>
          <p className="text-sm text-muted-foreground">
            We could not find a business with that ID.
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-primary hover:underline"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

  const { business, domain, page } = previewData;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Minimal header */}
      <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-sm border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <h1 className="text-sm font-medium text-foreground">
            Your website is ready
          </h1>
          {/* Spacer to balance the back button */}
          <div className="w-14" />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Preview frame */}
        <SitePreviewFrame
          business={business}
          pageContent={page?.content ?? null}
        />

        {/* Action bar: Go Live + secondary links + subdomain info */}
        <PreviewActionBar
          businessId={businessId}
          subdomain={domain?.subdomain ?? null}
          customDomain={domain?.customDomain ?? null}
          isPublished={business.isPublished ?? false}
        />
      </main>
    </div>
  );
}
