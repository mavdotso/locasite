"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { ClaimBanner } from "@/app/components/claim/claim-banner";

export default function ClaimByTokenPage() {
  const params = useParams<{ token: string }>();

  const business = useQuery(api.claimCheckout.getByClaimToken, {
    claimToken: params.token,
  });

  if (business === undefined) {
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

  if (business === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-lg font-semibold text-foreground">
            Business not found
          </h1>
          <p className="text-sm text-muted-foreground">
            This claim link is invalid or has already been used.
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

  return (
    <div className="min-h-screen bg-stone-50">
      <ClaimBanner
        businessId={business.businessId}
        businessName={business.name}
        isClaimed={business.isClaimed}
      />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {business.previewUrl ? (
          <iframe
            src={business.previewUrl}
            className="w-full h-[600px] rounded-lg border border-stone-200 shadow-sm"
            title={`Preview of ${business.name}`}
          />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Site preview is being generated...</p>
          </div>
        )}
      </main>
    </div>
  );
}
