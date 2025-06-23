'use client';

import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowRight, CheckCircle, Sparkles, Globe, Loader2 } from 'lucide-react';
import Logo from '@/app/components/ui/logo';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function HeroSection() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState<{
    businessId?: string;
    name?: string;
    category?: string;
    phone?: string;
    address?: string;
    rating?: number;
    reviews?: Array<{
      reviewer: string;
      rating: string;
      text: string;
    }>;
  } | null>(null);
  const router = useRouter();
  const createFromPending = useMutation(api.businesses.createBusinessFromPendingData);

  const validateUrl = (url: string): boolean => {
    return url.includes('google.com/maps') || 
           url.includes('maps.google.com') || 
           url.includes('goo.gl/maps') ||
           url.includes('maps.app.goo.gl');
  };

  const handleGeneratePreview = async () => {
    if (!url.trim()) {
      toast.error('Please enter a Google Maps URL');
      return;
    }

    if (!validateUrl(url)) {
      toast.error('Please enter a valid Google Maps URL');
      return;
    }

    setIsLoading(true);
    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';
      const deploymentName = convexUrl.split('//')[1]?.split('.')[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;
      
      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, preview: true }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.businessData) {
        setPreviewData(data.businessData);
        toast.success('Preview generated successfully!');
      }
    } catch (error) {
      console.error('Error scraping business:', error);
      toast.error('Failed to generate preview. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWebsite = async () => {
    if (!previewData) return;
    
    setIsLoading(true);
    try {
      // For the preview, we need to fetch the full business data again
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';
      const deploymentName = convexUrl.split('//')[1]?.split('.')[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;
      
      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.businessData) {
        const result = await createFromPending({ 
          businessData: data.businessData,
          aiContent: null
        });
        
        if (result.businessId) {
          router.push(`/preview/${result.businessId}`);
        }
      }
    } catch (error) {
      console.error('Error creating website:', error);
      toast.error('Failed to create website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent" />
      </div>
      
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Logo and Badge */}
          <div className="mb-8 flex flex-col items-center gap-4">
            <Logo width={56} height={56} />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Website Generator
            </div>
          </div>
          
          {/* Headline */}
          <h1 className="mx-auto mb-6 max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Transform Any Business Into a
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Stunning Website</span>
          </h1>
          
          {/* Subheadline */}
          <p className="mx-auto mb-12 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
            Simply paste a Google Maps link and watch as we create a professional, 
            fully-customized website in seconds. No coding required.
          </p>
          
          {/* Input and CTA Section */}
          <div className="mx-auto mb-8 max-w-2xl">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="url"
                placeholder="Paste a Google Maps business URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-14 text-base"
                disabled={isLoading}
              />
              <Button 
                size="lg" 
                onClick={handleGeneratePreview}
                disabled={isLoading}
                className="h-14 whitespace-nowrap px-8"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Preview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Try it free • No credit card required • Setup in 60 seconds
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="mb-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>SEO Optimized</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Mobile Responsive</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Fully Customizable</span>
            </div>
          </div>
        
          {/* Live Preview Section */}
          <div className="mx-auto max-w-6xl">
            <div className="relative">
              {/* Browser Frame */}
              <div className="rounded-xl border bg-card shadow-2xl">
                <div className="flex items-center gap-2 border-b px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="mx-auto flex max-w-sm items-center gap-2 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      {previewData ? `${previewData.name?.toLowerCase().replace(/\s+/g, '-')}.locasite.com` : 'your-business.locasite.com'}
                    </div>
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-b-xl bg-background">
                  {previewData ? (
                    <div className="h-full overflow-y-auto">
                      {/* Mini Website Preview */}
                      <div className="bg-gradient-to-b from-primary/10 to-transparent p-8 text-center">
                        <h2 className="mb-2 text-2xl font-bold">{previewData.name}</h2>
                        <p className="text-sm text-muted-foreground">{previewData.category || 'Local Business'}</p>
                        <div className="mt-4 flex justify-center gap-4">
                          <Button size="sm">Contact Us</Button>
                          <Button size="sm" variant="outline">View Hours</Button>
                        </div>
                      </div>
                      
                      {/* Business Info Preview */}
                      <div className="grid gap-6 p-8 md:grid-cols-2">
                        <div className="rounded-lg border bg-card p-4">
                          <h3 className="mb-2 font-semibold">Contact Information</h3>
                          <p className="text-sm text-muted-foreground">{previewData.phone}</p>
                          <p className="text-sm text-muted-foreground">{previewData.address}</p>
                        </div>
                        <div className="rounded-lg border bg-card p-4">
                          <h3 className="mb-2 font-semibold">Customer Rating</h3>
                          <p className="text-sm text-muted-foreground">
                            ⭐ {previewData.rating || '5.0'} ({previewData.reviews?.length || 0} reviews)
                          </p>
                        </div>
                      </div>
                      
                      {/* CTA for full preview */}
                      <div className="border-t bg-muted/50 p-4 text-center">
                        <Button onClick={handleCreateWebsite} className="group">
                          View Full Website Preview
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <Globe className="mx-auto h-24 w-24 text-muted-foreground/20" />
                        <p className="mt-4 text-lg font-medium text-muted-foreground">
                          Your website preview will appear here
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Enter a Google Maps URL above to get started
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}