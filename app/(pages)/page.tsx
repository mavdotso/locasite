import NavBar from '@/app/components/landing/nav-bar';
import HeroSection from '@/app/components/landing/hero-section';
import SocialProofBar from '@/app/components/landing/social-proof-bar';
import HowTheMagicHappensSection from '@/app/components/landing/how-the-magic-happens';
import FeaturesSection from '@/app/components/landing/features-section';
import TestimonialsSection from '@/app/components/landing/testimonials-section';
import PricingSection from '@/app/components/landing/pricing-section';
import FAQSection from '@/app/components/landing/faq-section';
import CTASection from '@/app/components/landing/cta-section';
import FooterSection from '@/app/components/landing/footer-section';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <NavBar />
      
      {/* Hero Section with integrated form and preview */}
      <HeroSection />
      
      {/* Social Proof Bar */}
      <SocialProofBar />
      
      {/* How the Magic Happens */}
      <HowTheMagicHappensSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      
      {/* Pricing Section */}
      <PricingSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Final CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
}