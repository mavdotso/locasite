import { useEffect, useRef } from "react";
import { Analytics } from "@/lib/analytics";
import { Id } from "@/convex/_generated/dataModel";

interface UseAnalyticsOptions {
  businessId: Id<"businesses">;
  domainId?: Id<"domains">;
  enabled?: boolean;
}

export function useAnalytics({ businessId, domainId, enabled = true }: UseAnalyticsOptions) {
  const analyticsRef = useRef<Analytics | null>(null);

  useEffect(() => {
    if (!enabled || !businessId) return;

    // Initialize analytics
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
    const analytics = new Analytics(convexUrl, businessId, domainId);
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

// Hook for tracking specific events
export function useEventTracking(businessId?: Id<"businesses">, domainId?: Id<"domains">) {
  const analytics = useAnalytics({ 
    businessId: businessId!, 
    domainId, 
    enabled: !!businessId 
  });

  return {
    trackContact: (method: string, details?: Record<string, unknown>) => 
      analytics?.trackContact(method, details),
    trackFormSubmit: (formName: string, details?: Record<string, unknown>) => 
      analytics?.trackFormSubmit(formName, details),
    trackClick: (element: string, details?: Record<string, unknown>) => 
      analytics?.trackClick(element, details),
    trackShare: (platform: string) => 
      analytics?.trackShare(platform),
    trackSearch: (query: string) => 
      analytics?.trackSearch(query),
    trackEvent: (
      eventType: string,
      eventCategory?: string,
      eventLabel?: string,
      eventValue?: number,
      metadata?: Record<string, unknown>
    ) => analytics?.trackEvent(eventType, eventCategory, eventLabel, eventValue, metadata),
  };
}