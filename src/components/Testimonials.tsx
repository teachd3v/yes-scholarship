'use client';

import React from 'react';
import { urlFor } from '@/sanity/image';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    quote: string;
    avatar?: any;
}

interface TestimonialsProps {
    testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
    if (!testimonials || testimonials.length === 0) {
        return null; // Don't render if no testimonials
    }

    return (
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-16 md:pb-20 pt-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-slate-900">Kata Alumni</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {testimonials.map((testi) => (
                    <div key={testi._id} className="bg-white p-5 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition">
                        <div className="text-yellow-400 text-4xl font-serif mb-4">“</div>
                        <p className="text-slate-600 mb-6 italic">{testi.quote}</p>
                        <div className="flex items-center gap-4">
                            {testi.avatar ? (
                                <img
                                    src={urlFor(testi.avatar).width(80).height(80).url()}
                                    alt={testi.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                            )}
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{testi.name}</h4>
                                <p className="text-xs text-slate-500">{testi.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
