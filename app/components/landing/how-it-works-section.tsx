import { MessageSquare, Paintbrush, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Tell us about your business",
    description: "Share your business name, location, and what you do. We handle everything from there.",
  },
  {
    icon: Paintbrush,
    number: "02",
    title: "We build your website",
    description: "Our team designs a professional, mobile-ready website tailored to your business in 7 days.",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Your site goes live",
    description: "Review your site, request changes, and go live. We handle hosting, security, and updates.",
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
            Three steps to your new website
          </h2>
          <p className="text-brand-taupe text-[17px] leading-[1.65] max-w-lg mx-auto">
            No templates. No DIY. We build it for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand-forest mb-5">
                <step.icon className="h-6 w-6 text-brand-cream" />
              </div>
              <div className="text-brand-amber font-display font-bold text-sm mb-2">{step.number}</div>
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
