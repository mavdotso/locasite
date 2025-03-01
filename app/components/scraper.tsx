"use client";

import { Id } from '@/convex/_generated/dataModel';
import { BusinessData } from '@/convex/businesses';
import { useState } from 'react';
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { Card, CardContent } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";

interface ScraperProps {
    onBusinessCreated?: (businessId: Id<"businesses">) => void;
}

export default function Scraper({ onBusinessCreated }: ScraperProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<BusinessData | null>(null);
    const [error, setError] = useState<string | null>(null);

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
            const response = await fetch('/api/scrape', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to scrape data');
            }

            setResult(data.data);

            if (onBusinessCreated && data.businessId) {
                onBusinessCreated(data.businessId);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

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

            {result && (
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="mb-2 font-medium text-lg">Scraped Business Data:</h3>
                        <div className="bg-muted/50 p-4 rounded-md max-h-[400px] overflow-auto">
                            <pre className="font-mono text-sm">
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}