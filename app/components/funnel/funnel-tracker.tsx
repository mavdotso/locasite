"use client";

import { useEffect } from "react";
import { useFunnelTracker } from "@/app/hooks/use-funnel-tracking";

interface FunnelTrackerProps {
  event: "category_page_viewed" | "preview_page_viewed";
  businessId?: string;
  metadata?: Record<string, unknown>;
  dedupKey?: string;
}

export function FunnelTracker({
  event,
  businessId,
  metadata,
  dedupKey,
}: FunnelTrackerProps) {
  const { trackFunnelEvent } = useFunnelTracker();

  useEffect(() => {
    trackFunnelEvent(event, { businessId, metadata, dedupKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
