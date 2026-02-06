import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';
import React from 'react';

// Re-use types if possible, or define here
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

export const metadata = {
    title: 'Sebaran Alumni | YES Scholarship',
    description: 'Daftar alumni penerima beasiswa YES yang tersebar di berbagai Perguruan Tinggi Negeri di Indonesia.',
};

async function getPtns() {
    return client.fetch(groq`*[_type == "ptn"] | order(name asc) {
        _id,
        name,
        logo,
        region,
        alumni,
        totalAlumni
    }`);
}

export default async function AlumniPage() {
    const ptns: PTN[] = await getPtns();

    return (
        <main className="bg-[#F8F9FB] min-h-screen">
            <section className="bg-blue-900 text-white pt-32 pb-20 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-[100px] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <span className="text-yellow-400 font-bold tracking-widest uppercase text-sm mb-4 block">JEJAK LANGKAH</span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Sebaran Alumni di PTN</h1>
                    <p className="text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed">
                        Kami bangga mengantarkan putra-putri terbaik bangsa melanjutkan pendidikan di kampus-kampus terbaik di seluruh Indonesia.
                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20">
                {ptns.length > 0 ? (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {ptns.map((ptn) => (
                            <div key={ptn._id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition group">
                                <div className="flex flex-col items-center text-center mb-6 border-b border-slate-100 pb-6">
                                    <div className="w-20 h-20 bg-white rounded-full p-2 shadow-sm mb-4 flex items-center justify-center border border-slate-50 group-hover:scale-110 transition duration-300">
                                        {ptn.logo ? (
                                            <img
                                                src={urlFor(ptn.logo).width(120).height(120).url()}
                                                alt={ptn.name}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="text-xs text-slate-400">No Logo</div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">{ptn.name}</h3>
                                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{ptn.region}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <span>Daftar Alumni</span>
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">{ptn.alumni?.length || 0}</span>
                                    </div>
                                    {ptn.alumni && ptn.alumni.length > 0 ? (
                                        <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                            {ptn.alumni.map((alum, idx) => (
                                                <li key={idx} className="flex gap-3 text-sm group/item">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 group-hover/item:bg-blue-600 group-hover/item:text-white transition">
                                                        {alum.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{alum.name}</div>
                                                        <div className="text-xs text-slate-500">{alum.major} <span className="text-slate-300">•</span> {alum.batch}</div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-slate-400 italic text-center py-4">Belum ada data alumni.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <p className="text-slate-500 text-lg">Belum ada data kampus yang ditambahkan.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
