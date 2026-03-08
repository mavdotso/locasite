import { Check } from "lucide-react";
import PasteLinkForm from "@/app/components/landing/paste-link-form";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-brand-forest">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 text-center">
        <h2 className="font-display font-extrabold text-brand-cream text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
          Your website is ready.
          <br />
          The only question is: will you claim it?
        </h2>
        <p className="text-brand-sage text-[17px] leading-[1.65] max-w-lg mx-auto mb-8">
          Enter your business name and see your site in 30 seconds. No account.
          No credit card. Just your business — online, finally.
        </p>

        <div className="max-w-xl mx-auto mb-8">
          <PasteLinkForm variant="hero" />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["No credit card needed", "Preview free", "Cancel anytime"].map(
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
