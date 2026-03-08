import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages } from "@/app/lib/seo-landing-data";
import PlumberPreview from "@/app/components/landing/seo/previews/plumber-preview";

const config = {
  ...seoPages["free-plumber-website"],
  previewComponent: PlumberPreview,
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: `https://locosite.io/${config.slug}` },
};

export default function FreePlumberWebsitePage() {
  return <SEOLandingPage config={config} />;
}
