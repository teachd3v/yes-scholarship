import React from 'react';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import { groq } from 'next-sanity';
import { PortableText } from '@portabletext/react';

export const revalidate = 86400; // cache 24 jam, konten jarang berubah

const teamQuery = groq`*[_type == "team"][0] {
  management_pusat[] { nama, jabatan, foto },
  management_wilayah[] { nama, jabatan, wilayah, foto }
}`;

const aboutQuery = groq`*[_type == "about"][0] {
  headerSubtitle,
  headerTitle,
  historyImage,
  historyTitle,
  historyContent,
  visionTitle,
  visionText,
  missionTitle,
  missions,
  goalsTitle,
  goalsList,
  criteriaSubtitle,
  criteriaTitle,
  criteriaDesc,
  criteriaItems,
  durationSubtitle,
  durationTitle,
  durationValue,
  durationUnit,
  durationDesc
}`;

export default async function TentangKami() {
    const [data, teamData] = await Promise.all([
        client ? client.fetch(aboutQuery) : null,
        client ? client.fetch(teamQuery) : null,
    ]);

    // Fallbacks
    const headerTitle = data?.headerTitle || "Mengenal Lebih Dekat Youth Ekselensia Scholarship";
    const headerSubtitle = data?.headerSubtitle || "Profil Program";
    
    const historyTitle = data?.historyTitle || "Sejarah & Latar Belakang";
    const historyImageSrc = data?.historyImage ? urlFor(data.historyImage).url() : "/images/tentang-kami.jpg";
    
    const visionTitle = data?.visionTitle || "Visi";
    const visionText = data?.visionText || "Menjadi inkubator pemimpin masa depan yang berdaya, berkarakter, dan berdampak luas, yang lahir dari ketangguhan keluarga rentan untuk mewujudkan keadilan sosial.";
    
    const missionTitle = data?.missionTitle || "Misi";
    const missions = data?.missions?.length ? data.missions : [
        "Membuka Akses Pendidikan Tinggi.",
        "Membangun Fondasi Spiritual dan Karakter.",
        "Menanamkan Kepemimpinan Sosial.",
        "Mengembangkan Kapasitas Holistik."
    ];

    const goalsTitle = data?.goalsTitle || "Tujuan Program";
    const goalsList = data?.goalsList?.length ? data.goalsList : [
        { title: "Sukses PTN", desc: "Mempersiapkan pelajar masuk Perguruan Tinggi Negeri (PTN)", icon: "🎓" },
        { title: "Akhlak Mulia", desc: "Membentuk pelajar yang berakhlak mulia", icon: "✨" },
        { title: "Cinta Al-Qur'an", desc: "Membina bacaan dan hafalan Al-Qur’an", icon: "📖" },
        { title: "Jiwa Pemimpin", desc: "Mengembangkan jiwa kepemimpinan pelajar", icon: "🚀" },
    ];

    const criteriaSubtitle = data?.criteriaSubtitle || "Kriteria Penerima";
    const criteriaTitle = data?.criteriaTitle || "Sasaran Program";
    const criteriaDesc = data?.criteriaDesc || "Sasaran program Youth Ekselensia Scholarship (YES) adalah siswa yatim tingkat SMA/MA/SMK yang berasal dari keluarga dhuafa atau yatim.";
    const criteriaItems = data?.criteriaItems?.length ? data.criteriaItems : [
        "Muslim/Muslimah",
        "Anak yatim dhuafa/ yatim muallaf/ anak keluarga dhuafa",
        "Bisa membaca Al-Qur’an, atau memiliki komitmen belajar AlQur’an",
        "Pelajar kelas XI semester 2 SMA/MA/SMK non boarding school (Rata-rata rapor min 60)",
        "Menggunakan pakaian sesuai syariat dan tidak merokok",
        "Tidak sedang menerima beasiswa dari program non pemerintah",
        "Memiliki komitmen untuk maju dengan mengikuti pembinaan"
    ];

    const durationSubtitle = data?.durationSubtitle || "Timeline";
    const durationTitle = data?.durationTitle || "Durasi Program";
    const durationValue = data?.durationValue || 1;
    const durationUnit = data?.durationUnit || "Tahun";
    const durationDesc = data?.durationDesc || "(12 Bulan)\nProgram akan dimulai sejak awardee menginjak kelas 12 SMA.";

    return (
        <main className="bg-[#F8F9FB] min-h-screen">
            <section className="pt-16 pb-10 px-6 max-w-4xl mx-auto text-center">
                <span className="text-yellow-600 font-bold tracking-widest uppercase text-sm mb-2 block">{headerSubtitle}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6" dangerouslySetInnerHTML={{ __html: headerTitle.replace(/\n/g, '<br />') }}></h1>
            </section>

            <section className="max-w-5xl mx-auto px-6 mb-20">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <img
                            src={historyImageSrc}
                            alt="Team YES"
                            className="rounded-3xl shadow-lg rotate-2 hover:rotate-0 transition duration-500 w-full object-cover"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-6">
                        <h2 className="text-3xl font-bold text-slate-900">{historyTitle}</h2>
                        {data?.historyContent ? (
                            <div className="prose prose-slate text-slate-600 leading-relaxed">
                                <PortableText value={data.historyContent} />
                            </div>
                        ) : (
                            <>
                                <p className="text-slate-600 leading-relaxed">
                                    Youth Ekselensia Scholarship (YES) lahir dari kepedulian terhadap potensi siswa berprestasi dari kalangan dhuafa yang seringkali terhambat biaya untuk melanjutkan pendidikan tinggi.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Diinisiasi oleh GREAT Edunesia dan Dompet Dhuafa, program ini tidak hanya fokus pada akademik, tetapi juga pembentukan karakter kepemimpinan yang tangguh (#ExcellentLeader) untuk menyongsong Indonesia Emas 2045.
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="bg-blue-900 text-white py-20 rounded-[2.5rem] mx-4 md:mx-10 mb-20">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">V</div>
                            <h3 className="text-2xl font-bold">{visionTitle}</h3>
                            <p className="text-blue-100 leading-relaxed">
                                {visionText}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-yellow-400 text-blue-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">M</div>
                            <h3 className="text-2xl font-bold">{missionTitle}</h3>
                            <ul className="text-blue-100 text-left space-y-2 inline-block">
                                {missions.map((m: string, idx: number) => (
                                    <li key={idx}>{(idx + 1)}. {m}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tujuan Program */}
            <section className="max-w-6xl mx-auto px-6 mb-20">
                <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">{goalsTitle}</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    {goalsList.map((item: { title: string, desc: string, icon: string }, idx: number) => (
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
                        <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">{criteriaSubtitle}</span>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">{criteriaTitle}</h2>
                        <p className="text-slate-600 mb-6">
                            {criteriaDesc}
                        </p>
                        <ul className="space-y-3">
                            {criteriaItems.map((item: string, idx: number) => (
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

                        <span className="relative z-10 text-blue-200 font-bold tracking-widest uppercase text-xs mb-4 block">{durationSubtitle}</span>
                        <h3 className="relative z-10 text-2xl font-bold mb-2">{durationTitle}</h3>
                        <div className="relative z-10 text-6xl font-bold text-yellow-400 mb-2">{durationValue} <span className="text-2xl text-white">{durationUnit}</span></div>
                        <p className="relative z-10 text-blue-100 whitespace-pre-line">
                            {durationDesc}
                        </p>
                    </div>
                </div>
            </section>

            {/* Meet Our #Excellent Team */}
            {(() => {
                const pusat: any[] = teamData?.management_pusat?.length
                    ? teamData.management_pusat
                    : [
                        { nama: "Bayu Candra Winata", jabatan: "Ketua Departemen Beastudi Indonesia" },
                        { nama: "Sri Mulyani", jabatan: "Pengelola Program YES" },
                        { nama: "Yulianti", jabatan: "Pengelola Program YES" },
                    ];

                const wilayah: any[] = teamData?.management_wilayah?.length
                    ? teamData.management_wilayah
                    : [
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah Jawa Barat" },
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah DI Yogyakarta" },
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah Jawa Timur" },
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah Sulawesi Selatan" },
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah Sumatera Utara" },
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah Sumatera Barat" },
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah Riau" },
                        { nama: "—", jabatan: "Mentor Wilayah", wilayah: "Wilayah Sumatera Selatan" },
                    ];

                return (
                    <section className="max-w-6xl mx-auto px-6 mb-20">
                        <div className="text-center mb-12">
                            <span className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-2 block">Struktur Organisasi</span>
                            <h2 className="text-3xl font-bold text-slate-900">
                                Meet Our <span className="text-blue-600">#Excellent</span> Team
                            </h2>
                            <p className="text-slate-500 mt-3 max-w-xl mx-auto text-sm">
                                Tim profesional yang berdedikasi mengelola dan mendampingi para awardee YES di seluruh Indonesia.
                            </p>
                        </div>

                        {/* Manajemen Pusat */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1 bg-slate-200"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">Manajemen Pusat</span>
                                <div className="h-px flex-1 bg-slate-200"></div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-6">
                                {pusat.map((member: any, idx: number) => (
                                    <div key={idx} className="flex flex-col items-center text-center group w-40 md:w-48">
                                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-blue-100 border-4 border-white shadow-lg mb-3 group-hover:shadow-xl group-hover:-translate-y-1 transition duration-300">
                                            {member.foto ? (
                                                <img
                                                    src={urlFor(member.foto).width(112).height(112).url()}
                                                    alt={member.nama}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-400">
                                                    {member.nama !== "—" ? member.nama.charAt(0) : "?"}
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-bold text-slate-900 text-sm leading-tight">{member.nama}</p>
                                        <p className="text-xs text-slate-500 mt-1 leading-snug">{member.jabatan}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Manajemen Wilayah */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1 bg-slate-200"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">Manajemen Wilayah</span>
                                <div className="h-px flex-1 bg-slate-200"></div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                                {wilayah.map((member: any, idx: number) => (
                                    <div key={idx} className="flex flex-col items-center text-center group bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300">
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-yellow-50 border-4 border-white shadow mb-3">
                                            {member.foto ? (
                                                <img
                                                    src={urlFor(member.foto).width(80).height(80).url()}
                                                    alt={member.nama}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-yellow-400">
                                                    {member.nama !== "—" ? member.nama.charAt(0) : "★"}
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-bold text-slate-900 text-xs md:text-sm leading-tight">{member.nama}</p>
                                        {member.wilayah && (
                                            <span className="mt-1 text-[10px] bg-blue-50 text-blue-600 font-semibold px-2 py-0.5 rounded-full">{member.wilayah}</span>
                                        )}
                                        <p className="text-[10px] text-slate-400 mt-1">{member.jabatan}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                );
            })()}

        </main>
    );
}
