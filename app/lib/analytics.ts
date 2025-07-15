import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexClient } from "convex/browser";
import { getTinybirdClient } from "./tinybird";

// Analytics configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const VISITOR_ID_KEY = "locasite_visitor_id";
const SESSION_ID_KEY = "locasite_session_id";
const LAST_ACTIVITY_KEY = "locasite_last_activity";

// Generate UUID
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Get or create visitor ID
function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

// Get or create session ID
function getSessionId(): string {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  const now = Date.now();

  // Check if session has expired
  if (lastActivity && now - parseInt(lastActivity) > SESSION_TIMEOUT) {
    localStorage.removeItem(SESSION_ID_KEY);
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  localStorage.setItem(LAST_ACTIVITY_KEY, now.toString());
  return sessionId;
}

// Parse user agent
function parseUserAgent() {
  const ua = navigator.userAgent;
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  let browser = "Unknown";
  let os = "Unknown";

  // Detect device type
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = "tablet";
  } else if (
    /mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(
      ua,
    )
  ) {
    deviceType = "mobile";
  }

  // Detect browser
  if (ua.indexOf("Chrome") > -1) browser = "Chrome";
  else if (ua.indexOf("Safari") > -1) browser = "Safari";
  else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
  else if (ua.indexOf("MSIE") > -1 || ua.indexOf("Trident/") > -1)
    browser = "IE";
  else if (ua.indexOf("Edge") > -1) browser = "Edge";

  // Detect OS
  if (ua.indexOf("Windows") > -1) os = "Windows";
  else if (ua.indexOf("Mac") > -1) os = "macOS";
  else if (ua.indexOf("Linux") > -1) os = "Linux";
  else if (ua.indexOf("Android") > -1) os = "Android";
  else if (ua.indexOf("iOS") > -1) os = "iOS";

  return { deviceType, browser, os };
}

// Parse referrer
function parseReferrer() {
  const referrer = document.referrer;
  if (!referrer) return {};

  try {
    const url = new URL(referrer);
    return {
      referrerDomain: url.hostname,
      referrerPath: url.pathname,
    };
  } catch {
    return {};
  }
}

// Parse UTM parameters
function parseUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
  };
}

export class Analytics {
  private convex: ConvexClient;
  private tinybird = getTinybirdClient();
  private businessId: Id<"businesses">;
  private domainId?: Id<"domains">;
  private visitorId: string;
  private sessionId: string;
  private pageViewId?: Id<"pageViews">;
  private startTime: number;
  private clicks: number = 0;
  private maxScrollDepth: number = 0;
  private isInitialized: boolean = false;
  private useTinybird: boolean;

