"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

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

  const handleClaimClick = async () => {
    // Store business ID so AuthRedirectHandler can pick it up after sign-in
    sessionStorage.setItem("claimBusinessId", businessId);
    // Store the redirect target so the user lands on the preview page after auth
    sessionStorage.setItem("authRedirect", `/preview/${businessId}`);
    await signIn("google");
  };

  // Already claimed
  if (isClaimed) {
    return (
      <div className="sticky top-0 z-40 border-b border-amber-200 bg-amber-50">
        <div className="mx-auto max-w-3xl px-4 py-3 text-center">
          <p className="text-sm font-medium text-amber-800">
            This site has already been claimed.
          </p>
          <Link
            href="/sign-in"
            className="text-sm text-amber-700 underline underline-offset-2 hover:text-amber-900"
          >
            Sign in to manage your business
          </Link>
        </div>
      </div>
    );
  }

  // User is already authenticated -- send them to the preview page to Go Live
  if (user) {
    return (
      <div className="sticky top-0 z-40 border-b border-green-200 bg-green-50">
        <div className="mx-auto max-w-3xl px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p className="text-sm font-medium text-green-800">
            Ready to claim <span className="font-semibold">{businessName}</span>?
          </p>
          <Link href={`/preview/${businessId}`}>
            <Button size="sm" className="whitespace-nowrap">
              Go to Preview
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Auth still loading
  if (user === undefined) {
    return (
      <div className="sticky top-0 z-40 border-b border-border/40 bg-stone-50/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -- show claim CTA
  return (
    <div className="sticky top-0 z-40 border-b border-border/40 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-3xl px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <p className="text-sm font-medium text-foreground">
          Is this your business? Claim{" "}
          <span className="font-semibold">{businessName}</span> to go live.
        </p>
        <Button size="sm" onClick={handleClaimClick} className="whitespace-nowrap">
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
          Claim This Site
        </Button>
      </div>
    </div>
  );
}
