'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { BusinessData } from '@/convex/businesses';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { 
  Loader2, 
  Search, 
  AlertCircle,
  CheckCircle,
  ArrowRight,
  MapPin,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import BusinessPreviewCard from '../common/business-preview-card';

interface BusinessCreationFormProps {
  onSuccess?: (businessId: string) => void;
  className?: string;
}

export default function BusinessCreationForm({ onSuccess, className }: BusinessCreationFormProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const createFromPending = useMutation(api.businesses.createBusinessFromPendingData);

  const validateUrl = (url: string): boolean => {
    // Check for various Google Maps URL patterns
    return url.includes('google.com/maps') || 
           url.includes('maps.google.com') || 
           url.includes('goo.gl/maps') ||
           url.includes('maps.app.goo.gl');
  };

  const handleExtractData = async () => {
    if (!googleMapsUrl.trim()) {
      setError('Please enter a Google Maps URL');
      return;
    }

    if (!validateUrl(googleMapsUrl)) {
      setError('Please enter a valid Google Maps URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';
      const deploymentName = convexUrl.split('//')[1]?.split('.')[0];
      const convexSiteUrl = `https://${deploymentName}.convex.site`;
      
      const response = await fetch(`${convexSiteUrl}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: googleMapsUrl, preview: true }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server error: ${text.substring(0, 100)}...`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to extract business information');
      }

      if (!data.success || !data.data) {
        throw new Error('No business data found at this URL');
      }

      setBusinessData(data.data);
      setStep('preview');
      toast.success('Business information extracted successfully!');
    } catch (error: unknown) {
      console.error('Error scraping business data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to extract business information. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBusiness = async () => {
    if (!businessData) {
      setError('No business data available');
      return;
    }

    setIsLoading(true);

    try {
      const { businessId } = await createFromPending({ 
        businessData,
        aiContent: null
      });
      
      toast.success('Website created successfully!', {
        description: `Your ${businessData.name} website has been created.`,
      });
      
      // Small delay to ensure pages are created and queries are updated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSuccess) {
        onSuccess(businessId);
      } else {
        router.push(`/business/${businessId}/edit`);
      }
    } catch (error: unknown) {
      console.error('Error creating site:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create website. Please try again.';
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('logged in')) {
        setError('You must be signed in to create a website. Please sign in and try again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('input');
    setError('');
    setBusinessData(null);
  };

  return (
    <div className={className}>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className={`flex items-center gap-2 ${step === 'input' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'input' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            {step === 'preview' ? <CheckCircle className="w-5 h-5" /> : '1'}
          </div>
          <span className="text-sm font-medium hidden sm:inline">Enter URL</span>
        </div>
        
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        
        <div className={`flex items-center gap-2 ${step === 'preview' ? 'text-primary' : 'text-muted-foreground'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-muted'
          }`}>
            2
          </div>
          <span className="text-sm font-medium hidden sm:inline">Review & Create</span>
        </div>
      </div>

      {/* Step 1: URL Input */}
      {step === 'input' && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              Create Website from Google Maps
            </CardTitle>
            <CardDescription>
              Enter a Google Maps URL to automatically create a professional website
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mapsUrl">Google Maps URL</Label>
              <Input
                id="mapsUrl"
                type="url"
                placeholder="https://maps.google.com/..."
                value={googleMapsUrl}
                onChange={(e) => {
                  setGoogleMapsUrl(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading && googleMapsUrl.trim()) {
                    handleExtractData();
                  }
                }}
                disabled={isLoading}
              />
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              <h3 className="font-medium text-foreground mb-2">How to get a Google Maps URL:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Search for the business on Google Maps</li>
                <li>Click on the business listing</li>
                <li>Copy the URL from your browser&apos;s address bar</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>

            <Button 
              onClick={handleExtractData} 
              disabled={isLoading || !googleMapsUrl.trim()}
              className="w-full transition-all"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Business Info...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Extract Business Information
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Preview & Create */}
      {step === 'preview' && businessData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Business Information Extracted
              </CardTitle>
              <CardDescription>
                Review the information below and create your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BusinessPreviewCard businessData={businessData} />
              
              {error && (
                <Alert className="border-red-200 bg-red-50 mt-4">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={handleCreateBusiness} 
                  disabled={isLoading}
                  size="lg"
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Website...
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 mr-2" />
                      Create Website
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleBack} 
                  disabled={isLoading}
                  size="lg"
                >
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}