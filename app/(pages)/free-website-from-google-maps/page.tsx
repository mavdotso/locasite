import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages } from "@/app/lib/seo-landing-data";
import GoogleMapsPreview from "@/app/components/landing/seo/previews/google-maps-preview";

const config = {
  ...seoPages["free-website-from-google-maps"],
  previewComponent: GoogleMapsPreview,
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: `https://locosite.io/${config.slug}` },
};

export default function FreeWebsiteFromGoogleMapsPage() {
  return <SEOLandingPage config={config} />;
}
