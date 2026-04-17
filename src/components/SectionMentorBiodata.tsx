"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MentorSchemaType } from "@/lib/schema-mentor";
import { Upload, AlertCircle } from "lucide-react";

const MAX_FOTO_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Tipe Data API Emsifa
type Region = {
    id: string;
    name: string;
};

const cleanRegionName = (name: string) => {
    if (!name) return "";
    // 1. Hapus karakter non-printable/zero-width
    let cleaned = name.replace(/[\u200B-\u200D\uFEFF]/g, "");
    
    // 2. Deteksi spasi ganjil (seperti K O T A  D U M A I)
    // Jika jumlah spasi sangat banyak dibanding panjang teks, kemungkinan besar spasi antar karakter
    const spaceCount = (cleaned.match(/\s/g) || []).length;
    if (spaceCount > 0 && spaceCount >= (cleaned.length / 3)) {
         cleaned = cleaned.replace(/\s/g, "");
         // Kembalikan spasi standar setelah KOTA atau KABUPATEN
         cleaned = cleaned.replace(/^(KOTA|KABUPATEN)(.+)$/, "$1 $2");
    }

    // 3. Normalisasi spasi ganda dan trim
    return cleaned.replace(/\s+/g, " ").trim().toUpperCase();
};

export default function SectionMentorBiodata() {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext<MentorSchemaType>();

    const [fotoError, setFotoError] = useState<string | null>(null);

    const { onChange: fotoRhfOnChange, ...fotoRestRegister } = register("foto_profil");

    const handleFotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setFotoError(null);

        if (file) {
            const issues: string[] = [];
            if (!ACCEPTED_TYPES.includes(file.type)) {
                issues.push("Format file harus JPG, PNG, atau WebP");
            }
            if (file.size > MAX_FOTO_SIZE) {
                const sizeMB = (file.size / 1024 / 1024).toFixed(1);
                issues.push(`Ukuran file ${sizeMB}MB melebihi batas maksimal 20MB`);
            }
            if (issues.length > 0) {
                setFotoError(issues.join(". "));
                e.target.value = "";
                setValue("foto_profil", undefined as any, { shouldValidate: false });
                return;
            }
        }
        fotoRhfOnChange(e);
    }, [fotoRhfOnChange, setValue]);

    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [villages, setVillages] = useState<Region[]>([]);
    const [loadingWilayah, setLoadingWilayah] = useState<string | null>(null);

    const fotoProfil = useWatch({ control, name: "foto_profil" });
    const selectedProvinsi = useWatch({ control, name: "provinsi" });
    const selectedKabupaten = useWatch({ control, name: "kabupaten" });
    const selectedKecamatan = useWatch({ control, name: "kecamatan" });
    const selectedKelurahan = useWatch({ control, name: "kelurahan" });

    const fotoPreview = useMemo(() => {
        if (fotoProfil?.[0]) return URL.createObjectURL(fotoProfil[0]);
        return null;
    }, [fotoProfil]);

    useEffect(() => {
        return () => { if (fotoPreview) URL.revokeObjectURL(fotoPreview); };
    }, [fotoPreview]);

    const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

    useEffect(() => {
        setLoadingWilayah("provinsi");
        fetch(`${BASE_URL}/provinces.json`)
            .then((res) => res.json())
            .then((data: Region[]) => setProvinces(data))
            .catch((err) => console.error(err))
            .finally(() => setLoadingWilayah(null));
    }, []);

    useEffect(() => {
        if (selectedProvinsi) {
            setLoadingWilayah("kabupaten");
            fetch(`${BASE_URL}/regencies/${selectedProvinsi}.json`)
                .then((res) => res.json())
                .then((data) => setRegencies(data))
                .finally(() => setLoadingWilayah(null));
            setValue("kabupaten", "");
            setValue("kecamatan", "");
            setValue("kelurahan", "");
            
            const found = provinces.find(p => p.id === selectedProvinsi);
            if (found) setValue("provinsi_nama", cleanRegionName(found.name));
        }
    }, [selectedProvinsi, setValue, provinces]);

    useEffect(() => {
        if (selectedKabupaten) {
            setLoadingWilayah("kecamatan");
            fetch(`${BASE_URL}/districts/${selectedKabupaten}.json`)
                .then((res) => res.json())
                .then((data) => setDistricts(data))
                .finally(() => setLoadingWilayah(null));
            setValue("kecamatan", "");
            setValue("kelurahan", "");

            const found = regencies.find(r => r.id === selectedKabupaten);
            if (found) setValue("kabupaten_nama", cleanRegionName(found.name));
        }
    }, [selectedKabupaten, setValue, regencies]);

    useEffect(() => {
        if (selectedKecamatan) {
            setLoadingWilayah("kelurahan");
            fetch(`${BASE_URL}/villages/${selectedKecamatan}.json`)
                .then((res) => res.json())
                .then((data) => setVillages(data))
                .finally(() => setLoadingWilayah(null));
            setValue("kelurahan", "");

            const found = districts.find(d => d.id === selectedKecamatan);
            if (found) setValue("kecamatan_nama", cleanRegionName(found.name));
        }
    }, [selectedKecamatan, setValue, districts]);

    useEffect(() => {
        if (selectedKelurahan) {
            const found = villages.find(v => v.id === selectedKelurahan);
            if (found) setValue("kelurahan_nama", cleanRegionName(found.name));
        }
    }, [selectedKelurahan, setValue, villages]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 my-4 p-4 md:p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Biodata Diri
            </h2>

            <div className="space-y-6">
                {/* a. FOTO PROFIL */}
                <div>
                    <label className="label-text text-sm font-semibold text-slate-700">Foto Profil Terbaru <span className="text-red-500">*</span></label>
                    <div className={`mt-2 border-2 border-dashed rounded-xl p-6 hover:bg-slate-50 transition cursor-pointer text-center ${fotoError || errors.foto_profil ? "border-red-400 bg-red-50" : "border-slate-200"}`}>
                        <input
                            type="file"
                            accept="image/*"
                            {...fotoRestRegister}
                            onChange={handleFotoChange}
                            className="hidden"
                            id="upload-foto"
                        />
                        <label htmlFor="upload-foto" className="cursor-pointer flex flex-col items-center">
                            {fotoProfil?.[0] && fotoPreview ? (
                                <>
                                    <img
                                        src={fotoPreview}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-full mb-2 border-2 border-blue-300"
                                    />
                                    <span className="text-xs text-green-600 font-medium">{fotoProfil[0].name}</span>
                                    <span className="text-xs text-blue-500 mt-1">Klik untuk ganti foto</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                    <span className="text-sm font-medium text-slate-600">Klik untuk unggah</span>
                                    <span className="text-xs text-slate-400 mt-1">Format JPG/PNG/WebP (Max 20MB)</span>
                                </>
                            )}
                        </label>
                    </div>
                    {errors.foto_profil && <p className="error-text text-red-500 text-xs mt-1">{errors.foto_profil.message as string}</p>}
                </div>

                {/* b. NAMA LENGKAP */}
                <div>
                    <label className="label-text text-sm font-semibold text-slate-700">Nama Lengkap dan Gelar</label>
                    <input {...register("nama_lengkap")} className="input-field mt-1" placeholder="Contoh: Siska Ahsani, S.Pd" />
                    {errors.nama_lengkap && <p className="error-text text-red-500 text-xs mt-1">{errors.nama_lengkap.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* c. JENIS KELAMIN */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Jenis Kelamin</label>
                        <select {...register("jenis_kelamin")} className="input-field mt-1">
                            <option value="">Pilih....</option>
                            <option value="Laki-Laki">Laki-Laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                        {errors.jenis_kelamin && <p className="error-text text-red-500 text-xs mt-1">{errors.jenis_kelamin.message}</p>}
                    </div>

                    {/* g. STATUS PERNIKAHAN */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Status Pernikahan</label>
                        <select {...register("status_pernikahan")} className="input-field mt-1">
                            <option value="">Pilih....</option>
                            <option value="Belum Menikah">Belum Menikah</option>
                            <option value="Menikah">Menikah</option>
                            <option value="Pernah Menikah">Pernah Menikah</option>
                        </select>
                        {errors.status_pernikahan && <p className="error-text text-red-500 text-xs mt-1">{errors.status_pernikahan.message}</p>}
                    </div>

                    {/* d. TEMPAT LAHIR */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Tempat Lahir</label>
                        <input {...register("tempat_lahir")} className="input-field mt-1" />
                        {errors.tempat_lahir && <p className="error-text text-red-500 text-xs mt-1">{errors.tempat_lahir.message}</p>}
                    </div>

                    {/* e. TANGGAL LAHIR */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Tanggal Lahir</label>
                        <input type="date" {...register("tanggal_lahir")} className="input-field mt-1" />
                        {errors.tanggal_lahir && <p className="error-text text-red-500 text-xs mt-1">{errors.tanggal_lahir.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* e. EMAIL */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Email (Wajib Gmail)</label>
                        <input type="email" {...register("email")} className="input-field mt-1" placeholder="nama@gmail.com" />
                        {errors.email && <p className="error-text text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    {/* f. WHATSAPP */}
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Nomor Whatsapp</label>
                        <div className="flex items-stretch border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 mt-1">
                            <span className="flex items-center px-3 bg-slate-50 border-r border-slate-200 text-slate-500 font-medium text-sm">+62</span>
                            <input
                                type="tel"
                                {...register("whatsapp")}
                                maxLength={13}
                                className="flex-1 px-3 py-2.5 text-sm outline-none bg-white"
                                placeholder="8xxxxxxxxxx"
                            />
                        </div>
                        {errors.whatsapp && <p className="error-text text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
                    </div>
                </div>

                {/* --- DOMISILI (Cascading Dropdown) --- */}
                <div className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-slate-800">Alamat Domisili</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label-text text-sm font-semibold text-slate-700">Provinsi</label>
                            <select {...register("provinsi")} className="input-field mt-1" disabled={loadingWilayah === "provinsi"}>
                                <option value="">Pilih...</option>
                                {provinces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            {errors.provinsi && <p className="error-text text-red-500 text-xs mt-1">{errors.provinsi.message}</p>}
                        </div>

                        <div>
                            <label className="label-text text-sm font-semibold text-slate-700">Kabupaten/Kota</label>
                            <select {...register("kabupaten")} className="input-field mt-1" disabled={!selectedProvinsi || loadingWilayah === "kabupaten"}>
                                <option value="">Pilih...</option>
                                {regencies.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                            </select>
                            {errors.kabupaten && <p className="error-text text-red-500 text-xs mt-1">{errors.kabupaten.message}</p>}
                        </div>

                        <div>
                            <label className="label-text text-sm font-semibold text-slate-700">Kecamatan</label>
                            <select {...register("kecamatan")} className="input-field mt-1" disabled={!selectedKabupaten || loadingWilayah === "kecamatan"}>
                                <option value="">Pilih...</option>
                                {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="label-text text-sm font-semibold text-slate-700">Kelurahan</label>
                            <select {...register("kelurahan")} className="input-field mt-1" disabled={!selectedKecamatan || loadingWilayah === "kelurahan"}>
                                <option value="">Pilih...</option>
                                {villages.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="label-text text-sm font-semibold text-slate-700">Alamat Detail</label>
                        <textarea {...register("alamat_detail")} className="input-field mt-1 h-24" placeholder="Jalan, No. Rumah, RT/RW" />
                        {errors.alamat_detail && <p className="error-text text-red-500 text-xs mt-1">{errors.alamat_detail.message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
