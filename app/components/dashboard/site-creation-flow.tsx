'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

export default function SiteCreationFlow() {
  const [step, setStep] = useState(1);
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

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
      // TODO: Implement actual scraping
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock business data
      const mockBusinessData = {
        name: 'Sample Business',
        address: '123 Main St, City, State 12345',
        phone: '(555) 123-4567',
        website: 'https://example.com',
        hours: [
          'Monday: 9:00 AM - 5:00 PM',
          'Tuesday: 9:00 AM - 5:00 PM',
          'Wednesday: 9:00 AM - 5:00 PM',
          'Thursday: 9:00 AM - 5:00 PM',
          'Friday: 9:00 AM - 5:00 PM',
          'Saturday: 10:00 AM - 4:00 PM',
          'Sunday: Closed'
        ],
        rating: 4.5,
        reviews: [],
        photos: [],
        description: 'A sample business description'
      };

      setBusinessData(mockBusinessData);
      setStep(2);
      toast.success('Business information extracted successfully!');
    } catch (error) {
      console.error('Error scraping business data:', error);
      setError('Failed to extract business information. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSite = async () => {
    setIsLoading(true);

    try {
      // TODO: Implement actual site creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Website created successfully!');
      router.push('/dashboard/sites');
    } catch (error) {
      console.error('Error creating site:', error);
      toast.error('Failed to create website. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}>
            {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
          </div>
          <span className="text-sm font-medium">Enter URL</span>
        </div>
        
        <ArrowRight className="w-4 h-4 text-gray-400" />
        
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
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
                  <Label className="text-sm font-medium text-gray-700">Business Name</Label>
                  <p className="text-lg font-semibold text-gray-900">{businessData.name}</p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-gray-900">{businessData.phone || 'Not available'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                  <p className="text-gray-900">{businessData.address}</p>
                </div>
                
                {businessData.website && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Website</Label>
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
                    <Label className="text-sm font-medium text-gray-700">Rating</Label>
                    <p className="text-gray-900">{businessData.rating} ⭐</p>
                  </div>
                )}
              </div>

              {businessData.hours && businessData.hours.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Business Hours</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                    {businessData.hours.map((hour: string, index: number) => (
                      <p key={index} className="text-gray-900">{hour}</p>
                    ))}
                  </div>
                </div>
              )}

              {businessData.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-gray-900">{businessData.description}</p>
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
                    <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading}>
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