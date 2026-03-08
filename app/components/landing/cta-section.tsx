import { Check } from "lucide-react";
import PasteLinkForm from "@/app/components/landing/paste-link-form";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-brand-forest">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 text-center">
        <h2 className="font-display font-extrabold text-brand-cream text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
          Your business is already on Google.
          <br />
          Now put it on the web.
        </h2>
        <p className="text-brand-sage text-[17px] leading-[1.65] max-w-lg mx-auto mb-8">
          You have a Google listing. That&apos;s all we need. Paste the link and
          your website builds itself — edit what you want, publish when
          you&apos;re ready.
        </p>

        <div className="max-w-xl mx-auto mb-8">
          <PasteLinkForm variant="hero" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["Takes minutes, not days", "No design skills needed", "Cancel anytime"].map(
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
