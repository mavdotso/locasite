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
        <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Generate Business Website</h2>

            <div className="mb-4">
                <label htmlFor="customSubdomain" className="block text-sm font-medium mb-1">
                    Custom Subdomain (Optional)
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        id="customSubdomain"
                        value={customSubdomain}
                        onChange={(e) => setCustomSubdomain(e.target.value)}
                        className="flex-1 p-2 border rounded-l-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="mybusiness"
                        disabled={isGenerating}
                    />
                    <span className="bg-gray-100 p-2 text-gray-500 border-y border-r rounded-r-md">
                        .yourdomain.com
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Leave empty to generate automatically from business name
                </p>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
                {isGenerating ? "Generating..." : "Generate Website"}
            </button>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {success && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                    <p className="font-medium">Website successfully generated!</p>
                    <p className="mt-2">
                        Your site is available at:
                        <a
                            href={`https://${subdomain}.yourdomain.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block mt-1 text-blue-600 underline"
                        >
                            {subdomain}.yourdomain.com
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
}