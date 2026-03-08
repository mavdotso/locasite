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
          href={`${SITE_CONFIG.url}?ref=header-badge`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          Locosite
        </Link>
        {" "}&mdash;{" "}
        <Link
          href={`${SITE_CONFIG.url}?ref=header-cta`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Create yours free
        </Link>
      </p>
    </div>
  );
}
