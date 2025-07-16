import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import AnalyticsClient from "./analytics-client";

interface AnalyticsPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function BusinessAnalyticsPage({
  params,
}: AnalyticsPageProps) {
  const { businessId } = await params;
  const businessIdTyped = businessId as Id<"businesses">;

  // Get current user (auth is handled by dashboard layout)
  const user = await fetchQuery(api.auth.currentUser, {});

  // Get business from database
  const business = await fetchQuery(api.businesses.getById, {
    id: businessIdTyped,
  });

  if (!business) {
    redirect("/dashboard/sites");
  }

  // Check ownership
  if (business.userId && user && business.userId !== user._id) {
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
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <p className="text-muted-foreground mt-2">Analytics & Performance</p>
      </div>

      <AnalyticsClient businessId={businessIdTyped} />
    </div>
  );
}
