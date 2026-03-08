import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages } from "@/app/lib/seo-landing-data";
import RestaurantPreview from "@/app/components/landing/seo/previews/restaurant-preview";

const config = {
  ...seoPages["free-restaurant-website"],
  previewComponent: RestaurantPreview,
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: `https://locosite.io/${config.slug}` },
};

export default function FreeRestaurantWebsitePage() {
  return <SEOLandingPage config={config} />;
}
