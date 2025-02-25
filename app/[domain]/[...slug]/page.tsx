import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';

interface DomainProps {
    params: Promise<{ domain: string; slug: string[] }>
}

export default async function DomainPage({ params }: DomainProps) {
    const { domain, slug: slugArray } = await params;

    const preloaded = await fetchQuery(api.pages.getBySlug, {
        tenant: domain,
        slug: slugArray?.join('/') || 'home'
    });

    return (
        <div className="p-6">
            <h1 className="font-bold text-2xl">{domain}</h1>
            {preloaded?.content ?? "No content found"}
        </div>
    );
}