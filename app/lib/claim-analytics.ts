const VISITOR_ID_KEY = "locosite_visitor_id";
const SESSION_ID_KEY = "locosite_session_id";

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getOrCreateId(key: string): string {
  try {
    let id = localStorage.getItem(key);
    if (!id) {
      id = generateUUID();
      localStorage.setItem(key, id);
    }
    return id;
  } catch {
    return generateUUID();
  }
}

/**
 * Fire-and-forget claim funnel analytics event.
 * Reuses the same visitor/session IDs as the main Analytics class.
 * Posts to /api/analytics with datasource "events" (Tinybird).
 */
export function trackClaimEvent(
  eventCategory: string,
  eventLabel: string,
  businessId: string,
  metadata?: Record<string, unknown>,
): void {
  try {
    const payload = JSON.stringify({
      datasource: "events",
      events: [
        {
          timestamp: Math.floor(Date.now() / 1000),
          businessId,
          visitorId: getOrCreateId(VISITOR_ID_KEY),
          sessionId: getOrCreateId(SESSION_ID_KEY),
          eventType: "claim_funnel",
          eventCategory,
          eventLabel,
          path: window.location.pathname,
          metadata: metadata ? JSON.stringify(metadata) : undefined,
        },
      ],
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics should never break the user flow
  }
}
