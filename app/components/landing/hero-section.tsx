'use client';

import { Button } from '@/app/components/ui/button';
import { ArrowRight, CheckCircle, Globe, Zap, Shield } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/app/components/ui/logo';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
      
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Logo width={48} height={48} />
          </div>
          
          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Turn Any Business Into a
            <span className="block text-primary">Professional Website</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Create stunning websites for local businesses in minutes. 
            Just paste a Google Maps link and watch the magic happen.
          </p>
          
          {/* CTA Buttons */}
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="group" asChild>
              <Link href="#create">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#how-it-works">
                See How It Works
              </Link>
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span>Setup in 60 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>Secure & reliable</span>
            </div>
          </div>
        </div>
        
        {/* Preview Image/Demo */}
        <div className="mx-auto mt-16 max-w-6xl">
          <div className="relative rounded-xl border bg-card p-2 shadow-2xl">
            <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <div className="text-center">
                <Globe className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">Website Preview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}