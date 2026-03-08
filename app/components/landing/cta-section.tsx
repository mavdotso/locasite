import Link from "next/link";
import { Check } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-brand-forest">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 text-center">
        <h2 className="font-display font-extrabold text-brand-cream text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
          Your business deserves a website
        </h2>
        <p className="text-brand-sage text-[17px] leading-[1.65] max-w-lg mx-auto mb-8">
          Stop losing customers to competitors with better online presence. Get a professional website built for you in 7 days.
        </p>
        <Link
          href="#pricing"
          className="inline-block bg-brand-amber text-brand-ink font-semibold text-[16px] px-8 py-4 rounded-lg tracking-tight hover:brightness-95 transition mb-8"
        >
          Get my website — $149
        </Link>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["7-day delivery", "Money-back guarantee", "Cancel anytime"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brand-amber" />
              <span className="text-brand-sage text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
