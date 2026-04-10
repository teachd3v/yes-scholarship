'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'

export default function FloatingWhatsApp() {
    const pathname = usePathname()

    // Jangan tampilkan di halaman admin (login maupun dashboard)
    if (pathname?.startsWith('/admin')) {
        return null
    }

    return (
        <Link
            href="https://wa.me/6285691660076"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
            aria-label="Chat WhatsApp Admin"
        >
            <MessageCircle className="w-8 h-8" />
            
            {/* Tooltip that appears on hover on larger screens */}
            <span className="absolute right-full mr-4 bg-white text-slate-800 text-sm font-medium py-1.5 px-3 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap hidden md:block">
                Hubungi Admin
            </span>
            
            {/* Subtle pulse effect */}
            <span className="absolute w-full h-full rounded-full bg-green-500 opacity-50 animate-ping -z-10"></span>
        </Link>
    )
}
