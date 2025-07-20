"use client";

import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { BarChart3, TrendingUp, Users, MousePointerClick } from "lucide-react";

interface AnalyticsPageProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsPage({
  businessId: _businessId,
}: AnalyticsPageProps) {
  // Show coming soon for ALL users
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Analytics Coming Soon</CardTitle>
          <CardDescription className="text-base">
            We&apos;re working hard to bring you powerful analytics features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="font-semibold">Real-time Traffic</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your website visitors in real-time
              </p>
            </div>
            <div className="text-center space-y-2">
              <Users className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="font-semibold">Detailed Reports</h3>
              <p className="text-sm text-muted-foreground">
                Get insights into visitor behavior and demographics
              </p>
            </div>
            <div className="text-center space-y-2">
              <MousePointerClick className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="font-semibold">Performance Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Track page views, bounce rates, and conversions
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Analytics features will be available soon. Stay tuned!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
