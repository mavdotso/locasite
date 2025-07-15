"use client";

import { Id } from "@/convex/_generated/dataModel";
import AnalyticsDashboardTinybird from "@/app/components/dashboard/analytics-dashboard-tinybird";

interface AnalyticsClientProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsClient({ businessId }: AnalyticsClientProps) {
  return <AnalyticsDashboardTinybird businessId={businessId} />;
}
