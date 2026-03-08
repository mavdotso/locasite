import { Globe, Eye, CreditCard } from "lucide-react";

const steps = [
  {
    icon: Globe,
    number: "01",
    title: "We build it from your Google listing",
    description:
      "We pull your business name, address, hours, photos, reviews, and service details directly from Google Maps. No forms to fill out. No questionnaires. Your information is already there.",
  },
  {
    icon: Eye,
    number: "02",
    title: "You preview it for free",
    description:
      "Enter your business name and see your site before you pay anything. Real copy. Real photos. Real layout — not a template preview with fake content.",
  },
  {
    icon: CreditCard,
    number: "03",
    title: "Claim it for $149",
    description:
      "Pay once to publish. Your site goes live at a clean URL within 24 hours. We handle hosting, updates, and security for $9/month. That\u2019s it.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            How it works
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            Three steps. Done in under 24 hours.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-forest mb-5">
                <step.icon className="h-6 w-6 text-brand-cream" />
              </div>
              <div className="text-brand-amber font-display font-bold text-sm mb-2">
                {step.number}
              </div>
              <h3 className="font-display font-bold text-brand-ink text-[22px] leading-[1.25] tracking-[-0.015em] mb-2">
                {step.title}
              </h3>
              <p className="text-brand-taupe text-[14px] leading-[1.6]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
