import { Check } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            Pricing
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            Simple pricing. No surprises.
          </h2>
        </div>

        <div className="max-w-md mx-auto">
          {/* Single pricing card */}
          <div className="relative rounded-xl border-2 border-brand-forest bg-white p-8">
            <div className="absolute -top-3 left-6">
              <span className="text-xs font-semibold text-brand-forest bg-[#D4EDDE] px-3 py-1 rounded-full">
                Claim your site
              </span>
            </div>
            <div className="mb-6">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-extrabold text-brand-ink text-4xl">
                  $149
                </span>
                <span className="text-brand-taupe text-sm">one-time</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              {[
                "Professional website built from your Google Maps listing",
                "Mobile-friendly design",
                "Your menu, photos, hours, and reviews \u2014 already loaded",
                "Custom URL (yourname.locosite.io or bring your own domain)",
                "Live within 24 hours",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-brand-forest flex-shrink-0 mt-0.5" />
                  <span className="text-brand-ink text-[14px]">{f}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-brand-border pt-5 mb-6">
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-bold text-brand-ink text-xl">
                  + $9
                </span>
                <span className="text-brand-taupe text-sm">/month</span>
              </div>
              <p className="text-brand-taupe text-[14px]">
                Hosting, SSL security, and site updates included. Cancel
                anytime. No contracts.
              </p>
            </div>

            <Link
              href="#hero"
              className="block w-full text-center bg-brand-amber text-brand-ink font-semibold text-[15px] px-7 py-3.5 rounded-lg tracking-tight hover:brightness-95 transition"
            >
              Claim My Website
            </Link>
          </div>
        </div>

        <p className="text-center text-brand-taupe text-[14px] leading-[1.6] mt-8 max-w-lg mx-auto italic">
          Already have a site? We&apos;re probably not for you. This is built
          for businesses on Google Maps that don&apos;t have a website yet.
        </p>

        {/* Trust */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {["SSL secured", "Cancel anytime", "No hidden fees"].map(
            (item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-forest" />
                <span className="text-brand-ink text-sm font-medium">
                  {item}
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
