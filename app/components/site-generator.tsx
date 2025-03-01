"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
        <div className="shadow-md mx-auto p-6 rounded-lg max-w-md">
            <h2 className="mb-4 font-bold text-2xl">Generate Business Website</h2>

            <div className="mb-4">
                <label htmlFor="customSubdomain" className="block mb-1 font-medium text-sm">
                    Custom Subdomain (Optional)
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customSubdomain"
                        value={customSubdomain}
                        onChange={(e) => setCustomSubdomain(e.target.value)}
                        className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="mybusiness"
                        disabled={isGenerating}
                    />
                    <span className="bg-gray-100 p-2 border-y border-r rounded-r-md text-gray-500">
                        {process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                    </span>
                </div>
                <p className="mt-1 text-gray-500 text-xs">
                    Leave empty to generate automatically from business name
                </p>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 px-4 py-2 rounded-md w-full text-white"
            >
                {isGenerating ? "Generating..." : "Generate Website"}
            </button>

            {error && (
                <div className="bg-red-100 mt-4 p-3 rounded-md text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 mt-4 p-4 rounded-md text-green-800">
                    <p className="font-medium">Website successfully generated!</p>
                    <p className="mt-2">
                        Your site is available at:
                        <a
                            href={`https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-1 text-blue-600 underline"
                        >
                            {subdomain}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}