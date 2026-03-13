import Link from "next/link";
import Image from "next/image";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { CATEGORY_DISPLAY_NAMES } from "@/app/lib/category-constants";
import { Star, MapPin, ChevronRight } from "lucide-react";

interface RelatedBusinessesSectionProps {
  city: string;
  cityDisplay: string;
  categorySlug: string;
  excludeDomainId: Id<"domains">;
  rootDomain: string;
}

export async function RelatedBusinessesSection({
  city,
  cityDisplay,
  categorySlug,
  excludeDomainId,
  rootDomain,
}: RelatedBusinessesSectionProps) {
  const businesses = await fetchQuery(api.categoryPages.getRelatedBusinesses, {
    city,
    categorySlug,
    excludeDomainId,
    limit: 6,
  });

  if (businesses.length < 2) return null;

  const categoryDisplay =
    CATEGORY_DISPLAY_NAMES[categorySlug] ??
    categorySlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 py-10 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-neutral-900 text-lg">
            More {categoryDisplay} in {cityDisplay}
          </h2>
          <Link
            href={`/${city}/${categorySlug}`}
            className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            See all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Link
              key={business._id}
              href={`https://${rootDomain}/${business.subdomain}`}
              className="group flex gap-3 rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-300 hover:shadow-sm transition-all"
            >
              {business.photos[0] && (
                <div className="w-16 h-16 shrink-0 rounded overflow-hidden bg-neutral-100">
                  <Image
                    src={business.photos[0]}
                    alt={business.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-neutral-900 text-sm line-clamp-1 group-hover:text-neutral-700">
                  {business.name}
                </p>
                {business.rating && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-neutral-600">
                      {business.rating.toFixed(1)}
                    </span>
                    {business.reviewCount && (
                      <span className="text-xs text-neutral-400">
                        ({business.reviewCount})
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-start gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-neutral-400" />
                  <span className="text-xs text-neutral-500 line-clamp-1">
                    {business.address}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-5 text-center">
          <Link
            href={`/${city}/${categorySlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-lg px-4 py-2 bg-white hover:border-neutral-400 transition-colors"
          >
            View all {categoryDisplay} in {cityDisplay}
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
