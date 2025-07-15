'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CTASection() {
  const [url, setUrl] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      // Navigate to the main page with the URL in hash
      router.push(`/#create?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-indigo-500/20 to-purple-600/30" />
      
      {/* Animated circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-500 -translate-x-1/2 -translate-y-1/2" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 text-sm font-medium text-white mb-8">
            <Zap className="h-4 w-4 text-yellow-400" />
            Limited Time Offer - 50% Off Professional Plan
          </div>
          
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 text-white">
            Ready to Transform Your
            <span className="block mt-2 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Business Online Presence?
            </span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses already using Locasite. 
            Get your professional website up and running in just 60 seconds.
          </p>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="url"
                placeholder="Paste your Google Maps URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 text-base"
              />
              <Button 
                type="submit"
                size="lg" 
                className="h-14 whitespace-nowrap px-8 group bg-white text-blue-600 hover:bg-blue-50 border-0 shadow-lg font-semibold"
              >
                Create My Website
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </form>
          
          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-green-400" />
              <span>Free forever plan available</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
          
          {/* Social Proof */}
          <div className="mt-12 pt-12 border-t border-white/20">
            <p className="text-sm text-blue-100 mb-4">
              Trusted by over 10,000 businesses worldwide
            </p>
            <div className="flex items-center justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm font-medium">4.9 out of 5 stars</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}