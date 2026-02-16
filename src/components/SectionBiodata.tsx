"use client";

import { useState, useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MasterSchemaType } from "@/lib/schema-master";
import { Upload, FileText } from "lucide-react";

// Tipe Data API Emsifa
type Region = {
    id: string;
    name: string;
};

export default function SectionBiodata() {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext<MasterSchemaType>();

    // --- STATE UNTUK API WILAYAH ---
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [villages, setVillages] = useState<Region[]>([]);
    const [loadingWilayah, setLoadingWilayah] = useState<string | null>(null);

    // useWatch agar compatible dengan React Compiler
    const fotoDiri = useWatch({ control, name: "foto_diri" });
    const selectedProvinsi = useWatch({ control, name: "provinsi" });
    const selectedKabupaten = useWatch({ control, name: "kabupaten" });
    const selectedKecamatan = useWatch({ control, name: "kecamatan" });
    const selectedKelurahan = useWatch({ control, name: "kelurahan" });

    // Cleanup Object URL untuk preview foto
    const fotoDiriPreview = useMemo(() => {
        if (fotoDiri?.[0]) return URL.createObjectURL(fotoDiri[0]);
        return null;
    }, [fotoDiri]);

    useEffect(() => {
        return () => { if (fotoDiriPreview) URL.revokeObjectURL(fotoDiriPreview); };
    }, [fotoDiriPreview]);

    const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

    // 1. Fetch Provinsi saat mount
    useEffect(() => {
        setLoadingWilayah("provinsi");
        fetch(`${BASE_URL}/provinces.json`)
            .then((res) => {
                if (!res.ok) throw new Error("Gagal memuat provinsi");
                return res.json();
            })
            .then((data) => setProvinces(data))
            .catch((err) => console.error(err.message))
            .finally(() => setLoadingWilayah(null));
    }, []);

    // 2. Fetch Kabupaten saat Provinsi berubah
    useEffect(() => {
        if (selectedProvinsi) {
            setLoadingWilayah("kabupaten");
            fetch(`${BASE_URL}/regencies/${selectedProvinsi}.json`)
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal memuat kabupaten");
                    return res.json();
                })
                .then((data) => setRegencies(data))
                .catch((err) => console.error(err.message))
                .finally(() => setLoadingWilayah(null));
            // Reset anak-anaknya
            setValue("kabupaten", "");
            setValue("kecamatan", "");
            setValue("kelurahan", "");
        }
    }, [selectedProvinsi, setValue]);

    // 2b. Simpan nama provinsi & kabupaten untuk pre-screening
    useEffect(() => {
        if (selectedProvinsi && provinces.length > 0) {
            const found = provinces.find((p) => p.id === selectedProvinsi);
            if (found) setValue("provinsi_nama", found.name);
        }
    }, [selectedProvinsi, provinces, setValue]);

    useEffect(() => {
        if (selectedKabupaten && regencies.length > 0) {
            const found = regencies.find((r) => r.id === selectedKabupaten);
            if (found) setValue("kabupaten_nama", found.name);
        }
    }, [selectedKabupaten, regencies, setValue]);

    // 3. Fetch Kecamatan saat Kabupaten berubah
    useEffect(() => {
        if (selectedKabupaten) {
            setLoadingWilayah("kecamatan");
            fetch(`${BASE_URL}/districts/${selectedKabupaten}.json`)
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal memuat kecamatan");
                    return res.json();
                })
                .then((data) => setDistricts(data))
                .catch((err) => console.error(err.message))
                .finally(() => setLoadingWilayah(null));
            setValue("kecamatan", "");
            setValue("kelurahan", "");
            // Reset names
            setValue("kecamatan_nama", "");
            setValue("kelurahan_nama", "");
        }
    }, [selectedKabupaten, setValue]);

    // 3b. Simpan nama kecamatan
    useEffect(() => {
        if (selectedKecamatan && districts.length > 0) {
            const found = districts.find((d) => d.id === selectedKecamatan);
            if (found) setValue("kecamatan_nama", found.name);
        }
    }, [selectedKecamatan, districts, setValue]);

    // 4. Fetch Kelurahan saat Kecamatan berubah
    useEffect(() => {
        if (selectedKecamatan) {
            setLoadingWilayah("kelurahan");
            fetch(`${BASE_URL}/villages/${selectedKecamatan}.json`)
                .then((res) => {
                    if (!res.ok) throw new Error("Gagal memuat kelurahan");
                    return res.json();
                })
                .then((data) => setVillages(data))
                .catch((err) => console.error(err.message))
                .finally(() => setLoadingWilayah(null));
            setValue("kelurahan", "");
            setValue("kelurahan_nama", "");
        }
    }, [selectedKecamatan, setValue]);

    // 4b. Simpan nama kelurahan
    useEffect(() => {
        if (selectedKelurahan && villages.length > 0) {
            const found = villages.find((v) => v.id === selectedKelurahan);
            if (found) setValue("kelurahan_nama", found.name);
        }
    }, [selectedKelurahan, villages, setValue]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white shadow-xl rounded-2xl border border-gray-100 my-4 md:my-10 p-4 md:p-8 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Biodata Diri
            </h2>

            <div className="space-y-6">

                {/* a. FOTO DIRI */}
                <div>
                    <label className="label-text">Unggah Foto Diri <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer text-center">
                        <input
                            type="file"
                            accept="image/*"
                            {...register("foto_diri")}
                            className="hidden"
                            id="upload-foto"
                        />
                        <label htmlFor="upload-foto" className="cursor-pointer flex flex-col items-center">
                            {fotoDiri?.[0] && fotoDiriPreview ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={fotoDiriPreview}
                                        alt="Preview foto diri"
                                        className="w-32 h-32 object-cover rounded-full mb-2 border-2 border-blue-300"
                                    />
                                    <span className="text-xs text-green-600 font-medium">{fotoDiri[0].name}</span>
                                    <span className="text-xs text-blue-500 mt-1">Klik untuk ganti foto</span>
                                </>
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-sm font-medium text-gray-600">Klik untuk unggah</span>
                                    <span className="text-xs text-gray-400 mt-1">Close Up Wajah/Setengah badan (size file &lt;1MB hanya 1 file)</span>
                                </>
                            )}
                        </label>
                    </div>
                    {errors.foto_diri && <p className="error-text">{String(errors.foto_diri.message)}</p>}
                </div>

                {/* b. NAMA LENGKAP */}
                <div>
                    <label className="label-text">Nama Lengkap</label>
                    <input {...register("nama")} className="input-field" placeholder="Sesuai KTP" />
                    {errors.nama && <p className="error-text">{errors.nama.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* c. NO KTP */}
                    <div>
                        <label className="label-text">No KTP</label>
                        <input {...register("nik")} maxLength={16} className="input-field" placeholder="16 Digit" />
                        {errors.nik && <p className="error-text">{errors.nik.message}</p>}
                    </div>

                    {/* d. NO KK */}
                    <div>
                        <label className="label-text">No KK</label>
                        <input {...register("no_kk")} maxLength={16} className="input-field" placeholder="16 Digit" />
                        {errors.no_kk && <p className="error-text">{errors.no_kk.message}</p>}
                    </div>

                    {/* e. JENIS KELAMIN */}
                    <div>
                        <label className="label-text">Jenis Kelamin</label>
                        <select {...register("jenis_kelamin")} className="input-field">
                            <option value="">Pilih....</option>
                            <option value="Laki-Laki">Laki-Laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                        {errors.jenis_kelamin && <p className="error-text">{errors.jenis_kelamin.message}</p>}
                    </div>

                    {/* f. AGAMA */}
                    <div>
                        <label className="label-text">Agama</label>
                        <select {...register("agama")} className="input-field">
                            <option value="">Pilih....</option>
                            <option value="Islam">Islam</option>
                            <option value="Kristen">Kristen</option>
                            <option value="Katolik">Katolik</option>
                            <option value="Hindu">Hindu</option>
                            <option value="Buddha">Buddha</option>
                            <option value="Konghucu">Konghucu</option>
                        </select>
                        {errors.agama && <p className="error-text">{errors.agama.message}</p>}
                    </div>

                    {/* g. TEMPAT LAHIR */}
                    <div>
                        <label className="label-text">Tempat Lahir</label>
                        <input {...register("tempat_lahir")} className="input-field" />
                        {errors.tempat_lahir && <p className="error-text">{errors.tempat_lahir.message}</p>}
                    </div>

                    {/* h. TANGGAL LAHIR */}
                    <div>
                        <label className="label-text">Tanggal Lahir</label>
                        <input type="date" {...register("tanggal_lahir")} className="input-field" />
                        {errors.tanggal_lahir && <p className="error-text">{errors.tanggal_lahir.message}</p>}
                    </div>
                </div>

                {/* i. EMAIL */}
                <div>
                    <label className="label-text">Email (Wajib Gmail)</label>
                    <input type="email" {...register("email")} className="input-field" placeholder="nama@gmail.com" />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                </div>

                {/* j. WHATSAPP */}
                <div>
                    <label className="label-text">No Whatsapp</label>
                    <input type="tel" {...register("whatsapp")} className="input-field" placeholder="08...." />
                    {errors.whatsapp && <p className="error-text">{errors.whatsapp.message}</p>}
                </div>

                {/* --- CASCADING DROPDOWN WILAYAH (API EMSIFA) --- */}
                <div className="space-y-4 border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-700">Alamat Domisili</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* k. PROVINSI */}
                        <div>
                            <label className="label-text">Provinsi</label>
                            <select {...register("provinsi")} className="input-field" disabled={loadingWilayah === "provinsi"}>
                                <option value="">{loadingWilayah === "provinsi" ? "Memuat..." : "Pilih..."}</option>
                                {provinces.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.provinsi && <p className="error-text">{errors.provinsi.message}</p>}
                        </div>

                        {/* l. KABUPATEN/KOTA */}
                        <div>
                            <label className="label-text">Kabupaten/Kota</label>
                            <select
                                {...register("kabupaten")}
                                className="input-field disabled:bg-gray-100"
                                disabled={!selectedProvinsi || loadingWilayah === "kabupaten"}
                            >
                                <option value="">{loadingWilayah === "kabupaten" ? "Memuat..." : "Pilih..."}</option>
                                {regencies.map((r) => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                            {errors.kabupaten && <p className="error-text">{errors.kabupaten.message}</p>}
                        </div>

                        {/* m. KECAMATAN */}
                        <div>
                            <label className="label-text">Kecamatan</label>
                            <select
                                {...register("kecamatan")}
                                className="input-field disabled:bg-gray-100"
                                disabled={!selectedKabupaten || loadingWilayah === "kecamatan"}
                            >
                                <option value="">{loadingWilayah === "kecamatan" ? "Memuat..." : "Pilih..."}</option>
                                {districts.map((d) => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
                            {errors.kecamatan && <p className="error-text">{errors.kecamatan.message}</p>}
                        </div>

                        {/* n. KELURAHAN */}
                        <div>
                            <label className="label-text">Kelurahan</label>
                            <select
                                {...register("kelurahan")}
                                className="input-field disabled:bg-gray-100"
                                disabled={!selectedKecamatan || loadingWilayah === "kelurahan"}
                            >
                                <option value="">{loadingWilayah === "kelurahan" ? "Memuat..." : "Pilih..."}</option>
                                {villages.map((v) => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            {errors.kelurahan && <p className="error-text">{errors.kelurahan.message}</p>}
                        </div>
                    </div>

                    {/* o. ALAMAT DETAIL (Muncul setelah Kelurahan dipilih) */}
                    {selectedKelurahan && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="label-text">Alamat Detail</label>
                            <textarea
                                {...register("alamat_detail")}
                                className="input-field h-24"
                                placeholder="Tulis Nama Jalan/Nomor Rumah/RT/RW"
                            />
                            {errors.alamat_detail && <p className="error-text">{errors.alamat_detail.message}</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}