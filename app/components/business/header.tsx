"use client"
import Link from 'next/link';
import { Doc } from '@/convex/_generated/dataModel';
import { Button } from "@/app/components/ui/button";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface BusinessHeaderProps {
    pages: Doc<"pages">[]
    domain: string;
    businessUserId?: string;
}

export default function BusinessHeader({ 
    pages, 
    domain,
    businessUserId 
}: BusinessHeaderProps) {
    const currentUser = useQuery(api.auth.currentUser)
    const isOwner = currentUser?._id === businessUserId;
    const page = pages[0]; // Single page site

    const title = page ? (() => {
        try {
            return JSON.parse(page.content).title || domain;
        } catch {
            return domain;
        }
    })() : domain;

    return (
        <header className="sticky top-0 z-50 bg-background shadow-sm">
            <div className="container px-4 py-4 mx-auto">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-primary">{title}</h1>
                    {isOwner && page && (
                        <Button asChild size="sm" variant="outline">
                            <Link href={`/${domain}/edit`}>
                                Edit Site
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}