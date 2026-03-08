"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ClaimSuccessPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("business_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="w-16 h-16 bg-brand-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-brand-forest">&#10003;</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl text-brand-ink tracking-tight mb-4">
          Website Claimed!
        </h1>

        <p className="text-brand-taupe text-[17px] leading-relaxed mb-8">
          Your website is now live. You can customize it, manage leads, and
          track visitors from your dashboard.
        </p>

        <div className="space-y-3">
          {businessId && (
            <Link
              href={`/dashboard/business/${businessId}`}
              className="block w-full bg-brand-amber text-brand-ink py-3 px-6 rounded-lg font-semibold hover:brightness-95 transition-all"
            >
              Go to Dashboard
            </Link>
          )}
          <Link
            href="/dashboard"
            className="block w-full bg-brand-forest/10 text-brand-forest py-3 px-6 rounded-lg font-semibold hover:bg-brand-forest/15 transition-all"
          >
            View All Businesses
          </Link>
        </div>
      </div>
    </div>
  );
}
