"use client";

import { useState } from "react";
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
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe,
  Activity,
  RefreshCw,
  Loader2,
  Database,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { subDays } from "date-fns";

interface AnalyticsDashboardProps {
  businessId?: Id<"businesses">;
}

export default function AnalyticsDashboardTinybird({
  businessId,
}: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    "24h" | "7d" | "30d" | "90d"
  >("30d");
  const [dataSource, setDataSource] = useState<"convex" | "tinybird">(
    "tinybird",
  );

  const user = useQuery(api.auth.currentUser);
  const userBusinesses = useQuery(
    api.businesses.listByUser,
    user && !businessId ? { userId: user._id } : "skip",
  );

  // Get time range dates
  const timeRanges = {
    "24h": subDays(new Date(), 1),
    "7d": subDays(new Date(), 7),
    "30d": subDays(new Date(), 30),
    "90d": subDays(new Date(), 90),
  };

  // Convex analytics data
  const convexAnalytics = useQuery(
    api.analytics.getBusinessAnalytics,
    businessId && dataSource === "convex"
      ? { businessId, timeRange: selectedTimeRange }
      : "skip",
  );

  // Tinybird analytics data
  const {
    summary: tinybirdSummary,
    topPages: tinybirdTopPages,
    realTimeVisitors: tinybirdRealTime,
    loading: tinybirdLoading,
    error: tinybirdError,
  } = useTinybirdAnalytics(
    businessId && dataSource === "tinybird" ? businessId : "",
    { start: timeRanges[selectedTimeRange] },
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

  const isLoading =
    dataSource === "convex" ? !convexAnalytics : tinybirdLoading;
  const hasError = dataSource === "tinybird" && tinybirdError;

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
          <Database className="w-12 h-12 mx-auto mb-4 opacity-50 text-red-500" />
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

  // Normalize data based on source
  const normalizedSummary =
    dataSource === "convex"
      ? convexAnalytics?.summary || {
          totalPageViews: 0,
          uniqueVisitors: 0,
          totalSessions: 0,
          avgSessionDuration: 0,
          avgPagesPerSession: 0,
          conversionRate: 0,
          totalConversions: 0,
        }
      : {
          totalPageViews: tinybirdSummary?.total_page_views || 0,
          uniqueVisitors: tinybirdSummary?.unique_visitors || 0,
          totalSessions: tinybirdSummary?.total_sessions || 0,
          avgSessionDuration: tinybirdSummary?.avg_session_duration || 0,
          avgPagesPerSession: tinybirdSummary?.avg_pages_per_session || 0,
          conversionRate: tinybirdSummary?.conversion_rate || 0,
          totalConversions: tinybirdSummary?.total_conversions || 0,
        };

  const normalizedTopPages =
    dataSource === "convex"
      ? convexAnalytics?.topPages || []
      : tinybirdTopPages || [];

  const normalizedRealTime =
    dataSource === "convex"
      ? convexAnalytics
        ? { activeVisitors: 0, pageViewsLast5Min: 0 }
        : null
      : tinybirdRealTime
        ? {
            activeVisitors: tinybirdRealTime.active_visitors,
            pageViewsLast5Min: tinybirdRealTime.page_views_last_5_min,
          }
        : null;

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
    {
      title: "Conversion Rate",
      value: `${normalizedSummary.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
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
          {/* Data Source Selector */}
          <Tabs
            value={dataSource}
            onValueChange={(v) => setDataSource(v as "convex" | "tinybird")}
          >
            <TabsList>
              <TabsTrigger value="convex" className="gap-2">
                <Database className="h-4 w-4" />
                Convex
              </TabsTrigger>
              <TabsTrigger value="tinybird" className="gap-2">
                <Zap className="h-4 w-4" />
                Tinybird
              </TabsTrigger>
            </TabsList>
          </Tabs>

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

      {/* Real-time Visitors Badge */}
      {normalizedRealTime && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-600 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="font-medium">Active Visitors Right Now</p>
                  <p className="text-sm text-muted-foreground">
                    {normalizedRealTime.activeVisitors} visitors
                    {normalizedRealTime.pageViewsLast5Min > 0 &&
                      `, ${normalizedRealTime.pageViewsLast5Min} page views`}{" "}
                    in the last 5 minutes
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 border-green-300"
              >
                Live
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

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

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
          <CardDescription>Most visited pages on your site</CardDescription>
        </CardHeader>
        <CardContent>
          {normalizedTopPages.length > 0 ? (
            <div className="space-y-4">
              {normalizedTopPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{page.path}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex-1">
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${(page.views / normalizedTopPages[0].views) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-foreground">
                      {page.views.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No page views yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Data Source Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {dataSource === "tinybird" ? (
              <>
                <Zap className="h-4 w-4 text-yellow-600" />
                <p className="text-sm text-muted-foreground">
                  Powered by Tinybird - Real-time analytics at scale
                </p>
              </>
            ) : (
              <>
                <Database className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-muted-foreground">
                  Using Convex database for analytics storage
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
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
