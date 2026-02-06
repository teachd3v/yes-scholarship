import React from 'react';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';

async function getTestimonials() {
    return client.fetch(groq`*[_type == "testimonial"]{
        _id,
        name,
        role,
        quote,
        avatar
    }`);
}

export const revalidate = 60; // Revalidate every 60 seconds

export default async function TentangKami() {
    const testimonials = await getTestimonials();

    return (
        <main className="bg-[#F8F9FB] min-h-screen">
            <section className="pt-16 pb-10 px-6 max-w-4xl mx-auto text-center">
                <span className="text-yellow-600 font-bold tracking-widest uppercase text-sm mb-2 block">Profil Program</span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Mengenal Lebih Dekat <br /> Youth Ekselensia Scholarship</h1>
            </section>

            <section className="max-w-5xl mx-auto px-6 mb-20">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img
                            src="/images/tentang-kami.jpg"
                            alt="Team YES"
                            className="rounded-3xl shadow-lg rotate-2 hover:rotate-0 transition duration-500"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">Sejarah & Latar Belakang</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Youth Ekselensia Scholarship (YES) lahir dari kepedulian terhadap potensi siswa berprestasi dari kalangan dhuafa yang seringkali terhambat biaya untuk melanjutkan pendidikan tinggi.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            Diinisiasi oleh GREAT Edunesia dan Dompet Dhuafa, program ini tidak hanya fokus pada akademik, tetapi juga pembentukan karakter kepemimpinan yang tangguh (#ResillientLeader) untuk menyongsong Indonesia Emas 2045.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-blue-900 text-white py-20 rounded-[2.5rem] mx-4 md:mx-10 mb-20">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">V</div>
                            <h3 className="text-2xl font-bold">Visi</h3>
                            <p className="text-blue-100 leading-relaxed">
                                Menjadi inkubator pemimpin masa depan yang berdaya, berkarakter, dan berdampak luas, yang lahir dari ketangguhan keluarga rentan untuk mewujudkan keadilan sosial.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">M</div>
                            <h3 className="text-2xl font-bold">Misi</h3>
                            <ul className="text-blue-100 text-left space-y-2 inline-block">
                                <li>1. Membuka Akses Pendidikan Tinggi.</li>
                                <li>2. Membangun Fondasi Spiritual dan Karakter.</li>
                                <li>3. Menanamkan Kepemimpinan Sosial.</li>
                                <li>4. Mengembangkan Kapasitas Holistik.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tujuan Program */}
            <section className="max-w-6xl mx-auto px-6 mb-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Tujuan Program</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        { title: "Sukses PTN", desc: "Mempersiapkan pelajar masuk Perguruan Tinggi Negeri (PTN)", icon: "🎓" },
                        { title: "Akhlak Mulia", desc: "Membentuk pelajar yang berakhlak mulia", icon: "✨" },
                        { title: "Cinta Al-Qur'an", desc: "Membina bacaan dan hafalan Al-Qur’an", icon: "📖" },
                        { title: "Jiwa Pemimpin", desc: "Mengembangkan jiwa kepemimpinan pelajar", icon: "🚀" },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center hover:shadow-md transition">
                            <div className="text-4xl mb-4">{item.icon}</div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-slate-600 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sasaran & Durasi */}
            <section className="max-w-5xl mx-auto px-6 mb-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Sasaran - Spans 2 cols */}
                    <div className="md:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Kriteria Penerima</span>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Sasaran Program</h2>
                        <p className="text-slate-600 mb-6">
                            Sasaran program Youth Ekselensia Scholarship (YES) adalah siswa yatim tingkat SMA/MA/SMK yang berasal dari keluarga dhuafa atau yatim.
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Muslim/Muslimah",
                                "Anak yatim dhuafa/ yatim muallaf/ anak keluarga dhuafa",
                                "Bisa membaca Al-Qur’an, atau memiliki komitmen belajar AlQur’an",
                                "Pelajar kelas XI semester 2 SMA/MA/SMK non boarding school (Rata-rata rapor min 60)",
                                "Menggunakan pakaian sesuai syariat dan tidak merokok",
                                "Tidak sedang menerima beasiswa dari program non pemerintah",
                                "Memiliki komitmen untuk maju dengan mengikuti pembinaan"
                            ].map((item, idx) => (
                                <li key={idx} className="flex gap-3 text-slate-700">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-sm code-font">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Durasi - Spans 1 col */}
                    <div className="bg-blue-900 text-white rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden group">
                        {/* Decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition duration-700"></div>

                        <span className="relative z-10 text-blue-200 font-bold tracking-widest uppercase text-xs mb-4 block">Timeline</span>
                        <h3 className="relative z-10 text-2xl font-bold mb-2">Durasi Program</h3>
                        <div className="relative z-10 text-6xl font-bold text-yellow-400 mb-2">1 <span className="text-2xl text-white">Tahun</span></div>
                        <p className="relative z-10 text-blue-100">
                            (12 Bulan) <br />
                            Program akan dimulai sejak awardee menginjak kelas 12 SMA.
                        </p>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">Kata Alumni</h2>
                {testimonials.length > 0 ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testi: any) => (
                            <div key={testi._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition">
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
                ) : (
                    <p className="text-center text-slate-500">Belum ada testimonial.</p>
                )}
            </section>
        </main>
    );
}
