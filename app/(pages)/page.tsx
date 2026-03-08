import NavBar from "@/app/components/landing/nav-bar";
import HeroSection from "@/app/components/landing/hero-section";
import HowItWorksSection from "@/app/components/landing/how-it-works-section";
import FeaturesSection from "@/app/components/landing/features-section";
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
        <HowItWorksSection />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <FooterSection />
    </>
  );
}
