"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { MasterSchemaType } from "@/lib/schema-master";
import { useEffect, useMemo } from "react";
import FileUploadField from "./FileUploadField";

export default function SectionKeluarga() {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext<MasterSchemaType>();

    // useWatch agar compatible dengan React Compiler
    const kondisiAyah = useWatch({ control, name: "kondisi_ayah" });
    const kondisiIbu = useWatch({ control, name: "kondisi_ibu" });

    // Watch file fields untuk preview
    const wFileKK = useWatch({ control, name: "file_kk" });
    const wFileSKTM = useWatch({ control, name: "file_sktm" });
    const wFileSKB = useWatch({ control, name: "file_skb" });


    // Sembunyikan penghasilan jika keduanya tidak bekerja atau wafat (cases 4 & 6)
    const isOrtuNonAktif = (kondisiAyah === "Tidak Bekerja" || kondisiAyah === "Wafat") &&
        (kondisiIbu === "Tidak Bekerja" || kondisiIbu === "Wafat");

    // Ganti label ke "Kontak Wali" HANYA jika keduanya wafat (case 6)
    const isKeduaWafat = kondisiAyah === "Wafat" && kondisiIbu === "Wafat";

    // Cleanup Object URLs untuk preview file
    const kkPreview = useMemo(() => {
        const f = wFileKK?.[0]; return f?.type?.startsWith("image/") ? URL.createObjectURL(f) : null;
    }, [wFileKK]);
    const sktmPreview = useMemo(() => {
        const f = wFileSKTM?.[0]; return f?.type?.startsWith("image/") ? URL.createObjectURL(f) : null;
    }, [wFileSKTM]);
    const skbPreview = useMemo(() => {
        const f = wFileSKB?.[0]; return f?.type?.startsWith("image/") ? URL.createObjectURL(f) : null;
    }, [wFileSKB]);

    useEffect(() => { return () => { if (kkPreview) URL.revokeObjectURL(kkPreview); }; }, [kkPreview]);
    useEffect(() => { return () => { if (sktmPreview) URL.revokeObjectURL(sktmPreview); }; }, [sktmPreview]);
    useEffect(() => { return () => { if (skbPreview) URL.revokeObjectURL(skbPreview); }; }, [skbPreview]);

    // Rule 8: auto-set penghasilan ke range_a saat field disembunyikan
    useEffect(() => {
        if (isOrtuNonAktif) {
            setValue("penghasilan_ortu", "range_a");
        }
    }, [isOrtuNonAktif, setValue]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 my-4 md:my-10 p-4 md:p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Data Keluarga
            </h2>

            <div className="space-y-8">

                {/* --- BAGIAN DOKUMEN (a, b, c) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FileUploadField
                        label="Unggah Kartu Keluarga"
                        name="file_kk"
                        placeholder="Foto Dokumen tidak boleh blur"
                        preview={kkPreview}
                        fileData={wFileKK}
                    />

                    <div>
                        <FileUploadField
                            label="Unggah SKTM/KIP/PKH/KIS"
                            name="file_sktm"
                            placeholder="Surat Keterangan Tidak Mampu, Kartu Program Indonesia Pintar (PIP), Kartu Program Keluarga Harapan (PKH), Kartu Indonesia Sehat (KIS)"
                            preview={sktmPreview}
                            fileData={wFileSKTM}
                            badge="wajib"
                        />
                        <p className="text-xs text-slate-400 mt-1">Opsional — unggah salah satu dokumen pendukung ekonomi jika ada.</p>
                        {errors.file_sktm && <p className="error-text mt-1">{errors.file_sktm.message as string}</p>}
                    </div>

                    <div>
                        <FileUploadField
                            label="Unggah SKB"
                            name="file_skb"
                            placeholder="Foto Dokumen tidak boleh blur"
                            preview={skbPreview}
                            fileData={wFileSKB}
                            badge="wajib"
                        />
                        <a
                            href="/format-surat-kelakuan-baik.docx"
                            download="Format Surat Kelakuan Baik - YES.docx"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Unduh Template SKB
                        </a>
                        <p className="text-xs text-slate-400 mt-1">Opsional — Surat Kelakuan Baik dari sekolah.</p>
                        {errors.file_skb && <p className="error-text mt-1">{errors.file_skb.message as string}</p>}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* --- DATA AYAH (d, f) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label-text">Nama Ayah</label>
                        <input {...register("nama_ayah")} className="input-field" placeholder="Nama Lengkap Ayah" />
                        {errors.nama_ayah && <p className="error-text">{errors.nama_ayah.message as string}</p>}
                    </div>
                    <div>
                        <label className="label-text">Kondisi Ayah</label>
                        <select {...register("kondisi_ayah")} className="input-field">
                            <option value="">Pilih...</option>
                            <option value="Bekerja">Bekerja</option>
                            <option value="Tidak Bekerja">Tidak Bekerja</option>
                            <option value="Wafat">Wafat</option>
                        </select>
                        {errors.kondisi_ayah && <p className="error-text">{errors.kondisi_ayah.message as string}</p>}
                    </div>
                    {kondisiAyah === "Bekerja" && (
                        <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2">
                            <label className="label-text">Keterangan Pekerjaan Ayah (opsional)</label>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <input {...register("pekerjaan_ayah" as any)} className="input-field" placeholder="PNS / Buruh / Pedagang / dll..." />
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(errors as any)?.pekerjaan_ayah && <p className="error-text">{(errors as any).pekerjaan_ayah.message as string}</p>}
                        </div>
                    )}
                </div>

                {/* --- DATA IBU (e, g) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label-text">Nama Ibu</label>
                        <input {...register("nama_ibu")} className="input-field" placeholder="Nama Lengkap Ibu" />
                        {errors.nama_ibu && <p className="error-text">{errors.nama_ibu.message as string}</p>}
                    </div>
                    <div>
                        <label className="label-text">Kondisi Ibu</label>
                        <select {...register("kondisi_ibu")} className="input-field">
                            <option value="">Pilih...</option>
                            <option value="Bekerja">Bekerja</option>
                            <option value="Tidak Bekerja">Tidak Bekerja</option>
                            <option value="Wafat">Wafat</option>
                        </select>
                        {errors.kondisi_ibu && <p className="error-text">{errors.kondisi_ibu.message as string}</p>}
                    </div>
                    {kondisiIbu === "Bekerja" && (
                        <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2">
                            <label className="label-text">Keterangan Pekerjaan Ibu (opsional)</label>
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <input {...register("pekerjaan_ibu" as any)} className="input-field" placeholder="Ibu Rumah Tangga / Guru / Pedagang / dll..." />
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(errors as any)?.pekerjaan_ibu && <p className="error-text">{(errors as any).pekerjaan_ibu.message as string}</p>}
                        </div>
                    )}
                </div>

                {/* --- EKONOMI & LAINNYA (h, i, j) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* h. Penghasilan (Disembunyikan jika kedua ortu tidak bekerja/wafat) */}
                    {!isOrtuNonAktif && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="label-text">Penghasilan Orangtua (per bulan)</label>
                            <select {...register("penghasilan_ortu")} className="input-field">
                                <option value="">Pilih...</option>
                                <option value="range_a">0 - &lt; 1 Juta</option>
                                <option value="range_b">1 - 2.5 Juta</option>
                                <option value="range_c">2.6 - 4 Juta</option>
                                <option value="range_d">4 - 5 Juta</option>
                                <option value="range_e">&gt; 5 Juta</option>
                            </select>
                            {errors.penghasilan_ortu && <p className="error-text">{errors.penghasilan_ortu.message}</p>}
                        </div>
                    )}

                    {/* i. Kontak Ortu / Wali */}
                    <div>
                        <label className="label-text">{isKeduaWafat ? "Kontak Wali" : "Kontak Orang Tua"}</label>
                        <div className="relative">
                            <input type="tel" {...register("kontak_ortu")} className="input-field" placeholder="08..." />
                        </div>
                        {errors.kontak_ortu && <p className="error-text">{errors.kontak_ortu.message}</p>}
                    </div>

                    {/* j. Jumlah Saudara */}
                    <div>
                        <label className="label-text">Jumlah Saudara (selain diri sendiri)</label>
                        <input
                            type="number"
                            {...register("jumlah_saudara")}
                            className="input-field"
                            placeholder="0"
                            min={0}
                        />
                        {errors.jumlah_saudara && <p className="error-text">{errors.jumlah_saudara.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
