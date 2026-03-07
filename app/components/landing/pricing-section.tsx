"use client";

import { Check, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 border border-green-200 px-4 py-1.5 text-sm font-medium text-green-700 mb-4">
            Done-For-You Professional Website
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Simple, Transparent
            <span className="text-primary"> Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We build your professional website. You focus on running your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Claim Fee */}
          <div className="relative rounded-2xl border border-primary shadow-lg scale-105 bg-card p-8 transition-all duration-300 hover:shadow-lg">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                <Sparkles className="h-3 w-3" />
                Get Started
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Claim Your Site</h3>
              <div className="mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$149</span>
                  <span className="text-muted-foreground">one-time</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                We build your professional website in 7 days
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Professional website built for you",
                "Google Maps auto-import",
                "Mobile responsive design",
                "Contact form included",
                "SSL security included",
                "Custom domain setup",
                "Ready in 7 business days",
                "One round of revisions",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" size="lg">
              Claim Your Site
            </Button>
          </div>

          {/* Base Plan */}
          <div className="relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Base Plan</h3>
              <div className="mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Keep your site live, updated, and running smoothly
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Hosting & maintenance included",
                "SSL & security updates",
                "Small content updates",
                "Uptime monitoring",
                "Basic analytics",
                "Email support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" variant="outline" size="lg" disabled>
              Included After Claim
            </Button>
          </div>

          {/* Paid Modules */}
          <div className="relative rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-lg">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Paid Modules</h3>
              <div className="mb-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">Add-ons</span>
                </div>
                <span className="text-sm text-muted-foreground">pricing coming soon</span>
              </div>
              <p className="text-muted-foreground">
                Supercharge your site with AI-powered features
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "AI Livechat for your business",
                "Online booking system",
                "Advanced SEO tools",
                "Review management",
                "More modules coming soon",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full" variant="outline" size="lg" disabled>
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16">
          <div className="max-w-3xl mx-auto bg-muted/50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Ready in 7 Days</p>
                <p className="text-sm text-muted-foreground">Guaranteed</p>
              </div>
              <div>
                <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Cancel Anytime</p>
                <p className="text-sm text-muted-foreground">No long-term contracts</p>
              </div>
              <div>
                <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-medium">Money-Back Guarantee</p>
                <p className="text-sm text-muted-foreground">Not happy? Full refund</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
