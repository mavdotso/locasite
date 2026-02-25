import { Card, CardContent } from "@/app/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

// Simple Coming Soon card - no fake data underneath

interface AnalyticsOverviewProps {
  businessId: Id<"businesses">;
}

export default function AnalyticsOverview({
  businessId: _businessId,
}: AnalyticsOverviewProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <BarChart3 className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Analytics Coming Soon</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          We&apos;re working on bringing you powerful analytics to track your
          website&apos;s performance. Stay tuned!
        </p>
      </CardContent>
    </Card>
  );
}
