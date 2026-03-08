'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Logo from '@/app/components/ui/logo';

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
] as const;

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-brand-forest border-b border-white/[0.08]">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo showText={false} className="text-brand-cream" />
            <span className="font-display font-extrabold text-xl text-brand-cream tracking-tight">
              Locosite
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-brand-sage hover:text-brand-cream transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              href="#hero"
              className="bg-brand-amber text-brand-ink text-[13px] font-semibold px-[18px] py-[9px] rounded-md hover:brightness-95 transition"
            >
              See Your Website
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
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-brand-sage hover:text-brand-cream" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <Link
                href="#hero"
                className="bg-brand-amber text-brand-ink text-[13px] font-semibold px-[18px] py-[9px] rounded-md text-center hover:brightness-95 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                See Your Website
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
