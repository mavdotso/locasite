import { ConvexClient } from 'convex/browser';

export function createClient() {
    const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');
    return client;
}