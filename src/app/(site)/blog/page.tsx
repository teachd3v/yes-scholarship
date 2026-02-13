import Link from 'next/link';
import { safeFetch } from '@/sanity/client';
import { urlFor } from '@/sanity/image';

// export const dynamic = 'force-dynamic'; // Default to static for export
// export const revalidate = 0; 
// export const runtime = 'edge'; 

const MOCK_BLOG_POSTS = [
    {
        title: "Kisah Inspiratif: Dari Desa ke Kampus Impian",
        slug: "kisah-inspiratif",
        description: "Perjalanan salah satu penerima beasiswa YES dalam meraih mimpi melanjutkan pendidikan tinggi.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
        tags: ["Inspirasi"],
        pubDate: "2026-01-20",
        author: "Tim YES"
    },
    {
        title: "Tips Lolos Seleksi Beasiswa YES 2026",
        slug: "tips-lolos-seleksi",
        description: "Hal-hal penting yang perlu dipersiapkan untuk menghadapi tahapan seleksi beasiswa.",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop",
        tags: ["Tips"],
        pubDate: "2026-01-15",
        author: "Admin YES"
    }
];

async function getBlogPosts() {
    return await safeFetch(`*[_type == "post"] | order(pubDate desc) {
        title,
        "slug": slug.current,
        description,
        image,
        tags,
        pubDate,
        author
    }`);
}

export default async function BlogIndex() {
    const postsFromSanity = await getBlogPosts();
    const posts = postsFromSanity?.length > 0 ? postsFromSanity : MOCK_BLOG_POSTS;

    return (
        <main className="bg-[#F8F9FB] min-h-screen pb-20">
            <section className="bg-blue-900 text-white pt-20 pb-24 px-6 text-center rounded-b-[2.5rem]">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Wawasan & Inspirasi</h1>
                <p className="text-blue-200 text-lg max-w-2xl mx-auto">Kumpulan artikel, tips lulus PTN, dan kisah sukses alumni.</p>
            </section>

            <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
                <div className="grid md:grid-cols-3 gap-8">
                    {posts.map((post: any) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="bg-white rounded-[2rem] overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition duration-300 group flex flex-col h-full"
                        >
                            <div className="h-56 overflow-hidden relative">
                                <img
                                    src={typeof post.image === 'string' ? post.image : urlFor(post.image).url()}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-blue-900 uppercase">
                                    {post.tags?.[0] || 'Umum'}
                                </div>
                            </div>

                            <div className="p-8 flex flex-col flex-grow">
                                <div className="text-sm text-slate-400 mb-3 flex gap-2">
                                    <span>{new Date(post.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    <span>•</span>
                                    <span>{post.author}</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition">
                                    {post.title}
                                </h2>
                                <p className="text-slate-600 text-sm line-clamp-3 mb-6">
                                    {post.description}
                                </p>
                                <span className="mt-auto text-blue-900 font-bold text-sm flex items-center gap-1">
                                    Baca Selengkapnya &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
