import type { Metadata } from "next";
import SEOLandingPage from "@/app/components/landing/seo/seo-landing-page";
import { seoPages, categoryPreviewConfigs } from "@/app/lib/seo-landing-data";
import GenericBusinessPreview from "@/app/components/landing/seo/previews/generic-business-preview";

const config = {
  ...seoPages["free-dance-studio-website"],
  previewComponent: function Preview() {
    return <GenericBusinessPreview config={categoryPreviewConfigs["dance-studio"]} />;
  },
};

export const metadata: Metadata = {
  title: config.metaTitle,
  description: config.metaDescription,
  alternates: { canonical: `https://locosite.io/${config.slug}` },
};

export default function FreeDanceStudioWebsitePage() {
  return <SEOLandingPage config={config} />;
}
