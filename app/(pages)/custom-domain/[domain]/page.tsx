import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import BusinessPageRenderer from "@/components/business/business-page-renderer";

interface CustomDomainPageProps {
  params: Promise<{
    domain: string;
  }>;
}

export default async function CustomDomainPage({
  params,
}: CustomDomainPageProps) {
  const { domain } = await params;

  // Look up the domain in the database
  const domainRecord = await fetchQuery(api.domains.getByDomain, {
    domain: domain,
  });

  if (!domainRecord) {
    notFound();
  }

  // Check if domain is verified
  if (!domainRecord.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Domain Not Verified</h1>
          <p className="text-muted-foreground">
            This domain is pending verification. Please complete the
            verification process.
          </p>
        </div>
      </div>
    );
  }

  // Get the business associated with this domain
  const business = await fetchQuery(api.businesses.getByDomainId, {
    domainId: domainRecord._id,
  });
  if (!business) {
    notFound();
  }

  // Check if business is published
  if (!business.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
          <p className="text-muted-foreground">
            This website is currently under construction.
          </p>
        </div>
      </div>
    );
  }

  // Get the page content
  const page = await fetchQuery(api.pages.getHomepageByDomain, {
    domainId: domainRecord._id,
  });
  if (!page) {
    notFound();
  }

  return (
    <BusinessPageRenderer
      business={business}
      pageContent={page?.content || JSON.stringify({ sections: [] })}
    />
  );
}

export async function generateMetadata({ params }: CustomDomainPageProps) {
  const { domain } = await params;

  const domainRecord = await fetchQuery(api.domains.getByDomain, {
    domain: domain,
  });

  if (!domainRecord) {
    return {
      title: "Not Found",
    };
  }

  const business = await fetchQuery(api.businesses.getByDomainId, {
    domainId: domainRecord._id,
  });

  if (!business) {
    return {
      title: "Not Found",
    };
  }

  const businessData = business;

  return {
    title: businessData.seoTitle || businessData.name,
    description:
      businessData.seoDescription ||
      businessData.description ||
      `Welcome to ${businessData.name}`,
    openGraph: {
      title: businessData.seoTitle || businessData.name,
      description: businessData.seoDescription || businessData.description,
      images: businessData.ogImage
        ? [businessData.ogImage]
        : businessData.photos.slice(0, 1),
    },
  };
}
