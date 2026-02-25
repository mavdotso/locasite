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
    <footer className="mt-auto py-4 px-4 bg-muted/50 border-t">
      <div className="container mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          {businessName && (
            <>
              <span>{businessName}</span>
              <span className="mx-2">•</span>
            </>
          )}
          <span>Powered by </span>
          <Link
            href={SITE_CONFIG.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Locasite
          </Link>
        </p>
      </div>
    </footer>
  );
}
