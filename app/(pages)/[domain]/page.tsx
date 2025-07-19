import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import BusinessPageRenderer from "@/app/components/business/business-page-renderer";
import { BusinessFooter } from "@/app/components/business/business-footer";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import {
  generateLocalBusinessStructuredData,
  generateBreadcrumbStructuredData,
  generateWebsiteStructuredData,
} from "@/app/lib/structured-data";

interface PageProps {
  params: Promise<{
    domain: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
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

    // Use custom SEO settings if available, otherwise fall back to defaults
    const businessName =
      businessData.seoTitle || domain.name || businessData.name || "Business";
    const businessDescription =
      businessData.seoDescription ||
      businessData.description ||
      `${businessName} - Located at ${businessData.address}. ${businessData.hours ? "Visit us today!" : "Contact us for more information."}`;

    // Combine custom keywords with auto-generated ones
    const keywords = [
      ...(businessData.seoKeywords || []),
      businessName,
      "local business",
      businessData.address?.split(",").slice(-2).join(",").trim() || "local",
      "business",
      ...(businessData.description?.split(" ").slice(0, 5) || []),
    ].filter((keyword, index, self) => self.indexOf(keyword) === index); // Remove duplicates

    // Use custom OG image if available
    const ogImages = businessData.ogImage
      ? [
          {
            url: businessData.ogImage,
            width: 1200,
            height: 630,
            alt: businessName,
          },
        ]
      : businessData.photos
          ?.slice(0, 4)
          .map((photo: string, index: number) => ({
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
          },
        ];

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";
    const fullUrl = `https://${businessDomain}.${rootDomain}`;

    return {
      title: businessName,
      description: businessDescription,
      keywords,
      metadataBase: new URL(fullUrl),
      icons: {
        icon:
          businessData.favicon ||
          `${process.env.NEXT_PUBLIC_CONVEX_URL}/favicon/${businessDomain}`,
        shortcut:
          businessData.favicon ||
          `${process.env.NEXT_PUBLIC_CONVEX_URL}/favicon/${businessDomain}`,
        apple:
          businessData.favicon ||
          `${process.env.NEXT_PUBLIC_CONVEX_URL}/favicon/${businessDomain}`,
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: fullUrl,
        siteName: businessName,
        title: businessName,
        description: businessDescription,
        images: ogImages,
      },
      twitter: {
        card: "summary_large_image",
        title: businessName,
        description: businessDescription,
        images: businessData.ogImage
          ? [businessData.ogImage]
          : businessData.photos?.[0]
            ? [businessData.photos[0]]
            : ["/default-business-og.png"],
      },
      alternates: {
        canonical: fullUrl,
      },
      robots: {
        index: businessData.isPublished !== false,
        follow: businessData.isPublished !== false,
        googleBot: {
          index: businessData.isPublished !== false,
          follow: businessData.isPublished !== false,
        },
      },
      other: {
        ...(businessData.address?.includes(",") && {
          "geo.region": businessData.address
            .split(",")
            .slice(-2, -1)[0]
            ?.trim(),
        }),
        ...(businessData.address && {
          "geo.placename": businessData.address.split(",")[0]?.trim(),
        }),
      },
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
      notFound();
    }

    // Get the page for this domain
    let page = await fetchQuery(api.pages.getByDomain, {
      domain: businessDomain,
    });

    // If no page found, check if there are any pages and use the first one
    if (!page) {
      const allPages = await fetchQuery(api.pages.listByDomain, {
        domainId: domain._id,
      });

      if (allPages && allPages.length > 0) {
        page = allPages[0];
      }
    }

    if (!page) {
      notFound();
    }

    // Get the business associated with this domain
    const business = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!business || !business.length) {
      notFound();
    }

    const businessData = business[0];

    // Check if business is published
    if (!businessData.isPublished) {
      notFound();
    }

    // Get business owner's subscription status
    let showWatermark = true;
    if (businessData.userId) {
      const subscription = await fetchQuery(
        api.subscriptions.getUserSubscriptionByUserId,
        {
          userId: businessData.userId,
        },
      ).catch(() => null);

      if (
        subscription &&
        subscription.planType !== "FREE" &&
        ["active", "trialing"].includes(subscription.status)
      ) {
        showWatermark = false;
      }
    }

    // Content parsing is now handled by BusinessPageRenderer
    if (!page.content) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-500">Invalid Content</h1>
          <p>Page content is missing</p>
        </div>
      );
    }

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locasite.xyz";
    const fullDomain = `${businessDomain}.${rootDomain}`;

    // Generate structured data
    const structuredData = [
      generateLocalBusinessStructuredData(businessData, fullDomain),
      generateBreadcrumbStructuredData(businessData.name, fullDomain),
      generateWebsiteStructuredData(businessData.name, fullDomain),
    ];

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <div className="flex flex-col min-h-screen">
          {!businessData.userId && (
            <div className="px-4 py-2 bg-amber-50 border-b border-amber-200">
              <div className="container flex items-center justify-between mx-auto">
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Are you the owner of this business?
                  </p>
                  <p className="text-xs text-amber-600">
                    Claim your business to manage information and respond to
                    customers
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

          <BusinessPageRenderer
            business={businessData}
            pageContent={page?.content || JSON.stringify({ sections: [] })}
          />

          <BusinessFooter
            businessName={businessData.name}
            showWatermark={showWatermark}
          />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error loading business page:", error);
    notFound();
  }
}
