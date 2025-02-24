import { query } from './_generated/server';
import { v } from 'convex/values';

export const getBySlug = query({
    args: {
        tenant: v.string(),
        slug: v.string()
    },
    handler: async (ctx, args) => {
        const tenant = await ctx.db
            .query('tenants')
            .withIndex('by_subdomain', q => q.eq('subdomain', args.tenant))
            .first();

        if (!tenant) return null;

        return await ctx.db
            .query('pages')
            .withIndex('by_tenant_slug', q =>
                q.eq('tenantId', tenant._id)
                    .eq('slug', args.slug)
            )
            .first();
    }
});