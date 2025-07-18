import { Id } from "@/convex/_generated/dataModel";
import BusinessEditClient from "./business-edit-client";
import { SimpleAuthGuard } from "@/app/components/auth/simple-auth-guard";

export default async function BusinessEditPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const resolvedParams = await params;
  const businessId = resolvedParams.businessId as Id<"businesses">;

  return (
    <SimpleAuthGuard loadingMessage="Loading editor...">
      <BusinessEditClient businessId={businessId} />
    </SimpleAuthGuard>
  );
}
