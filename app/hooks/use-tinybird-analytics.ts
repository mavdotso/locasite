import { useState, useEffect } from "react";
import { getTinybirdClient } from "@/app/lib/tinybird";

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

  useEffect(() => {
    if (!businessId) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const tinybird = getTinybirdClient();

        // Fetch analytics summary
        const summaryResponse = await tinybird.getAnalyticsSummary(
          businessId,
          timeRange?.start,
          timeRange?.end,
        );
        if (summaryResponse.data && summaryResponse.data.length > 0) {
          setSummary(summaryResponse.data[0]);
        }

        // Fetch top pages
        const topPagesResponse = await tinybird.getTopPages(
          businessId,
          10,
          timeRange?.start,
          timeRange?.end,
        );
        setTopPages(topPagesResponse.data || []);

        // Fetch real-time visitors
        const realTimeResponse = await tinybird.getRealTimeVisitors(businessId);
        if (realTimeResponse.data && realTimeResponse.data.length > 0) {
          setRealTimeVisitors(realTimeResponse.data[0]);
        }

        // Fetch visitor countries
        const countriesResponse = await tinybird.getVisitorCountries(
          businessId,
          timeRange?.start,
          timeRange?.end,
        );
        setVisitorCountries(countriesResponse.data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    // Refresh real-time data every 30 seconds
    const interval = setInterval(async () => {
      try {
        const tinybird = getTinybirdClient();
        const realTimeResponse = await tinybird.getRealTimeVisitors(businessId);
        if (realTimeResponse.data && realTimeResponse.data.length > 0) {
          setRealTimeVisitors(realTimeResponse.data[0]);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [businessId, timeRange?.start, timeRange?.end]);

  const refetch = async () => {
    if (!businessId) return;

    try {
      setLoading(true);
      const tinybird = getTinybirdClient();

      // Fetch analytics summary
      const summaryResponse = await tinybird.getAnalyticsSummary(
        businessId,
        timeRange?.start,
        timeRange?.end,
      );
      if (summaryResponse.data && summaryResponse.data.length > 0) {
        setSummary(summaryResponse.data[0]);
      }

      // Fetch top pages
      const topPagesResponse = await tinybird.getTopPages(
        businessId,
        10,
        timeRange?.start,
        timeRange?.end,
      );
      setTopPages(topPagesResponse.data || []);

      // Fetch real-time visitors
      const realTimeResponse = await tinybird.getRealTimeVisitors(businessId);
      if (realTimeResponse.data && realTimeResponse.data.length > 0) {
        setRealTimeVisitors(realTimeResponse.data[0]);
      }

      // Fetch visitor countries
      const countriesResponse = await tinybird.getVisitorCountries(
        businessId,
        timeRange?.start,
        timeRange?.end,
      );
      setVisitorCountries(countriesResponse.data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

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
