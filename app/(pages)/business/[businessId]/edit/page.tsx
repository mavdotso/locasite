import { Id } from "@/convex/_generated/dataModel";
import BusinessEdit from "./business-edit";
import { AuthGuard } from "@/app/components/auth/auth-guard";

export default async function BusinessEditPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const resolvedParams = await params;
  const businessId = resolvedParams.businessId as Id<"businesses">;

  return (
    <AuthGuard loadingMessage="Loading editor...">
      <BusinessEdit businessId={businessId} />
    </AuthGuard>
  );
}
