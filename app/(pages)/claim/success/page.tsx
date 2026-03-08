"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ClaimSuccessPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("business_id");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-green-600">&#10003;</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Website Claimed!
        </h1>

        <p className="text-gray-600 mb-8">
          Your website is now live. You can customize it, manage leads, and
          track visitors from your dashboard.
        </p>

        <div className="space-y-3">
          {businessId && (
            <Link
              href={`/dashboard/business/${businessId}`}
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
          )}
          <Link
            href="/dashboard"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            View All Businesses
          </Link>
        </div>
      </div>
    </div>
  );
}
