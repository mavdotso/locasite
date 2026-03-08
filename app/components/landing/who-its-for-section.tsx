import { UtensilsCrossed, Wrench, TreePine } from "lucide-react";

const verticals = [
  {
    icon: UtensilsCrossed,
    title: "Restaurants & Caf\u00e9s",
    description:
      "Your menu deserves to be online. Your hours shouldn\u2019t be a mystery. Diners are searching \u2014 stop sending them to your competitor\u2019s website.",
  },
  {
    icon: Wrench,
    title: "Plumbers, HVAC & Electricians",
    description:
      "Emergency jobs go to whoever shows up first in search. A professional site with your licenses, service area, and reviews means you\u2019re in the running at 2am.",
  },
  {
    icon: TreePine,
    title: "Landscapers & Cleaning Services",
    description:
      "Homeowners hire who they trust \u2014 and trust starts online. Your Google reviews are already doing the work. A website gives them a home.",
  },
];

export default function WhoItsForSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            Who it&apos;s for
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4 max-w-3xl mx-auto">
            Built for local businesses that have earned their reputation — and
            are ready to get found.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {verticals.map((v) => (
            <div
              key={v.title}
              className="rounded-xl border border-brand-border bg-brand-cream/40 p-6 transition-all hover:shadow-sm"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-forest/10 text-brand-forest mb-4">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-brand-ink text-lg mb-2">
                {v.title}
              </h3>
              <p className="text-brand-taupe text-[14px] leading-[1.6]">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
