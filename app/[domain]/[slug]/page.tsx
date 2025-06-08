import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import BusinessHeader from "@/app/components/business/header";
import BusinessFooter from "@/app/components/business/footer";
import BusinessPageContent from "@/app/components/business/business-page-content";
import SimpleThemeWrapper from "@/app/components/business/simple-theme-wrapper";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";

interface PageProps {
  params: Promise<{
    domain: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { domain: businessDomain, slug } = await params;

    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      return {
        title: "Page Not Found",
      };
    }

    // Get the page
    const page = await fetchQuery(api.pages.getBySlug, {
      domain: businessDomain,
      slug: slug,
    });

    if (!page) {
      return {
        title: "Page Not Found",
      };
    }

    let pageTitle = slug;
    try {
      const content = JSON.parse(page.content);
      pageTitle = content.title || slug;
    } catch {
      // Use slug as fallback
    }

    return {
      title: `${pageTitle} - ${domain.name}`,
      description: `${pageTitle} page for ${domain.name}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Page",
    };
  }
}

export default async function BusinessSlugPage({ params }: PageProps) {
  const { domain: businessDomain, slug } = await params;

  try {
    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      console.log("Domain not found:", businessDomain);
      notFound();
    }

    // Get the specific page
    const page = await fetchQuery(api.pages.getBySlug, {
      domain: businessDomain,
      slug: slug,
    });

    if (!page) {
      console.log("Page not found:", slug);
      notFound();
    }

    // Get the business associated with this domain
    const business = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!business || !business.length) {
      notFound();
    }

    // Fetch all pages for the navigation
    const pages = await fetchQuery(api.pages.listByDomain, {
      domainId: domain._id,
    });

    const businessData = business[0];
    let content;
    try {
      content = JSON.parse(page.content);
    } catch (error) {
      console.error("Error parsing page content:", error);
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-500">Invalid Content</h1>
          <p>Page content is not in valid JSON format</p>
        </div>
      );
    }

    return (
      <SimpleThemeWrapper businessId={businessData._id}>
        <div className="flex flex-col min-h-screen">
          <BusinessHeader
            domain={domain.name}
            pages={pages}
            currentSlug={slug}
            businessUserId={businessData.userId}
          />

          {!businessData.userId && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
              <div className="container flex items-center justify-between mx-auto">
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Are you the owner of this business?
                  </p>
                  <p className="text-xs text-amber-600">
                    Claim your business to manage information and respond to customers
                  </p>
                </div>
                <a 
                  href={`/${businessDomain}/claim/${businessData._id}`}
                  className="px-4 py-2 text-sm font-medium text-white transition-colors rounded-md bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                >
                  Claim this Business
                </a>
              </div>
            </div>
          )} 

          <BusinessPageContent 
            initialBusiness={businessData}
            content={content}
          />
          <BusinessFooter businessName={domain.name} />
        </div>
      </SimpleThemeWrapper>
    );
  } catch (error) {
    console.error("Error loading business page:", error);
    notFound();
  }
}