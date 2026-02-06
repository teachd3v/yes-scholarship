import React from 'react'
import Link from 'next/link'
import { urlFor } from '@/sanity/image'

interface Post {
    title: string;
    description: string;
    image: any;
    tags?: string[];
    pubDate: string;
}

interface LatestBlogProps {
    posts: Post[];
}

export default function LatestBlog({ posts }: LatestBlogProps) {
    return (
        <section className="py-16 px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Kabar Terbaru</h2>
                <Link href="/blog" className="text-blue-900 font-bold hover:underline">
                    Lihat Semua Artikel &rarr;
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                    <article
                        key={index}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group border border-slate-100"
                    >
                        <div className="h-48 overflow-hidden">
                            <img
                                src={typeof post.image === 'string' ? post.image : urlFor(post.image).url()}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>
                        <div className="p-6">
                            <div className="text-xs font-bold text-yellow-600 mb-2 uppercase">
                                {post.tags?.[0] || 'Berita'}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-900 transition">
                                {post.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2">{post.description}</p>
                        </div>
                    </article>
                ))}
                {posts.length === 0 && <p className="text-slate-500">Belum ada artikel terbaru.</p>}
            </div>
        </section>
    );
}