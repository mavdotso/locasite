"use client";

import { Id } from "@/convex/_generated/dataModel";
import AnalyticsDashboardV2 from "@/app/components/dashboard/analytics-dashboard-v2";

interface AnalyticsClientProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsClient({ businessId }: AnalyticsClientProps) {
  return <AnalyticsDashboardV2 businessId={businessId} />;
}