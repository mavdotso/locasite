import { notFound, redirect } from "next/navigation";
import { convex } from "@/app/lib/convex";
import { api } from "@/convex/_generated/api";

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

    // Redirect to unified editor
    redirect(`/business/${business._id}/edit`);
  } catch (error) {
    console.error("Error loading page live editor:", error);
    notFound();
  }
}