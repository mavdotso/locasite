"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Loader2, LogIn, CheckCircle } from "lucide-react";
import { useFunnelTracker } from "@/app/hooks/use-funnel-tracking";
import Link from "next/link";
import { toast } from "sonner";

interface ClaimFormProps {
  businessId: Id<"businesses">;
  businessName: string;
  domain: string;
  isAuthenticated: boolean;
  alreadyClaimed: boolean;
  isClaimable: boolean;
}

export function ClaimForm({
  businessId,
  businessName,
  domain,
  isAuthenticated,
  alreadyClaimed,
  isClaimable,
}: ClaimFormProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const { signIn } = useAuthActions();
  const claimBusiness = useMutation(api.businesses.claimBusinessAfterAuth);
  const { trackFunnelEvent } = useFunnelTracker();

  // Track page view on mount
  useEffect(() => {
    trackFunnelEvent("claim_page_viewed", {
      businessId,
      dedupKey: `claim_page_viewed_${businessId}`,
    });
  }, [businessId, trackFunnelEvent]);

  const handleSignIn = async () => {
    trackFunnelEvent("claim_cta_clicked", { businessId });
    sessionStorage.setItem("claimBusinessId", businessId);
    sessionStorage.setItem("authRedirect", `/preview/${businessId}`);
    await signIn("google");
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    trackFunnelEvent("claim_initiated", { businessId });

    try {
      await claimBusiness({ businessId });
      trackFunnelEvent("claim_completed", {
        businessId,
        dedupKey: `claim_completed_${businessId}`,
      });
      toast.success(`${businessName} has been claimed!`);
      window.location.href = `/dashboard/business/${businessId}/theme`;
    } catch (error: unknown) {
      setIsClaiming(false);
      const msg =
        error instanceof Error ? error.message : "Failed to claim business";
      if (msg.includes("Unauthorized") || msg.includes("logged in")) {
        await signIn("google");
      } else {
        toast.error(msg);
      }
    }
  };

  if (alreadyClaimed) {
    return (
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <p className="font-medium">This business has already been claimed.</p>
        <Link
          href="/sign-in"
          className="mt-1 inline-block text-amber-700 underline underline-offset-2 hover:text-amber-900"
        >
          Sign in to manage your business
        </Link>
      </div>
    );
  }

  if (!isClaimable) {
    return (
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <p className="font-medium">This business is not available to claim.</p>
        <Link
          href={`/${domain}`}
          className="mt-1 inline-block text-amber-700 underline underline-offset-2"
        >
          Return to business page
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Sign in with Google to claim <span className="font-medium">{businessName}</span> and take your site live.
        </p>
        <Button onClick={handleSignIn} className="w-full" size="lg">
          <svg
            className="mr-2 h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
            />
          </svg>
          Sign in with Google to Claim
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-medium text-green-900">You&apos;re signed in</p>
          <p className="text-green-700">
            One click to claim <span className="font-semibold">{businessName}</span> and take your site live.
          </p>
        </div>
      </div>
      <Button
        onClick={handleClaim}
        disabled={isClaiming}
        className="w-full"
        size="lg"
      >
        {isClaiming ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Claiming...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Claim This Business
          </>
        )}
      </Button>
    </div>
  );
}
