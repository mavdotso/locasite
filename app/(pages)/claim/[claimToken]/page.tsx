"use client";

import { useParams } from "next/navigation";
import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";
import { useState } from "react";
import Link from "next/link";

export default function ClaimPage() {
  const { claimToken } = useParams<{ claimToken: string }>();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const business = useQuery(api.claimCheckout.getByClaimToken, {
    claimToken: claimToken || "",
  });
  const createCheckout = useAction(api.claimCheckout.createClaimCheckoutSession);
  const [isRedirecting, setIsRedirecting] = useState(false);

  if (authLoading || business === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Business Not Found
          </h1>
          <p className="text-gray-600">
            This claim link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (business.isClaimed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Already Claimed
          </h1>
          <p className="text-gray-600">
            This business has already been claimed by its owner.
          </p>
        </div>
      </div>
    );
  }

  const handleClaim = async () => {
    if (!isAuthenticated) {
      // Redirect to sign-in with return URL
      window.location.href = `/sign-in?redirect=/claim/${claimToken}`;
      return;
    }

    setIsRedirecting(true);
    try {
      const result = await createCheckout({
        businessId: business.businessId,
        claimToken,
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      setIsRedirecting(false);
      alert(
        err instanceof Error ? err.message : "Failed to start checkout",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-2">
            Your website is ready
          </p>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
            {business.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We built a professional website for your business. Claim it to
            go live and start attracting customers online.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 truncate flex-1 text-center">
                  {business.previewUrl || "your-site.locosite.io"}
                </span>
              </div>
              {business.previewUrl ? (
                <iframe
                  src={business.previewUrl}
                  className="w-full h-[400px] border-0"
                  title={`Preview of ${business.name}`}
                />
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-400">
                  Preview loading...
                </div>
              )}
            </div>

            {/* Business details */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <span className="text-sm font-medium">Address:</span>
                <span className="text-sm">{business.address}</span>
              </div>
              {business.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-sm font-medium">Phone:</span>
                  <span className="text-sm">{business.phone}</span>
                </div>
              )}
              {business.rating && (
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="text-sm font-medium">Rating:</span>
                  <span className="text-sm">
                    {business.rating} stars ({business.reviewCount} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing + CTA */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Claim Your Website
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">
                    $149
                  </span>
                  <span className="text-gray-500">one-time setup</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-900">
                    + $9/mo
                  </span>
                  <span className="text-gray-500">
                    hosting & maintenance
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Professional website live in minutes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Mobile-optimized design
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Custom subdomain included
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  SEO optimized for local search
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Contact form for leads
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Edit content anytime
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">&#10003;</span>
                  Cancel anytime
                </li>
              </ul>

              <button
                onClick={handleClaim}
                disabled={isRedirecting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRedirecting
                  ? "Redirecting to checkout..."
                  : isAuthenticated
                    ? "Claim & Pay $149"
                    : "Sign Up to Claim"}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure payment powered by Stripe. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
