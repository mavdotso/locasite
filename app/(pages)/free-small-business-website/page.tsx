import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages } from "@/app/lib/seo-landing-data";
import SmallBusinessPreview from "@/app/components/landing/seo/previews/small-business-preview";

const config = {
  ...seoPages["free-small-business-website"],
  previewComponent: SmallBusinessPreview,
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: `https://locosite.io/${config.slug}` },
};

export default function FreeSmallBusinessWebsitePage() {
  return <SEOLandingPage config={config} />;
}
