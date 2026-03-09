"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import { ThemePickerSheet } from "./theme-picker-sheet";
import { trackClaimEvent } from "@/app/lib/claim-analytics";

interface PreviewActionBarProps {
  businessId: Id<"businesses">;
  subdomain: string | null;
  customDomain?: string | null;
  isPublished: boolean;
}

export function PreviewActionBar({
  businessId,
  subdomain,
  customDomain,
  isPublished,
}: PreviewActionBarProps) {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const user = useQuery(api.auth.currentUser);
  const claimBusiness = useMutation(api.businesses.claimBusinessAfterAuth);
  const publishBusiness = useMutation(api.businessPublishing.publishBusiness);

  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";
  const siteUrl = customDomain
    ? customDomain
    : subdomain
      ? `${subdomain}.${rootDomain}`
      : null;

  const handlePublishFree = async () => {
    setError(null);
    trackClaimEvent("claim", "publish_initiated", businessId);

    // If not authenticated, redirect to sign-in
    if (user === null) {
      trackClaimEvent("auth", "sign_in_started", businessId);
      sessionStorage.setItem("claimBusinessId", businessId);
      await signIn("google");
      return;
    }

    // If user is undefined, auth is still loading
    if (user === undefined) return;

    setIsPublishing(true);
    try {
      // Claim the business if not already claimed
      await claimBusiness({ businessId });
      trackClaimEvent("conversion", "claim_completed", businessId);

      // Publish directly — no payment required
      await publishBusiness({ businessId });
      trackClaimEvent("conversion", "publish_completed", businessId);

      // Redirect to the live site
      router.push(`/live/${businessId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to publish.";
      setError(message);
    } finally {
      setIsPublishing(false);
    }
  };

  // Already-published state
  if (isPublished && siteUrl) {
    return (
      <div className="space-y-5">
        <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4 text-center">
          <p className="text-sm font-medium text-green-800">
            Your site is already live!
          </p>
          <a
            href={`https://${siteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-sm text-green-700 underline underline-offset-2 hover:text-green-900"
          >
            {siteUrl}
          </a>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => router.push(`/edit/${businessId}`)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Edit details
          </button>
          <button
            onClick={() => setShowThemePicker(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Change look
          </button>
        </div>

        {showThemePicker && (
          <ThemePickerSheet
            businessId={businessId}
            isOpen={showThemePicker}
            onClose={() => setShowThemePicker(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Publish Free button */}
      <Button
        size="lg"
        onClick={handlePublishFree}
        disabled={isPublishing}
        className="w-full h-12 text-base font-medium"
      >
        {isPublishing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          "Publish for Free"
        )}
      </Button>

      {/* Info */}
      <p className="text-xs text-center text-muted-foreground">
        Free forever. Upgrade anytime to edit content, remove branding, and more.
      </p>

      {/* Error message */}
      {error && (
        <p className="text-sm text-center text-destructive">{error}</p>
      )}

      {/* Secondary actions */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => router.push(`/edit/${businessId}`)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Edit details
        </button>
        <button
          onClick={() => setShowThemePicker(true)}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Change look
        </button>
      </div>

      {/* Theme picker bottom sheet */}
      <ThemePickerSheet
        businessId={businessId}
        isOpen={showThemePicker}
        onClose={() => setShowThemePicker(false)}
      />

      {/* Subdomain info */}
      {siteUrl && (
        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Your site will be at:
          </p>
          <p className="text-sm font-medium text-foreground">{siteUrl}</p>
        </div>
      )}
    </div>
  );
}
