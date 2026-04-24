import { getApplicationById } from "../../actions";
import FileGallery from "./FileGallery";
import Link from "next/link";
import { ArrowLeft, CheckCircle, User, GraduationCap, Users, XCircle, Award, Building2 } from "lucide-react";

import { notFound } from "next/navigation";
import { formatIncome } from "@/lib/types";

// Client component for actions
import DetailActions from "./DetailActions";
import PrintButton from "./PrintButton";
import RekomendasiPanel from "./RekomendasiPanel";
import EditDataModal from "./EditDataModal";
import { getAdminUser } from "../../auth-actions";

export const dynamic = 'force-dynamic';
// export const runtime = 'edge'; // Removed for Vercel

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [app, adminUser] = await Promise.all([getApplicationById(id), getAdminUser()]);

  if (!app) {
    notFound();
  }

  const sections = [
    { id: "biodata", label: "Biodata Diri", icon: User, data: app.biodata },
    { id: "keluarga", label: "Keluarga", icon: Users, data: app.keluarga },
    { id: "seleksi", label: "Seleksi & Sekolah", icon: GraduationCap, data: app.seleksi },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-full transition text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-lg md:text-xl font-bold text-slate-800">{app.biodata.nama}</h1>
                    {/* ID is intentionally hidden, to debug view: <p className="text-xs text-slate-500 hidden">ID: {app._id}</p> */}
                </div>
            </div>
            <div className="flex items-center gap-3">
                 <PrintButton />
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    app.status === 'approved' ? 'bg-green-100 text-green-700' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                 }`}>
                    {app.status}
                 </span>
            </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 md:px-8 space-y-8">
        
        {/* Scoring Summary Card & Rejection Reasons - Moved to Top */}
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-blue-600" size={20} /> Hasil Screening & Scoring
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <div className="text-sm text-slate-500 mb-1">Total Skor</div>
                        <div className="text-4xl font-black text-slate-800">{app.scoring?.total_skor || 0}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <div className="text-sm text-slate-500 mb-1">Pre-Screening</div>
                        <div className={`text-xl font-bold ${app.scoring?.lolos_screening ? 'text-green-600' : 'text-red-600'}`}>
                            {app.scoring?.lolos_screening ? 'LOLOS' : 'TIDAK LOLOS'}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="text-sm text-slate-500 mb-1">Detail Skor</div>
                        <div className="text-xs text-slate-600 space-y-1">
                            {(() => {
                                try {
                                    const details = JSON.parse(app.scoring?.detail_skor || '{}');
                                    return Object.entries(details).map(([k, v]) => (
                                        <div key={k} className="flex justify-between border-b border-slate-200 pb-0.5 last:border-0">
                                            <span className="capitalize">{k.replace(/_/g, ' ')}</span>
                                            <span className="font-mono font-bold">{String(v)}</span>
                                        </div>
                                    ));
                                } catch (e) { return <span>Error parsing details</span> }
                            })()}
                        </div>
                    </div>
                </div>
                {app.scoring?.alasan_gagal && app.scoring.alasan_gagal.length > 0 && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                        <strong>Alasan Gagal Screening:</strong>
                        <ul className="list-disc list-inside mt-1 ml-1">
                            {app.scoring.alasan_gagal.map((a: string, i: number) => <li key={i}>{a}</li>)}
                        </ul>
                    </div>
                )}
            </div>

            {app.status === 'rejected' && app.rejectedReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-3 border-b border-red-200 bg-red-100/50 flex items-center gap-2">
                        <XCircle size={18} className="text-red-600" />
                        <h3 className="font-bold text-red-800 text-sm">Alasan Penolakan (Admin)</h3>
                    </div>
                    <div className="p-5">
                        <p className="text-sm text-red-700 italic">"{app.rejectedReason}"</p>
                    </div>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Data */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Biodata */}
                <SectionCard title="Biodata Diri" icon={<User size={20} />}>
                    <Field label="Nama Lengkap" value={app.biodata.nama} />
                    <Field label="NIK" value={app.biodata.nik} />
                    <Field label="No KK" value={app.biodata.no_kk} />
                    <Field label="Jenis Kelamin" value={app.biodata.jenis_kelamin} />
                    <Field label="Agama" value={app.biodata.agama} />
                    <Field label="TTL" value={`${app.biodata.tempat_lahir}, ${app.biodata.tanggal_lahir}`} />
                    <Field label="Email" value={app.biodata.email} />
                    <Field label="WhatsApp" value={app.biodata.whatsapp} />
                    <Field 
                        label="Alamat" 
                        value={`${app.biodata.alamat_detail}, ${app.biodata.kelurahan_nama || app.biodata.kelurahan}, ${app.biodata.kecamatan_nama || app.biodata.kecamatan}, ${app.biodata.kabupaten_nama || app.biodata.kabupaten}, ${app.biodata.provinsi_nama || app.biodata.provinsi}`} 
                        fullWidth 
                    />
                </SectionCard>

                {/* Keluarga */}
                <SectionCard title="Keluarga" icon={<Users size={20} />}>
                    <Field label="Nama Ayah" value={app.keluarga.nama_ayah} />
                    <Field label="Kondisi Ayah" value={app.keluarga.kondisi_ayah} />
                    <Field label="Nama Ibu" value={app.keluarga.nama_ibu} />
                    <Field label="Kondisi Ibu" value={app.keluarga.kondisi_ibu} />
                    <Field 
                        label="Penghasilan" 
                        value={formatIncome(app.keluarga.penghasilan_ortu)} 
                    />
                    <Field label="Jumlah Saudara" value={app.keluarga.jumlah_saudara} />
                    <Field label="Kontak Ortu" value={app.keluarga.kontak_ortu} />
                </SectionCard>

                 {/* Seleksi */}
                 <SectionCard title="Pendidikan & Seleksi" icon={<GraduationCap size={20} />}>
                    <Field label="Asal Sekolah" value={app.seleksi.asal_sekolah} />
                    <Field label="Jenjang" value={app.seleksi.jenjang_pendidikan} />
                    <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="text-center border-r border-blue-200 last:border-0">
                            <div className="text-xs text-slate-500">Sem 1</div>
                            <div className="font-bold text-blue-700">{app.seleksi.nilai_raport_1}</div>
                        </div>
                        <div className="text-center border-r border-blue-200 last:border-0">
                            <div className="text-xs text-slate-500">Sem 2</div>
                            <div className="font-bold text-blue-700">{app.seleksi.nilai_raport_2}</div>
                        </div>
                        <div className="text-center border-r border-blue-200 last:border-0">
                            <div className="text-xs text-slate-500">Sem 3</div>
                            <div className="font-bold text-blue-700">{app.seleksi.nilai_raport_3}</div>
                        </div>
                        <div className="text-center bg-blue-100 rounded-lg flex flex-col justify-center">
                            <div className="text-xs text-blue-600 font-bold uppercase">Rataan</div>
                            <div className="font-black text-blue-800 text-lg">
                                {((app.seleksi.nilai_raport_1 + app.seleksi.nilai_raport_2 + app.seleksi.nilai_raport_3) / 3).toFixed(2)}
                            </div>
                        </div>
                    </div>
                    <Field label="Status Beasiswa" value={app.seleksi.status_beasiswa} />
                    {app.seleksi.keterangan_beasiswa && <Field label="Ket. Beasiswa" value={app.seleksi.keterangan_beasiswa} />}
                    <Field label="Hafalan" value={app.seleksi.kategori_hafalan || '-'} />
                    <Field label="Social Media" value={app.seleksi.social_media || '-'} isLink={true} fullWidth />
                    <Field label="Motivasi" value={app.seleksi.motivasi} fullWidth />
                </SectionCard>

                <SectionCard title="Organisasi" icon={<Building2 size={20} />}>
                    {(app.seleksi.list_organisasi && app.seleksi.list_organisasi.length > 0) ? (
                        app.seleksi.list_organisasi.map((org, i) => (
                            <div key={i} className="col-span-1 md:col-span-2 bg-slate-50 rounded-lg p-4 border border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-slate-700">{org.jenis}</span>
                                    <span className="text-slate-400">—</span>
                                    <span className="text-slate-600">{org.jabatan}</span>
                                </div>
                                {org.ket_lainnya && <p className="text-sm text-slate-500">{org.ket_lainnya}</p>}
                            </div>
                        ))
                    ) : (
                        <p className="col-span-2 text-slate-400 text-sm">Tidak ada data organisasi.</p>
                    )}
                </SectionCard>

                <SectionCard title="Prestasi" icon={<Award size={20} />}>
                    {(app.seleksi.list_prestasi && app.seleksi.list_prestasi.length > 0) ? (
                        app.seleksi.list_prestasi.map((p, i) => (
                            <div key={i} className="col-span-1 md:col-span-2 bg-amber-50 rounded-lg p-4 border border-amber-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-amber-700">Juara {p.juara}</span>
                                    <span className="text-slate-400">—</span>
                                    <span className="text-slate-600">Tingkat {p.tingkat}</span>
                                </div>
                                <p className="text-sm text-slate-600">{p.keterangan}</p>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-2 text-slate-400 text-sm">Tidak ada data prestasi.</p>
                    )}
                </SectionCard>

                <FileGallery 
                    title="Foto & Identitas" 
                    files={[
                        { label: "Foto Diri 3x4", url: app.biodata.foto_diri_url },
                        { label: "Kartu Keluarga", url: app.keluarga.file_kk_url },
                        { label: "SKTM", url: app.keluarga.file_sktm_url },
                        { label: "SKB", url: app.keluarga.file_skb_url },
                    ].filter(f => !!f.url)}
                    gridCols={4}
                />

                <FileGallery 
                    title="Raport Sekolah" 
                    files={[
                        { label: "Raport Semester 1", url: app.seleksi.foto_raport_1_url },
                        { label: "Raport Semester 2", url: app.seleksi.foto_raport_2_url },
                        { label: "Raport Semester 3", url: app.seleksi.foto_raport_3_url },
                    ].filter(f => !!f.url)} 
                    gridCols={3}
                />
            </div>

             {/* Right Column: Actions Only */}
             <div className="space-y-6">
                
                {/* Action Panel */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24 space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-4">Validasi Admin</h3>
                        <DetailActions id={app._id} currentStatus={app.status} />
                    </div>

                    {(adminUser?.role === 'superadmin' || adminUser?.role === 'admin_wilayah') && (
                        <div className="border-t border-slate-100 pt-5">
                            <h3 className="font-bold text-slate-800 mb-3">Edit Data</h3>
                            <EditDataModal app={app} />
                        </div>
                    )}

                    <div className="border-t border-slate-100 pt-5">
                        <h3 className="font-bold text-slate-800 mb-3">Rekomendasi Override</h3>
                        <RekomendasiPanel
                            id={app._id}
                            lolos_screening={app.scoring?.lolos_screening ?? false}
                            rekomendasi={app.rekomendasi}
                        />
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