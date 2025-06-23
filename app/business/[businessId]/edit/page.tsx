import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import BusinessEditClient from "./business-edit-client";

export default async function BusinessEditPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const resolvedParams = await params;
  const businessId = resolvedParams.businessId as Id<"businesses">;
  
  // Server-side auth check
  const user = await fetchQuery(api.auth.currentUser, {});
  
  if (!user) {
    redirect(`/sign-in?redirect=/business/${businessId}/edit`);
  }
  
  // Fetch business to check ownership
  const business = await fetchQuery(api.businesses.getById, { id: businessId });
  
  if (!business) {
    redirect("/dashboard/sites");
  }
  
  // Check ownership - only allow owner to edit
  if (business.userId && business.userId !== user._id) {
    redirect(`/business/${businessId}`);
  }
  
  return <BusinessEditClient businessId={businessId} />;
}