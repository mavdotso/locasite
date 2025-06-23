'use client';

import { 
  Globe, 
  Zap, 
  Palette, 
  Search, 
  Shield, 
  BarChart3,
  MessageSquare,
  Smartphone
} from 'lucide-react';

const features = [
  {
    name: 'Instant Import',
    description: 'Just paste a Google Maps URL and we automatically import all business information.',
    icon: Search,
    color: 'text-blue-600',
  },
  {
    name: 'Professional Design',
    description: 'Beautiful, mobile-responsive templates that look great on any device.',
    icon: Palette,
    color: 'text-purple-600',
  },
  {
    name: 'Lightning Fast',
    description: 'Optimized for speed with instant loading times and great SEO performance.',
    icon: Zap,
    color: 'text-yellow-600',
  },
  {
    name: 'Business Claiming',
    description: 'Business owners can claim and manage their listings with Google verification.',
    icon: Shield,
    color: 'text-green-600',
  },
  {
    name: 'Contact Forms',
    description: 'Built-in contact forms to capture leads and customer inquiries.',
    icon: MessageSquare,
    color: 'text-indigo-600',
  },
  {
    name: 'Analytics Dashboard',
    description: 'Track visitors, page views, and engagement with detailed analytics.',
    icon: BarChart3,
    color: 'text-pink-600',
  },
  {
    name: 'Mobile Optimized',
    description: 'Perfectly responsive design that looks amazing on phones and tablets.',
    icon: Smartphone,
    color: 'text-cyan-600',
  },
  {
    name: 'Custom Domains',
    description: 'Use your own domain or get a free subdomain at yourname.locasite.com.',
    icon: Globe,
    color: 'text-orange-600',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need to Succeed Online
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features to help local businesses thrive in the digital world
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4">
                  <div className={`inline-flex rounded-lg bg-background p-3 ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">{feature.name}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}