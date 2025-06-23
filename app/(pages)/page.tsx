import NavBar from '@/app/components/landing/nav-bar';
import HeroSection from '@/app/components/landing/hero-section';
import ValuePropositionSection from '@/app/components/landing/value-proposition-section';
import FeaturesSection from '@/app/components/landing/features-section';
import HowItWorksSection from '@/app/components/landing/how-it-works-section';
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
      
      {/* Value Proposition - Why Choose Locasite */}
      <ValuePropositionSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
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