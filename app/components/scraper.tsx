"use client";

import { BusinessData } from '@/convex/businesses';
import { useState } from 'react';
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Label } from "@/app/components/ui/label";
import BusinessPreviewCard from "./business-preview-card";

export default function Scraper() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<BusinessData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    async function handleScrape() {
        setLoading(true);
        setError(null);
    
        // Validate that the URL is a Google Maps URL
        const googleMapsRegex = /^https:\/\/(www\.)?google\.com\/maps\/(place|search)/;
        if (!googleMapsRegex.test(url)) {
            setError('Please enter a valid Google Maps URL');
            setLoading(false);
            return;
        }
    
        try {
            // Get the Convex deployment URL
            const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || '';
            // Extract deployment name from the URL (e.g., "careful-emu-235" from "https://careful-emu-235.convex.cloud")
            const deploymentName = convexUrl.split('//')[1]?.split('.')[0];
            const convexSiteUrl = `https://${deploymentName}.convex.site`;
            
            console.log(`Calling Convex endpoint: ${convexSiteUrl}/scrape`);
            
            const response = await fetch(`${convexSiteUrl}/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, preview: true }), // Always preview mode now
            });
    
            // Check if response is JSON before trying to parse it
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Received non-JSON response:', text);
                throw new Error(`Received non-JSON response: ${text.substring(0, 100)}...`);
            }
    
            const data = await response.json();
            console.log('Response data:', data);
    
            if (!response.ok) {
                throw new Error(data.error || 'Failed to scrape data');
            }
    
            setResult(data.data);
            setShowPreview(true);
        } catch (err) {
            console.error('Error during scrape:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }


    // Show preview if we have scraped data
    if (showPreview && result) {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Website Preview</h2>
                    <p className="text-muted-foreground">
                        Review your business information before continuing
                    </p>
                </div>
                
                <BusinessPreviewCard 
                    businessData={result}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="url">Google Maps URL</Label>
                    <div className="flex gap-2">
                        <Input
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://www.google.com/maps/place/..."
                            className="flex-1"
                        />
                        <Button
                            onClick={handleScrape}
                            disabled={loading || !url}
                        >
                            {loading ? 'Scraping...' : 'Scrape Data'}
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    );
}