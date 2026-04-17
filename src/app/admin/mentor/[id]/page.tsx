import { getMentorById } from "../../actions";
import FileGallery from "../../application/[id]/FileGallery";
import Link from "next/link";
import { ArrowLeft, User, GraduationCap, MapPin, Info, Globe, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import MentorDetailActions from "./MentorDetailActions";
import { getAdminUser } from "../../auth-actions";

export const dynamic = 'force-dynamic';

export default async function MentorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [mentor, adminUser] = await Promise.all([getMentorById(id), getAdminUser()]);

  if (!mentor) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/admin?tab=mentors" className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-lg md:text-xl font-bold text-slate-800">{mentor.biodata.nama_lengkap}</h1>
                    <p className="text-xs text-slate-400">Pendaftaran Mentor YES</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    mentor.status === 'approved' ? 'bg-green-100 text-green-700' :
                    mentor.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                 }`}>
                    {mentor.status}
                 </span>
            </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-8 space-y-8">
        {/* Status & Rejection Reasons - Moved to Top */}
        {mentor.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-red-200 bg-red-100/50 flex items-center gap-2">
                    <XCircle size={20} className="text-red-600" />
                    <h3 className="font-bold text-red-800">Alasan Penolakan</h3>
                </div>
                <div className="p-6 space-y-4">
                    {/* Auto Screening Reasons */}
                    {mentor.scoring?.alasan_gagal && mentor.scoring.alasan_gagal.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Gagal Screening Otomatis:</h4>
                            <ul className="list-disc list-inside space-y-1">
                                {mentor.scoring.alasan_gagal.map((reason, idx) => (
                                    <li key={idx} className="text-sm text-red-700">{reason}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Manual Reason */}
                    {mentor.rejectedReason && (
                        <div className={mentor.scoring?.alasan_gagal?.length ? "pt-4 border-t border-red-100" : ""}>
                            <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Alasan Manual (Admin):</h4>
                            <p className="text-sm text-red-700 italic">"{mentor.rejectedReason}"</p>
                        </div>
                    )}

                    {(!mentor.rejectedReason && (!mentor.scoring?.alasan_gagal || mentor.scoring.alasan_gagal.length === 0)) && (
                        <p className="text-sm text-red-600 italic">Tidak ada alasan penolakan yang tercatat.</p>
                    )}
                </div>
            </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Data */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Biodata */}
                <SectionCard title="Biodata Diri" icon={<User size={20} />}>
                    <div className="col-span-1 md:col-span-2 flex items-center gap-6 mb-4">
                        {mentor.biodata.foto_profil_url ? (
                            <img src={mentor.biodata.foto_profil_url} alt="Profile" className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md" />
                        ) : (
                            <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 border-4 border-white shadow-md">
                                <User size={40} />
                            </div>
                        )}
                        <div>
                             <h2 className="text-2xl font-black text-slate-900">{mentor.biodata.nama_lengkap}</h2>
                             <p className="text-slate-500">{mentor.biodata.email}</p>
                        </div>
                    </div>
                    <Field label="Jenis Kelamin" value={mentor.biodata.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} />
                    <Field label="TTL" value={`${mentor.biodata.tempat_lahir}, ${mentor.biodata.tanggal_lahir}`} />
                    <Field label="WhatsApp" value={mentor.biodata.whatsapp} />
                    <Field label="Status Pernikahan" value={mentor.biodata.status_pernikahan} />
                </SectionCard>

                {/* Domisili */}
                <SectionCard title="Domisili" icon={<MapPin size={20} />}>
                    <Field 
                        label="Alamat Lengkap" 
                        value={`${mentor.domisili.alamat_detail}, ${mentor.domisili.kelurahan_nama}, ${mentor.domisili.kecamatan_nama}, ${mentor.domisili.kabupaten_nama}, ${mentor.domisili.provinsi_nama}`} 
                        fullWidth 
                    />
                </SectionCard>

                {/* Pendidikan */}
                <SectionCard title="Riwayat Pendidikan" icon={<GraduationCap size={20} />}>
                    <Field label="Jenjang Terakhir" value={mentor.pendidikan.jenjang} />
                    <Field label="Jurusan" value={mentor.pendidikan.jurusan} />
                </SectionCard>

                {/* Informasi Tambahan */}
                <SectionCard title="Informasi Tambahan" icon={<Info size={20} />}>
                    <Field label="Lancar Membaca Al-Qur'an?" value={mentor.tambahan.lancar_quran} />
                    <Field label="Sumber Informasi" value={mentor.tambahan.sumber_info} fullWidth />
                    <Field label="Motivasi" value={mentor.tambahan.motivasi} fullWidth />
                    <Field label="Link Sosial Media" value={mentor.tambahan.social_media} fullWidth isLink />
                </SectionCard>

                <FileGallery 
                    title="Dokumen Pendukung" 
                    files={[
                        { label: "CV / Resume", url: mentor.tambahan.cv_resume_url },
                        { label: "Foto Profil", url: mentor.biodata.foto_profil_url },
                    ].filter(f => !!f.url)}
                    gridCols={2}
                />

            </div>

             {/* Right Column: Actions */}
             <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24 space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4">Validasi Mentor</h3>
                        <MentorDetailActions id={mentor._id} currentStatus={mentor.status} />
                    </div>
                </div>
             </div>
        </div>
      </main>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
                <span className="text-slate-500">{icon}</span>
                <h3 className="font-bold text-slate-700">{title}</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {children}
            </div>
        </div>
    )
}

function Field({ label, value, fullWidth = false, isLink = false }: { label: string, value: string | number | null, fullWidth?: boolean, isLink?: boolean }) {
    return (
        <div className={fullWidth ? "col-span-1 md:col-span-2" : ""}>
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</div>
            <div className="font-medium text-slate-800 break-words">
                {isLink && value && value !== '-' ? (
                    <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {value}
                    </a>
                ) : (
                    value || "-"
                )}
            </div>
        </div>
    )
}
