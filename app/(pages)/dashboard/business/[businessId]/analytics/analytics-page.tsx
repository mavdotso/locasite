"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import AnalyticsDashboard from "@/app/components/dashboard/analytics-dashboard";
import { useSubscription } from "@/app/hooks/use-subscription";
import { UpgradeDialog } from "@/app/components/common/upgrade-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { BarChart3, TrendingUp, Users, MousePointerClick } from "lucide-react";

interface AnalyticsPageProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsPage({ businessId }: AnalyticsPageProps) {
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const { planType, canUseFeature } = useSubscription();

  // Check if user has access to advanced analytics
  const hasAnalyticsAccess = canUseFeature("PROFESSIONAL");

  if (!hasAnalyticsAccess) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Card className="border-dashed">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Advanced Analytics</CardTitle>
              <CardDescription className="text-base">
                Unlock powerful insights about your website visitors and
                performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center space-y-2">
                  <TrendingUp className="h-8 w-8 mx-auto text-muted-foreground" />
                  <h3 className="font-semibold">Traffic Trends</h3>
                  <p className="text-sm text-muted-foreground">
                    Track visitor growth over time
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <Users className="h-8 w-8 mx-auto text-muted-foreground" />
                  <h3 className="font-semibold">Visitor Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand your audience demographics
                  </p>
                </div>
                <div className="text-center space-y-2">
                  <MousePointerClick className="h-8 w-8 mx-auto text-muted-foreground" />
                  <h3 className="font-semibold">Conversion Tracking</h3>
                  <p className="text-sm text-muted-foreground">
                    Measure engagement and conversions
                  </p>
                </div>
              </div>

              <div className="text-center pt-4">
                <Button onClick={() => setShowUpgradeDialog(true)} size="lg">
                  Upgrade to Professional
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  Starting at $19/month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <UpgradeDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
          feature="Advanced Analytics"
          requiredPlan="PROFESSIONAL"
          currentPlan={planType}
        />
      </>
    );
  }

  return <AnalyticsDashboard businessId={businessId} />;
}
