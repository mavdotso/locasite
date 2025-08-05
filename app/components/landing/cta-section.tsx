"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export default function CTASection() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      // Navigate to the hero section and populate the input
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth' });
        // Find the input in the hero section and populate it
        setTimeout(() => {
          const heroInput = document.querySelector('#hero input[type="url"]') as HTMLInputElement;
          if (heroInput) {
            heroInput.value = url;
            heroInput.focus();
            // Trigger the input event to update the React state
            const event = new Event('input', { bubbles: true });
            heroInput.dispatchEvent(event);
          }
        }, 500);
      }
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-indigo-500/10" />
      
      {/* Simple accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Headline - Direct and urgent */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
            Ready to Get Your Business Online
            <span className="block mt-2">
              in 60 Seconds?
            </span>
          </h2>

          {/* Subheadline - Clear benefit */}
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Stop losing customers to competitors with better websites. 
            Get found online today.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="url"
                placeholder="Paste your Google Maps link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 text-base bg-white/95 backdrop-blur border-white/20"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="h-14 whitespace-nowrap px-8 group bg-white text-blue-600 hover:bg-gray-50 border-0 shadow-lg font-semibold text-base"
              >
                Create My Free Website
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>

          {/* Trust points - simpler */}
          <p className="text-sm text-blue-100 mb-12">
            ✓ No credit card required &nbsp;&nbsp; ✓ Free forever plan &nbsp;&nbsp; ✓ Setup in 60 seconds
          </p>

          {/* Urgency without being pushy */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <p className="text-white font-semibold mb-2">
              Your competitors are already online
            </p>
            <p className="text-sm text-blue-100">
              Every day without a website is potential customers lost. 
              Join 50,000+ businesses growing with Locasite.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
