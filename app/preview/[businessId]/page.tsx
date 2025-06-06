import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { BusinessPreviewWrapper } from "@/components/business/business-preview-wrapper";

export default async function BusinessPreviewPage({
  params,
}: {
  params: { businessId: string };
}) {
  try {
    const businessId = params.businessId as Id<"businesses">;
    
    // Preload business data with draft content
    const preloadedBusiness = await preloadQuery(api.businesses.getByIdWithDraft, {
      id: businessId,
    });

    if (!preloadedBusiness) {
      notFound();
    }

    return (
      <BusinessPreviewWrapper
        businessId={businessId}
        preloadedBusiness={preloadedBusiness}
      />
    );
  } catch (error) {
    notFound();
  }
}