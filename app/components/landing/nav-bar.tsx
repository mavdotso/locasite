'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

function LogoMark({ className }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="14" cy="12" r="9" fill="currentColor" />
      <circle cx="14" cy="12" r="4" fill="var(--color-brand-forest)" />
      <path d="M14 21 L14 27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-forest border-b border-white/[0.08]">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <LogoMark className="text-brand-cream" />
            <span className="font-display font-extrabold text-xl text-brand-cream tracking-tight">
              Locasite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-sm font-medium text-brand-sage hover:text-brand-cream transition-colors">
              How it works
            </Link>
            <Link href="#examples" className="text-sm font-medium text-brand-sage hover:text-brand-cream transition-colors">
              Examples
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-brand-sage hover:text-brand-cream transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-brand-sage hover:text-brand-cream transition-colors">
              FAQ
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="#pricing"
              className="bg-brand-amber text-brand-ink text-[13px] font-semibold px-[18px] py-[9px] rounded-md hover:brightness-95 transition"
            >
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-brand-cream"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <div className="flex flex-col gap-4">
              <Link href="#how-it-works" className="text-sm font-medium text-brand-sage hover:text-brand-cream" onClick={() => setIsMenuOpen(false)}>
                How it works
              </Link>
              <Link href="#examples" className="text-sm font-medium text-brand-sage hover:text-brand-cream" onClick={() => setIsMenuOpen(false)}>
                Examples
              </Link>
              <Link href="#pricing" className="text-sm font-medium text-brand-sage hover:text-brand-cream" onClick={() => setIsMenuOpen(false)}>
                Pricing
              </Link>
              <Link href="#faq" className="text-sm font-medium text-brand-sage hover:text-brand-cream" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </Link>
              <Link
                href="#pricing"
                className="bg-brand-amber text-brand-ink text-[13px] font-semibold px-[18px] py-[9px] rounded-md text-center hover:brightness-95 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
