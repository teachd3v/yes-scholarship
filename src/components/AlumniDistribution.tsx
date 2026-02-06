'use client';

import React from 'react';
import Link from 'next/link';
import { urlFor } from '@/sanity/image';

interface Alumni {
    name: string;
    major: string;
    batch: string;
}

interface PTN {
    _id: string;
    name: string;
    logo: any;
    region: string;
    alumni: Alumni[];
    totalAlumni?: number;
}

interface AlumniDistributionProps {
    ptns: PTN[];
}

export default function AlumniDistribution({ ptns }: AlumniDistributionProps) {
    // Sort logic handled in parent or assume simple list passed
    const topPtns = ptns.slice(0, 3);

    return (
        <section className="bg-slate-50 py-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Jejak Langkah</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Sebaran Alumni di PTN</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Para penerima manfaat YES telah berhasil menembus berbagai Perguruan Tinggi Negeri terbaik di Indonesia.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {topPtns.map((ptn) => (
                        <div key={ptn._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition">
                            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                                {ptn.logo ? (
                                    <img
                                        src={urlFor(ptn.logo).width(60).height(60).url()}
                                        alt={ptn.name}
                                        className="w-12 h-12 object-contain"
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-xs text-slate-500">Logo</div>
                                )}
                                <div>
                                    <h3 className="font-bold text-slate-900">{ptn.name}</h3>
                                    <span className="text-xs text-slate-500">{ptn.region}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alumni</h4>
                                <ul className="space-y-3">
                                    {ptn.alumni?.slice(0, 5).map((alum, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                            <div>
                                                <div className="font-bold text-slate-800">{alum.name}</div>
                                                <div className="text-xs text-slate-500">{alum.major} - Angkatan {alum.batch}</div>
                                            </div>
                                        </li>
                                    ))}
                                    {ptn.alumni?.length > 5 && (
                                        <li className="text-xs text-blue-600 italic pt-1">
                                            + {ptn.alumni.length - 5} alumni lainnya...
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/alumni"
                        className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition"
                    >
                        <span>Lihat Sebaran Lengkap</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
