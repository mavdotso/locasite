"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useTinybirdAnalytics } from "@/app/hooks/use-tinybird-analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  BarChart3,
  Users,
  Clock,
  Eye,
  Globe,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { subDays } from "date-fns";
import { ComingSoonOverlay } from "@/app/components/ui/coming-soon-overlay";

interface AnalyticsDashboardProps {
  businessId?: Id<"businesses">;
}

export default function AnalyticsDashboard({
  businessId,
}: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "24h" | "7d" | "30d" | "90d"
  >("30d");

  const user = useQuery(api.auth.currentUser);
  const userBusinesses = useQuery(
    api.businesses.listByUser,
    user && !businessId ? { userId: user._id } : "skip",
  );

  // Get time range dates - memoized to prevent infinite re-renders
  const timeRanges = useMemo(
    () => ({
      "24h": subDays(new Date(), 1),
      "7d": subDays(new Date(), 7),
      "30d": subDays(new Date(), 30),
      "90d": subDays(new Date(), 90),
    }),
    [],
  );

  // Tinybird analytics data
  const shouldUseTinybird = !!businessId;

  // Memoize the time range object to prevent infinite re-renders
  const tinybirdTimeRange = useMemo(
    () =>
      shouldUseTinybird ? { start: timeRanges[selectedTimeRange] } : undefined,
    [shouldUseTinybird, selectedTimeRange, timeRanges],
  );

  const {
    summary: tinybirdSummary,
    visitorCountries: tinybirdCountries,
    loading: tinybirdLoading,
    error: tinybirdError,
  } = useTinybirdAnalytics(
    shouldUseTinybird ? businessId : null,
    tinybirdTimeRange,
  );

  // If no businessId provided, use the first published business
  const businesses = userBusinesses?.filter((b) => b.isPublished) || [];
  const selectedBusinessId = businessId || businesses[0]?._id;

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Please sign in to view your analytics.</p>
        </div>
      </Card>
    );
  }

  if (!selectedBusinessId) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No published sites
          </h3>
          <p className="mb-4">
            Publish your first site to start tracking analytics.
          </p>
          <Button asChild>
            <Link href="/dashboard/sites">View Your Sites</Link>
          </Button>
        </div>
      </Card>
    );
  }

  const isLoading = tinybirdLoading;
  const hasError = tinybirdError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (hasError) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50 text-red-500" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Analytics Error
          </h3>
          <p className="mb-4">
            Failed to load analytics data. Please try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // Use Tinybird data
  const normalizedSummary = {
    totalPageViews: tinybirdSummary?.total_page_views || 0,
    uniqueVisitors: tinybirdSummary?.unique_visitors || 0,
    totalSessions: tinybirdSummary?.total_sessions || 0,
    avgSessionDuration: tinybirdSummary?.avg_session_duration || 0,
    avgPagesPerSession: tinybirdSummary?.avg_pages_per_session || 0,
    conversionRate: tinybirdSummary?.conversion_rate || 0,
    totalConversions: tinybirdSummary?.total_conversions || 0,
  };

  const statCards = [
    {
      title: "Total Page Views",
      value: normalizedSummary.totalPageViews.toLocaleString(),
      icon: Eye,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Unique Visitors",
      value: normalizedSummary.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Avg. Session Time",
      value: formatDuration(normalizedSummary.avgSessionDuration),
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="relative">
      <div className="space-y-8">
        {/* Header with Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Analytics Overview</h2>
            <p className="text-muted-foreground">
              Track your website performance and visitor behavior
            </p>
          </div>

          <div className="flex gap-2 items-center">
            {/* Time Range Selector */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              {(["24h", "7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedTimeRange === range
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {range === "24h"
                    ? "24 hours"
                    : range === "7d"
                      ? "7 days"
                      : range === "30d"
                        ? "30 days"
                        : "90 days"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visitor Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Visitor Countries</CardTitle>
            <CardDescription>
              Where your visitors come from and how often they visit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tinybirdCountries && tinybirdCountries.length > 0 ? (
              <div className="space-y-4">
                {tinybirdCountries.map((country, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {country.country || "Unknown"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {country.unique_visitors.toLocaleString()} unique
                        visitors • {country.avg_visits_per_visitor.toFixed(1)}{" "}
                        visits per visitor
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-foreground">
                        {country.total_visits.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        total visits
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No visitor data yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Overlay */}
      <ComingSoonOverlay
        title="Analytics Coming Soon"
        description="We're working on bringing you powerful analytics to track your website's performance. Stay tuned!"
      />
    </div>
  );
}

// Helper function to format duration
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
