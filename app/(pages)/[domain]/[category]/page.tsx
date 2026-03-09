import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { MapPin, Star, ChevronRight } from "lucide-react";

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

  const categoryDisplay = unslug(categorySlug);
  const { cityDisplay, state } = cityInfo;
  const location = `${cityDisplay}, ${state}`;

  const title = `${categoryDisplay} in ${location}`;
  const description = `Browse the best ${categoryDisplay.toLowerCase()} in ${location}. Local businesses with reviews, hours, photos, and contact info.`;
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
      title: `${title} | Locosite`,
      description,
    },
    twitter: {
      card: "summary",
      title: `${title} | Locosite`,
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

  if (!cityInfo || result.businesses.length === 0) {
    notFound();
  }

  const categoryDisplay = unslug(categorySlug);
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${categoryDisplay} in ${location}`,
    description: `Local ${categoryDisplay.toLowerCase()} in ${location}`,
    numberOfItems: result.businesses.length,
    itemListElement: businessesWithLinks.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([structuredData, breadcrumbData]),
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
              {categoryDisplay} in {location}
            </h1>
            <p className="text-neutral-600 text-lg max-w-2xl">
              Browse {result.businesses.length} local{" "}
              {categoryDisplay.toLowerCase()} in {location}. Find reviews,
              hours, photos, and contact information.
            </p>
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
