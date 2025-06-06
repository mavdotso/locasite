import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { UnifiedEditor } from "@/components/editors/unified-editor";
import AuthGuard from "@/components/auth/auth-guard";

export default async function BusinessEditPage({
  params,
}: {
  params: { businessId: string };
}) {
  try {
    const businessId = params.businessId as Id<"businesses">;
    
    // Preload business data
    const preloadedBusiness = await preloadQuery(api.businesses.getById, {
      id: businessId,
    });

    if (!preloadedBusiness) {
      notFound();
    }

    return (
      <AuthGuard>
        <UnifiedEditor
          businessId={businessId}
          preloadedBusiness={preloadedBusiness}
        />
      </AuthGuard>
    );
  } catch (error) {
    notFound();
  }
}