  constructor(
    convexUrl: string,
    businessId: Id<"businesses">,
    domainId?: Id<"domains">,
  ) {
    this.convex = new ConvexClient(convexUrl);
    this.businessId = businessId;
    this.domainId = domainId;
    this.visitorId = getVisitorId();
    this.sessionId = getSessionId();
    this.startTime = Date.now();
    // Enable Tinybird if token is configured
    this.useTinybird = !!process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      // Create or update visitor
      const { deviceType, browser, os } = parseUserAgent();
      const referrerData = parseReferrer();
      const utmData = parseUTMParams();

      await this.convex.mutation(api.analytics.upsertVisitor, {
        visitorId: this.visitorId,
        userAgent: navigator.userAgent,
        deviceType,
        browser,
        os,
        ...referrerData,
        ...utmData,
      });

      // Create session if new
      const sessionExists = sessionStorage.getItem(`session_${this.sessionId}`);
      if (!sessionExists) {
        await this.convex.mutation(api.analytics.createSession, {
          sessionId: this.sessionId,
          visitorId: this.visitorId,
          businessId: this.businessId,
          entryPage: window.location.pathname,
        });
        sessionStorage.setItem(`session_${this.sessionId}`, "1");

        // Also create session in Tinybird
        if (this.useTinybird) {
          await this.tinybird.updateSession({
            sessionId: this.sessionId,
            visitorId: this.visitorId,
            businessId: this.businessId,
            startTime: Math.floor(Date.now() / 1000), // Convert to seconds for Tinybird
            pageCount: 1,
            eventCount: 0,
            entryPage: window.location.pathname,
            hasConverted: false,
            bounce: true,
          });
        }
      }

      // Track page view
      await this.trackPageView();

      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error("Analytics initialization error:", error);
    }
  }

  private async trackPageView() {
    try {
      const navigation = performance.getEntriesByType(
        "navigation",
      )[0] as PerformanceNavigationTiming;
      const loadTime = navigation
        ? Math.round(navigation.loadEventEnd - navigation.fetchStart)
        : undefined;

      // Track in Convex for real-time features
      this.pageViewId = await this.convex.mutation(
        api.analytics.trackPageView,
        {
          businessId: this.businessId,
          domainId: this.domainId,
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          path: window.location.pathname,
          title: document.title,
          loadTime: loadTime && loadTime > 0 ? loadTime : undefined,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
        },
      );

      // Also track in Tinybird for analytics
      if (this.useTinybird) {
        const { deviceType, browser, os } = parseUserAgent();
        const referrerData = parseReferrer();
        const utmData = parseUTMParams();

        await this.tinybird.trackPageView({
          timestamp: Math.floor(Date.now() / 1000), // Convert to seconds for Tinybird
          businessId: this.businessId,
          domainId: this.domainId,
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          path: window.location.pathname,
          title: document.title,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
          deviceType,
          browser,
          os,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          loadTime: loadTime || undefined,
          ...referrerData,
          ...utmData,
        });
      }
    } catch (error) {
      console.error("Page view tracking error:", error);
    }
  }

  private setupEventListeners() {
    // Track clicks
    document.addEventListener("click", () => {
      this.clicks++;
    });

    // Track scroll depth
    let ticking = false;
    const updateScrollDepth = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollDepth =
        scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0;
      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollDepth);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    });

    // Update page view data before unload
    window.addEventListener("beforeunload", () => {
      this.updatePageViewData();
    });

    // Update page view data on visibility change
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.updatePageViewData();
      }
    });
  }

  private async updatePageViewData() {
    if (!this.pageViewId) return;

    try {
      const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);

      await this.convex.mutation(api.analytics.updatePageView, {
        pageViewId: this.pageViewId,
        timeOnPage,
        scrollDepth: Math.round(this.maxScrollDepth),
        clicks: this.clicks,
      });

      // Update session in Tinybird with end time
      if (this.useTinybird) {
        const sessionData = sessionStorage.getItem(
          `session_data_${this.sessionId}`,
        );
        const pageCount = sessionData
          ? JSON.parse(sessionData).pageCount + 1
          : 1;
        const eventCount = sessionData ? JSON.parse(sessionData).eventCount : 0;

        await this.tinybird.updateSession({
          sessionId: this.sessionId,
          visitorId: this.visitorId,
          businessId: this.businessId,
          startTime: Math.floor(this.startTime / 1000), // Convert to seconds for Tinybird
          endTime: Math.floor(Date.now() / 1000), // Convert to seconds for Tinybird
          duration: timeOnPage,
          pageCount,
          eventCount,
          entryPage: window.location.pathname,
          exitPage: window.location.pathname,
          hasConverted: false,
          bounce: pageCount === 1,
        });

        // Update session data in storage
        sessionStorage.setItem(
          `session_data_${this.sessionId}`,
          JSON.stringify({
            pageCount,
            eventCount,
          }),
        );
      }
    } catch (error) {
      console.error("Page view update error:", error);
    }
  }

  // Public methods for tracking custom events
  async trackEvent(
    eventType: string,
    eventCategory?: string,
    eventLabel?: string,
    eventValue?: number,
    metadata?: Record<string, unknown>,
  ) {
    try {
      // Track in Convex
      await this.convex.mutation(api.analytics.trackEvent, {
        businessId: this.businessId,
        visitorId: this.visitorId,
        sessionId: this.sessionId,
        eventType,
        eventCategory,
        eventLabel,
        eventValue,
        path: window.location.pathname,
        metadata,
      });

      // Also track in Tinybird
      if (this.useTinybird) {
        await this.tinybird.trackEvent({
          timestamp: Math.floor(Date.now() / 1000), // Convert to seconds for Tinybird
          businessId: this.businessId,
          visitorId: this.visitorId,
          sessionId: this.sessionId,
          eventType,
          eventCategory,
          eventLabel,
          eventValue,
          path: window.location.pathname,
          metadata,
        });
      }
    } catch (error) {
      console.error("Event tracking error:", error);
    }
  }

  // Convenience methods for common events
  async trackContact(method: string, details?: Record<string, unknown>) {
    await this.trackEvent("contact", "conversion", method, undefined, details);
  }

  async trackFormSubmit(formName: string, details?: Record<string, unknown>) {
    await this.trackEvent(
      "form_submit",
      "engagement",
      formName,
      undefined,
      details,
    );
  }

  async trackClick(element: string, details?: Record<string, unknown>) {
    await this.trackEvent("click", "engagement", element, undefined, details);
  }

  async trackShare(platform: string) {
    await this.trackEvent("share", "engagement", platform);
  }

  async trackSearch(query: string) {
    await this.trackEvent("search", "engagement", query);
  }
}
