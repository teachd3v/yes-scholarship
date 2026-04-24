import { urlFor } from '@/sanity/image'
import React from 'react'

interface Partner {
    name: string;
    logo: any;
}

interface PartnersProps {
    partners: Partner[];
}

export default function Partners({ partners }: PartnersProps) {
    return (
        <section className="py-12 md:py-16 px-4 md:px-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Mitra & Kolaborator Program</p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-16 opacity-70 hover:opacity-100 transition duration-500">
                {partners?.map((p, index) => (
                    <div key={index} className="h-16 md:h-24 flex items-center justify-center">
                        <img
                            src={typeof p.logo === 'string' ? p.logo : urlFor(p.logo).url()}
                            alt={p.name}
                            className="max-h-full w-auto object-contain mix-blend-multiply"
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}