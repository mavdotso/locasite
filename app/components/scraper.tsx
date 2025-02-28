"use client";

import { Id } from '@/convex/_generated/dataModel';
import { BusinessData } from '@/convex/businesses';
import { useState } from 'react';

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
        <div className="mx-auto p-4 max-w-2xl">
            <h1 className="mb-4 font-bold text-2xl">Business Data Scraper</h1>

            <div className="mb-4">
                <label htmlFor="url" className="block mb-2">
                    Google Maps URL:
                </label>
                <input
                    type="text"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.google.com/maps/place/..."
                    className="p-2 border rounded w-full"
                />
            </div>

            <button
                onClick={handleScrape}
                disabled={loading || !url}
                className="bg-blue-600 disabled:bg-blue-300 px-4 py-2 rounded text-white"
            >
                {loading ? 'Scraping...' : 'Scrape Data'}
            </button>

            {error && (
                <div className="bg-red-100 mt-4 p-3 rounded text-red-700">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-4">
                    <h2 className="mb-2 font-semibold text-xl">Scraped Data:</h2>
                    <pre className="p-4 rounded overflow-x-auto">
                        {JSON.stringify(result, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}