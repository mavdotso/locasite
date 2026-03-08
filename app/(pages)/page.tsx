import NavBar from "@/app/components/landing/nav-bar";
import HeroSection from "@/app/components/landing/hero-section";
import TrustBar from "@/app/components/landing/trust-bar";
import ProblemSection from "@/app/components/landing/problem-section";
import HowItWorksSection from "@/app/components/landing/how-it-works-section";
import WhoItsForSection from "@/app/components/landing/who-its-for-section";
import ComparisonSection from "@/app/components/landing/comparison-section";
import PricingSection from "@/app/components/landing/pricing-section";
import TestimonialsSection from "@/app/components/landing/testimonials-section";
import FaqSection from "@/app/components/landing/faq-section";
import CtaSection from "@/app/components/landing/cta-section";
import FooterSection from "@/app/components/landing/footer-section";

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <TrustBar />
        <ProblemSection />
        <HowItWorksSection />
        <WhoItsForSection />
        <ComparisonSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <FooterSection />
    </>
  );
}
