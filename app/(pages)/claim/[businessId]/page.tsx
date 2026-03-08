"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { SitePreviewFrame } from "@/app/components/preview/site-preview-frame";
import { ClaimBanner } from "@/app/components/claim/claim-banner";

export default function ClaimPage() {
  const params = useParams<{ businessId: string }>();
  const businessId = params.businessId as Id<"businesses">;

  // Fetch business data (no auth required)
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
            Loading site preview...
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
            We could not find a business with that ID. The link may be invalid
            or the business may have been removed.
          </p>
          <Link
            href="/"
            className="inline-block text-sm text-primary hover:underline"
          >
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  const { business, page } = previewData;
  const isClaimed = !!business.userId;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Sticky claim banner */}
      <ClaimBanner
        businessId={businessId}
        businessName={business.name}
        isClaimed={isClaimed}
      />

      {/* Scrollable website preview */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <SitePreviewFrame
          business={business}
          pageContent={page?.content ?? null}
        />
      </main>
    </div>
  );
}
