'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Globe, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Plus,
  ExternalLink,
  Edit3,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import EditButton from '@/app/components/ui/edit-button';
import ViewButton from '@/app/components/ui/view-button';

interface DashboardOverviewProps {
  initialData?: Record<string, unknown>;
}

export default function DashboardOverview({ initialData: _initialData }: DashboardOverviewProps) {
  const [isProcessingPending, setIsProcessingPending] = useState(false);
  const user = useQuery(api.auth.currentUser);
  const userBusinesses = useQuery(api.businesses.listByUser, 
    user ? { userId: user._id } : 'skip'
  );
  const totalUnreadMessages = useQuery(api.contactMessages.getTotalUnreadCount) || 0;
  const createFromPending = useMutation(api.createFromPending.createBusinessFromPendingData);

  // Check for pending business data and process it
  useEffect(() => {
    if (!user || isProcessingPending) return;

    const pendingData = sessionStorage.getItem('pendingBusinessData');
    if (pendingData) {
      setIsProcessingPending(true);
      try {
        const { businessData, aiContent } = JSON.parse(pendingData);
        createFromPending({ businessData, aiContent })
          .then(({ businessId }) => {
            sessionStorage.removeItem('pendingBusinessData');
            // Redirect to edit page
            window.location.href = `/business/${businessId}/edit`;
          })
          .catch((error) => {
            console.error('Failed to create business from pending data:', error);
            setIsProcessingPending(false);
          });
      } catch (error) {
        console.error('Failed to parse pending business data:', error);
        sessionStorage.removeItem('pendingBusinessData');
        setIsProcessingPending(false);
      }
    }
  }, [user, createFromPending, isProcessingPending]);

  // Calculate stats
  const totalSites = userBusinesses?.length || 0;
  const activeSites = userBusinesses?.filter(b => b.domainId).length || 0;

  // Mock analytics data (in a real app, this would come from your analytics service)
  const mockAnalytics = {
    totalViews: 1247,
    monthlyGrowth: 12.5,
    uniqueVisitors: 892,
    avgSessionTime: '2m 34s'
  };

  // Recent activity (mock data)
  const recentActivity = [
    {
      id: 1,
      type: 'site_created',
      message: 'New site created for "Coffee Shop Downtown"',
      time: '2 hours ago',
      icon: Globe,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'message_received',
      message: 'New contact form submission',
      time: '5 hours ago',
      icon: MessageSquare,
      color: 'text-blue-600'
    },
  ];

  const statCards = [
    {
      title: 'Total Sites',
      value: totalSites,
      description: `${activeSites} published`,
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Unread Messages',
      value: totalUnreadMessages,
      description: 'From contact forms',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Monthly Views',
      value: mockAnalytics.totalViews.toLocaleString(),
      description: `+${mockAnalytics.monthlyGrowth}% from last month`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Unique Visitors',
      value: mockAnalytics.uniqueVisitors.toLocaleString(),
      description: `Avg. session: ${mockAnalytics.avgSessionTime}`,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Please sign in to view your dashboard.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Sites */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Business Sites</CardTitle>
              <CardDescription>
                Manage and monitor your published websites
              </CardDescription>
            </div>
            <Button size="sm" asChild>
              <Link href="/dashboard/sites">
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {userBusinesses && userBusinesses.length > 0 ? (
              <div className="space-y-4">
                {userBusinesses.slice(0, 3).map((business) => (
                  <div key={business._id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{business.name}</h3>
                        <p className="text-sm text-muted-foreground">{business.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {business.domainId ? (
                        <Badge className="bg-green-100 text-green-800">Published</Badge>
                      ) : (
                        <Badge variant="outline">Draft</Badge>
                      )}
                      <div className="flex gap-1">
                        {business.domainId && (
                          <ViewButton businessId={business._id} size="sm" variant="ghost">
                            <ExternalLink className="w-4 h-4" />
                          </ViewButton>
                        )}
                        <EditButton businessId={business._id} size="sm" variant="ghost">
                          <Edit3 className="w-4 h-4" />
                        </EditButton>
                      </div>
                    </div>
                  </div>
                ))}
                
                {userBusinesses.length === 0 && (
                  <div className="text-center py-8">
                    <Globe className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No sites yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first business website to get started.</p>
                    <Button asChild>
                      <Link href="/dashboard/sites/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Site
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No sites yet</h3>
                <p className="text-muted-foreground mb-4">Create your first business website to get started.</p>
                <Button asChild>
                  <Link href="/dashboard/sites/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Site
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/dashboard/sites/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Site
                </Link>
              </Button>
              
              {totalUnreadMessages > 0 && (
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/dashboard/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Messages ({totalUnreadMessages})
                  </Link>
                </Button>
              )}
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/analytics">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-muted">
                      <activity.icon className={`w-3 h-3 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}