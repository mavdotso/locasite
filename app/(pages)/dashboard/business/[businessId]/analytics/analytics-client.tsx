"use client";

import { Id } from "@/convex/_generated/dataModel";
import AnalyticsDashboard from "@/app/components/dashboard/analytics-dashboard";

interface AnalyticsClientProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsClient({ businessId }: AnalyticsClientProps) {
  return <AnalyticsDashboard businessId={businessId} />;
}
