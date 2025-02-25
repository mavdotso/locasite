import { query } from './_generated/server';
import { v } from 'convex/values';

export const getBySlug = query({
    args: {
        domain: v.string(),
        slug: v.string()
    },
    handler: async (ctx, args) => {
        const domain = await ctx.db
            .query('domains')
            .withIndex('by_subdomain', q => q.eq('subdomain', args.domain))
            .first();

        if (!domain) return null;

        return await ctx.db
            .query('pages')
            .withIndex('by_domain_slug', q =>
                q.eq('domainId', domain._id)
                    .eq('slug', args.slug)
            )
            .first();
    }
});