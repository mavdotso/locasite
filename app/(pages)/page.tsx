import BusinessCreationForm from '@/app/components/business/business-creation-form';
import NavBar from '@/app/components/landing/nav-bar';
import HeroSection from '@/app/components/landing/hero-section';
import FeaturesSection from '@/app/components/landing/features-section';
import HowItWorksSection from '@/app/components/landing/how-it-works-section';
import FooterSection from '@/app/components/landing/footer-section';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <NavBar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Create Website Section */}
      <section id="create" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Create Your Website?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start by entering a Google Maps URL below
            </p>
          </div>
          
          <BusinessCreationForm className="max-w-2xl mx-auto" />
        </div>
      </section>
      
      {/* Footer */}
      <FooterSection />
    </div>
  );
}