import { safeFetch, client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    if (!client) return [{ slug: '_placeholder' }];
    try {
        const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`);
        const params = (posts || []).map((post: any) => ({ slug: post.slug }));
        return params.length > 0 ? params : [{ slug: '_placeholder' }];
    } catch {
        return [{ slug: '_placeholder' }];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    if (slug === '_placeholder') {
        return { title: "Blog | YES Scholarship" };
    }
    const post = await getBlogPost(slug);

    if (!post) {
        return {
            title: "Artikel Tidak Ditemukan",
            description: "Artikel yang Anda cari tidak tersedia.",
        };
    }

    const ogImage = post.image ? urlFor(post.image).width(1200).height(630).url() : "/images/logo-yes.png";

    return {
        title: post.title,
        description: post.description || "Baca artikel terbaru dari Youth Ekselensia Scholarship via blog kami.",
        openGraph: {
            title: post.title,
            description: post.description || "Baca artikel terbaru dari Youth Ekselensia Scholarship.",
            url: `https://www.youthekselensia.id/blog/${slug}`,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
            type: "article",
        },
    };
}

async function getBlogPost(slug: string) {
    return await safeFetch<any>(
        `*[_type == "post" && slug.current == $slug][0]`,
        { slug }
    );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post || slug === '_placeholder') {
        return notFound();
    }

    // Dynamic import PortableText
    const { PortableText } = await import('@portabletext/react');

    const formattedDate = new Date(post.pubDate).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const ptComponents = {
        block: {
            h1: ({ children }: any) => <h1 className="text-3xl font-bold text-blue-900 mt-8 mb-4">{children}</h1>,
            h2: ({ children }: any) => <h2 className="text-2xl font-bold text-blue-900 mt-8 mb-4">{children}</h2>,
            h3: ({ children }: any) => <h3 className="text-xl font-bold text-blue-900 mt-6 mb-3">{children}</h3>,
            normal: ({ children }: any) => <p className="text-slate-600 leading-relaxed mb-6">{children}</p>,
            blockquote: ({ children }: any) => (
                <blockquote className="border-l-4 border-yellow-400 bg-yellow-50 py-4 px-6 rounded-r-lg italic text-slate-700 my-8">
                    {children}
                </blockquote>
            ),
        },
        list: {
            bullet: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-slate-600">{children}</ul>,
            number: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-slate-600">{children}</ol>,
        },
        marks: {
            link: ({ children, value }: any) => (
                <a href={value.href} className="text-blue-600 font-semibold no-underline hover:underline">
                    {children}
                </a>
            ),
            strong: ({ children }: any) => <strong className="text-blue-900 font-bold">{children}</strong>,
        },
        types: {
            image: ({ value }: any) => (
                <div className="my-8">
                    <img
                        src={urlFor(value).url()}
                        alt={value.alt || 'Blog Image'}
                        className="rounded-2xl shadow-md w-full"
                    />
                </div>
            ),
        },
    };

    return (
        <main className="bg-[#F8F9FB] min-h-screen pb-20">
            <header className="relative w-full h-[450px] overflow-hidden rounded-b-[2.5rem] shadow-xl group">
                <img
                    src={typeof post.image === 'string' ? post.image : urlFor(post.image).url()}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full max-w-4xl mx-auto p-8 md:p-12 text-white z-10">
                    <div className="bg-yellow-400 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full inline-block mb-6 uppercase tracking-widest shadow-lg shadow-yellow-400/20">
                        {post.tags?.[0] || 'Artikel'}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 drop-shadow-sm">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 text-sm md:text-base text-blue-100 font-medium">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                            <span>{post.author}</span>
                        </div>
                        <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0117.25 3v1.5h3a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-3v1.5a.75.75 0 01-1.5 0v-1.5h-9v1.5a.75.75 0 01-1.5 0v-1.5h-3a2.25 2.25 0 01-2.25-2.25v-9A2.25 2.25 0 015.25 4.5h3V3A.75.75 0 016.75 2.25z" clipRule="evenodd" />
                            </svg>
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>
            </header>

            <article className="relative z-20 bg-white max-w-4xl mx-auto -mt-10 px-6 py-16 md:px-12 md:py-20 rounded-[2.5rem] shadow-xl border border-slate-100">
                <div className="prose prose-lg prose-slate max-w-none">
                    <PortableText value={post.body} components={ptComponents} />
                </div>

                <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <Link href="/blog" className="group flex items-center gap-3 text-slate-500 font-bold hover:text-blue-900 transition">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-100 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </div>
                        Kembali ke Blog
                    </Link>
                </div>
            </article>
        </main>
    );
}
