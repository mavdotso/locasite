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
            Simple, transparent pricing
          </h2>
          <p className="text-brand-taupe text-[17px] leading-[1.65] max-w-lg mx-auto">
            One fee to build your site. One small monthly fee to keep it running.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Claim Fee */}
          <div className="relative rounded-xl border-2 border-brand-forest bg-white p-8">
            <div className="absolute -top-3 left-6">
              <span className="text-xs font-semibold text-brand-forest bg-[#D4EDDE] px-3 py-1 rounded-full">
                Get started
              </span>
            </div>
            <div className="mb-6">
              <h3 className="font-display font-bold text-brand-ink text-xl mb-2">Claim your site</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-extrabold text-brand-ink text-4xl">$149</span>
                <span className="text-brand-taupe text-sm">one-time</span>
              </div>
              <p className="text-brand-taupe text-[14px]">
                We build your professional website in 7 days
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Professional website built for you",
                "Mobile responsive design",
                "Contact form included",
                "SSL security included",
                "Custom domain setup",
                "Ready in 7 business days",
                "One round of revisions",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-brand-forest flex-shrink-0 mt-0.5" />
                  <span className="text-brand-ink text-[14px]">{f}</span>
                </li>
              ))}
            </ul>
            <Link
              href="#hero"
              className="block w-full text-center bg-brand-amber text-brand-ink font-semibold text-[15px] px-7 py-3.5 rounded-lg tracking-tight hover:brightness-95 transition"
            >
              Get my website — $149
            </Link>
          </div>

          {/* Base Plan */}
          <div className="rounded-xl border border-brand-border bg-white p-8">
            <div className="mb-6">
              <h3 className="font-display font-bold text-brand-ink text-xl mb-2">Base plan</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-extrabold text-brand-ink text-4xl">$9</span>
                <span className="text-brand-taupe text-sm">/month</span>
              </div>
              <p className="text-brand-taupe text-[14px]">
                Keep your site live and running smoothly
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Hosting & maintenance",
                "SSL & security updates",
                "Small content updates",
                "Uptime monitoring",
                "Basic analytics",
                "Email support",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-brand-forest flex-shrink-0 mt-0.5" />
                  <span className="text-brand-ink text-[14px]">{f}</span>
                </li>
              ))}
            </ul>
            <div className="block w-full text-center bg-brand-forest text-brand-cream font-semibold text-[15px] px-7 py-3.5 rounded-lg">
              Included after claim
            </div>
          </div>

          {/* Paid Modules */}
          <div className="rounded-xl border border-brand-border bg-white p-8">
            <div className="mb-6">
              <h3 className="font-display font-bold text-brand-ink text-xl mb-2">Paid modules</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-display font-extrabold text-brand-ink text-2xl">Add-ons</span>
              </div>
              <p className="text-brand-taupe text-[14px]">
                Supercharge your site with extras
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "AI livechat for your business",
                "Online booking system",
                "Advanced SEO tools",
                "Review management",
                "More modules coming soon",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-brand-taupe flex-shrink-0 mt-0.5" />
                  <span className="text-brand-taupe text-[14px]">{f}</span>
                </li>
              ))}
            </ul>
            <div className="block w-full text-center border border-brand-border text-brand-taupe font-semibold text-[15px] px-7 py-3.5 rounded-lg">
              Coming soon
            </div>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {["Ready in 7 days", "Cancel anytime", "Money-back guarantee"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-brand-forest" />
              <span className="text-brand-ink text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
