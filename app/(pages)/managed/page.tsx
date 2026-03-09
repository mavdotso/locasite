import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Share2, BarChart3, Check } from "lucide-react";
import Logo from "@/app/components/ui/logo";
import WaitlistForm from "./waitlist-form";

export const metadata: Metadata = {
  title: "Managed by AI — Locosite",
  description:
    "Your website, managed by AI. Monthly content updates, weekly social posts, and monthly performance reports — all done for you. $99/mo.",
};

const BENEFITS = [
  {
    icon: CalendarDays,
    title: "Monthly content updates",
    description:
      "We refresh your website copy, hours, and promotions every month — no login required.",
  },
  {
    icon: Share2,
    title: "Weekly social posts",
    description:
      "AI-written posts about your business, ready to publish on Facebook, Instagram, and Google.",
  },
  {
    icon: BarChart3,
    title: "Monthly performance report",
    description:
      "A plain-English summary of your site traffic, top pages, and what we updated.",
  },
];

const EARLY_BIRD_SLOTS = 20;

export default function ManagedPage() {
  return (
    <div className="min-h-screen bg-brand-forest">
      {/* Nav */}
      <nav className="border-b border-white/[0.08]">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Logo showText={false} className="text-brand-cream" />
            <span className="font-display font-extrabold text-xl text-brand-cream tracking-tight">
              Locosite
            </span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 lg:px-10 py-20 md:py-28 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-amber/30 bg-brand-amber/10 px-4 py-1.5 mb-8">
          <span className="text-brand-amber text-sm font-medium">Coming soon</span>
        </div>

        <h1 className="font-display font-extrabold text-brand-cream text-4xl sm:text-5xl md:text-[60px] leading-[1.0] tracking-[-0.03em] max-w-3xl mx-auto mb-6">
          Your website,
          <br />
          managed by AI.
        </h1>

        <p className="text-brand-sage text-lg md:text-xl leading-relaxed max-w-xl mx-auto mb-12">
          Forget logging in, writing copy, or posting on social. We handle your
          entire web presence — every month, automatically.
        </p>

        {/* Pricing */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="flex items-baseline gap-1">
            <span className="text-brand-cream font-display font-extrabold text-5xl">$99</span>
            <span className="text-brand-sage text-lg">/mo</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-white/10" />
          <div className="rounded-lg bg-brand-amber/15 border border-brand-amber/30 px-4 py-2 text-left">
            <p className="text-brand-amber font-semibold text-sm">
              Early bird: $49/mo
            </p>
            <p className="text-brand-sage text-xs">
              First {EARLY_BIRD_SLOTS} signups only
            </p>
          </div>
        </div>

        {/* Waitlist form */}
        <WaitlistForm />

        <p className="text-brand-sage/50 text-xs mt-4">
          No credit card. No commitment. We&apos;ll email you when we launch.
        </p>
      </section>

      {/* What's included */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-20">
          <h2 className="font-display font-bold text-brand-cream text-2xl md:text-3xl text-center mb-12">
            Everything done for you
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-lg bg-brand-pine/60 border border-brand-sage/20 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-brand-amber" />
                </div>
                <div>
                  <h3 className="text-brand-cream font-semibold mb-1">{title}</h3>
                  <p className="text-brand-sage text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get for $49 */}
      <section className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-2xl px-6 lg:px-10 py-20 text-center">
          <div className="rounded-2xl border border-brand-amber/20 bg-brand-amber/5 p-8 md:p-12">
            <p className="text-brand-amber font-semibold text-sm uppercase tracking-widest mb-4">
              Early bird offer
            </p>
            <h2 className="font-display font-extrabold text-brand-cream text-3xl md:text-4xl mb-2">
              $49/mo for life
            </h2>
            <p className="text-brand-sage mb-8">
              Lock in half price forever — for the first {EARLY_BIRD_SLOTS} businesses that join.
            </p>
            <ul className="text-left space-y-3 mb-8">
              {[
                "Monthly website content refresh",
                "4 weekly social posts per month",
                "Monthly performance report",
                "Priority onboarding",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-brand-amber mt-0.5 shrink-0" />
                  <span className="text-brand-cream text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo showText={false} className="text-brand-sage" width={20} height={20} />
            <span className="text-brand-sage text-sm">Locosite</span>
          </Link>
          <p className="text-brand-sage/50 text-xs">
            © {new Date().getFullYear()} Locosite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
