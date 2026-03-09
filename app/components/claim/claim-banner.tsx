"use client";

import { useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Loader2, BadgeCheck, CircleAlert } from "lucide-react";
import Link from "next/link";
import { trackClaimEvent } from "@/app/lib/claim-analytics";

interface ClaimBannerProps {
  businessId: Id<"businesses">;
  businessName: string;
  isClaimed: boolean;
}

export function ClaimBanner({
  businessId,
  businessName,
  isClaimed,
}: ClaimBannerProps) {
  const { signIn } = useAuthActions();
  const user = useQuery(api.auth.currentUser);

  // Track banner impression for unclaimed businesses
  useEffect(() => {
    if (!isClaimed) {
      trackClaimEvent("impression", "claim_banner", businessId);
    }
  }, [isClaimed, businessId]);

  const handleClaimClick = async () => {
    trackClaimEvent("click", "claim_banner_cta", businessId);
    trackClaimEvent("auth", "sign_in_started", businessId);
    // Store business ID so AuthRedirectHandler can pick it up after sign-in
    sessionStorage.setItem("claimBusinessId", businessId);
    // Store the redirect target so the user lands on the preview page after auth
    sessionStorage.setItem("authRedirect", `/preview/${businessId}`);
    await signIn("google");
  };

  // Claimed state — verified badge
  if (isClaimed) {
    return (
      <div className="sticky top-0 z-40 border-b border-emerald-200 bg-emerald-50">
        <div className="mx-auto max-w-3xl px-4 py-2.5 flex items-center justify-center gap-2">
          <BadgeCheck className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">
            Claimed
          </span>
        </div>
      </div>
    );
  }

  // Auth still loading
  if (user === undefined) {
    return (
      <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50">
        <div className="mx-auto max-w-3xl px-4 py-2.5 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
          <span className="text-sm text-amber-600">Loading...</span>
        </div>
      </div>
    );
  }

  // User is already authenticated — send them to the preview page to claim
  if (user) {
    return (
      <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50">
        <div className="mx-auto max-w-3xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <CircleAlert className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">
              Unclaimed
            </span>
            <span className="text-sm text-amber-600">
              &mdash; Is this your business?
            </span>
          </div>
          <Link
            href={`/preview/${businessId}`}
            onClick={() =>
              trackClaimEvent("click", "claim_banner_cta", businessId)
            }
          >
            <Button
              size="sm"
              className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white"
            >
              Claim it free &rarr;
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Not authenticated — show unclaimed badge + claim CTA
  return (
    <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50">
      <div className="mx-auto max-w-3xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <CircleAlert className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-700">
            Unclaimed
          </span>
          <span className="text-sm text-amber-600">
            &mdash; Is this your business?
          </span>
        </div>
        <Button
          size="sm"
          onClick={handleClaimClick}
          className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white"
        >
          <svg
            className="mr-1.5 h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Claim it free &rarr;
        </Button>
      </div>
    </div>
  );
}
