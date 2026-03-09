"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export type ContactClickType =
  | "phone_click"
  | "email_click"
  | "directions_click"
  | "share_click";

export function useEngagementTracking(
  businessId: Id<"businesses">,
  enabled: boolean = true,
) {
  const trackEvent = useMutation(api.businessEngagement.trackEvent);
  const recentClicks = useRef<Set<string>>(new Set());

  // Track page view once per session per business
  useEffect(() => {
    if (!enabled) return;

    const key = `engagement_pv_${businessId}`;
    if (sessionStorage.getItem(key)) return;

    sessionStorage.setItem(key, "1");
    trackEvent({ businessId, eventType: "page_view" }).catch(() => {});
  }, [businessId, enabled, trackEvent]);

  const trackClick = useCallback(
    (type: ContactClickType) => {
      if (!enabled) return;

      // Throttle: ignore duplicate clicks of same type within 2 seconds
      if (recentClicks.current.has(type)) return;
      recentClicks.current.add(type);
      setTimeout(() => recentClicks.current.delete(type), 2000);

      trackEvent({ businessId, eventType: type }).catch(() => {});
    },
    [businessId, enabled, trackEvent],
  );

  return { trackClick };
}
