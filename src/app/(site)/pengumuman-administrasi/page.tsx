import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { safeFetch } from '@/sanity/client';
import { groq } from 'next-sanity';

export const metadata: Metadata = {
  title: 'Pengumuman Hasil Seleksi Administrasi | YES 2026',
  description: 'Pengumuman hasil seleksi administrasi program Youth Ekselensia Scholarship 2026.',
};

async function getAnnouncementData() {
  const query = groq`*[_type == "announcement" && isActive == true][0]{
    title,
    description,
    "pdfUrl": pdfFile.asset->url,
    publishDate
  }`;
  return await safeFetch(query);
}

export default async function AnnouncementPage() {
  const data = await getAnnouncementData();

  // If no active announcement, show a "Coming Soon" or redirect
  if (!data || !data.pdfUrl) {
    return (
      <main className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Pengumuman Belum Tersedia</h1>
          <p className="text-slate-600 mb-8">
            Hasil seleksi administrasi akan diumumkan pada tanggal 2 Mei 2026. Silakan pantau terus website dan media sosial kami.
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-800 transition shadow-lg"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F8F9FB] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="bg-blue-900 text-white pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-yellow-400 font-bold uppercase tracking-widest text-sm mb-4">Official Announcement</p>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            {data.title}
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {data.description || "Selamat kepada seluruh pendaftar yang telah lolos tahap seleksi administrasi. Silakan unduh dokumen di bawah ini untuk melihat daftar nama selengkapnya."}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-4 -mt-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Action Bar */}
          <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Dokumen Hasil Seleksi</h3>
                <p className="text-sm text-slate-500">Format: PDF (Official Document)</p>
              </div>
            </div>
            <a
              href={data.pdfUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition transform hover:-translate-y-1 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh Hasil Seleksi
            </a>
          </div>

          {/* PDF Preview (Iframe) */}
          <div className="relative aspect-[1/1.4] md:aspect-[1.4/1] bg-slate-200">
             <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(data.pdfUrl)}&embedded=true`}
              className="w-full h-full border-none"
              title="PDF Preview"
            ></iframe>
            {/* Fallback if iframe fails or loading */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          </div>
        </div>

        {/* Next Steps Card */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎉</span> Bagi Peserta yang Lolos
            </h3>
            <ul className="space-y-4 text-yellow-800">
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <p>Segera bergabung ke dalam grup WhatsApp koordinasi melalui link di email atau dokumen.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <p>Pantau akun Instagram <a href="https://instagram.com/youthekselensia" target="_blank" className="font-bold underline">@youthekselensia</a> untuk info tahap selanjutnya.</p>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 bg-yellow-200 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <p>Persiapkan diri untuk Tes Tahap 2 (Wawancara & Tes Akademik).</p>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
             <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">💪</span> Bagi Peserta Belum Lolos
            </h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Jangan patah semangat! Perjalananmu masih panjang. Jadikan ini sebagai pengalaman berharga untuk terus bertumbuh.
            </p>
            <p className="text-slate-600">
              Kamu bisa meminta feedback hasil seleksimu melalui fitur "Cek Status" di dashboard pendaftar (mulai 3 Mei).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
