import Link from 'next/link'

export default function PendaftaranPage() {
    return (
        <main className="min-h-[80vh] flex items-center justify-center bg-[#F8F9FB] px-6 py-20">
            <div className="max-w-2xl w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-50 rounded-full -ml-12 -mb-12 opacity-50"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-2xl mb-8 animate-bounce">
                        <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 leading-tight">
                        Pendaftaran Seleksi YES 2026 Angkatan 5
                    </h1>

                    <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
                        Akan segera hadir! Persiapkan dirimu untuk menjadi bagian dari pemimpin masa depan bangsa.
                    </p>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                            Nantikan Informasinya di
                        </p>

                        <Link
                            href="https://www.instagram.com/youthekselensia.id/"
                            target="_blank"
                            className="inline-flex items-center gap-3 md:gap-4 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white px-6 py-4 md:px-8 rounded-full font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 group max-w-full"
                        >
                            <svg className="w-6 h-6 md:w-8 md:h-8 transition-transform group-hover:rotate-12 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            <span className="truncate">@youthekselensia.id</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
