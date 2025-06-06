import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import LivePreviewEditor from "@/app/components/editors/live-preview-editor";

interface LiveEditPageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function LiveEditPage({ params }: LiveEditPageProps) {
  const { domain: businessDomain } = await params;

  try {
    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      notFound();
    }

    // Get the business associated with this domain
    const businesses = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!businesses || !businesses.length) {
      notFound();
    }

    const business = businesses[0];

    // TODO: Check if user owns this business
    // This should be implemented when authentication is fully set up

    // Fetch all pages for the domain
    const pages = await fetchQuery(api.pages.listByDomain, {
      domainId: domain._id,
    });

    return (
      <LivePreviewEditor
        business={business}
        domain={domain}
        pages={pages}
      />
    );
  } catch (error) {
    console.error("Error loading live edit page:", error);
    notFound();
  }
}