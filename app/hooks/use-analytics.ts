import { useEffect, useRef } from "react";
import { Analytics } from "@/app/lib/analytics";
import { Id } from "@/convex/_generated/dataModel";

interface UseAnalyticsOptions {
  businessId: Id<"businesses">;
  domainId?: Id<"domains">;
  enabled?: boolean;
}

export function useAnalytics({
  businessId,
  domainId,
  enabled = true,
}: UseAnalyticsOptions) {
  const analyticsRef = useRef<Analytics | null>(null);

  useEffect(() => {
    if (!enabled || !businessId) return;

    // Initialize analytics
    const analytics = new Analytics(businessId, domainId);
    analyticsRef.current = analytics;

    // Start tracking
    analytics.init();

    return () => {
      // Cleanup if needed
      analyticsRef.current = null;
    };
  }, [businessId, domainId, enabled]);

  return analyticsRef.current;
}
