import { notFound, redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
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

  // Server-side auth check
  const user = await fetchQuery(api.auth.currentUser, {});
  
  if (!user) {
    redirect(`/sign-in?redirect=/dashboard/business/${businessId}`);
  }

  try {
    // Get business from database
    const business = await fetchQuery(api.businesses.getById, {
      id: businessIdTyped,
    });

    if (!business) {
      notFound();
    }

    // Check ownership
    if (business.userId && business.userId !== user._id) {
      redirect("/dashboard/sites");
    }

    // Get domain if it exists
    const domain = await fetchQuery(api.domains.getByBusinessId, { businessId: businessIdTyped });

    // Fetch contact messages
    const messages = await fetchQuery(api.contactMessages.getByBusiness, {
      businessId: business._id,
    });
    
    // Get unread count
    const unreadCount = await fetchQuery(api.contactMessages.getUnreadCount, {
      businessId: business._id,
    });

    return (
      <BusinessDashboardClient 
        business={business}
        domain={domain}
        initialMessages={messages}
        unreadCount={unreadCount}
      />
    );
  } catch (error) {
    console.error("Error loading business dashboard:", error);
    notFound();
  }
}