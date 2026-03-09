import Link from "next/link";
import { SITE_CONFIG } from "@/app/lib/site-config";

interface BusinessFooterProps {
  businessName?: string;
  showWatermark?: boolean;
}

export function BusinessFooter({
  showWatermark = true,
}: BusinessFooterProps) {
  if (!showWatermark) return null;

  return (
    <footer className="mt-auto py-4 px-4 bg-muted border-t">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          Powered by{" "}
          <Link
            href={`${SITE_CONFIG.url}?ref=footer-badge`}
            target="_blank"
            rel="noopener"
            className="font-medium text-foreground hover:underline"
          >
            Locosite
          </Link>
          {" "}&mdash; Free websites for local businesses
        </p>
      </div>
    </footer>
  );
}
