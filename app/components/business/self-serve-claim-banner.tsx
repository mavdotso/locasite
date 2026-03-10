"use client";

import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { useState, Suspense } from "react";
import Link from "next/link";

function SelfServeClaimBannerInner() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const isClaimed = searchParams.get("claimed") === "true";
  const claimToken = searchParams.get("token");

  if (!isClaimed || dismissed) return null;

  return (
    <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-200">
      <div className="container flex items-center justify-between mx-auto">
        <div>
          <p className="text-sm font-medium text-emerald-800">
            Your free website is live!
          </p>
          <p className="text-xs text-emerald-600">
            Upgrade to remove the Locosite badge and connect your own domain.
            {claimToken && " Bookmark this page to come back anytime."}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/pricing"
            className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            Upgrade
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-emerald-400 hover:text-emerald-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SelfServeClaimBanner() {
  return (
    <Suspense fallback={null}>
      <SelfServeClaimBannerInner />
    </Suspense>
  );
}
