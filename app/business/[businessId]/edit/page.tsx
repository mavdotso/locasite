import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { UnifiedEditor } from "@/components/editors/unified-editor";
import AuthGuard from "@/components/auth/auth-guard";

export default async function BusinessEditPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  try {
    const { businessId } = await params;
    const businessIdTyped = businessId as Id<"businesses">;
    
    // Preload business data
    const preloadedBusiness = await preloadQuery(api.businesses.getById, {
      id: businessIdTyped,
    });

    if (!preloadedBusiness) {
      notFound();
    }

    return (
      <AuthGuard>
        <UnifiedEditor
          businessId={businessIdTyped}
          preloadedBusiness={preloadedBusiness}
        />
      </AuthGuard>
    );
  } catch {
    notFound();
  }
}