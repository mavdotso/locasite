import Link from "next/link";

function LogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="12" r="9" fill="currentColor" />
      <circle cx="14" cy="12" r="4" fill="var(--color-brand-cream)" />
      <path d="M14 21 L14 27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-cream border-t border-brand-border">
      <div className="mx-auto max-w-6xl px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-brand-forest"><LogoMark /></span>
              <span className="font-display font-extrabold text-brand-ink text-lg tracking-tight">
                Locasite
              </span>
            </div>
            <p className="text-brand-taupe text-[14px] leading-[1.6] max-w-xs">
              Professional websites for local businesses. Built for you in 7 days, just $149.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-brand-ink text-sm mb-4">Product</h3>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="#how-it-works" className="text-brand-taupe hover:text-brand-ink transition-colors">How it works</Link></li>
              <li><Link href="#features" className="text-brand-taupe hover:text-brand-ink transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-brand-taupe hover:text-brand-ink transition-colors">Pricing</Link></li>
              <li><Link href="#faq" className="text-brand-taupe hover:text-brand-ink transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-brand-ink text-sm mb-4">Legal</h3>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/privacy" className="text-brand-taupe hover:text-brand-ink transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-brand-taupe hover:text-brand-ink transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-brand-border pt-6 text-center text-brand-taupe text-[13px]">
          &copy; {currentYear} Locasite. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
