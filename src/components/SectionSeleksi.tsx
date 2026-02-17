"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { MasterSchemaType } from "@/lib/schema-master";
import { Plus, Trash2, Trophy, Users, BookOpen } from "lucide-react";
import { useEffect, useMemo } from "react";
import FileUploadField from "./FileUploadField";

export default function SectionSeleksi() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<MasterSchemaType>();

    // Array Field untuk Organisasi & Prestasi
    const { fields: orgFields, append: appendOrg, remove: removeOrg } = useFieldArray({
        control,
        name: "list_organisasi",
    });

    const { fields: presFields, append: appendPres, remove: removePres } = useFieldArray({
        control,
        name: "list_prestasi",
    });

    // useWatch agar compatible dengan React Compiler
    const wBeasiswa = useWatch({ control, name: "status_beasiswa" });
    const wToggleOrg = useWatch({ control, name: "toggle_organisasi" });
    const wTogglePres = useWatch({ control, name: "toggle_prestasi" });
    const wToggleHafalan = useWatch({ control, name: "toggle_hafalan" });
    const wListOrg = useWatch({ control, name: "list_organisasi" });

    // Watch file fields untuk preview
    const wFotoRaport1 = useWatch({ control, name: "foto_raport_1" });
    const wFotoRaport2 = useWatch({ control, name: "foto_raport_2" });
    const wFotoRaport3 = useWatch({ control, name: "foto_raport_3" });

    // Cleanup Object URLs untuk preview raport
    const raport1Preview = useMemo(() => {
        const f = wFotoRaport1?.[0]; return f?.type?.startsWith("image/") ? URL.createObjectURL(f) : null;
    }, [wFotoRaport1]);
    const raport2Preview = useMemo(() => {
        const f = wFotoRaport2?.[0]; return f?.type?.startsWith("image/") ? URL.createObjectURL(f) : null;
    }, [wFotoRaport2]);
    const raport3Preview = useMemo(() => {
        const f = wFotoRaport3?.[0]; return f?.type?.startsWith("image/") ? URL.createObjectURL(f) : null;
    }, [wFotoRaport3]);

    useEffect(() => { return () => { if (raport1Preview) URL.revokeObjectURL(raport1Preview); }; }, [raport1Preview]);
    useEffect(() => { return () => { if (raport2Preview) URL.revokeObjectURL(raport2Preview); }; }, [raport2Preview]);
    useEffect(() => { return () => { if (raport3Preview) URL.revokeObjectURL(raport3Preview); }; }, [raport3Preview]);

    // (FileUpload extracted to shared FileUploadField component)

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 my-4 md:my-10 p-4 md:p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Seleksi & Prestasi
            </h2>

            <div className="space-y-8">

                {/* --- SEKOLAH & RAPORT (a-h) --- */}
                <section className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label-text">Asal Sekolah</label>
                            <input {...register("asal_sekolah")} className="input-field" placeholder="Nama Lengkap Sekolah" />
                            {errors.asal_sekolah && <p className="error-text">{errors.asal_sekolah.message}</p>}
                        </div>
                        <div>
                            <label className="label-text">Jenjang Pendidikan</label>
                            <select {...register("jenjang_pendidikan")} className="input-field">
                                <option value="">Pilih...</option>
                                <option value="SMA">SMA</option>
                                <option value="MA">MA</option>
                                <option value="SMK">SMK</option>
                            </select>
                            {errors.jenjang_pendidikan && <p className="error-text">{errors.jenjang_pendidikan.message}</p>}
                        </div>
                    </div>

                    {/* Grid Raport: Foto & Nilai */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 bg-slate-50 p-4 rounded-lg border">
                        {/* Semester 1 */}
                        <FileUploadField label="Foto Raport Semester 1" name="foto_raport_1" preview={raport1Preview} fileData={wFotoRaport1} compact />
                        <div>
                            <label className="label-text">Nilai Rata-rata Sem 1</label>
                            <input type="number" step="0.01" {...register("nilai_raport_1")} className="input-field" placeholder="85.50" />
                            {errors.nilai_raport_1 && <p className="error-text">{errors.nilai_raport_1.message}</p>}
                        </div>

                        {/* Semester 2 */}
                        <FileUploadField label="Foto Raport Semester 2" name="foto_raport_2" preview={raport2Preview} fileData={wFotoRaport2} compact />
                        <div>
                            <label className="label-text">Nilai Rata-rata Sem 2</label>
                            <input type="number" step="0.01" {...register("nilai_raport_2")} className="input-field" placeholder="85.50" />
                            {errors.nilai_raport_2 && <p className="error-text">{errors.nilai_raport_2.message}</p>}
                        </div>

                        {/* Semester 3 */}
                        <FileUploadField label="Foto Raport Semester 3" name="foto_raport_3" preview={raport3Preview} fileData={wFotoRaport3} compact />
                        <div>
                            <label className="label-text">Nilai Rata-rata Sem 3</label>
                            <input type="number" step="0.01" {...register("nilai_raport_3")} className="input-field" placeholder="85.50" />
                            {errors.nilai_raport_3 && <p className="error-text">{errors.nilai_raport_3.message}</p>}
                        </div>
                    </div>
                </section>

                {/* --- i. BEASISWA --- */}
                <section>
                    <label className="label-text">Sedang mendapatkan beasiswa?</label>
                    <select {...register("status_beasiswa")} className="input-field">
                        <option value="">Pilih...</option>
                        <option value="Tidak">Tidak</option>
                        <option value="Ya_PIP">Ya, mendapat PIP</option>
                        <option value="Ya_Lainnya">Ya, mendapat beasiswa lain</option>
                    </select>
                    {wBeasiswa === "Ya_Lainnya" && (
                        <div className="mt-2 animate-in fade-in slide-in-from-top-1">
                            <input {...register("keterangan_beasiswa")} className="input-field" placeholder="Sebutkan nama beasiswa lain..." />
                            {errors.keterangan_beasiswa && <p className="error-text">{errors.keterangan_beasiswa.message}</p>}
                        </div>
                    )}
                </section>

                {/* --- j. ORGANISASI (Toggle) --- */}
                <section className="border rounded-xl p-4 md:p-5 bg-white shadow-sm">
                    <div className="flex items-start md:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <Users className="text-blue-600 shrink-0" />
                            <label className="font-bold text-gray-700 text-sm md:text-base">3 Pengalaman Organisasi Terbaik</label>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-gray-400 hidden md:inline">Aktifkan jika punya</span>
                            <input type="checkbox" {...register("toggle_organisasi")} className="w-5 h-5 accent-blue-600" />
                        </div>
                    </div>

                    {wToggleOrg && (
                        <div className="space-y-4 animate-in fade-in">
                            {orgFields.map((field, index) => (
                                <div key={field.id} className="p-4 bg-gray-50 rounded-lg border relative">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Jenis Organisasi */}
                                        <div>
                                            <label className="label-text text-xs">Jenis Organisasi</label>
                                            <select {...register(`list_organisasi.${index}.jenis`)} className="input-field text-sm">
                                                <option value="">Pilih...</option>
                                                <option value="OSIS">OSIS</option>
                                                <option value="Rohis">Rohis</option>
                                                <option value="UKM">UKM</option>
                                                <option value="Komunitas">Komunitas</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </select>
                                            {/* Conditional Input Lainnya dalam Array */}
                                            {wListOrg?.[index]?.jenis === "Lainnya" && (
                                                <input
                                                    {...register(`list_organisasi.${index}.ket_lainnya`)}
                                                    className="input-field mt-2 text-sm"
                                                    placeholder="Sebutkan organisasi..."
                                                />
                                            )}
                                        </div>

                                        {/* Level Jabatan */}
                                        <div>
                                            <label className="label-text text-xs">Level Jabatan</label>
                                            <select {...register(`list_organisasi.${index}.jabatan`)} className="input-field text-sm">
                                                <option value="">Pilih...</option>
                                                <option value="Ketua">Ketua/Wakil Ketua</option>
                                                <option value="Pengurus">Pengurus Inti</option>
                                                <option value="Anggota">Anggota</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button type="button" onClick={() => removeOrg(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            {/* Tombol Tambah */}
                            {orgFields.length < 3 && (
                                <button type="button" onClick={() => appendOrg({ jenis: "", jabatan: "" as "Ketua" })} className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                    <Plus size={16} /> Tambah Pengalaman Terbaik (Max 3)
                                </button>
                            )}
                            {errors.list_organisasi && <p className="error-text">{errors.list_organisasi.message}</p>}
                        </div>
                    )}
                </section>

                {/* --- k. PRESTASI (Toggle) --- */}
                <section className="border rounded-xl p-4 md:p-5 bg-white shadow-sm">
                    <div className="flex items-start md:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <Trophy className="text-yellow-500 shrink-0" />
                            <label className="font-bold text-gray-700 text-sm md:text-base">3 Prestasi Terbaik</label>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-gray-400 hidden md:inline">Aktifkan jika punya</span>
                            <input type="checkbox" {...register("toggle_prestasi")} className="w-5 h-5 accent-yellow-500" />
                        </div>
                    </div>

                    {wTogglePres && (
                        <div className="space-y-4 animate-in fade-in">
                            {presFields.map((field, index) => (
                                <div key={field.id} className="p-4 bg-yellow-50/50 rounded-lg border relative">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="label-text text-xs">Tingkat Prestasi</label>
                                            <select {...register(`list_prestasi.${index}.tingkat`)} className="input-field text-sm">
                                                <option value="">Pilih...</option>
                                                <option value="Sekolah">Sekolah</option>
                                                <option value="Kab/Kota">Kab/Kota</option>
                                                <option value="Provinsi">Provinsi</option>
                                                <option value="Nasional">Nasional</option>
                                                <option value="Internasional">Internasional</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label-text text-xs">Tingkat Kejuaraan</label>
                                            <select {...register(`list_prestasi.${index}.juara`)} className="input-field text-sm">
                                                <option value="">Pilih...</option>
                                                <option value="Juara 1">Juara 1</option>
                                                <option value="Juara 2">Juara 2</option>
                                                <option value="Juara 3">Juara 3</option>
                                                <option value="Juara Favorit">Juara Favorit</option>
                                                <option value="Finalis">Finalis</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label-text text-xs">Keterangan Lomba</label>
                                            <input {...register(`list_prestasi.${index}.keterangan`)} className="input-field text-sm" placeholder="Contoh: Olimpiade Matematika" />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removePres(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-600">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}

                            {presFields.length < 3 && (
                                <button type="button" onClick={() => appendPres({ tingkat: "", juara: "", keterangan: "" })} className="text-sm font-bold text-yellow-600 flex items-center gap-1 hover:underline">
                                    <Plus size={16} /> Tambah Prestasi Terbaik (Max 3)
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* --- l. HAFALAN QURAN (Toggle) --- */}
                <section className="border rounded-xl p-4 md:p-5 bg-white shadow-sm">
                    <div className="flex items-start md:items-center justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2 min-w-0">
                            <BookOpen className="text-green-600 shrink-0" />
                            <label className="font-bold text-gray-700 text-sm md:text-base">Hafalan Quran</label>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-gray-400 hidden md:inline">Aktifkan jika punya</span>
                            <input type="checkbox" {...register("toggle_hafalan")} className="w-5 h-5 accent-green-600" />
                        </div>
                    </div>

                    {wToggleHafalan && (
                        <div className="animate-in fade-in">
                            <label className="label-text">Jumlah Hafalan</label>
                            <select {...register("kategori_hafalan")} className="input-field">
                                <option value="">Pilih...</option>
                                <option value="Surat Pendek">10 Surat-Surat Pendek Al Fiil - An-Naas</option>
                                <option value="Juz 30">Juz 30</option>
                                <option value="3 Juz">3 Juz</option>
                                <option value=">3 Juz">&gt;3 Juz</option>
                            </select>
                            {errors.kategori_hafalan && <p className="error-text">{errors.kategori_hafalan.message}</p>}
                        </div>
                    )}
                </section>

                {/* --- m & n. ESAI & SUMBER INFO --- */}
                <section className="space-y-4 border-t pt-6">
                    <div>
                        <label className="label-text">Motivasi Bergabung YES</label>
                        <textarea {...register("motivasi")} className="input-field h-32" placeholder="Ceritakan motivasi kamu..." />
                        {errors.motivasi && <p className="error-text">{errors.motivasi.message}</p>}
                    </div>

                    <div>
                        <label className="label-text">Sumber informasi seleksi YES</label>
                        <select {...register("sumber_info")} className="input-field">
                            <option value="">Pilih...</option>
                            <option value="IG">Instagram</option>
                            <option value="Website">Website</option>
                            <option value="Whatsapp">Whatsapp</option>
                        </select>
                        {errors.sumber_info && <p className="error-text">{errors.sumber_info.message}</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}