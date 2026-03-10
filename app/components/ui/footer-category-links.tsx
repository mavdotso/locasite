import Link from "next/link";
import { FOOTER_CATEGORY_LINKS } from "@/app/lib/category-constants";

export function FooterCategoryLinks({
  className = "flex flex-wrap gap-2 mb-6",
  linkClassName = "px-3 py-1 rounded-full border border-neutral-200 text-xs text-neutral-500 hover:border-neutral-400 hover:text-neutral-900 transition-colors",
}: {
  className?: string;
  linkClassName?: string;
}) {
  return (
    <div className={className}>
      {FOOTER_CATEGORY_LINKS.map((link) => (
        <Link key={link.href} href={link.href} className={linkClassName}>
          Free {link.label} Website
        </Link>
      ))}
    </div>
  );
}
