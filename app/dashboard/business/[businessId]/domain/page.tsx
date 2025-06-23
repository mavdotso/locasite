import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DomainPageClient from "./domain-page-client";

export default async function BusinessDomainPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const resolvedParams = await params;
  const businessId = resolvedParams.businessId as Id<"businesses">;
  
  // Server-side auth check
  const user = await fetchQuery(api.auth.currentUser, {});
  
  if (!user) {
    redirect(`/sign-in?redirect=/dashboard/business/${businessId}/domain`);
  }
  
  // Fetch initial data
  const business = await fetchQuery(api.businesses.getById, { id: businessId });
  
  if (!business) {
    redirect("/dashboard/sites");
  }
  
  // Check ownership
  if (business.userId && business.userId !== user._id) {
    redirect("/dashboard/sites");
  }
  
  return <DomainPageClient businessId={businessId} />;
}