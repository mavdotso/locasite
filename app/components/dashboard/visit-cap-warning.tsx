"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useSubscription } from "@/app/hooks/use-subscription";
import { getTinybirdClient } from "@/app/lib/tinybird";

interface VisitCapWarningProps {
  businessId: string;
}

export function VisitCapWarning({ businessId }: VisitCapWarningProps) {
  const router = useRouter();
  const { monthlyVisitsSoftCap, planDisplayName } = useSubscription();
  const [monthlyViews, setMonthlyViews] = useState<number | null>(null);

  useEffect(() => {
    if (monthlyVisitsSoftCap === -1) return; // unlimited

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    getTinybirdClient()
      .getAnalyticsSummary(businessId, startOfMonth, now)
      .then((result) => {
        const views = result?.data?.[0]?.total_page_views ?? 0;
        setMonthlyViews(views);
      })
      .catch(() => {
        // Silently fail — don't block the dashboard
      });
  }, [businessId, monthlyVisitsSoftCap]);

  // Don't show for paid plans or while loading
  if (monthlyVisitsSoftCap === -1 || monthlyViews === null) return null;

  // Only show when approaching or exceeding the cap
  const threshold = monthlyVisitsSoftCap * 0.8;
  if (monthlyViews < threshold) return null;

  const isOver = monthlyViews >= monthlyVisitsSoftCap;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${
        isOver
          ? "border-amber-300 bg-amber-50"
          : "border-amber-200 bg-amber-50/50"
      }`}
    >
      <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-900">
          {isOver
            ? `Your site has exceeded its monthly visitor limit (${monthlyViews.toLocaleString()} / ${monthlyVisitsSoftCap.toLocaleString()})`
            : `Your site is approaching its monthly visitor limit (${monthlyViews.toLocaleString()} / ${monthlyVisitsSoftCap.toLocaleString()})`}
        </p>
        <p className="text-xs text-amber-700 mt-1">
          You&apos;re on the {planDisplayName} plan with{" "}
          {monthlyVisitsSoftCap.toLocaleString()} visits/month. Your site
          continues to work normally for visitors. Upgrade to Starter for
          unlimited visits.
        </p>
      </div>
      <Button
        size="sm"
        variant="outline"
        className="flex-shrink-0"
        onClick={() => router.push("/dashboard/billing")}
      >
        Upgrade
      </Button>
    </div>
  );
}
