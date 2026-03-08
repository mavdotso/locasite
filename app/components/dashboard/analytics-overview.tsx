"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useSubscription } from "@/app/hooks/use-subscription";
import { FeatureLockOverlay } from "@/app/components/common/feature-lock-overlay";

interface AnalyticsOverviewProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsOverview({
  businessId: _businessId,
}: AnalyticsOverviewProps) {
  const { canAccessAnalytics } = useSubscription();

  if (!canAccessAnalytics) {
    return (
      <FeatureLockOverlay
        feature="Analytics & Performance Tracking"
        requiredPlan="PROFESSIONAL"
        className="py-16"
      />
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Analytics Coming Soon</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          We&apos;re building powerful analytics for your plan. Stay tuned!
        </p>
      </CardContent>
    </Card>
  );
}
