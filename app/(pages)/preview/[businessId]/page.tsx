import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";
import { BusinessPreviewWrapper } from "@/components/business/business-preview-wrapper";

export default async function BusinessPreviewPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  try {
    const { businessId } = await params;
    const businessIdTyped = businessId as Id<"businesses">;

    // Preload business data with draft content
    const preloadedBusiness = await preloadQuery(
      api.businesses.getByIdWithDraft,
      {
        id: businessIdTyped,
      },
    );

    if (!preloadedBusiness) {
      notFound();
    }

    return (
      <BusinessPreviewWrapper
        businessId={businessIdTyped}
        preloadedBusiness={preloadedBusiness}
      />
    );
  } catch (error) {
    console.error("Error fetching business for preview:", error);
    notFound();
  }
}
