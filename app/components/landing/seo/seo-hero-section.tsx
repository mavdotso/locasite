import { Check } from "lucide-react";
import PasteLinkForm from "@/app/components/landing/paste-link-form";

interface SEOHeroSectionProps {
  h1: string;
  definitionText: string;
}

export default function SEOHeroSection({
  h1,
  definitionText,
}: SEOHeroSectionProps) {
  return (
    <section className="relative bg-brand-forest overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28">
        <h1 className="text-center font-display font-extrabold text-brand-cream text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.0] tracking-[-0.03em] max-w-4xl mx-auto mb-6">
          {h1}
        </h1>

        <p className="text-center text-brand-sage text-lg md:text-[18px] leading-[1.6] max-w-xl mx-auto mb-10">
          Paste your Google Maps link. We generate your site instantly. No
          design, no decisions.
        </p>

        <div className="max-w-xl mx-auto mb-6">
          <PasteLinkForm variant="hero" ctaLabel="Get My Free Website" />
        </div>

        <p className="text-center text-brand-sage/60 text-sm mb-8">
          Free forever. Upgrade anytime for custom domain and more.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            "No design skills needed",
            "No credit card",
            "Live in 30 seconds",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brand-amber" />
              <span className="text-brand-sage text-sm">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-brand-sage/40 text-sm mt-12 max-w-2xl mx-auto leading-relaxed">
          {definitionText}
        </p>
      </div>
    </section>
  );
}
