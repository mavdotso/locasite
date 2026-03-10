import Link from "next/link";
import { SITE_CONFIG } from "@/app/lib/site-config";

interface BusinessHeaderBadgeProps {
  show: boolean;
}

export function BusinessHeaderBadge({ show }: BusinessHeaderBadgeProps) {
  if (!show) return null;

  return (
    <div className="px-4 py-1.5 bg-muted border-b text-center">
      <p className="text-xs text-muted-foreground">
        Built with{" "}
        <Link
          href={`${SITE_CONFIG.url}?utm_source=powered_badge&utm_medium=header`}
          target="_blank"
          rel="noopener"
          className="font-medium text-primary hover:underline"
        >
          Locosite
        </Link>
        {" "}&mdash;{" "}
        <Link
          href={`${SITE_CONFIG.url}?utm_source=powered_badge&utm_medium=header_cta`}
          target="_blank"
          rel="noopener"
          className="hover:underline"
        >
          Get your free website
        </Link>
      </p>
    </div>
  );
}
