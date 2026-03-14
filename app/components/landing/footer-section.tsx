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

          {/* Free Websites — Home Services */}
          <div>
            <h3 className="font-semibold text-brand-ink text-sm mb-4">
              Home Services
            </h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/free-plumber-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Plumber Website
                </Link>
              </li>
              <li>
                <Link href="/free-electrician-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Electrician Website
                </Link>
              </li>
              <li>
                <Link href="/free-hvac-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free HVAC Website
                </Link>
              </li>
              <li>
                <Link href="/free-cleaning-service-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Cleaning Service Website
                </Link>
              </li>
              <li>
                <Link href="/free-landscaping-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Landscaping Website
                </Link>
              </li>
              <li>
                <Link href="/free-roofing-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Roofing Website
                </Link>
              </li>
            </ul>
          </div>

          {/* Free Websites — Other Categories + Legal */}
          <div>
            <h3 className="font-semibold text-brand-ink text-sm mb-4">
              More Categories
            </h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/free-restaurant-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Restaurant Website
                </Link>
              </li>
              <li>
                <Link href="/free-salon-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Salon Website
                </Link>
              </li>
              <li>
                <Link href="/free-dentist-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Dentist Website
                </Link>
              </li>
              <li>
                <Link href="/free-auto-repair-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Auto Repair Website
                </Link>
              </li>
              <li>
                <Link href="/free-lawyer-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Lawyer Website
                </Link>
              </li>
              <li>
                <Link href="/free-small-business-website" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Free Small Business Website
                </Link>
              </li>
            </ul>
            <h3 className="font-semibold text-brand-ink text-sm mt-6 mb-4">Legal</h3>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link href="/privacy" className="text-brand-taupe hover:text-brand-ink transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-brand-taupe hover:text-brand-ink transition-colors">
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
          <p className="text-center text-brand-taupe/60 text-[12px] mt-3">
            Part of{" "}
            <a href="https://zerohumancorp.com" className="underline underline-offset-2 hover:text-brand-taupe transition-colors" target="_blank" rel="noopener noreferrer">
              Zero Human Corp
            </a>
            {" "}&middot;{" "}
            <a href="https://autoworkhq.com" className="underline underline-offset-2 hover:text-brand-taupe transition-colors" target="_blank" rel="noopener noreferrer">
              AutoWork HQ
            </a>
            {" "}&middot;{" "}
            <a href="https://oat.tools" className="underline underline-offset-2 hover:text-brand-taupe transition-colors" target="_blank" rel="noopener noreferrer">
              oat.tools
            </a>
            {" "}&middot;{" "}
            <a href="https://brightroom.app" className="underline underline-offset-2 hover:text-brand-taupe transition-colors" target="_blank" rel="noopener noreferrer">
              Brightroom
            </a>
            {" "}&middot;{" "}
            <a href="https://monolink.me" className="underline underline-offset-2 hover:text-brand-taupe transition-colors" target="_blank" rel="noopener noreferrer">
              Monolink
            </a>
            {" "}&middot;{" "}
            <a href="https://zendoc.ai" className="underline underline-offset-2 hover:text-brand-taupe transition-colors" target="_blank" rel="noopener noreferrer">
              Zendoc
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
