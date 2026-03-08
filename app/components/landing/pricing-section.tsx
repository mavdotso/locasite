import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    badge: null,
    description: "Get your business online in 30 seconds",
    features: [
      "Website built from your Google Maps listing",
      "Mobile-friendly design",
      "Contact form",
      "Locosite subdomain",
    ],
    cta: "Get My Free Website",
    ctaStyle:
      "border-2 border-brand-forest text-brand-forest hover:bg-brand-forest/5",
  },
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    badge: "Most popular",
    description: "Edit your content and remove branding",
    features: [
      "Everything in Free",
      "Edit hours, photos, and text",
      "Remove Locosite branding",
      "Basic analytics",
      "5 theme options",
      "Unlimited visitors",
    ],
    cta: "Start Free, Upgrade Later",
    ctaStyle: "bg-brand-amber text-brand-ink hover:brightness-95",
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    badge: null,
    description: "Full control with custom domain and more",
    features: [
      "Everything in Starter",
      "Custom domain (yourbusiness.com)",
      "Full visual editor",
      "Google Reviews widget",
      "Photo gallery",
      "Menu management",
      "SEO meta editor",
      "Priority support",
    ],
    cta: "Start Free, Upgrade Later",
    ctaStyle:
      "border-2 border-brand-forest text-brand-forest hover:bg-brand-forest/5",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            Pricing
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            Start free. Upgrade when you&apos;re ready.
          </h2>
          <p className="text-brand-taupe text-[16px] max-w-lg mx-auto">
            Every business deserves a website. Get yours in 30 seconds — no
            credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl border-2 bg-white p-6 flex flex-col ${
                plan.badge ? "border-brand-forest" : "border-brand-border"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="text-xs font-semibold text-brand-forest bg-[#D4EDDE] px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="font-display font-bold text-brand-ink text-lg mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-display font-extrabold text-brand-ink text-3xl">
                    {plan.price}
                  </span>
                  <span className="text-brand-taupe text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="text-brand-taupe text-[13px]">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-2.5 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="h-4 w-4 text-brand-forest flex-shrink-0 mt-0.5" />
                    <span className="text-brand-ink text-[13px]">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="#hero"
                className={`block w-full text-center font-semibold text-[14px] px-6 py-3 rounded-lg tracking-tight transition ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {["No credit card required", "Cancel anytime", "No hidden fees"].map(
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
