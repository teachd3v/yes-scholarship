import { Studio } from './Studio'

export const runtime = 'edge';

// Required for static export to work with dynamic routes
export function generateStaticParams() {
    // Export just the index route for the studio
    return [{ tool: [] }];
}

export default function AdminPage() {
    return <Studio />
}
