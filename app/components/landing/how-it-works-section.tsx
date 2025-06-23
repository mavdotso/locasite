'use client';

import { Search, Palette, Globe } from 'lucide-react';

const steps = [
  {
    number: '1',
    title: 'Find the Business',
    description: 'Search for any business on Google Maps and copy the URL from your browser.',
    icon: Search,
  },
  {
    number: '2',
    title: 'Customize Design',
    description: 'Our AI automatically creates a beautiful website. Customize colors, fonts, and content.',
    icon: Palette,
  },
  {
    number: '3',
    title: 'Publish & Share',
    description: 'Go live instantly with a free subdomain or connect your own custom domain.',
    icon: Globe,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create a Website in 3 Simple Steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No coding required. No complicated setup. Just results.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center">
                {/* Connection Line (hidden on mobile and last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-0.5 w-full -translate-x-1/2 bg-border md:block" />
                )}
                
                {/* Step Number */}
                <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                
                {/* Icon */}
                <div className="mb-4 flex justify-center">
                  <step.icon className="h-8 w-8 text-muted-foreground" />
                </div>
                
                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Example Section */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="rounded-xl border bg-muted/50 p-8">
            <h3 className="mb-4 text-center text-lg font-semibold">Try It With These Examples</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card p-4 text-sm">
                <p className="font-medium">Coffee Shop</p>
                <p className="mt-1 text-xs text-muted-foreground">Starbucks, Blue Bottle Coffee</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-sm">
                <p className="font-medium">Restaurant</p>
                <p className="mt-1 text-xs text-muted-foreground">Local pizzeria, sushi bar</p>
              </div>
              <div className="rounded-lg border bg-card p-4 text-sm">
                <p className="font-medium">Service Business</p>
                <p className="mt-1 text-xs text-muted-foreground">Plumber, electrician, salon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}