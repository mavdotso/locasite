import Link from "next/link";
import { SITE_CONFIG } from "@/app/lib/site-config";
import { FooterCategoryLinks } from "@/app/components/ui/footer-category-links";

interface BusinessFooterProps {
  showWatermark?: boolean;
}

export function BusinessFooter({
  showWatermark = true,
}: BusinessFooterProps) {
  if (!showWatermark) return null;

  return (
    <footer className="mt-auto py-6 px-4 bg-muted border-t">
      <div className="container mx-auto">
        <FooterCategoryLinks
          className="flex flex-wrap justify-center gap-2 mb-4"
          linkClassName="px-3 py-1 rounded-full border border-muted-foreground/20 text-xs text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground transition-colors"
        />
        <p className="text-sm text-muted-foreground text-center">
          Powered by{" "}
          <Link
            href={`${SITE_CONFIG.url}?utm_source=powered_badge&utm_medium=footer`}
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground hover:underline"
          >
            Locosite
          </Link>
          {" "}&mdash; Get your free website
        </p>
      </div>
    </footer>
  );
}
