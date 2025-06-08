import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import BusinessHeader from "@/app/components/business/header";
import BusinessFooter from "@/app/components/business/footer";
import BusinessPageContent from "@/app/components/business/business-page-content";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";

interface PageProps {
  params: Promise<{
    domain: string;
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { domain: businessDomain } = await params;

    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      return {
        title: "Business Not Found",
      };
    }

    // Get the business associated with this domain
    const business = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!business || !business.length) {
      return {
        title: domain.name || "Business",
      };
    }

    const businessData = business[0];

    const businessName = domain.name || businessData.name || "Business";
    const businessDescription = businessData.description || 
      `${businessName} - Located at ${businessData.address}. ${businessData.hours ? 'Visit us today!' : 'Contact us for more information.'}`;
    
    return {
      title: businessName,
      description: businessDescription,
      keywords: [
        businessName,
        "local business",
        businessData.address?.split(',').slice(-2).join(',').trim() || "local",
        "business",
        "local business",
        ...(businessData.description?.split(' ').slice(0, 5) || [])
      ],
      openGraph: {
        type: "website",
        locale: "en_US",
        url: `/${businessDomain}`,
        siteName: "Locasite",
        title: businessName,
        description: businessDescription,
        images: businessData.photos?.slice(0, 4).map((photo: string, index: number) => ({
          url: photo,
          width: 1200,
          height: 630,
          alt: `${businessName} - Photo ${index + 1}`,
        })) || [
          {
            url: "/default-business-og.png",
            width: 1200, 
            height: 630,
            alt: businessName,
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: businessName,
        description: businessDescription,
        images: businessData.photos?.[0] ? [businessData.photos[0]] : ["/default-business-og.png"],
      },
      alternates: {
        canonical: `/${businessDomain}`,
      },
      other: {
        ...(businessData.address?.includes(',') && {
          "geo.region": businessData.address.split(',').slice(-2, -1)[0]?.trim()
        }),
        ...(businessData.address && {
          "geo.placename": businessData.address.split(',')[0]?.trim()
        }),
      }
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Business Page",
    };
  }
}

export default async function BusinessPage({ params }: PageProps) {

  const { domain: businessDomain } = await params;

  try {
    // Get domain from database
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      console.log("Domain not found:", businessDomain);
      notFound();
    }

    // Get the home page (try published first, then fallback to unpublished)
    let page = await fetchQuery(api.pages.getBySlug, {
      domain: businessDomain,
      slug: "home",
    });

    // If no home page found, check if there are any pages and use the first one
    if (!page) {
      const allPages = await fetchQuery(api.pages.listByDomain, {
        domainId: domain._id,
      });
      
      if (allPages && allPages.length > 0) {
        page = allPages[0];
      }
    }

    if (!page) {
      console.log("No page found for domain:", businessDomain);
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
      <div className="flex flex-col min-h-screen">
        <BusinessHeader
          domain={domain.name}
          pages={pages}
          currentSlug="home"
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
    );
  } catch (error) {
    console.error("Error loading business page:", error);
    notFound();
  }
}

