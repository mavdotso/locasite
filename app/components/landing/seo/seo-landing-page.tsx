import type { SEOLandingPageConfig } from "@/app/lib/seo-landing-data";
import {
  generateFAQPageStructuredData,
  generateHowToStructuredData,
  generateProductStructuredData,
} from "@/app/lib/structured-data";
import NavBar from "@/app/components/landing/nav-bar";
import FooterSection from "@/app/components/landing/footer-section";
import HowItWorksSection from "@/app/components/landing/how-it-works-section";
import ComparisonSection from "@/app/components/landing/comparison-section";
import PricingSection from "@/app/components/landing/pricing-section";
import CTASection from "@/app/components/landing/cta-section";
import SEOHeroSection from "./seo-hero-section";
import SEOPreviewSection from "./seo-preview-section";
import SEOFaqSection from "./seo-faq-section";
import SEOInternalLinks from "./seo-internal-links";

export default function SEOLandingPage({
  config,
}: {
  config: SEOLandingPageConfig;
}) {
  const structuredData = [
    generateFAQPageStructuredData(config.faqs),
    generateHowToStructuredData(),
    generateProductStructuredData(),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <NavBar />
      <main>
        <SEOHeroSection
          h1={config.h1}
          definitionText={config.definitionText}
        />
        <SEOPreviewSection
          businessType={config.businessType}
          previewDomain={config.previewDomain}
          PreviewComponent={config.previewComponent}
        />
        <HowItWorksSection />
        <ComparisonSection />
        <PricingSection />
        <SEOFaqSection faqs={config.faqs} />
        <SEOInternalLinks relatedPages={config.relatedPages} />
        <CTASection />
      </main>
      <FooterSection />
    </>
  );
}
