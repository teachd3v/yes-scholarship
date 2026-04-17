"use client";

import { MentorSchemaType } from "@/lib/schema-mentor";
import { X, CheckCircle, User, GraduationCap, Info, Camera } from "lucide-react";

interface MentorSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    data: MentorSchemaType;
    isSubmitting: boolean;
}

export default function MentorSummaryModal({ isOpen, onClose, onConfirm, data, isSubmitting }: MentorSummaryModalProps) {
    if (!isOpen) return null;

    const Row = ({ label, value }: { label: string, value: any }) => (
        <div className="flex flex-col py-2 border-b border-slate-50 last:border-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-semibold text-slate-700">{value || "—"}</span>
        </div>
    );

    const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
        <div className="flex items-center gap-2 mb-3 mt-6 first:mt-0">
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                <Icon size={16} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h3>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Review Data Pendaftaran</h2>
                        <p className="text-xs text-slate-500 font-medium">Pastikan semua data di bawah ini sudah benar sebelum mengirim.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-2">
                        
                        <SectionHeader icon={User} title="Data Diri & Kontak" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <Row label="Nama Lengkap" value={data.nama_lengkap} />
                            <Row label="Jenis Kelamin" value={data.jenis_kelamin} />
                            <Row label="Tempat, Tanggal Lahir" value={`${data.tempat_lahir}, ${data.tanggal_lahir}`} />
                            <Row label="Email" value={data.email} />
                            <Row label="WhatsApp" value={`+62${data.whatsapp}`} />
                            <Row label="Status" value={data.status_pernikahan} />
                        </div>

                        <SectionHeader icon={GraduationCap} title="Pendidikan & Keahlian" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                            <Row label="Jenjang Terakhir" value={data.jenjang_pendidikan} />
                            <Row label="Jurusan" value={data.jurusan} />
                            <Row label="Lancar Baca Al-Qur'an" value={data.lancar_quran} />
                        </div>

                        <SectionHeader icon={Info} title="Motivasi & Sosial Media" />
                        <Row label="Social Media Link" value={data.social_media} />
                        <Row label="Sumber Informasi" value={data.sumber_info} />
                        <div className="flex flex-col py-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Motivasi Bergabung</span>
                            <p className="text-sm font-semibold text-slate-700 leading-relaxed italic mt-1 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                                "{data.motivasi}"
                            </p>
                        </div>

                        <SectionHeader icon={Camera} title="Lampiran Berkas" />
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-bold border border-green-100">
                                <CheckCircle size={12} /> FOTO PROFIL
                            </div>
                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-bold border border-green-100">
                                <CheckCircle size={12} /> CV / RESUME
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t flex flex-col md:flex-row gap-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition border border-slate-100"
                    >
                        PERBAIKI DATA
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="flex-[2] bg-blue-600 px-6 py-3.5 rounded-2xl text-sm font-black text-white hover:bg-blue-700 transition shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "SEDANG MENGIRIM..." : "YA, DATA SUDAH BENAR & KIRIM"}
                    </button>
                </div>
            </div>
        </div>
    );
}
