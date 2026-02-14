"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { MasterSchemaType } from "@/lib/schema-master";
import { FileText, Upload } from "lucide-react";

export default function SectionKeluarga() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<MasterSchemaType>();

    // useWatch agar compatible dengan React Compiler
    const kondisiAyah = useWatch({ control, name: "kondisi_ayah" });
    const kondisiIbu = useWatch({ control, name: "kondisi_ibu" });

    // Watch file fields untuk preview
    const wFileKK = useWatch({ control, name: "file_kk" });
    const wFileSKTM = useWatch({ control, name: "file_sktm" });
    const wFileSKB = useWatch({ control, name: "file_skb" });

    const isOrtuNonAktif = (kondisiAyah === "Tidak Bekerja" || kondisiAyah === "Wafat") &&
        (kondisiIbu === "Tidak Bekerja" || kondisiIbu === "Wafat");

    // Component Helper untuk File Upload dengan Preview
    const FileUploadField = ({ label, name, placeholder, fileData }: { label: string, name: keyof MasterSchemaType, placeholder: string, fileData?: any }) => {
        const file = fileData?.[0];
        const isImage = file && file.type?.startsWith("image/");

        return (
            <div className="mb-4">
                <label className="label-text">{label} <span className="text-red-500">*</span></label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer text-center relative">
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        {...register(name)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id={`upload-${name}`}
                    />
                    {file ? (
                        <div className="flex flex-col items-center pointer-events-none">
                            {isImage ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={URL.createObjectURL(file)} alt="Preview" className="w-20 h-20 object-cover rounded-lg border mb-2" />
                            ) : (
                                <FileText className="w-8 h-8 text-blue-500 mb-2" />
                            )}
                            <span className="text-xs text-green-600 font-medium truncate max-w-full">{file.name}</span>
                            <span className="text-xs text-blue-500 mt-1">Klik untuk ganti</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center pointer-events-none">
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm font-medium text-gray-600">{placeholder}</span>
                            <span className="text-xs text-gray-400 mt-1">File size &lt;10MB, Format JPG/PNG/PDF (Hanya 1 file)</span>
                        </div>
                    )}
                </div>
                {errors[name] && <p className="error-text">{String(errors[name]?.message)}</p>}
            </div>
        );
    };

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
                        fileData={wFileKK}
                    />
                    <FileUploadField
                        label="Surat Keterangan Tidak Mampu"
                        name="file_sktm"
                        placeholder="Foto Dokumen tidak boleh blur"
                        fileData={wFileSKTM}
                    />
                    <FileUploadField
                        label="Surat Kelakuan Baik dari Sekolah"
                        name="file_skb"
                        placeholder="Foto Dokumen tidak boleh blur"
                        fileData={wFileSKB}
                    />
                </div>

                <hr className="border-gray-100" />

                {/* --- DATA AYAH (d, f) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label-text">Nama Ayah</label>
                        <input {...register("nama_ayah")} className="input-field" placeholder="Nama Lengkap Ayah" />
                        {errors.nama_ayah && <p className="error-text">{errors.nama_ayah.message}</p>}
                    </div>
                    <div>
                        <label className="label-text">Kondisi Ayah</label>
                        <select {...register("kondisi_ayah")} className="input-field">
                            <option value="">Pilih...</option>
                            <option value="Bekerja">Bekerja</option>
                            <option value="Tidak Bekerja">Tidak Bekerja</option>
                            <option value="Wafat">Wafat</option>
                        </select>
                        {errors.kondisi_ayah && <p className="error-text">{errors.kondisi_ayah.message}</p>}
                    </div>
                </div>

                {/* --- DATA IBU (e, g) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label-text">Nama Ibu</label>
                        <input {...register("nama_ibu")} className="input-field" placeholder="Nama Lengkap Ibu" />
                        {errors.nama_ibu && <p className="error-text">{errors.nama_ibu.message}</p>}
                    </div>
                    <div>
                        <label className="label-text">Kondisi Ibu</label>
                        <select {...register("kondisi_ibu")} className="input-field">
                            <option value="">Pilih...</option>
                            <option value="Bekerja">Bekerja</option>
                            <option value="Tidak Bekerja">Tidak Bekerja</option>
                            <option value="Wafat">Wafat</option>
                        </select>
                        {errors.kondisi_ibu && <p className="error-text">{errors.kondisi_ibu.message}</p>}
                    </div>
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
                        <label className="label-text">{isOrtuNonAktif ? "Kontak Wali" : "Kontak Orang tua"}</label>
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