import { api } from '@/convex/_generated/api';
import { fetchQuery } from 'convex/nextjs';

export default async function TenantPage({
    params,
}: {
    params: { tenant: string; slug: string[] }
}) {
    const preloaded = await fetchQuery(api.pages.getBySlug, {
        tenant: params.tenant,
        slug: params.slug?.join('/') || 'home'
    });

    return (
        <div className="p-6">
            <h1 className="font-bold text-2xl">{params.tenant}</h1>
            {preloaded?.content ?? "No content found"}
        </div>
    );
}
