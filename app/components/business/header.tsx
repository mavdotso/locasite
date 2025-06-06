"use client"
import Link from 'next/link';
import { Doc } from '@/convex/_generated/dataModel';
import { Button } from "@/app/components/ui/button";
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface BusinessHeaderProps {
    pages: Doc<"pages">[]
    currentSlug: string;
    domain: string;
    businessUserId?: string;
}

export default function BusinessHeader({ 
    pages, 
    currentSlug,
    domain,
    businessUserId 
}: BusinessHeaderProps) {
    const currentUser = useQuery(api.helpers.getCurrentUser)
    const isOwner = currentUser?.userId === businessUserId;

    return (
        <header className="sticky top-0 z-50 bg-background shadow-sm">
            <div className="container px-4 py-4 mx-auto">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <h1 className="text-xl font-bold text-primary">{domain}</h1>
                        {isOwner && (
                            <Button asChild size="sm" variant="outline">
                                <Link href={`/${domain}/live-edit`}>
                                    Edit Site
                                </Link>
                            </Button>
                        )}
                    </div>
                    <nav>
                        <ul className="flex flex-wrap gap-2">
                            {pages.map((page) => {
                                const title = (() => {
                                    try {
                                        return JSON.parse(page.content).title || page.slug;
                                    } catch {
                                        return page.slug;
                                    }
                                })();

                                return (
                                    <li key={page._id as string}>
                                        <Button
                                            asChild
                                            variant={currentSlug === page.slug ? "default" : "ghost"}
                                            size="sm"
                                        >
                                            <Link href={`/${page.slug}`}>
                                                {title}
                                            </Link>
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}