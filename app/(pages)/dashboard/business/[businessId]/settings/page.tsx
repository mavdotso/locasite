import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import WebsiteSettingsPage from "./website-settings-page";

export default async function BusinessSettingsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const resolvedParams = await params;
  const businessId = resolvedParams.businessId as Id<"businesses">;

  const user = await fetchQuery(api.auth.currentUser, {});

  // Fetch initial data
  const business = await fetchQuery(api.businesses.getById, { id: businessId });

  if (!business) {
    redirect("/dashboard");
  }

  if (business.userId && user && business.userId !== user._id) {
    redirect("/dashboard");
  }

  return <WebsiteSettingsPage businessId={businessId} />;
}
