import { Check } from "lucide-react";
import PasteLinkForm from "@/app/components/landing/paste-link-form";

export default function HeroSection() {
  return (
    <section id="hero" className="relative bg-brand-forest overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28">
        {/* Headline */}
        <h1 className="text-center font-display font-extrabold text-brand-cream text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.0] tracking-[-0.03em] max-w-4xl mx-auto mb-6">
          Your website is already built.
          <br />
          Claim it in 60 seconds.
        </h1>

        {/* Subhead */}
        <p className="text-center text-brand-sage text-lg md:text-[18px] leading-[1.6] max-w-xl mx-auto mb-10">
          A professional website for your business — built from your Google
          Maps listing. Your menu, your photos, your hours. Preview it free.
          Get it free.
        </p>

        {/* Paste Link Form */}
        <div className="max-w-xl mx-auto mb-6">
          <PasteLinkForm variant="hero" />
        </div>

        {/* Secondary CTA */}
        <p className="text-center text-brand-sage/60 text-sm mb-8">
          No credit card. No account. Just your business name.
        </p>

        {/* Trust Bullets */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["No design skills needed", "No agency fees", "Live in 24 hours"].map(
            (item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-amber" />
                <span className="text-brand-sage text-sm">{item}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
