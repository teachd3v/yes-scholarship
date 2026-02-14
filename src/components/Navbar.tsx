'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const menus = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang-kami" },
    { name: "Program", href: "/program" },
    { name: "Alumni", href: "/alumni" },
    { name: "Blog", href: "/blog" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    };

    const closeMenu = () => {
        setIsOpen(false);
        document.body.classList.remove('overflow-hidden');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200" id="navbar">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex justify-between items-center bg-white relative z-50">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/images/logo-yes.png"
                            alt="YES Logo"
                            width={150}
                            height={40}
                            priority
                            style={{ height: '2.5rem', width: 'auto' }}
                        />
                    </Link>

                    <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600 items-center">
                        {menus.map((menu) => (
                            <Link
                                key={menu.href}
                                href={menu.href}
                                className="hover:text-blue-900 transition relative group"
                            >
                                {menu.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                        <Link
                            href="/pendaftaran"
                            className="bg-blue-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
                        >
                            Daftar YES 2026
                        </Link>
                    </div>

                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-blue-900 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {!isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 transition-transform duration-300">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 transition-transform duration-300 rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            <div
                className={`fixed inset-0 top-[72px] bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-start pt-8 pb-10 items-center gap-6 text-center shadow-inner overflow-y-auto ${isOpen ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                {menus.map((menu) => (
                    <Link
                        key={menu.href}
                        href={menu.href}
                        onClick={closeMenu}
                        className="mobile-link text-lg font-bold text-slate-800 hover:text-blue-900 py-2 border-b-2 border-transparent hover:border-yellow-400 transition-all"
                    >
                        {menu.name}
                    </Link>
                ))}
                <Link
                    href="/pendaftaran"
                    onClick={closeMenu}
                    className="mt-2 bg-blue-900 text-white px-8 py-3 rounded-full text-base font-bold shadow-xl hover:bg-blue-800 transition transform hover:scale-105"
                >
                    Daftar YES 2026
                </Link>
            </div>
        </nav>
    );
}
