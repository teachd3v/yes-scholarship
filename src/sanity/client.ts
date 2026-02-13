import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

// Create a client that gracefully handles missing config
export const client = projectId
    ? createClient({
        projectId,
        dataset,
        apiVersion: '2024-02-03',
        useCdn: false,
    })
    : null

// Safe fetch wrapper that returns fallback when Sanity is not configured
export async function safeFetch<T = any>(query: string, params?: Record<string, unknown>): Promise<T> {
    if (!client) {
        console.warn('[Sanity] Client not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
        return [] as unknown as T
    }
    try {
        return await client.fetch(query, params)
    } catch (error) {
        console.error('[Sanity] Fetch error:', error)
        return [] as unknown as T
    }
}
