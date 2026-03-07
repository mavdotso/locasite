import {
  Globe,
  Shield,
  Smartphone,
  Search,
  MessageSquare,
  Paintbrush,
} from "lucide-react";

const features = [
  {
    name: "Custom design",
    description: "A unique website designed for your business, not a cookie-cutter template.",
    icon: Paintbrush,
  },
  {
    name: "Mobile responsive",
    description: "Looks perfect on phones, tablets, and desktops. Over 60% of your customers browse on mobile.",
    icon: Smartphone,
  },
  {
    name: "SEO built in",
    description: "We optimize your site for Google so local customers can find you.",
    icon: Search,
  },
  {
    name: "Contact form",
    description: "Capture leads and inquiries directly from your website. Never miss a customer.",
    icon: MessageSquare,
  },
  {
    name: "Custom domain",
    description: "Your own .com domain, set up and configured by us. Professional from day one.",
    icon: Globe,
  },
  {
    name: "SSL & security",
    description: "Enterprise-grade security included. Your site and your visitors are protected.",
    icon: Shield,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            What you get
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            Everything a local business needs
          </h2>
          <p className="text-brand-taupe text-[17px] leading-[1.65] max-w-lg mx-auto">
            All included in your $149 website. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="rounded-xl border border-brand-border bg-brand-cream/40 p-6 transition-all hover:shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-forest/10 text-brand-forest mb-4">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-brand-ink text-lg mb-1">
                {feature.name}
              </h3>
              <p className="text-brand-taupe text-[14px] leading-[1.6]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
