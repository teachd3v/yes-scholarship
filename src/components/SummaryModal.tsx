"use client";

import { X, CheckCircle, User, Users, GraduationCap, FileText } from "lucide-react";
import { MasterSchemaType } from "@/lib/schema-master";
import { useEffect } from "react";

const INCOME_LABELS: Record<string, string> = {
    range_a: "0 - < 1 Juta",
    range_b: "1 - 2.5 Juta",
    range_c: "2.6 - 4 Juta",
    range_d: "4 - 5 Juta",
    range_e: "> 5 Juta",
};

function Row({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <div className="flex flex-col sm:flex-row sm:gap-2 py-1.5 border-b border-slate-100 last:border-0 text-sm">
            <span className="text-slate-400 sm:w-40 shrink-0 text-xs sm:text-sm">{label}</span>
            <span className="font-medium text-slate-800 break-words min-w-0">{value || <span className="text-slate-300 italic">—</span>}</span>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="mb-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg mb-2">
                <span className="text-blue-600">{icon}</span>
                <h4 className="font-bold text-blue-800 text-sm">{title}</h4>
            </div>
            <div className="px-1">{children}</div>
        </div>
    );
}

interface SummaryModalProps {
    isOpen: boolean;
    data: MasterSchemaType | null;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}

export default function SummaryModal({ isOpen, data, onClose, onConfirm, isLoading }: SummaryModalProps) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isLoading) onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose, isLoading]);

    if (!isOpen || !data) return null;

    const fotoName = data.foto_diri?.[0]?.name || null;
    const kkName = data.file_kk?.[0]?.name || null;
    const sktmName = data.file_sktm?.[0]?.name || null;
    const skbName = data.file_skb?.[0]?.name || null;
    const r1Name = data.foto_raport_1?.[0]?.name || null;
    const r2Name = data.foto_raport_2?.[0]?.name || null;
    const r3Name = data.foto_raport_3?.[0]?.name || null;

    const alamatLengkap = [
        data.alamat_detail,
        data.kelurahan_nama || data.kelurahan,
        data.kecamatan_nama || data.kecamatan,
        data.kabupaten_nama || data.kabupaten,
        data.provinsi_nama || data.provinsi,
    ].filter(Boolean).join(", ");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="text-blue-600" size={22} />
                        <h3 className="text-lg font-bold text-slate-800">Ringkasan Data Pendaftaran</h3>
                    </div>
                    {!isLoading && (
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
                        Harap periksa kembali data di bawah sebelum mengirim. Data yang sudah dikirim <strong>tidak dapat diubah</strong>.
                    </p>

                    {/* BIODATA */}
                    <Section title="Biodata Diri" icon={<User size={16} />}>
                        <Row label="Nama Lengkap" value={data.nama} />
                        <Row label="NIK" value={data.nik} />
                        <Row label="No KK" value={data.no_kk} />
                        <Row label="Jenis Kelamin" value={data.jenis_kelamin} />
                        <Row label="Agama" value={data.agama} />
                        <Row label="Tempat Lahir" value={data.tempat_lahir} />
                        <Row label="Tanggal Lahir" value={data.tanggal_lahir} />
                        <Row label="Email" value={data.email} />
                        <Row label="WhatsApp" value={data.whatsapp ? `+62${data.whatsapp}` : null} />
                        <Row label="Alamat Domisili" value={alamatLengkap} />
                        <Row label="Foto Diri" value={fotoName ? `✓ ${fotoName}` : null} />
                    </Section>

                    {/* KELUARGA */}
                    <Section title="Data Keluarga" icon={<Users size={16} />}>
                        <Row label="Nama Ayah" value={data.nama_ayah} />
                        <Row label="Kondisi Ayah" value={data.kondisi_ayah} />
                        {(data as any).pekerjaan_ayah && <Row label="Pekerjaan Ayah" value={(data as any).pekerjaan_ayah} />}
                        <Row label="Nama Ibu" value={data.nama_ibu} />
                        <Row label="Kondisi Ibu" value={data.kondisi_ibu} />
                        {(data as any).pekerjaan_ibu && <Row label="Pekerjaan Ibu" value={(data as any).pekerjaan_ibu} />}
                        <Row label="Penghasilan Ortu" value={data.penghasilan_ortu ? INCOME_LABELS[data.penghasilan_ortu] : null} />
                        <Row label="Kontak Ortu/Wali" value={data.kontak_ortu} />
                        <Row label="Jumlah Saudara" value={data.jumlah_saudara} />
                        <Row label="File KK" value={kkName ? `✓ ${kkName}` : null} />
                        <Row label="File SKTM/KIP/PKH/KIS" value={sktmName ? `✓ ${sktmName}` : "Tidak diupload"} />
                        <Row label="File SKB" value={skbName ? `✓ ${skbName}` : "Tidak diupload"} />
                    </Section>

                    {/* SELEKSI */}
                    <Section title="Data Seleksi & Prestasi" icon={<GraduationCap size={16} />}>
                        <Row label="Asal Sekolah" value={data.asal_sekolah} />
                        <Row label="Jenis Pendidikan" value={data.jenjang_pendidikan} />
                        <Row label="Nilai Raport Sem 1" value={data.nilai_raport_1} />
                        <Row label="Foto Raport Sem 1" value={r1Name ? `✓ ${r1Name}` : null} />
                        <Row label="Nilai Raport Sem 2" value={data.nilai_raport_2} />
                        <Row label="Foto Raport Sem 2" value={r2Name ? `✓ ${r2Name}` : null} />
                        <Row label="Nilai Raport Sem 3" value={data.nilai_raport_3} />
                        <Row label="Foto Raport Sem 3" value={r3Name ? `✓ ${r3Name}` : null} />
                        <Row label="Status Beasiswa" value={data.status_beasiswa} />
                        {data.keterangan_beasiswa && <Row label="Keterangan Beasiswa" value={data.keterangan_beasiswa} />}
                        {data.kategori_hafalan && <Row label="Hafalan Quran" value={data.kategori_hafalan} />}

                        {data.list_organisasi && data.list_organisasi.length > 0 && (
                            <div className="py-1.5 border-b border-slate-100 text-sm">
                                <span className="text-slate-400 block mb-1">Organisasi</span>
                                {data.list_organisasi.map((org, i) => (
                                    <div key={i} className="ml-2 text-slate-700">
                                        {i + 1}. {org.jenis === "Lainnya" ? org.ket_lainnya : org.jenis} — {org.jabatan}
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.list_prestasi && data.list_prestasi.length > 0 && (
                            <div className="py-1.5 border-b border-slate-100 text-sm">
                                <span className="text-slate-400 block mb-1">Prestasi</span>
                                {data.list_prestasi.map((p, i) => (
                                    <div key={i} className="ml-2 text-slate-700">
                                        {i + 1}. {p.keterangan} — {p.juara} Tk. {p.tingkat}
                                    </div>
                                ))}
                            </div>
                        )}

                        <Row label="Motivasi" value={data.motivasi} />
                        <Row label="Sumber Info" value={data.sumber_info} />
                        {data.social_media && <Row label="Social Media" value={data.social_media} />}
                    </Section>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-slate-200 flex gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 font-medium transition disabled:opacity-50"
                    >
                        Koreksi Data
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Mengirim...
                            </>
                        ) : (
                            <><FileText size={16} /> Konfirmasi & Kirim</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
