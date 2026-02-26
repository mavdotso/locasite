"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useState, useCallback } from "react";
import { Check, Copy, ExternalLink, Loader2, Share2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";

export default function LiveConfirmationPage() {
  const params = useParams<{ businessId: string }>();
  const businessId = params.businessId as Id<"businesses">;

  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });

  const [copied, setCopied] = useState(false);

  const siteUrl = domain?.customDomain
    ? `https://${domain.customDomain}`
    : domain?.subdomain
      ? `https://${domain.subdomain}.${ROOT_DOMAIN}`
      : null;

  const displayUrl = domain?.customDomain
    ? domain.customDomain
    : domain?.subdomain
      ? `${domain.subdomain}.${ROOT_DOMAIN}`
      : null;

  const handleCopyLink = useCallback(async () => {
    if (!siteUrl) return;
    try {
      await navigator.clipboard.writeText(siteUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [siteUrl]);

  const handleShare = useCallback(async () => {
    if (!siteUrl || !business) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: `Check out ${business.name}`,
          url: siteUrl,
        });
      } catch (err: unknown) {
        // User cancelled share — not an error
        const isAbort =
          err instanceof DOMException && err.name === "AbortError";
        if (!isAbort) {
          toast.error("Failed to share");
        }
      }
    } else {
      // Fallback to copy
      handleCopyLink();
    }
  }, [siteUrl, business, handleCopyLink]);

  // Loading state
  if (business === undefined || domain === undefined) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Business not found
  if (business === null) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-lg font-semibold text-foreground">
            Business not found
          </h1>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t find a business with that ID.
          </p>
          <Link href="/" className="text-sm text-primary hover:underline">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Celebration section */}
        <div className="text-center space-y-4">
          {/* Green checkmark */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Your site is live!
          </h1>

          {/* Site URL */}
          {displayUrl && (
            <p className="text-muted-foreground font-mono text-sm">
              {displayUrl}
            </p>
          )}
        </div>

        {/* Primary CTA */}
        <div className="space-y-3">
          {siteUrl && (
            <Button
              className="w-full h-12 text-base"
              size="lg"
              onClick={() => window.open(siteUrl, "_blank")}
            >
              Visit Your Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}

          {/* Secondary actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCopyLink}
              disabled={!siteUrl}
            >
              {copied ? (
                <Check className="mr-2 h-4 w-4 text-green-600" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy link"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleShare}
              disabled={!siteUrl}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Upsell: Custom domain */}
        {!domain?.customDomain && (
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Want <span className="font-medium">{business.name.toLowerCase().replace(/[^a-z0-9]+/g, "") || "your-business"}.com</span> instead?
            </p>
            <Link
              href={`/dashboard/business/${businessId}/domain`}
              className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            >
              Set up your own domain
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
