import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SEOInternalLinksProps {
  relatedPages: Array<{ slug: string; label: string }>;
}

export default function SEOInternalLinks({
  relatedPages,
}: SEOInternalLinksProps) {
  return (
    <section className="py-12 bg-white border-t border-brand-border">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h3 className="text-sm font-semibold text-brand-taupe uppercase tracking-wider mb-4">
          More free websites
        </h3>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[15px] text-brand-forest font-medium hover:text-brand-pine transition-colors"
          >
            Locosite Home
            <ArrowRight className="h-4 w-4" />
          </Link>
          {relatedPages.map((page) => (
            <Link
              key={page.slug}
              href={`/${page.slug}`}
              className="inline-flex items-center gap-2 text-[15px] text-brand-forest font-medium hover:text-brand-pine transition-colors"
            >
              {page.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
