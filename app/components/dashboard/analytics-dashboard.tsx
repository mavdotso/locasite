'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Link,
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [selectedSite, setSelectedSite] = useState<string | 'all'>('all');
  
  const user = useQuery(api.auth.currentUser);
  const userBusinesses = useQuery(api.businesses.listByUser, 
    user ? { userId: user._id } : 'skip'
  );

  // Mock analytics data (in a real app, this would come from your analytics service)
  const mockAnalytics = {
    totalViews: 2847,
    uniqueVisitors: 1923,
    avgSessionTime: '3m 42s',
    bounceRate: 42.3,
    topPages: [
      { path: '/', views: 1245, title: 'Home' },
      { path: '/about', views: 456, title: 'About Us' },
      { path: '/contact', views: 234, title: 'Contact' },
      { path: '/services', views: 189, title: 'Services' },
    ],
    deviceBreakdown: [
      { device: 'Desktop', percentage: 58.3, visitors: 1121 },
      { device: 'Mobile', percentage: 35.7, visitors: 686 },
      { device: 'Tablet', percentage: 6.0, visitors: 116 },
    ],
    topReferrers: [
      { source: 'Google Search', visitors: 1456, percentage: 75.7 },
      { source: 'Direct', visitors: 289, percentage: 15.0 },
      { source: 'Social Media', visitors: 134, percentage: 7.0 },
      { source: 'Other', visitors: 44, percentage: 2.3 },
    ],
    dailyViews: [
      { date: '2024-01-01', views: 145 },
      { date: '2024-01-02', views: 189 },
      { date: '2024-01-03', views: 234 },
      { date: '2024-01-04', views: 198 },
      { date: '2024-01-05', views: 267 },
      { date: '2024-01-06', views: 301 },
      { date: '2024-01-07', views: 289 },
    ]
  };

  const publishedSites = userBusinesses?.filter(b => b.domainId) || [];

  const statCards = [
    {
      title: 'Total Views',
      value: mockAnalytics.totalViews.toLocaleString(),
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Unique Visitors',
      value: mockAnalytics.uniqueVisitors.toLocaleString(),
      change: '+8.7%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Avg. Session Time',
      value: mockAnalytics.avgSessionTime,
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Bounce Rate',
      value: `${mockAnalytics.bounceRate}%`,
      change: '-2.1%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

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

  if (publishedSites.length === 0) {
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

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <select 
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
            className="px-3 py-2 border border-border rounded-md text-sm"
          >
            <option value="all">All Sites</option>
            {publishedSites.map(site => (
              <option key={site._id} value={site._id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedTimeRange === range
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className={`text-xs mt-1 ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last period
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your sites</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{page.title}</p>
                    <p className="text-sm text-muted-foreground">{page.path}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{page.views.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Visitor devices and platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.deviceBreakdown.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {device.device === 'Desktop' && <Monitor className="w-4 h-4 text-muted-foreground" />}
                    {device.device === 'Mobile' && <Smartphone className="w-4 h-4 text-muted-foreground" />}
                    {device.device === 'Tablet' && <Monitor className="w-4 h-4 text-muted-foreground" />}
                    <span className="font-medium text-foreground">{device.device}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{device.percentage}%</p>
                    <p className="text-sm text-muted-foreground">{device.visitors} visitors</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAnalytics.topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{referrer.source}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${referrer.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-medium text-foreground">{referrer.visitors}</p>
                    <p className="text-sm text-muted-foreground">{referrer.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest website interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Real-time analytics coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note about analytics */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Analytics Integration</h3>
              <p className="text-blue-800 text-sm">
                Currently showing demo data. Connect Google Analytics or another analytics service 
                to see real visitor data for your websites.
              </p>
              <Button variant="outline" size="sm" className="mt-3">
                Set up Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}