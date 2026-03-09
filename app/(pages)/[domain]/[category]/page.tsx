import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { MapPin, Star, ChevronRight } from "lucide-react";
import {
  CATEGORY_DISPLAY_NAMES,
  SCHEMA_TYPE_MAP,
  CATEGORY_INTRO_COPY,
  CATEGORY_FOOTER_CTA,
} from "@/app/lib/category-constants";

interface PageProps {
  params: Promise<{
    domain: string;
    category: string;
  }>;
}

function unslug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getCategoryDisplay(slug: string): string {
  return CATEGORY_DISPLAY_NAMES[slug] ?? unslug(slug);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { domain: citySlug, category: categorySlug } = await params;

  const cityInfo = await fetchQuery(api.categoryPages.getCityInfo, {
    city: citySlug,
  });

  if (!cityInfo) {
    return { title: "Not Found" };
  }

  const categoryDisplay = getCategoryDisplay(categorySlug);
  const { cityDisplay, state } = cityInfo;
  const location = `${cityDisplay}, ${state}`;

  const title = `${categoryDisplay} in ${location} | Locosite`;
  const description = `Find the best ${categoryDisplay.toLowerCase()} in ${location}. Browse local businesses with verified reviews, hours, photos, and contact info — powered by Locosite.`;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";
  const canonicalUrl = `https://${rootDomain}/${citySlug}/${categorySlug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: "Locosite",
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { domain: citySlug, category: categorySlug } = await params;

  // Fetch city info, businesses, and categories in parallel
  const [cityInfo, result, allCategories] = await Promise.all([
    fetchQuery(api.categoryPages.getCityInfo, { city: citySlug }),
    fetchQuery(api.categoryPages.listByCityCategory, {
      city: citySlug,
      categorySlug,
      limit: 24,
    }),
    fetchQuery(api.categoryPages.getCategoriesForCity, { city: citySlug }),
  ]);

  // Minimum 3 businesses to avoid thin-content pages
  if (!cityInfo || result.businesses.length < 3) {
    notFound();
  }

  const categoryDisplay = getCategoryDisplay(categorySlug);
  const { cityDisplay, state } = cityInfo;
  const location = `${cityDisplay}, ${state}`;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "locosite.io";

  const relatedCategories = allCategories
    .filter((c) => c.categorySlug !== categorySlug)
    .slice(0, 8);

  // Batch resolve subdomains for linking
  const domainIds = result.businesses
    .map((b) => b.domainId)
    .filter((id): id is NonNullable<typeof id> => id != null);
  const subdomainMap = domainIds.length > 0
    ? await fetchQuery(api.categoryPages.getSubdomainsForBusinesses, { domainIds })
    : {};
  const businessesWithLinks = result.businesses.map((b) => ({
    ...b,
    subdomain: b.domainId ? (subdomainMap[b.domainId] ?? null) : null,
  }));

  // Structured data
  const businessSchemaType = SCHEMA_TYPE_MAP[categorySlug] ?? "LocalBusiness";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryDisplay} in ${location}`,
    description: `Local ${categoryDisplay.toLowerCase()} in ${location}`,
    numberOfItems: result.businesses.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: businessesWithLinks.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": businessSchemaType,
        name: b.name,
        address: b.address,
        ...(b.rating && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: b.rating,
            ...(b.reviewCount && { reviewCount: b.reviewCount }),
          },
        }),
        ...(b.subdomain && {
          url: `https://${rootDomain}/${b.subdomain}`,
        }),
      },
    })),
  };

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
      {
        "@type": "ListItem",
        position: 3,
        name: categoryDisplay,
        item: `https://${rootDomain}/${citySlug}/${categorySlug}`,
      },
    ],
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Locosite",
    url: `https://${rootDomain}`,
    description: "Free professional websites for local businesses",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, breadcrumbData, organizationData]).replace(/</g, "\\u003c"),
        }}
      />

      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
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
              <Link
                href={`/${citySlug}`}
                className="hover:text-neutral-900"
              >
                {cityDisplay}
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-neutral-900">{categoryDisplay}</span>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="bg-white border-b border-neutral-200">
          <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight text-neutral-900 mb-3">
              Best {categoryDisplay} in {location}
            </h1>
            <p className="text-neutral-600 text-lg max-w-2xl">
              Browse {result.businesses.length} local{" "}
              {categoryDisplay.toLowerCase()} in {location} with verified
              reviews, hours, photos, and contact info.
            </p>
            {CATEGORY_INTRO_COPY[categorySlug] ? (
              <p className="text-neutral-500 text-base max-w-2xl mt-3">
                {CATEGORY_INTRO_COPY[categorySlug].body}{" "}
                {CATEGORY_INTRO_COPY[categorySlug].ctaPrefix}{" "}
                <Link
                  href="/claim"
                  className="underline hover:text-neutral-900"
                >
                  Claim your free website.
                </Link>
              </p>
            ) : (
              <p className="text-neutral-500 text-base max-w-2xl mt-3">
                Each listing links to a free business website on Locosite with
                verified hours, photos, and contact info. Own one of these
                businesses?{" "}
                <Link
                  href="/claim"
                  className="underline hover:text-neutral-900"
                >
                  Claim your free website.
                </Link>
              </p>
            )}
          </div>
        </section>

        {/* Business listing */}
        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessesWithLinks.map((business) => (
              <BusinessCard
                key={business._id}
                business={business}
                rootDomain={rootDomain}
              />
            ))}
          </div>

          {/* Related categories */}
          {relatedCategories.length > 0 && (
            <section className="mt-16 pt-10 border-t border-neutral-200">
              <h2 className="font-display font-bold text-xl text-neutral-900 mb-4">
                More in {cityDisplay}
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedCategories.map((cat) => (
                  <Link
                    key={cat.categorySlug}
                    href={`/${citySlug}/${cat.categorySlug}`}
                    className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm text-neutral-700 hover:border-neutral-400 hover:text-neutral-900 transition-colors"
                  >
                    {cat.categoryDisplay}{" "}
                    <span className="text-neutral-400">({cat.count})</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Claim CTA */}
        <section className="bg-neutral-100 border-t border-neutral-200 py-10">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <p className="text-neutral-700 font-medium mb-2">
              {CATEGORY_FOOTER_CTA[categorySlug]?.heading ??
                "Is your business listed here?"}
            </p>
            <p className="text-neutral-500 text-sm mb-4">
              {CATEGORY_FOOTER_CTA[categorySlug]?.body ??
                "Claim your free Locosite website to edit your listing, add photos, and upgrade to your own domain."}
            </p>
            <Link
              href="/claim"
              className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              {CATEGORY_FOOTER_CTA[categorySlug]?.button ??
                "Claim your free website"}
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 bg-white mt-auto">
          <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between text-sm text-neutral-500">
            <Link href="/" className="font-display font-bold text-neutral-900">
              Locosite
            </Link>
            <p>Free professional websites for local businesses</p>
          </div>
        </footer>
      </div>
    </>
  );
}

function BusinessCard({
  business,
  rootDomain,
}: {
  business: {
    _id: string;
    name: string;
    address: string;
    phone?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
    category?: string | null;
    photos: string[];
    subdomain: string | null;
  };
  rootDomain: string;
}) {
  const href = business.subdomain
    ? `https://${rootDomain}/${business.subdomain}`
    : undefined;

  const content = (
    <div className="group rounded-lg border border-neutral-200 bg-white overflow-hidden hover:border-neutral-300 hover:shadow-sm transition-all">
      {/* Photo */}
      {business.photos[0] && (
        <div className="aspect-[16/10] overflow-hidden bg-neutral-100">
          <Image
            src={business.photos[0]}
            alt={business.name}
            width={640}
            height={400}
            className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            unoptimized
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1">
          {business.name}
        </h3>

        {/* Rating */}
        {business.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-neutral-700">
              {business.rating.toFixed(1)}
            </span>
            {business.reviewCount && (
              <span className="text-sm text-neutral-400">
                ({business.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-1.5 text-sm text-neutral-500">
          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span className="line-clamp-1">{business.address}</span>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
