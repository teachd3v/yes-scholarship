import Link from 'next/link';
import { safeFetch } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';

async function getPrograms() {
    return safeFetch(groq`*[_type == "program"]{
        _id,
        title,
        desc,
        icon,
        image,
        features
    }`);
}

export const revalidate = 60;

export default async function ProgramPage() {
    const programs = await getPrograms();

    return (
        <main className="bg-[#F8F9FB] min-h-screen pb-20">
            <section className="bg-blue-900 text-white pt-20 pb-24 px-6 rounded-b-[2.5rem] text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Program Unggulan</h1>
                <p className="text-blue-200 max-w-2xl mx-auto text-lg">Kurikulum komprehensif untuk mencetak pemimpin berkarakter dan berprestasi.</p>
            </section>

            <section className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((prog: any, index: number) => (
                        <div key={index} className="bg-white rounded-[2rem] shadow-lg border border-slate-100 hover:shadow-xl transition duration-300 group overflow-hidden flex flex-col">
                            {/* Image Placeholder */}
                            <div className="h-48 bg-slate-200 w-full relative">
                                {prog.image ? (
                                    <img
                                        src={urlFor(prog.image).width(400).height(200).url()}
                                        alt={prog.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                                        <span className="sr-only">{prog.title} Image</span>
                                        FOTO KEGIATAN
                                    </div>
                                )}
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-yellow-400 transition duration-300">
                                        {prog.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight">{prog.title}</h3>
                                </div>

                                <p className="text-slate-600 mb-6 text-sm leading-relaxed">{prog.desc}</p>

                                <div className="space-y-2 border-t border-slate-100 pt-6 mt-auto">
                                    {prog.features && prog.features.map((feat: string, fIndex: number) => (
                                        <div key={fIndex} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                            {feat}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-4xl mx-auto text-center mt-20 px-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Siap Mengembangkan Diri?</h2>
                <Link href="/pendaftaran" className="inline-block bg-blue-900 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
                    Daftar Sekarang
                </Link>
            </section>
        </main>
    );
}
