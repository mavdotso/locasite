"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import { 
  Edit3, 
  Globe, 
  MessageSquare, 
  BarChart3, 
  ExternalLink,
  Shield,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { notFound } from "next/navigation";

interface BusinessDashboardClientProps {
  businessId: Id<"businesses">;
}

export default function BusinessDashboardClient({ 
  businessId 
}: BusinessDashboardClientProps) {
  const router = useRouter();
  
  // All hooks must be called before any conditional returns
  const user = useQuery(api.auth.currentUser);
  const business = useQuery(api.businesses.getById, { id: businessId });
  const domain = useQuery(api.domains.getByBusinessId, { businessId });
  const unreadCount = useQuery(api.contactMessages.getUnreadCount, { businessId });
  
  // Handle authentication
  useEffect(() => {
    if (user === null) {
      // User is not authenticated, redirect to sign-in with redirect back to this page
      router.push(`/sign-in?redirect=/dashboard/business/${businessId}`);
    }
  }, [user, businessId, router]);
  
  // Loading state while fetching user or business
  if (user === undefined || business === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // User not authenticated (null)
  if (user === null) {
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
  
  // Check ownership - only allow owner to access dashboard
  if (business.userId && business.userId !== user._id) {
    router.push(`/dashboard/sites`);
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  const isPublished = !!domain;
  const canClaim = !business.userId;

  return (
    <div className="container max-w-6xl p-8 mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/sites">
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
                : "Not published yet"
              }
            </p>
          </div>
          {isPublished && (
            <Button variant="outline" asChild>
              <a href={`/${domain?.subdomain}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Live Site
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
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
            <CardDescription>
              View contact form submissions
            </CardDescription>
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
              {isPublished ? "Manage your website domain" : "Publish your website"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant={isPublished ? "outline" : "default"}>
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
                <Link href={`/${domain?.subdomain || business._id}/claim/${business._id}`}>
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
              <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
              <p className="mt-1">{business.name}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Address</h4>
              <p className="mt-1">{business.address}</p>
            </div>
            {business.phone && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Phone</h4>
                <p className="mt-1">{business.phone}</p>
              </div>
            )}
            {business.email && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Email</h4>
                <p className="mt-1">{business.email}</p>
              </div>
            )}
            {business.website && (
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Website</h4>
                <p className="mt-1">{business.website}</p>
              </div>
            )}
            {business.description && (
              <div className="md:col-span-2">
                <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                <p className="mt-1">{business.description}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}