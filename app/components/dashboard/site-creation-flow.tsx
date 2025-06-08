'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { 
  Globe, 
  MapPin, 
  Search,
  ArrowRight,
  Loader,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { BusinessData } from '@/convex/businesses';

export default function SiteCreationFlow() {
  const [step, setStep] = useState(1);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const createFromPending = useMutation(api.createFromPending.createBusinessFromPendingData);

  const handleUrlSubmit = async () => {
    if (!googleMapsUrl.trim()) {
      setError('Please enter a Google Maps URL');
      return;
    }

    if (!googleMapsUrl.includes('maps.google.com') && !googleMapsUrl.includes('goo.gl/maps')) {
      setError('Please enter a valid Google Maps URL');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use the real Google Maps scraper
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
      setStep(2);
      toast.success('Business information extracted successfully!');
    } catch (error: any) {
      console.error('Error scraping business data:', error);
      setError(error.message || 'Failed to extract business information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSite = async () => {
    if (!businessData) {
      setError('No business data available');
      return;
    }

    setIsLoading(true);

    try {
      // Create the business using the real mutation
      const { businessId, domainId } = await createFromPending({ 
        businessData,
        aiContent: null // No AI content for now
      });
      
      toast.success('Website created successfully!', {
        description: `Your ${businessData.name} website has been created as a draft.`,
      });
      
      // Redirect to the business editor
      router.push(`/business/${businessId}/edit`);
    } catch (error: any) {
      console.error('Error creating site:', error);
      if (error.message?.includes('Unauthorized') || error.message?.includes('logged in')) {
        setError('You must be signed in to create a website. Please sign in and try again.');
      } else {
        setError(error.message || 'Failed to create website. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-muted-foreground/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-muted'
          }`}>
            {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
          </div>
          <span className="text-sm font-medium">Enter URL</span>
        </div>
        
        <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
        
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-muted-foreground/50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-muted'
          }`}>
            {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
          </div>
          <span className="text-sm font-medium">Review & Create</span>
        </div>
      </div>

      {/* Step 1: URL Input */}
      {step === 1 && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Add Google Maps Business
            </CardTitle>
            <CardDescription>
              Enter the Google Maps URL of the business you want to create a website for.
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How to find the Google Maps URL:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Go to Google Maps and search for the business</li>
                <li>Click on the business listing</li>
                <li>Copy the URL from your browser&apos;s address bar</li>
                <li>Paste it in the field above</li>
              </ol>
            </div>

            <Button 
              onClick={handleUrlSubmit} 
              disabled={isLoading || !googleMapsUrl.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Extracting Business Info...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Extract Business Information
                </>
              )}
            </Button>
            
            <div className="text-xs text-muted-foreground text-center">
              <p>⚠️ Note: You'll need a Google Maps API key configured to use this feature</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review & Create */}
      {step === 2 && businessData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Business Information Extracted
              </CardTitle>
              <CardDescription>
                Review the extracted information and create your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Business Name</Label>
                  <p className="text-lg font-semibold text-foreground">{businessData.name}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p className="text-foreground">{businessData.phone || 'Not available'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="text-foreground">{businessData.address}</p>
                </div>
                
                {businessData.website && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Website</Label>
                    <a 
                      href={businessData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {businessData.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                
                {businessData.rating && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
                    <p className="text-foreground">{businessData.rating} ⭐</p>
                  </div>
                )}
              </div>

              {businessData.hours && businessData.hours.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">Business Hours</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                    {businessData.hours.map((hour: string, index: number) => (
                      <p key={index} className="text-foreground">{hour}</p>
                    ))}
                  </div>
                </div>
              )}

              {businessData.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-foreground">{businessData.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Globe className="w-6 h-6 text-green-600 mt-1" />
                <div className="flex-1">
                  <h3 className="font-medium text-green-900 mb-2">Ready to Create Your Website</h3>
                  <p className="text-green-800 text-sm mb-4">
                    We&apos;ll create a professional website using this business information. 
                    You can customize it further after creation.
                  </p>
                  {error && (
                    <Alert className="border-red-200 bg-red-50 mb-4">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <AlertDescription className="text-red-600">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="flex gap-3">
                    <Button onClick={handleCreateSite} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Creating Website...
                        </>
                      ) : (
                        <>
                          <Globe className="w-4 h-4 mr-2" />
                          Create Website
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => {setStep(1); setError('');}} disabled={isLoading}>
                      Back
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}