"use client";

import { lazy, Suspense, useMemo } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { Id } from "@/convex/_generated/dataModel";
import {
  Edit3,
  Globe,
  MessageSquare,
  BarChart3,
  ExternalLink,
  Shield,
  ArrowLeft,
  Loader2,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";

// Lazy load heavy components
const SeoSettings = lazy(() =>
  import("@/app/components/business/seo-settings").then(module => ({
    default: module.SeoSettings
  }))
);

const AnalyticsOverview = lazy(() =>
  import("@/app/components/dashboard/analytics-overview")
);

// Loading component for lazy loaded components
const TabContentLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

interface BusinessDashboardProps {
  businessId: Id<"businesses">;
}

export default function BusinessDashboard({
  businessId,
}: BusinessDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "overview";

  // Use compound query to fetch all data in one call
  const dashboardData = useQuery(api.dashboardData.getDashboardBusinessData, {
    businessId,
  });
  // Query user data directly - Convex handles deduplication
  const userWithSub = useQuery(api.auth.currentUserWithSubscription);
  const user = userWithSub?.user;

  const business = dashboardData?.business;
  const domain = dashboardData?.domain;
  const unreadCount = dashboardData?.unreadCount ?? 0;

  // Memoize computed values
  const isPublished = useMemo(() => !!domain, [domain]);
  const canClaim = useMemo(() => !business?.userId, [business?.userId]);

  // Loading state while fetching business data
  if (business === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Business not found
  if (business === null) {
    return notFound();
  }

  // At this point, user is guaranteed to be defined due to auth guard
  if (business.userId && user && business.userId !== user._id) {
    router.push(`/dashboard`);
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl p-8 mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-muted-foreground mt-2">
              {isPublished
                ? `Published at ${domain?.subdomain}.locasite.com`
                : "Not published yet"}
            </p>
          </div>
          {isPublished && (
            <Button variant="outline" asChild>
              <a
                href={`/${domain?.subdomain}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Site
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="messages">
            Messages
            {(unreadCount || 0) > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="h-4 w-4 mr-1" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Visual Editor
                </CardTitle>
                <CardDescription>
                  Customize your website design and content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/business/${business._id}/edit`}>
                    Open Editor
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                  {(unreadCount || 0) > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>View contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/dashboard/business/${business._id}/messages`}>
                    View Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  Track visitor insights and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/dashboard/business/${business._id}/analytics`}>
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Domain Settings
                </CardTitle>
                <CardDescription>
                  {isPublished
                    ? "Manage your website domain"
                    : "Publish your website"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full"
                  variant={isPublished ? "outline" : "default"}
                >
                  <Link href={`/dashboard/business/${business._id}/domain`}>
                    {isPublished ? "Manage Domain" : "Publish Website"}
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {canClaim && (
              <Card className="hover:shadow-lg transition-shadow border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Claim Business
                  </CardTitle>
                  <CardDescription>
                    Verify ownership to manage this listing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full" variant="outline">
                    <Link
                      href={`/${domain?.subdomain || business._id}/claim/${business._id}`}
                    >
                      Claim This Business
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Business Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Basic details about your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Name
                  </h4>
                  <p className="mt-1">{business.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">
                    Address
                  </h4>
                  <p className="mt-1">{business.address}</p>
                </div>
                {business.phone && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Phone
                    </h4>
                    <p className="mt-1">{business.phone}</p>
                  </div>
                )}
                {business.email && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Email
                    </h4>
                    <p className="mt-1">{business.email}</p>
                  </div>
                )}
                {business.website && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Website
                    </h4>
                    <p className="mt-1">{business.website}</p>
                  </div>
                )}
                {business.description && (
                  <div className="md:col-span-2">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Description
                    </h4>
                    <p className="mt-1">{business.description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Editor Tab */}
        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>Visual Editor</CardTitle>
              <CardDescription>
                Design and customize your business website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full">
                <Link href={`/business/${business._id}/edit`}>
                  <Edit3 className="mr-2 h-5 w-5" />
                  Open Visual Editor
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Customer Messages</CardTitle>
              <CardDescription>
                View and manage contact form submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="w-full">
                <Link href={`/dashboard/business/${business._id}/messages`}>
                  <MessageSquare className="mr-2 h-5 w-5" />
                  View All Messages
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab - Lazy loaded */}
        <TabsContent value="analytics">
          <Suspense fallback={<TabContentLoader />}>
            <AnalyticsOverview businessId={businessId} />
          </Suspense>
        </TabsContent>

        {/* SEO Tab - Lazy loaded */}
        <TabsContent value="seo">
          <Suspense fallback={<TabContentLoader />}>
            <SeoSettings businessId={businessId} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
