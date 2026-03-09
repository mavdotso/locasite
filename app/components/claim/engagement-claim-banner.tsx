"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface EngagementClaimBannerProps {
  businessId: Id<"businesses">;
  businessName: string;
  claimUrl: string;
}

export function EngagementClaimBanner({
  businessId,
  businessName,
  claimUrl,
}: EngagementClaimBannerProps) {
  const stats = useQuery(api.businessEngagement.getMonthlyStats, {
    businessId,
  });

  // Pick the most compelling stat to display
  const engagementLine = getEngagementLine(stats);

  return (
    <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
      <div className="container flex items-center justify-between mx-auto">
        <div>
          <p className="text-sm font-medium text-amber-800">
            {engagementLine || (
              <>Are you the owner of {businessName}?</>
            )}
          </p>
          <p className="text-xs text-amber-600">
            Claim your business to manage information and respond to customers
          </p>
        </div>
        <a
          href={claimUrl}
          className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Claim this Business
        </a>
      </div>
    </div>
  );
}

type EngagementStats = NonNullable<typeof api.businessEngagement.getMonthlyStats._returnType>;

function getEngagementLine(
  stats: EngagementStats | null | undefined,
): string | null {
  if (!stats) return null;

  // Pick the highest contact-action metric first (more compelling than page views)
  const metrics: { count: number; label: string }[] = [
    { count: stats.phoneClicks, label: "clicked the phone number" },
    { count: stats.emailClicks, label: "sent an email" },
    { count: stats.directionsClicks, label: "looked up directions" },
    { count: stats.pageViews, label: "viewed this page" },
  ];

  const best = metrics.reduce((a, b) => (b.count > a.count ? b : a));

  if (best.count < 3) return null; // Don't show until we have meaningful numbers

  const people = best.count === 1 ? "person" : "people";
  return `${best.count} ${people} ${best.label} this month. Claim your page to see the full report.`;
}
