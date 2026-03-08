import Link from "next/link";
import { SITE_CONFIG } from "@/app/lib/site-config";

interface BusinessFooterProps {
  businessName?: string;
  showWatermark?: boolean;
}

export function BusinessFooter({
  businessName,
  showWatermark = true,
}: BusinessFooterProps) {
  if (!showWatermark) return null;

  return (
    <footer className="mt-auto py-6 px-4 bg-muted border-t">
      <div className="container mx-auto text-center space-y-2">
        <p className="text-base font-medium text-foreground">
          {businessName && (
            <>
              <span>{businessName}</span>
              <span className="mx-2">&middot;</span>
            </>
          )}
          <span>Powered by </span>
          <Link
            href={`${SITE_CONFIG.url}?ref=footer-badge`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Locosite
          </Link>
        </p>
        <p className="text-sm text-muted-foreground">
          <Link
            href={`${SITE_CONFIG.url}?ref=footer-cta`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Create your free website &rarr;
          </Link>
        </p>
      </div>
    </footer>
  );
}
