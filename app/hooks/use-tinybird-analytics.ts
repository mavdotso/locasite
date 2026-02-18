import { useState, useEffect, useRef, useCallback } from "react";
import { getTinybirdClient } from "@/app/lib/tinybird";

// Cache management
interface CacheData {
  summary: AnalyticsSummary | null;
  topPages: TopPage[];
  realTime: RealTimeVisitors | null;
  countries: VisitorCountry[];
}

const analyticsCache = new Map<string, {
  data: CacheData;
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const REAL_TIME_REFRESH_INTERVAL = 60 * 1000; // 60 seconds (reduced from 30)

function getCacheKey(businessId: string, start?: Date, end?: Date): string {
  return `${businessId}-${start?.toISOString() || 'none'}-${end?.toISOString() || 'none'}`;
}

interface AnalyticsSummary {
  unique_visitors: number;
  total_page_views: number;
  total_sessions: number;
  avg_load_time: number;
  homepage_views: number;
  avg_session_duration: number;
  avg_pages_per_session: number;
  total_conversions: number;
  conversion_rate: number;
  bounce_rate: number;
}

interface TopPage {
  path: string;
  views: number;
  unique_visitors: number;
  avg_load_time: number;
}

interface RealTimeVisitors {
  active_visitors: number;
  page_views_last_5_min: number;
  active_sessions: number;
}

interface VisitorCountry {
  country: string;
  unique_visitors: number;
  total_visits: number;
  avg_visits_per_visitor: number;
}

export function useTinybirdAnalytics(
  businessId: string | null | undefined,
  timeRange?: { start?: Date; end?: Date },
) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [realTimeVisitors, setRealTimeVisitors] =
    useState<RealTimeVisitors | null>(null);
  const [visitorCountries, setVisitorCountries] = useState<VisitorCountry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to prevent unnecessary re-renders
  const lastFetchRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAnalytics = useCallback(async (forceRefresh = false) => {
    if (!businessId) return;

    // Check cache first
    const cacheKey = getCacheKey(businessId, timeRange?.start, timeRange?.end);
    const cached = analyticsCache.get(cacheKey);

    if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setSummary(cached.data.summary);
      setTopPages(cached.data.topPages);
      setRealTimeVisitors(cached.data.realTime);
      setVisitorCountries(cached.data.countries);
      setLoading(false);
      return;
    }

    // Prevent duplicate fetches
    const now = Date.now();
    if (now - lastFetchRef.current < 1000) return; // Debounce 1 second
    lastFetchRef.current = now;
    try {
      setLoading(true);
      const tinybird = getTinybirdClient();

      // Parallel fetch all data
      const [summaryResponse, topPagesResponse, realTimeResponse, countriesResponse] =
        await Promise.all([
          tinybird.getAnalyticsSummary(
            businessId,
            timeRange?.start,
            timeRange?.end,
          ),
          tinybird.getTopPages(
            businessId,
            10,
            timeRange?.start,
            timeRange?.end,
          ),
          tinybird.getRealTimeVisitors(businessId),
          tinybird.getVisitorCountries(
            businessId,
            timeRange?.start,
            timeRange?.end,
          ),
        ]);

      const newSummary = summaryResponse.data?.[0] || null;
      const newTopPages = topPagesResponse.data || [];
      const newRealTime = realTimeResponse.data?.[0] || null;
      const newCountries = countriesResponse.data || [];

      // Update state
      setSummary(newSummary);
      setTopPages(newTopPages);
      setRealTimeVisitors(newRealTime);
      setVisitorCountries(newCountries);

      // Update cache
      analyticsCache.set(cacheKey, {
        data: {
          summary: newSummary,
          topPages: newTopPages,
          realTime: newRealTime,
          countries: newCountries,
        },
        timestamp: Date.now(),
      });

      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching analytics data:", err);
    } finally {
      setLoading(false);
    }
  }, [businessId, timeRange?.start, timeRange?.end]);

  // Fetch real-time data only
  const fetchRealTimeOnly = useCallback(async () => {
    if (!businessId) return;

    try {
      const tinybird = getTinybirdClient();
      const realTimeResponse = await tinybird.getRealTimeVisitors(businessId);
      if (realTimeResponse.data?.[0]) {
        setRealTimeVisitors(realTimeResponse.data[0]);
      }
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    }
  }, [businessId]);

  // Initial fetch
  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Set up real-time refresh interval
  useEffect(() => {
    if (!businessId) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval for real-time data only
    intervalRef.current = setInterval(fetchRealTimeOnly, REAL_TIME_REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [businessId, fetchRealTimeOnly]);

  const refetch = useCallback(() => {
    return fetchAnalytics(true);
  }, [fetchAnalytics]);

  return {
    summary,
    topPages,
    realTimeVisitors,
    visitorCountries,
    loading,
    error,
    refetch,
  };
}

// Clear old cache entries periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of analyticsCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION * 2) {
        analyticsCache.delete(key);
      }
    }
  }, CACHE_DURATION);
}
