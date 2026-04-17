"use client";

import SectionMentorBiodata from "@/components/SectionMentorBiodata";
import SectionMentorPendidikan from "@/components/SectionMentorPendidikan";
import SectionMentorTambahan from "@/components/SectionMentorTambahan";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mentorSchema, MentorSchemaType } from "@/lib/schema-mentor";
import { Save, Loader2, CheckCircle, Mail, X, BookOpen, ChevronRight, AlertTriangle } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { compressImage } from "@/lib/image-compression";
import Link from "next/link";
import MentorSummaryModal from "@/components/MentorSummaryModal";

export default function DaftarMentorPage() {
    const methods = useForm<MentorSchemaType>({
        resolver: zodResolver(mentorSchema),
        defaultValues: {
            nama_lengkap: "",
            jenis_kelamin: undefined,
            tempat_lahir: "",
            tanggal_lahir: "",
            email: "",
            whatsapp: "",
            status_pernikahan: undefined,
            provinsi: "",
            kabupaten: "",
            kecamatan: "",
            kelurahan: "",
            alamat_detail: "",
            jenjang_pendidikan: undefined,
            jurusan: "",
            social_media: "",
            lancar_quran: undefined,
            sumber_info: undefined,
            motivasi: "",
        }
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [pendingData, setPendingData] = useState<MentorSchemaType | null>(null);
    const [submitError, setSubmitError] = useState("");
    const [submitStep, setSubmitStep] = useState("");
    const [submitProgress, setSubmitProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const errorBannerRef = useRef<HTMLDivElement>(null);

    // Filter spasi ganjil sebelum disimpan
    const cleanRegionName = (name: string) => {
        if (!name) return "";
        let cleaned = name.replace(/[\u200B-\u200D\uFEFF]/g, "");
        const spaceCount = (cleaned.match(/\s/g) || []).length;
        if (spaceCount > 0 && spaceCount >= (cleaned.length / 3)) {
            cleaned = cleaned.replace(/\s/g, "");
            cleaned = cleaned.replace(/^(KOTA|KABUPATEN)(.+)$/, "$1 $2");
        }
        return cleaned.replace(/\s+/g, " ").trim().toUpperCase();
    };

    const onSubmit = useCallback(async (data: MentorSchemaType) => {
        setSubmitError("");
        setPendingData(data);
        setShowSummary(true);
    }, []);

    const doActualSubmit = useCallback(async (data: MentorSchemaType) => {
        setIsSubmitting(true);
        setShowSummary(false);
        setSubmitError("");
        setSubmitStep("Menyiapkan pendaftaran...");
        setSubmitProgress(0);

        // Progress Animation: 0 to 99% in 3 seconds
        const startTime = Date.now();
        const duration = 3000;
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(99, Math.floor((elapsed / duration) * 99));
            setSubmitProgress(progress);
            if (progress >= 99) clearInterval(interval);
        }, 50);

        try {
            const formData = new FormData();

            setSubmitStep("Mengompresi dan memproses data...");
            
            // Helper to append data to FormData
            const processAndAppend = async (key: string, value: any) => {
                if (value instanceof FileList && value.length > 0) {
                    const file = value[0];
                    if (file.type.startsWith("image/")) {
                         const compressed = await compressImage(file);
                         formData.append(key, compressed);
                    } else {
                         formData.append(key, file);
                    }
                } else if (value instanceof File) {
                    if (value.type.startsWith("image/")) {
                         const compressed = await compressImage(value);
                         formData.append(key, compressed);
                    } else {
                         formData.append(key, value);
                    }
                } else if (value !== undefined && value !== null) {
                    // Bersihkan nama wilayah jika field-nya adalah nama wilayah
                    let valToAppend = String(value);
                    if (key.endsWith("_nama")) {
                        valToAppend = cleanRegionName(valToAppend);
                    }
                    formData.append(key, valToAppend);
                }
            };

            const entries = Object.entries(data);
            await Promise.all(entries.map(([key, value]) => processAndAppend(key, value)));

            setSubmitStep("Mengirim data & konfirmasi email...");

            const response = await fetch('/api/mentor/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Gagal mengirim pendaftaran");
            }

            clearInterval(interval);
            setSubmitProgress(100);
            setSubmitStep("Selesai!");
            
            setTimeout(() => {
                setShowSuccess(true);
                methods.reset();
                setIsSubmitting(false);
            }, 500);

        } catch (error) {
            clearInterval(interval);
            console.error("Submission error:", error);
            setSubmitError(error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim pendaftaran.");
            setIsSubmitting(false);
            setTimeout(() => {
                errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        }
    }, [methods]);

    return (
        <main className="min-h-screen bg-slate-50 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">Pendaftaran Mentor YES 2026</h1>
                    <p className="text-slate-500 text-sm md:text-base">Bergabunglah menjadi bagian dari pembentuk pemimpin masa depan.</p>
                </header>

                {submitError && (
                    <div ref={errorBannerRef} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800">Pendaftaran Gagal</p>
                            <p className="text-sm text-red-600 mt-1">{submitError}</p>
                        </div>
                        <button type="button" onClick={() => setSubmitError("")} className="text-red-400 hover:text-red-600">
                            <X size={16} />
                        </button>
                    </div>
                )}

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
                        <SectionMentorBiodata />
                        <SectionMentorPendidikan />
                        <SectionMentorTambahan />

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition text-lg shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={20} className="animate-spin" /> Sedang Memproses...</>
                                ) : (
                                    <><ChevronRight size={20} /> Tinjau Data Pendaftaran</>
                                )}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>

            {/* Submission Progress Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full mx-4">
                        <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={40} />
                        <p className="font-bold text-slate-800 mb-1">{submitStep}</p>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-3">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${submitProgress}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">{submitProgress}%</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center relative">
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 rounded-full p-4">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Pendaftaran Berhasil!</h3>
                        <p className="text-gray-500 mb-6">Terima kasih telah mendaftar sebagai mentor YES 2026. Data Anda telah kami terima.</p>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
                            <p className="text-sm text-blue-800 font-bold flex items-center gap-2">
                                <Mail size={16} /> Cek Email Kamu!
                            </p>
                            <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                                Kami telah mengirimkan <strong>email konfirmasi</strong> berisi ringkasan data yang kamu kirimkan. Silakan cek Inbox atau folder Spam kamu.
                            </p>
                            <p className="text-xs text-blue-500 mt-3 italic border-t border-blue-100 pt-2">
                                Informasi seleksi selanjutnya akan diumumkan melalui WhatsApp atau Email resmi.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowSuccess(false)}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showSummary && pendingData && (
                <MentorSummaryModal
                    isOpen={showSummary}
                    data={pendingData}
                    onClose={() => setShowSummary(false)}
                    onConfirm={() => doActualSubmit(pendingData)}
                    isSubmitting={isSubmitting}
                />
            )}
        </main>
    );
}
