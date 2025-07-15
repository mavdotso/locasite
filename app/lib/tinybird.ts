// Tinybird client for analytics event tracking and querying

interface TinybirdConfig {
  apiUrl: string;
  token: string;
}

interface PageViewEvent {
  timestamp: number; // Unix timestamp in seconds
  businessId: string;
  domainId?: string;
  visitorId: string;
  sessionId: string;
  path: string;
  title?: string;
  referrer?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  loadTime?: number;
  country?: string;
  region?: string;
  city?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface CustomEvent {
  timestamp: number;
  businessId: string;
  visitorId: string;
  sessionId: string;
  eventType: string;
  eventCategory?: string;
  eventLabel?: string;
  eventValue?: number;
  path: string;
  metadata?: Record<string, unknown>;
}

interface SessionEvent {
  sessionId: string;
  visitorId: string;
  businessId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageCount: number;
  eventCount: number;
  entryPage: string;
  exitPage?: string;
  hasConverted: boolean;
  conversionType?: string;
  bounce: boolean;
}

export class TinybirdClient {
  private config: TinybirdConfig;

  constructor(config: TinybirdConfig) {
    this.config = config;
  }

  // Send events to Tinybird Events API
  private async sendEvents(datasource: string, events: unknown[]) {
    const url = `${this.config.apiUrl}/v0/events?name=${datasource}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.token}`,
          "Content-Type": "application/json",
        },
        body: events.map((event) => JSON.stringify(event)).join("\n"),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Tinybird API error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to send events to Tinybird:", error);
      throw error;
    }
  }

  // Track page view
  async trackPageView(event: PageViewEvent) {
    return this.sendEvents("page_views", [event]);
  }

  // Track custom event
  async trackEvent(event: CustomEvent) {
    // Convert metadata to JSON string for storage
    const eventWithStringMetadata = {
      ...event,
      metadata: event.metadata ? JSON.stringify(event.metadata) : undefined,
    };
    return this.sendEvents("events", [eventWithStringMetadata]);
  }

  // Update session
  async updateSession(session: SessionEvent) {
    return this.sendEvents("sessions", [session]);
  }

  // Batch send multiple events
  async batchTrackPageViews(events: PageViewEvent[]) {
    return this.sendEvents("page_views", events);
  }

  async batchTrackEvents(events: CustomEvent[]) {
    const eventsWithStringMetadata = events.map((event) => ({
      ...event,
      metadata: event.metadata ? JSON.stringify(event.metadata) : undefined,
    }));
    return this.sendEvents("events", eventsWithStringMetadata);
  }

  // Query endpoints
  async query(endpoint: string, params: Record<string, unknown> = {}) {
    const queryParams = new URLSearchParams({
      token: this.config.token,
      ...Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ),
    });

    const url = `${this.config.apiUrl}/v0/pipes/${endpoint}.json?${queryParams}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Tinybird query error: ${response.status} - ${error}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to query Tinybird:", error);
      throw error;
    }
  }

  // Helper function to format date for Tinybird (YYYY-MM-DD HH:MM:SS format)
  private formatDateForTinybird(date: Date): string {
    return date.toISOString().split(".")[0].replace("T", " ");
  }

  // Analytics queries
  async getAnalyticsSummary(
    businessId: string,
    startTime?: Date,
    endTime?: Date,
  ) {
    return this.query("api_analytics_summary", {
      business_id: businessId,
      start_time: startTime
        ? this.formatDateForTinybird(startTime)
        : this.formatDateForTinybird(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          ),
      end_time: endTime
        ? this.formatDateForTinybird(endTime)
        : this.formatDateForTinybird(new Date()),
    });
  }

  async getTopPages(
    businessId: string,
    limit = 10,
    startTime?: Date,
    endTime?: Date,
  ) {
    return this.query("api_top_pages", {
      business_id: businessId,
      limit,
      start_time: startTime
        ? this.formatDateForTinybird(startTime)
        : this.formatDateForTinybird(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          ),
      end_time: endTime
        ? this.formatDateForTinybird(endTime)
        : this.formatDateForTinybird(new Date()),
    });
  }

  async getRealTimeVisitors(businessId: string) {
    return this.query("api_real_time_visitors", {
      business_id: businessId,
    });
  }
}

// Singleton instance
let tinybirdClient: TinybirdClient | null = null;

export function getTinybirdClient(): TinybirdClient {
  if (!tinybirdClient) {
    const apiUrl =
      process.env.NEXT_PUBLIC_TINYBIRD_API_URL || "https://api.tinybird.co";
    const token = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;

    if (!token) {
      throw new Error("NEXT_PUBLIC_TINYBIRD_TOKEN is not configured");
    }

    tinybirdClient = new TinybirdClient({
      apiUrl,
      token,
    });
  }

  return tinybirdClient;
}
