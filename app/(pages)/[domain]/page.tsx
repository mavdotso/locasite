import * as Sentry from "@sentry/nextjs";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import BusinessPageRenderer from "@/app/components/business/business-page-renderer";
import { BusinessFooter } from "@/app/components/business/business-footer";
import { BusinessHeaderBadge } from "@/app/components/business/business-header-badge";
import { ReferToOwnerCTA } from "@/app/components/refer-to-owner-cta";
import { ClaimBanner } from "@/app/components/claim/claim-banner";
import { Metadata } from "next";
import { fetchQuery } from "convex/nextjs";
import {
  generateLocalBusinessStructuredData,
  generateBreadcrumbStructuredData,
  generateWebsiteStructuredData,
} from "@/app/lib/structured-data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      // Check if this is a city slug for category pages
      const cityInfo = await fetchQuery(api.categoryPages.getCityInfo, {
        city: businessDomain,
      });
      if (cityInfo) {
        const rootDomain =
          process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";
        const location = `${cityInfo.cityDisplay}, ${cityInfo.state}`;
        return {
          title: `Local Businesses in ${location}`,
          description: `Browse local businesses in ${location}. Find restaurants, services, and more with reviews, hours, and contact info.`,
          alternates: {
            canonical: `https://${rootDomain}/${businessDomain}`,
          },
          openGraph: {
            type: "website",
            title: `Local Businesses in ${location} | Locosite`,
            description: `Browse local businesses in ${location}.`,
          },
        };
      }
      return {
        title: "Business Not Found",
      };
    }

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

    // Build SEO title: {Name} | {City}, {State} | {Category}
    const addressParts = businessData.address?.split(",") || [];
    const city =
      addressParts.length >= 3
        ? addressParts[addressParts.length - 2]?.trim()
        : "";
    const stateZip = addressParts[addressParts.length - 1]?.trim() || "";
    const state = stateZip.split(" ")[0] || "";
    const locationSuffix = city && state ? ` | ${city}, ${state}` : "";
    const categorySuffix = businessData.category
      ? ` | ${businessData.category}`
      : "";
    const seoTitle = `${businessName}${locationSuffix}${categorySuffix}`;

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";
    const fullUrl = `https://${businessDomain}.${rootDomain}`;

    return {
      title: { absolute: seoTitle },
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
    Sentry.captureException(error);
    return {
      title: "Business Page",
    };
  }
}

export default async function BusinessPage({ params }: PageProps) {
  const { domain: businessDomain } = await params;

  try {
    const domain = await fetchQuery(api.domains.getBySubdomain, {
      subdomain: businessDomain,
    });

    if (!domain) {
      // Try rendering as a city landing page
      const cityInfo = await fetchQuery(api.categoryPages.getCityInfo, {
        city: businessDomain,
      });
      if (cityInfo) {
        return (
          <CityLandingPage
            citySlug={businessDomain}
            cityDisplay={cityInfo.cityDisplay}
            state={cityInfo.state}
          />
        );
      }
      notFound();
    }

    let page = await fetchQuery(api.pages.getByDomain, {
      domain: businessDomain,
    });

    // If no page found, check if there's a homepage for this domain
    if (!page) {
      page = await fetchQuery(api.pages.getHomepageByDomain, {
        domainId: domain._id,
      });
    }

    if (!page) {
      notFound();
    }

    const business = await fetchQuery(api.businesses.listByDomain, {
      domain: domain._id,
    });

    if (!business || !business.length) {
      notFound();
    }

    const businessData = business[0];

    if (!businessData.isPublished) {
      notFound();
    }

    // Watermark visibility: default to showing watermark for free-plan businesses.
    // Subscription check requires auth, so on public pages we fall back to
    // checking the authenticated user's subscription (business owner viewing their own site).
    let showWatermark = true;
    try {
      const subscription = await fetchQuery(
        api.subscriptions.getUserSubscriptionByUserId,
      );

      if (
        subscription &&
        subscription.planType !== "FREE" &&
        ["active", "trialing"].includes(subscription.status)
      ) {
        showWatermark = false;
      }
    } catch {
      // No auth context (public visitor) — keep watermark visible
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

    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";
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
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <div className="flex flex-col min-h-screen">
          <BusinessHeaderBadge show={showWatermark} />

          <ClaimBanner
            businessId={businessData._id}
            businessName={businessData.name}
            isClaimed={!!businessData.userId}
          />

          {!businessData.userId && (
            <div className="container mx-auto px-4 py-3">
              <ReferToOwnerCTA
                businessId={businessData._id}
                businessName={businessData.name}
                referrerSource="business_page"
                referrerPath={`/${businessDomain}`}
              />
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
    Sentry.captureException(error);
    notFound();
  }
}

async function CityLandingPage({
  citySlug,
  cityDisplay,
  state,
}: {
  citySlug: string;
  cityDisplay: string;
  state: string;
}) {
  const categories = await fetchQuery(api.categoryPages.getCategoriesForCity, {
    city: citySlug,
  });

  const location = `${cityDisplay}, ${state}`;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://${rootDomain}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cityDisplay,
        item: `https://${rootDomain}/${citySlug}`,
      },
    ],
  };

  const totalBusinesses = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData).replace(/</g, "\\u003c") }}
      />

      <div className="min-h-screen bg-neutral-50">
        <header className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="font-display font-bold text-xl tracking-tight text-neutral-900"
            >
              Locosite
            </Link>
            <nav className="flex items-center gap-1 text-sm text-neutral-500">
              <Link href="/" className="hover:text-neutral-900">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-neutral-900">{cityDisplay}</span>
            </nav>
          </div>
        </header>

        <section className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight text-neutral-900 mb-3">
              Local Businesses in {location}
            </h1>
            <p className="text-neutral-600 text-lg max-w-2xl">
              Browse {totalBusinesses} local businesses across{" "}
              {categories.length} categories in {location}.
            </p>
          </div>
        </section>

        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.categorySlug}
                href={`/${citySlug}/${cat.categorySlug}`}
                className="group rounded-lg border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-sm transition-all"
              >
                <h2 className="font-semibold text-neutral-900 text-lg mb-1 group-hover:text-neutral-700">
                  {cat.categoryDisplay}
                </h2>
                <p className="text-sm text-neutral-500">
                  {cat.count} {cat.count === 1 ? "business" : "businesses"}
                </p>
              </Link>
            ))}
          </div>
        </main>

        <footer className="border-t border-neutral-200 bg-white mt-auto">
          <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between text-sm text-neutral-500">
            <Link
              href="/"
              className="font-display font-bold text-neutral-900"
            >
              Locosite
            </Link>
            <p>Free professional websites for local businesses</p>
          </div>
        </footer>
      </div>
    </>
  );
}
