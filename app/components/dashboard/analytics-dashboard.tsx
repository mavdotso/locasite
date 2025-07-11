'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  Globe,
  MousePointer,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow, format, subDays } from 'date-fns';
import { SimpleLineChart } from '@/app/components/ui/simple-line-chart';

interface AnalyticsDashboardProps {
  businessId?: Id<"businesses">;
}

export default function AnalyticsDashboardV2({ businessId }: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const user = useQuery(api.auth.currentUser);
  const userBusinesses = useQuery(api.businesses.listByUser, 
    user && !businessId ? { userId: user._id } : 'skip'
  );
  
  // Get analytics data
  const analytics = useQuery(
    api.analytics.getBusinessAnalytics, 
    businessId ? { businessId, timeRange: selectedTimeRange } : 'skip'
  );
  
  // Get real-time visitors
  const realTimeVisitors = useQuery(
    api.analytics.getRealTimeVisitors,
    businessId ? { businessId } : 'skip'
  );

  // If no businessId provided, use the first published business
  const businesses = userBusinesses?.filter(b => b.isPublished) || [];
  const selectedBusinessId = businessId || businesses[0]?._id;

  const handleRefresh = () => {
    setIsRefreshing(true);
    // In a real app, you'd trigger a data refresh here
    setTimeout(() => setIsRefreshing(false), 1000);
  };

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
          <h3 className="text-lg font-medium text-foreground mb-2">No published sites</h3>
          <p className="mb-4">Publish your first site to start tracking analytics.</p>
          <Button asChild>
            <Link href="/dashboard/sites">View Your Sites</Link>
          </Button>
        </div>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { summary, topPages, recentSessions, conversionTypes } = analytics;

  // Calculate percentage changes (mock for now)
  const changes = {
    pageViews: 12.3,
    visitors: 8.7,
    sessionTime: 5.2,
    conversionRate: 15.8
  };

  const statCards = [
    {
      title: 'Total Page Views',
      value: summary.totalPageViews.toLocaleString(),
      change: changes.pageViews,
      changeType: changes.pageViews > 0 ? 'positive' : 'negative' as const,
      icon: Eye,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Unique Visitors',
      value: summary.uniqueVisitors.toLocaleString(),
      change: changes.visitors,
      changeType: changes.visitors > 0 ? 'positive' : 'negative' as const,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Avg. Session Time',
      value: formatDuration(summary.avgSessionDuration),
      change: changes.sessionTime,
      changeType: changes.sessionTime > 0 ? 'positive' : 'negative' as const,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Conversion Rate',
      value: `${summary.conversionRate.toFixed(1)}%`,
      change: changes.conversionRate,
      changeType: changes.conversionRate > 0 ? 'positive' : 'negative' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Overview</h2>
          <p className="text-muted-foreground">Track your website performance and visitor behavior</p>
        </div>
        
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {(['24h', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range === '24h' ? '24 hours' : 
                 range === '7d' ? '7 days' : 
                 range === '30d' ? '30 days' : '90 days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Visitors Badge */}
      {realTimeVisitors && (
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
                    {realTimeVisitors.activeVisitors} {realTimeVisitors.activeVisitors === 1 ? 'visitor' : 'visitors'} in the last 5 minutes
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                Live
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Views Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Page Views Trend</CardTitle>
          <CardDescription>Daily page views over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleLineChart 
            data={generateChartData(selectedTimeRange, summary.totalPageViews)}
            height={250}
            color="#3b82f6"
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <p className={`text-xs ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(stat.change)}% from last period
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{page.path}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex-1">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${(page.views / topPages[0].views) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-medium text-foreground">{page.views.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">views</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No page views yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Latest visitor sessions on your site</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-3">
                {recentSessions.slice(0, 5).map((session, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{session.entryPage}</p>
                        {session.hasConverted && (
                          <Badge variant="outline" className="text-xs">
                            Converted
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(session.startTime), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{session.pageCount} pages</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(session.duration || 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No sessions recorded yet</p>
            )}
          </CardContent>
        </Card>

        {/* Conversions */}
        <Card>
          <CardHeader>
            <CardTitle>Conversions</CardTitle>
            <CardDescription>Actions taken by your visitors</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(conversionTypes).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(conversionTypes).map(([type, count], index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {((count / summary.totalSessions) * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No conversions tracked yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key indicators for your website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pages per Session</span>
                <span className="font-medium">{summary.avgPagesPerSession.toFixed(1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <span className="font-medium">{summary.totalSessions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Conversions</span>
                <span className="font-medium">{summary.totalConversions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bounce Rate</span>
                <span className="font-medium">
                  {summary.totalSessions > 0 
                    ? `${((recentSessions.filter(s => s.pageCount === 1).length / summary.totalSessions) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to format duration
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

// Helper function to generate chart data
function generateChartData(timeRange: string, totalViews: number) {
  const days = timeRange === '24h' ? 1 : 
               timeRange === '7d' ? 7 : 
               timeRange === '30d' ? 30 : 90;
  
  const data = [];
  const viewsPerDay = totalViews / days;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const variance = (Math.random() - 0.5) * 0.4; // ±20% variance
    const value = Math.round(viewsPerDay * (1 + variance));
    
    data.push({
      date: format(date, days > 7 ? 'MMM d' : 'EEE'),
      value: Math.max(0, value)
    });
  }
  
  return data;
}