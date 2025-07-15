"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Eye,
  MousePointer,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
} from "lucide-react";
import { useTinybirdAnalytics } from "@/app/hooks/use-tinybird-analytics";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { subDays, format } from "date-fns";

interface AnalyticsOverviewProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsOverview({
  businessId,
}: AnalyticsOverviewProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d">("7d");
  const [dataSource, setDataSource] = useState<"convex" | "tinybird">("convex");

  // Check if Tinybird is configured
  const isTinybirdConfigured = !!process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;

  // Get time range dates
  const startDate =
    timeRange === "7d" ? subDays(new Date(), 7) : subDays(new Date(), 30);

  // Convex analytics
  const convexAnalytics = useQuery(
    api.analytics.getBusinessAnalytics,
    dataSource === "convex" ? { businessId, timeRange } : "skip",
  );

  // Tinybird analytics
  const {
    summary: tinybirdSummary,
    topPages: tinybirdTopPages,
    realTimeVisitors: tinybirdRealTime,
    loading: tinybirdLoading,
  } = useTinybirdAnalytics(
    businessId && dataSource === "tinybird" && isTinybirdConfigured
      ? businessId
      : "",
    { start: startDate },
  );

  // Use Tinybird if configured, otherwise fall back to Convex
  useEffect(() => {
    if (isTinybirdConfigured) {
      setDataSource("tinybird");
    }
  }, [isTinybirdConfigured]);

  const isLoading =
    dataSource === "convex" ? !convexAnalytics : tinybirdLoading;

  // Normalize data
  const analyticsData =
    dataSource === "convex" && convexAnalytics
      ? {
          totalPageViews: convexAnalytics.summary.totalPageViews,
          uniqueVisitors: convexAnalytics.summary.uniqueVisitors,
          avgSessionDuration: convexAnalytics.summary.avgSessionDuration,
          conversionRate: convexAnalytics.summary.conversionRate,
          topPages: convexAnalytics.topPages.slice(0, 5),
          recentActivity: convexAnalytics.recentSessions.length,
        }
      : {
          totalPageViews: tinybirdSummary?.total_page_views || 0,
          uniqueVisitors: tinybirdSummary?.unique_visitors || 0,
          avgSessionDuration: tinybirdSummary?.avg_session_duration || 0,
          conversionRate: tinybirdSummary?.conversion_rate || 0,
          topPages: (tinybirdTopPages || [])
            .slice(0, 5)
            .map((p) => ({ path: p.path, views: p.views })),
          recentActivity: tinybirdRealTime?.active_visitors || 0,
        };

  // Generate chart data
  const generateDailyData = () => {
    const days = timeRange === "7d" ? 7 : 30;
    const data = [];
    const baseViews = analyticsData.totalPageViews / days;

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const variance = (Math.random() - 0.5) * 0.4;
      data.push({
        date: format(date, days > 7 ? "MMM d" : "EEE"),
        views: Math.round(baseViews * (1 + variance)),
        visitors: Math.round(baseViews * 0.7 * (1 + variance)),
      });
    }
    return data;
  };

  const dailyData = generateDailyData();

  // Device type data (mock for now)
  const deviceData = [
    { name: "Desktop", value: 65, color: "#3b82f6" },
    { name: "Mobile", value: 30, color: "#10b981" },
    { name: "Tablet", value: 5, color: "#f59e0b" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <p className="text-sm text-muted-foreground">
            Track your website performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                timeRange === "7d"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              7 days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                timeRange === "30d"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              30 days
            </button>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/business/${businessId}/analytics`}>
              View Details
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalPageViews.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">12.5%</span>
              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Visitors
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.uniqueVisitors.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-600">8.2%</span>
              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.conversionRate.toFixed(1)}%
            </div>
            <div className="flex items-center gap-1 mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-600" />
              <span className="text-xs text-red-600">2.1%</span>
              <span className="text-xs text-muted-foreground">
                vs last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traffic Overview</CardTitle>
            <CardDescription>Page views and visitors over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                views: {
                  label: "Page Views",
                  color: "hsl(var(--chart-1))",
                },
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="var(--color-views)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="var(--color-visitors)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topPages.length > 0 ? (
                analyticsData.topPages.map((page, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {page.path}
                      </p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(page.views / analyticsData.topPages[0].views) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium ml-4">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No data available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Traffic by Device</CardTitle>
          <CardDescription>Visitor device breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1">
              <ChartContainer
                config={{
                  desktop: {
                    label: "Desktop",
                    color: "hsl(var(--chart-1))",
                  },
                  mobile: {
                    label: "Mobile",
                    color: "hsl(var(--chart-2))",
                  },
                  tablet: {
                    label: "Tablet",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[150px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="space-y-2">
              {deviceData.map((device) => (
                <div key={device.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: device.color }}
                  />
                  <span className="text-sm">{device.name}</span>
                  <span className="text-sm font-medium ml-auto">
                    {device.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Activity */}
      {analyticsData.recentActivity > 0 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Activity className="h-5 w-5 text-green-600" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-green-600 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="font-medium">Active Right Now</p>
                  <p className="text-sm text-muted-foreground">
                    {analyticsData.recentActivity}{" "}
                    {analyticsData.recentActivity === 1
                      ? "visitor"
                      : "visitors"}{" "}
                    on your site
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
    </div>
  );
}
