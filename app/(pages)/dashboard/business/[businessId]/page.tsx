import { Id } from "@/convex/_generated/dataModel";
import BusinessDashboardClient from "./business-dashboard-client";

interface BusinessDashboardPageProps {
  params: Promise<{
    businessId: string;
  }>;
}

export default async function BusinessDashboardPage({ params }: BusinessDashboardPageProps) {
  const { businessId } = await params;
  const businessIdTyped = businessId as Id<"businesses">;

  // Client-side auth and ownership checks will be handled in BusinessDashboardClient
  return <BusinessDashboardClient businessId={businessIdTyped} />;
}