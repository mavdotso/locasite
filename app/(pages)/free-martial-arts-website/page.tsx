import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages, categoryPreviewConfigs } from "@/app/lib/seo-landing-data";
import GenericBusinessPreview from "@/app/components/landing/seo/previews/generic-business-preview";

const config = {
  ...seoPages["free-martial-arts-website"],
  previewComponent: function Preview() {
    return <GenericBusinessPreview config={categoryPreviewConfigs["martial-arts"]} />;
  },
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: `https://locosite.io/${config.slug}` },
};

export default function FreeMartialArtsWebsitePage() {
  return <SEOLandingPage config={config} />;
}
