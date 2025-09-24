import { Id } from "@/convex/_generated/dataModel";
// import { getTinybirdClient } from "./tinybird"; // COMMENTED OUT - Tinybird disabled

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

function getVisitorId(): string {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateUUID();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
}

function getSessionId(): string {
  const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);
  const now = Date.now();

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
  } catch (error) {
    console.error("Error getting location data:", error);
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
  // private tinybird = getTinybirdClient(); // COMMENTED OUT - Tinybird disabled
  private businessId: Id<"businesses">;
  private domainId?: Id<"domains">;
  private visitorId: string;
  private sessionId: string;
  private startTime: number;
  private clicks: number = 0;
  private maxScrollDepth: number = 0;
  private isInitialized: boolean = false;

  constructor(businessId: Id<"businesses">, domainId?: Id<"domains">) {
    this.businessId = businessId;
    this.domainId = domainId;
    this.visitorId = getVisitorId();
    this.sessionId = getSessionId();
    this.startTime = Date.now();
  }

  async init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      const sessionExists = sessionStorage.getItem(`session_${this.sessionId}`);
      if (!sessionExists) {
        // COMMENTED OUT - Tinybird disabled
        // await this.tinybird.updateSession({
        //   sessionId: this.sessionId,
        //   visitorId: this.visitorId,
        //   businessId: this.businessId,
        //   startTime: Math.floor(this.startTime / 1000), // Convert to seconds for Tinybird
        //   pageCount: 1,
        //   eventCount: 0,
        //   entryPage: window.location.pathname,
        //   hasConverted: false,
        //   bounce: true,
        // });
        sessionStorage.setItem(`session_${this.sessionId}`, "1");
      }

      // Track page view
      await this.trackPageView();

      // Set up event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error("Analytics error:", error);
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

      const { deviceType, browser, os } = parseUserAgent();
      const referrerData = parseReferrer();
      const utmData = parseUTMParams();

      // COMMENTED OUT - Tinybird disabled
      // await this.tinybird.trackPageView({
      //   timestamp: Math.floor(Date.now() / 1000), // Convert to seconds for Tinybird
      //   businessId: this.businessId,
      //   domainId: this.domainId,
      //   visitorId: this.visitorId,
      //   sessionId: this.sessionId,
      //   path: window.location.pathname,
      //   title: document.title,
      //   referrer: document.referrer || undefined,
      //   userAgent: navigator.userAgent,
      //   deviceType,
      //   browser,
      //   os,
      //   screenWidth: window.screen.width,
      //   screenHeight: window.screen.height,
      //   viewportWidth: window.innerWidth,
      //   viewportHeight: window.innerHeight,
      //   loadTime: loadTime || undefined,
      //   ...referrerData,
      //   ...utmData,
      // });
    } catch (error) {
      console.error("Analytics error:", error);
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
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const scrollDepth = Math.round(
        ((scrollTop + clientHeight) / scrollHeight) * 100,
      );
      this.maxScrollDepth = Math.max(this.maxScrollDepth, scrollDepth);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDepth);
        ticking = true;
      }
    });

    // Track page unload
    window.addEventListener("beforeunload", () => {
      this.trackPageUnload();
    });
  }

  private async trackPageUnload() {
    try {
      const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);

      // COMMENTED OUT - Tinybird disabled
      // await this.tinybird.updateSession({
      //   sessionId: this.sessionId,
      //   visitorId: this.visitorId,
      //   businessId: this.businessId,
      //   startTime: Math.floor(this.startTime / 1000),
      //   endTime: Math.floor(Date.now() / 1000),
      //   duration: timeOnPage,
      //   pageCount: 1, // This would need to be tracked properly
      //   eventCount: this.clicks,
      //   entryPage: window.location.pathname,
      //   exitPage: window.location.pathname,
      //   hasConverted: false,
      //   bounce: timeOnPage < 10, // Consider it a bounce if less than 10 seconds
      // });
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }

  async trackEvent(
    eventType: string,
    eventCategory?: string,
    eventLabel?: string,
    eventValue?: number,
  ) {
    try {
      // COMMENTED OUT - Tinybird disabled
      // await this.tinybird.trackEvent({
      //   timestamp: Math.floor(Date.now() / 1000),
      //   businessId: this.businessId,
      //   visitorId: this.visitorId,
      //   sessionId: this.sessionId,
      //   eventType,
      //   eventCategory,
      //   eventLabel,
      //   eventValue,
      //   path: window.location.pathname,
      //   metadata: undefined,
      // });
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }

  async trackConversion(conversionType: string = "contact") {
    try {
      await this.trackEvent("conversion", "engagement", conversionType);

      // COMMENTED OUT - Tinybird disabled
      // await this.tinybird.updateSession({
      //   sessionId: this.sessionId,
      //   visitorId: this.visitorId,
      //   businessId: this.businessId,
      //   hasConverted: true,
      //   conversionType,
      //   startTime: Math.floor(this.startTime / 1000),
      //   pageCount: 1,
      //   eventCount: this.clicks,
      //   entryPage: window.location.pathname,
      //   bounce: false,
      // });
    } catch (error) {
      console.error("Analytics error:", error);
    }
  }
}

// Initialize analytics on page load
export function initAnalytics(
  businessId: Id<"businesses">,
  domainId?: Id<"domains">,
) {
  const analytics = new Analytics(businessId, domainId);
  analytics.init();
  return analytics;
}
