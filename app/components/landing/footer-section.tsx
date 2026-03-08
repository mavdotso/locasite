import Link from "next/link";
import Logo from "@/app/components/ui/logo";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-cream border-t border-brand-border">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo
                width={24}
                height={24}
                showText={false}
                className="text-brand-forest"
                innerFill="var(--color-brand-cream)"
              />
              <span className="font-display font-extrabold text-brand-ink text-lg tracking-tight">
                Locosite
              </span>
            </div>
            <p className="text-brand-taupe text-[14px] leading-[1.6] max-w-xs mb-4">
              Done-for-you websites for local businesses. Built from Google Maps.
              Live in 24 hours.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-brand-taupe text-[12px]">
              <span>SSL secured</span>
              <span>&middot;</span>
              <span>Cancel anytime</span>
              <span>&middot;</span>
              <span>Proudly serving Orlando, FL</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-brand-ink text-sm mb-4">
              Product
            </h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link
                  href="#how-it-works"
                  className="text-brand-taupe hover:text-brand-ink transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="#features"
                  className="text-brand-taupe hover:text-brand-ink transition-colors"
                >
                  Who it&apos;s for
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-brand-taupe hover:text-brand-ink transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-brand-taupe hover:text-brand-ink transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-brand-ink text-sm mb-4">Legal</h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link
                  href="/privacy"
                  className="text-brand-taupe hover:text-brand-ink transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-brand-taupe hover:text-brand-ink transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO footer text */}
        <div className="mt-8 border-t border-brand-border pt-6">
          <p className="text-brand-taupe/60 text-[12px] leading-[1.6] max-w-2xl mx-auto text-center mb-4">
            Locosite is a done-for-you website service for local businesses. We
            build professional websites for restaurants, plumbers, HVAC
            contractors, landscapers, and cleaning services — directly from your
            Google Maps listing. No design skills required. Free to publish, plans from $9/month. Currently serving Orlando, FL.
          </p>
          <p className="text-center text-brand-taupe text-[13px]">
            &copy; {currentYear} Locosite. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
