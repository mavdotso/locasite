"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { CheckCircle, AlertCircle } from "lucide-react";

interface SiteGeneratorProps {
    businessId: Id<"businesses">;
}

export default function SiteGenerator({ businessId }: SiteGeneratorProps) {
    const [subdomain, setSubdomain] = useState("");
    const [customSubdomain, setCustomSubdomain] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const generateSubdomain = useMutation(api.domains.generateSubdomain);
    const createDefaultPages = useMutation(api.pages.createDefaultPages);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setError(null);
        setSuccess(false);

        try {
            // Generate subdomain
            const { domainId, subdomain: generatedSubdomain } = await generateSubdomain({
                businessId,
                customSubdomain: customSubdomain || undefined,
            });

            // Set the generated subdomain for display
            setSubdomain(generatedSubdomain);

            // Create default pages
            await createDefaultPages({
                domainId,
                businessId,
            });

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate site");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle>Generate Business Website</CardTitle>
                <CardDescription>
                    Create a custom website for your business with a unique subdomain
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="customSubdomain">Custom Subdomain (Optional)</Label>
                    <div className="flex items-center">
                        <Input
                            id="customSubdomain"
                            value={customSubdomain}
                            onChange={(e) => setCustomSubdomain(e.target.value)}
                            className="rounded-r-none"
                            placeholder="mybusiness"
                            disabled={isGenerating}
                        />
                        <div className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">
                            {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                        </div>
                    </div>
                    <p className="text-muted-foreground text-xs">
                        Leave empty to generate automatically from business name
                    </p>
                </div>

                <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full"
                >
                    {isGenerating ? "Generating..." : "Generate Website"}
                </Button>

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="w-4 h-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>
                            <p>Website successfully generated!</p>
                            <p className="mt-2">
                                Your site is available at:
                                <a
                                    href={`https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-1 font-medium text-primary hover:underline"
                                >
                                    {subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                                </a>
                            </p>
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
}