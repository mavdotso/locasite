"use client"
import { useState } from "react";
import Scraper from "../components/scraper";
import SiteGenerator from "../components/site-generator";
import { Id } from "@/convex/_generated/dataModel";


export default function HomePage() {
    const [scrapedBusinessId, setScrapedBusinessId] = useState<Id<"businesses"> | null>(null);

    return (
        <div className="mx-auto py-8 container">
            <h1 className="mb-8 font-bold text-3xl text-center">Business Site Generator</h1>

            <div className="mb-12">
                <h2 className="mb-4 font-bold text-2xl">Step 1: Import Business Information</h2>
                <Scraper onBusinessCreated={(businessId) => setScrapedBusinessId(businessId)} />
            </div>

            {scrapedBusinessId && (
                <div className="mt-12 pt-12 border-t">
                    <h2 className="mb-4 font-bold text-2xl">Step 2: Generate Website</h2>
                    <SiteGenerator businessId={scrapedBusinessId} />
                </div>
            )}
        </div>
    );
}