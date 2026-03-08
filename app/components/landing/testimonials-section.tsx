import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Maria Garcia",
    business: "Garcia Tax Services",
    location: "Orlando, FL",
    initials: "MG",
    text: "I was quoted $3,000 for a website by a local agency. Locosite built me something just as good for $149. My clients say it looks very professional.",
  },
  {
    name: "James Thompson",
    business: "Thompson Plumbing",
    location: "Winter Park, FL",
    initials: "JT",
    text: "I don't have time to mess around with website builders. They built everything for me, and now customers find me on Google. Exactly what I needed.",
  },
  {
    name: "David Kim",
    business: "Kim Family Dentistry",
    location: "Kissimmee, FL",
    initials: "DK",
    text: "We went from no web presence to a professional site in a week. The $9/month hosting is a no-brainer compared to what our old provider charged.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="py-20 md:py-28 bg-brand-cream">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold text-brand-forest uppercase tracking-[0.12em] mb-3 block">
            Testimonials
          </span>
          <h2 className="font-display font-extrabold text-brand-ink text-3xl md:text-[48px] leading-[1.05] tracking-[-0.025em] mb-4">
            Local businesses trust Locosite
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl border border-brand-border p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-amber text-brand-amber" />
                ))}
              </div>
              <p className="text-brand-ink text-[15px] leading-[1.65] mb-6">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-forest flex items-center justify-center text-brand-cream text-sm font-semibold">
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-brand-ink text-sm">{t.name}</p>
                  <p className="text-brand-taupe text-xs">{t.business} &middot; {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
