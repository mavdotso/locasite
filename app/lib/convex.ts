import { ConvexClient, ConvexHttpClient } from 'convex/browser';

export function createClient() {
    const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL || '');
    return client;
}

export const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);