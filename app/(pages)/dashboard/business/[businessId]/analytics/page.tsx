import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, BarChart3, Eye, MousePointer, Clock } from "lucide-react";
import Link from "next/link";

interface AnalyticsPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function BusinessAnalyticsPage({ params }: AnalyticsPageProps) {
  const { businessId } = await params;
  const businessIdTyped = businessId as Id<"businesses">;

  // Server-side auth check
  const user = await fetchQuery(api.auth.currentUser, {});
  
  if (!user) {
    redirect(`/sign-in?redirect=/dashboard/business/${businessId}/analytics`);
  }

  // Get business from database
  const business = await fetchQuery(api.businesses.getById, {
    id: businessIdTyped,
  });

  if (!business) {
    redirect("/dashboard/sites");
  }

  // Check ownership
  if (business.userId && business.userId !== user._id) {
    redirect("/dashboard/sites");
  }

  return (
    <div className="container p-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/sites">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sites
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{business.name} - Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Website performance and visitor insights
        </p>
      </div>

      {/* Placeholder Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              All-time page views
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Unique site visitors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0:00</div>
            <p className="text-xs text-muted-foreground">
              Average time on site
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">
              Single page sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Analytics Coming Soon</CardTitle>
          <CardDescription>
            Detailed analytics and insights for your business website will be available here.
            We&apos;re working on bringing you comprehensive visitor data, traffic sources, and engagement metrics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Upcoming features:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Real-time visitor tracking</li>
              <li>Traffic source analysis</li>
              <li>Page performance metrics</li>
              <li>Conversion tracking</li>
              <li>Custom reports and exports</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}