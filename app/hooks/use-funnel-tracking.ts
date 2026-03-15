"use client";

import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type FunnelEvent =
  | "category_page_viewed"
  | "form_submission_started"
  | "website_created"
  | "preview_page_viewed"
  | "publish_clicked"
  | "website_published"
  | "claim_banner_shown"
  | "claim_cta_clicked"
  | "claim_page_viewed"
  | "claim_initiated"
  | "claim_completed";

const SESSION_ID_KEY = "locosite_funnel_session_id";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const LAST_ACTIVITY_KEY = "locosite_funnel_last_activity";

export function getFunnelSessionId(): string {
  if (typeof window === "undefined") return "";

  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  const now = Date.now();

  if (lastActivity && now - parseInt(lastActivity) > SESSION_TIMEOUT) {
    localStorage.removeItem(SESSION_ID_KEY);
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  return sessionId;
}

export function useFunnelTracker() {
  const trackMutation = useMutation(api.funnelEvents.track);

  const trackFunnelEvent = useCallback(
    (
      event: FunnelEvent,
      opts?: {
        businessId?: string;
        metadata?: Record<string, unknown>;
        dedupKey?: string;
      },
    ) => {
      const dedupKey = opts?.dedupKey ?? event;
      const sessionKey = `funnel_${dedupKey}`;

      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");

      const sessionId = getFunnelSessionId();
      trackMutation({
        event,
        sessionId,
        businessId: opts?.businessId,
        metadata: opts?.metadata,
      }).catch(() => {});
    },
    [trackMutation],
  );

  return { trackFunnelEvent };
}
