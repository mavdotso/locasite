import { Check } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="hero" className="relative bg-brand-forest overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28">
        {/* Eyebrow */}
        <div className="flex justify-center mb-6">
          <span className="inline-block bg-brand-sage/10 text-brand-sage text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-1.5 rounded-full">
            Done-for-you websites for local businesses
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-center font-display font-extrabold text-brand-cream text-4xl sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.0] tracking-[-0.03em] max-w-4xl mx-auto mb-6">
          A professional website.
          <br />
          Built for you. $149.
        </h1>

        {/* Subhead */}
        <p className="text-center text-brand-sage text-lg md:text-[18px] leading-[1.6] max-w-xl mx-auto mb-10">
          We design and build your website in 7 days. You focus on running your business. Hosting and updates from $9/month.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="#pricing"
            className="bg-brand-amber text-brand-ink font-semibold text-[16px] px-8 py-4 rounded-lg tracking-tight hover:brightness-95 transition"
          >
            Get my website — $149
          </Link>
          <Link
            href="#examples"
            className="border border-brand-cream/20 text-brand-cream font-semibold text-[15px] px-7 py-[14px] rounded-lg tracking-tight hover:bg-white/5 transition"
          >
            See examples
          </Link>
        </div>

        {/* Trust Bullets */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["Ready in 7 days", "No contracts", "Cancel anytime"].map((item) => (
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
