import { redirect } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DomainPage from "./domain-page";

export default async function BusinessDomainPage({
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

  return <DomainPage businessId={businessId} />;
}
