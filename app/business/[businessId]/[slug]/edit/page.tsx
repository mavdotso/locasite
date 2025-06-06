import { notFound } from "next/navigation";
import { convex } from "@/app/lib/convex";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import PageLiveEditor from "@/app/components/editors/page-live-editor";
import AuthGuard from "@/app/components/auth/auth-guard";

interface UnpublishedPageEditProps {
  params: Promise<{
    businessId: string;
    slug: string;
  }>;
}

export default async function UnpublishedPageEdit({ params }: UnpublishedPageEditProps) {
  const { businessId, slug } = await params;

  try {
    // Get business from database
    const business = await convex.query(api.businesses.getById, {
      id: businessId as Id<"businesses">,
    });

    if (!business) {
      notFound();
    }

    // For unpublished businesses, we'll create a mock domain object
    const mockDomain = {
      _id: "mock" as Id<"domains">,
      name: business.name,
      subdomain: `business-${businessId}`,
    };

    // For unpublished businesses, we'll create a mock page object 
    // This will primarily be used for business editing, not page content editing
    const mockPage = {
      _id: `mock-${businessId}-${slug}` as Id<"pages">,
      slug: slug,
      content: JSON.stringify({
        title: `Preview: ${business.name}`,
        sections: [
          {
            type: "header",
            title: business.name,
            subtitle: "Business Preview - Publish to create your website",
          },
          {
            type: "content",
            text: "This is a preview of your business. Use the Business Settings to customize your information, then publish to create your live website.",
          },
        ],
      }),
      domainId: mockDomain._id,
    };

    return (
      <AuthGuard businessUserId={business.userId} requireOwnership={true}>
        <PageLiveEditor page={mockPage} domain={mockDomain} business={business} />
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading unpublished business editor:", error);
    notFound();
  }
}