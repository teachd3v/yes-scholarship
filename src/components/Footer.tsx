'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, MessageCircle } from 'lucide-react'

const menus = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang-kami" },
    { name: "Program", href: "/program" },
    { name: "Alumni", href: "/alumni" },
    { name: "Blog", href: "/blog" },
];

export default function Footer() {
    return (
        <footer className="bg-[#0f172a] text-white pt-20 pb-10 relative overflow-hidden">
            {/* Background decoration for premium feel */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-8 mb-12 md:mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-1 flex flex-col gap-6">
                        <Link href="/" className="inline-block transition-transform hover:scale-105 duration-300">
                            <Image
                                src="/images/logo-DDGEN.webp"
                                alt="DDGEN Logo"
                                width={180}
                                height={60}
                                className="h-16 w-auto"
                            />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            YES adalah beasiswa terpadu bagi pelajar berprestasi tingkat SMA bagi Yatim, Dhuafa dan Mualaf. Melalui pendampingan kurikulum #ExcellentLeader, cetak generasi cendekia yang berakhlak mulia dan siap memimpin.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-white relative inline-block">
                            Eksplorasi
                            <span className="block w-8 h-1 bg-yellow-400 mt-2 rounded-full"></span>
                        </h3>
                        <ul className="flex flex-col gap-4">
                            {menus.map((menu) => (
                                <li key={menu.href}>
                                    <Link
                                        href={menu.href}
                                        className="text-slate-400 hover:text-white hover:translate-x-2 transition-all inline-flex items-center gap-3 group"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors"></span>
                                        {menu.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-white relative inline-block">
                            Hubungi Kami
                            <span className="block w-8 h-1 bg-yellow-400 mt-2 rounded-full"></span>
                        </h3>
                        <div className="grid grid-cols-1 gap-5">
                            <div className="flex items-start gap-4 group cursor-default">
                                <div className="p-2.5 bg-slate-800/50 rounded-xl group-hover:bg-blue-600/20 transition-colors border border-slate-700/50">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Jl. Parung Bogor Km 42, Jampang, Kemang, Bogor, Jawa Barat.
                                </p>
                            </div>
                            <Link
                                href="https://wa.me/6285691660076"
                                target="_blank"
                                className="flex items-center gap-4 group w-fit"
                            >
                                <div className="p-2.5 bg-slate-800/50 rounded-xl group-hover:bg-green-600/20 transition-colors border border-slate-700/50">
                                    <MessageCircle className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 uppercase font-bold tracking-widest leading-tight">WhatsApp</span>
                                    <span className="text-slate-300 font-medium group-hover:text-blue-400 transition-colors">+62 856-9166-0076</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm font-medium text-center md:text-left">
                        © 2026 <span className="text-slate-400">Transformative EduAction Hub</span>. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {/* Optional social icons could be added here later */}
                    </div>
                </div>
            </div>
        </footer>
    )
}
