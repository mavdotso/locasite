import {
  Globe,
  MousePointerClick,
  Smartphone,
  Rocket,
  Search,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    name: "Auto-built from Google Business",
    description:
      "We pull your name, photos, hours, location, and description from your Google listing. Your site is ready before you lift a finger.",
    icon: Globe,
  },
  {
    name: "Edit anything with a click",
    description:
      "Change your headline, swap a photo, add your phone number. No code. No learning curve. If you can click, you can do it.",
    icon: MousePointerClick,
  },
  {
    name: "Mobile-ready out of the box",
    description:
      "Looks sharp on every phone, tablet, and desktop. Your customers are on mobile — your site will be too.",
    icon: Smartphone,
  },
  {
    name: "One-click Publish",
    description:
      "When you're ready, press Publish. Done. Your site is live. We manage hosting, SSL security, and uptime in the background.",
    icon: Rocket,
  },
  {
    name: "Local SEO built in",
    description:
      "Your site is structured to show up when people nearby search for your type of business on Google.",
    icon: Search,
  },
  {
    name: "Contact form included",
    description:
      "Customers can reach you directly from your site. Every inquiry lands in your inbox.",
    icon: MessageSquare,
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
            Everything your business website needs. Nothing you don&apos;t.
          </h2>
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
