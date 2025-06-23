import { Id } from "@/convex/_generated/dataModel";
import BusinessEditClient from "./business-edit-client";

export default async function BusinessEditPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const resolvedParams = await params;
  const businessId = resolvedParams.businessId as Id<"businesses">;
  
  // Client-side auth and ownership checks will be handled in BusinessEditClient
  return <BusinessEditClient businessId={businessId} />;
}