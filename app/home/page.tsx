"use client"
import { useState } from "react";
import Scraper from "../components/scraper";
import SiteGenerator from "../components/site-generator";
import { Id } from "@/convex/_generated/dataModel";


export default function HomePage() {
    const [scrapedBusinessId, setScrapedBusinessId] = useState<Id<"businesses"> | null>(null);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Business Site Generator</h1>

            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Step 1: Import Business Information</h2>
                <Scraper onBusinessCreated={(businessId) => setScrapedBusinessId(businessId)} />
            </div>

            {scrapedBusinessId && (
                <div className="mt-12 pt-12 border-t">
                    <h2 className="text-2xl font-bold mb-4">Step 2: Generate Website</h2>
                    <SiteGenerator businessId={scrapedBusinessId} />
                </div>
            )}
        </div>
    );
}