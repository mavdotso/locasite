import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages } from "@/app/lib/seo-landing-data";
import SalonPreview from "@/app/components/landing/seo/previews/salon-preview";

const config = {
  ...seoPages["free-salon-website"],
  previewComponent: SalonPreview,
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: `https://locosite.io/${config.slug}` },
};

export default function FreeSalonWebsitePage() {
  return <SEOLandingPage config={config} />;
}
