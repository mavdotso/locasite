import { notFound } from "next/navigation";
import { convex } from "@/app/lib/convex";
import { api } from "@/convex/_generated/api";
import PageLiveEditor from "@/app/components/editors/page-live-editor";
import AuthGuard from "@/app/components/auth/auth-guard";

interface PageLiveEditProps {
  params: Promise<{
    domain: string;
    slug: string;
  }>;
}

export default async function PageLiveEdit({ params }: PageLiveEditProps) {
  const { domain: businessDomain, slug } = await params;

  try {
    // Get domain from database
    const domain = await convex.query(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      notFound();
    }

    // Get the business associated with this domain
    const businesses = await convex.query(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!businesses || !businesses.length) {
      notFound();
    }

    const business = businesses[0];

    // Get the specific page
    const page = await convex.query(api.pages.getBySlug, {
      domain: businessDomain,
      slug: slug,
    });

    if (!page) {
      notFound();
    }

    return (
      <AuthGuard businessUserId={business.userId} requireOwnership={true}>
        <PageLiveEditor page={page} domain={domain} business={business} />
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading page live editor:", error);
    notFound();
  }
}