"use client"
import { useState } from "react";
import Scraper from "../components/scraper";
import SiteGenerator from "../components/site-generator";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { ArrowDown } from "lucide-react";

export default function HomePage() {
    const [scrapedBusinessId, setScrapedBusinessId] = useState<Id<"businesses"> | null>(null);

    return (
        <div className="bg-gray-50 py-12 min-h-screen">
            <div className="mx-auto px-4 max-w-4xl container">
                <div className="mb-10 text-center">
                    <h1 className="font-bold text-4xl tracking-tight">Business Site Generator</h1>
                    <p className="mt-3 text-muted-foreground text-lg">
                        Create a professional website for your business in minutes
                    </p>
                </div>

                <Card className="shadow-md mb-10 border-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex justify-center items-center bg-primary rounded-full w-7 h-7 font-medium text-primary-foreground text-sm">1</span>
                            Import Business Information
                        </CardTitle>
                        <CardDescription>
                            Enter a Google Maps URL to automatically import business details
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Scraper onBusinessCreated={(businessId) => setScrapedBusinessId(businessId)} />
                    </CardContent>
                </Card>

                {scrapedBusinessId ? (
                    <Card className="shadow-md border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="flex justify-center items-center bg-primary rounded-full w-7 h-7 font-medium text-primary-foreground text-sm">2</span>
                                Generate Website
                            </CardTitle>
                            <CardDescription>
                                Choose a subdomain and create your business website
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SiteGenerator businessId={scrapedBusinessId} />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="opacity-50 py-8 text-center">
                        <ArrowDown className="mx-auto mb-4 w-8 h-8 animate-bounce" />
                        <p className="text-muted-foreground">Complete step 1 to continue</p>
                    </div>
                )}
            </div>
        </div>
    );
}