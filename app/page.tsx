"use client"
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { ArrowDown } from "lucide-react";
import SiteGenerator from "./components/site-generator";
import Scraper from "./components/scraper";

export default function HomePage() {
    const [scrapedBusinessId, setScrapedBusinessId] = useState<Id<"businesses"> | null>(null);
    
    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="container max-w-4xl px-4 mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Business Site Generator</h1>
                    <p className="mt-3 text-lg text-muted-foreground">
                        Create a professional website for your business in minutes
                    </p>
                </div>

                <Card className="mb-10 border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="flex items-center justify-center text-sm font-medium rounded-full bg-primary w-7 h-7 text-primary-foreground">1</span>
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
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span className="flex items-center justify-center text-sm font-medium rounded-full bg-primary w-7 h-7 text-primary-foreground">2</span>
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
                    <div className="py-8 text-center opacity-50">
                        <ArrowDown className="w-8 h-8 mx-auto mb-4 animate-bounce" />
                        <p className="text-muted-foreground">Complete step 1 to continue</p>
                    </div>
                )}
            </div>
        </div>
    );
}