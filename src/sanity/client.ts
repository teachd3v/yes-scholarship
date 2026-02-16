import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-02-03'

// Read-only client (public, no token) - for fetching CMS content
export const client = projectId
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        useCdn: false,
    })
    : null

// Write client (with token) - for mutations & authenticated queries
export const writeClient = projectId
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token: process.env.SANITY_API_TOKEN,
        useCdn: false,
    })
    : null

// Safe fetch wrapper that returns fallback when Sanity is not configured
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
