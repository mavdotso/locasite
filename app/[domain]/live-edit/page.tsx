import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import LivePreviewEditor from "@/app/components/editors/live-preview-editor";
import AuthGuard from "@/app/components/auth/auth-guard";

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


    return (
      <AuthGuard businessUserId={business.userId} requireOwnership={true}>
        <LivePreviewEditor
          business={business}
          domain={domain}
        />
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading live edit page:", error);
    notFound();
  }
}