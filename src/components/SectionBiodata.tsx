"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { MasterSchemaType } from "@/lib/schema-master";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { WILAYAH_VALID, WILAYAH_EXTENDED } from "@/lib/constants";
import { CLOSE_DATE, EXTENDED_CLOSE_DATE } from "@/components/RegistrationGate";

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
    const spaceCount = (cleaned.match(/\s/g) || []).length;
    if (spaceCount > 0 && spaceCount >= (cleaned.length / 3)) {
         cleaned = cleaned.replace(/\s/g, "");
         // Kembalikan spasi standar setelah KOTA atau KABUPATEN
         cleaned = cleaned.replace(/^(KOTA|KABUPATEN)(.+)$/, "$1 $2");
    }

    // 3. Normalisasi spasi ganda dan trim
    return cleaned.replace(/\s+/g, " ").trim().toUpperCase();
};

const normalizeForMatch = (s: string) => s.toUpperCase().replace(/[\s\.]/g, "");


export default function SectionBiodata() {
    const {
        register,
        control,
        setValue,
        formState: { errors },
    } = useFormContext<MasterSchemaType>();

    const [fotoError, setFotoError] = useState<string | null>(null);

    const { onChange: fotoRhfOnChange, ...fotoRestRegister } = register("foto_diri");

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
                setValue("foto_diri", undefined as any, { shouldValidate: false });
                return;
            }
        }
        fotoRhfOnChange(e);
    }, [fotoRhfOnChange, setValue]);

    // --- STATE UNTUK API WILAYAH ---
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [villages, setVillages] = useState<Region[]>([]);
    const [loadingWilayah, setLoadingWilayah] = useState<string | null>(null);
    // Store detected city from IP for auto-matching kabupaten
    const [ipDetectedCity, setIpDetectedCity] = useState<string | null>(null);

    // useWatch agar compatible dengan React Compiler
    const fotoDiri = useWatch({ control, name: "foto_diri" });
    const wAgama = useWatch({ control, name: "agama" });
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

    // Mapping nama region dari IP API ke nama provinsi emsifa (lowercase)
    const IP_REGION_MAP: Record<string, string> = {
        "aceh": "aceh",
        "north sumatra": "sumatera utara", "sumatera utara": "sumatera utara",
        "west sumatra": "sumatera barat", "sumatera barat": "sumatera barat",
        "riau": "riau", "riau islands": "kepulauan riau", "kepulauan riau": "kepulauan riau",
        "jambi": "jambi",
        "south sumatra": "sumatera selatan", "sumatera selatan": "sumatera selatan",
        "bangka belitung islands": "kepulauan bangka belitung", "bangka belitung": "kepulauan bangka belitung",
        "bengkulu": "bengkulu", "lampung": "lampung",
        "dki jakarta": "dki jakarta", "jakarta": "dki jakarta",
        "west java": "jawa barat", "jawa barat": "jawa barat",
        "central java": "jawa tengah", "jawa tengah": "jawa tengah",
        "di yogyakarta": "di yogyakarta", "yogyakarta": "di yogyakarta", "daerah istimewa yogyakarta": "di yogyakarta",
        "east java": "jawa timur", "jawa timur": "jawa timur",
        "banten": "banten", "bali": "bali",
        "west nusa tenggara": "nusa tenggara barat", "nusa tenggara barat": "nusa tenggara barat",
        "east nusa tenggara": "nusa tenggara timur", "nusa tenggara timur": "nusa tenggara timur",
        "west kalimantan": "kalimantan barat", "kalimantan barat": "kalimantan barat",
        "central kalimantan": "kalimantan tengah", "kalimantan tengah": "kalimantan tengah",
        "south kalimantan": "kalimantan selatan", "kalimantan selatan": "kalimantan selatan",
        "east kalimantan": "kalimantan timur", "kalimantan timur": "kalimantan timur",
        "north kalimantan": "kalimantan utara", "kalimantan utara": "kalimantan utara",
        "north sulawesi": "sulawesi utara", "sulawesi utara": "sulawesi utara",
        "central sulawesi": "sulawesi tengah", "sulawesi tengah": "sulawesi tengah",
        "south sulawesi": "sulawesi selatan", "sulawesi selatan": "sulawesi selatan",
        "southeast sulawesi": "sulawesi tenggara", "sulawesi tenggara": "sulawesi tenggara",
        "gorontalo": "gorontalo",
        "west sulawesi": "sulawesi barat", "sulawesi barat": "sulawesi barat",
        "maluku": "maluku", "north maluku": "maluku utara", "maluku utara": "maluku utara",
        "west papua": "papua barat", "papua barat": "papua barat",
        "papua": "papua", "papua selatan": "papua selatan", "papua tengah": "papua tengah",
        "papua pegunungan": "papua pegunungan",
    };

    // 1. Fetch Provinsi saat mount + auto-detect lokasi dari IP
    useEffect(() => {
        setLoadingWilayah("provinsi");
        fetch(`${BASE_URL}/provinces.json`)
            .then((res) => {
                if (!res.ok) throw new Error("Gagal memuat provinsi");
                return res.json();
            })
            .then((data: Region[]) => {
                const now = Date.now();
                const isExtended = now > CLOSE_DATE.getTime() && now < EXTENDED_CLOSE_DATE.getTime();
                const activeWilayah = isExtended ? WILAYAH_EXTENDED : WILAYAH_VALID;

                // Filter hanya provinsi yang ada di activeWilayah
                const allowedProvs = data.filter(p => {
                    const name = cleanRegionName(p.name);
                    return Object.keys(activeWilayah).includes(name);
                });
                setProvinces(allowedProvs);
                // Auto-detect provinsi dari IP (hanya jika provinsi belum diisi)
                fetch("https://ipapi.co/json/")
                    .then((r) => r.ok ? r.json() : null)
                    .then((geo) => {
                        if (!geo?.region) return;
                        const regionLower = geo.region.toLowerCase();
                        const mapped = IP_REGION_MAP[regionLower] ?? regionLower;
                        const found = data.find((p: Region) =>
                            p.name.toLowerCase() === mapped ||
                            p.name.toLowerCase().includes(mapped) ||
                            mapped.includes(p.name.toLowerCase())
                        );
                        if (found) {
                            setValue("provinsi", found.id, { shouldValidate: false });
                            setValue("provinsi_nama", cleanRegionName(found.name), { shouldValidate: false });
                            // Store detected city for kabupaten matching
                            if (geo.city) setIpDetectedCity(geo.city.toLowerCase());
                        }
                    })
                    .catch(() => {});
            })
            .catch((err) => console.error(err.message))
            .finally(() => setLoadingWilayah(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                .then((data: Region[]) => {
                    // Filter kabupaten berdasarkan activeWilayah jika ada batasan kabupaten
                    const provFound = provinces.find(p => p.id === selectedProvinsi);
                    if (provFound) {
                        const provName = cleanRegionName(provFound.name);
                        const now = Date.now();
                        const isExtended = now > CLOSE_DATE.getTime() && now < EXTENDED_CLOSE_DATE.getTime();
                        const activeWilayah = isExtended ? WILAYAH_EXTENDED : WILAYAH_VALID;
                        const allowedCities = activeWilayah[provName];

                        if (allowedCities && allowedCities.length > 0) {
                            const normalizedAllowed = allowedCities.map(normalizeForMatch);
                            const filtered = data.filter((r: Region) => 
                                normalizedAllowed.includes(normalizeForMatch(r.name))
                            );
                            setRegencies(filtered);
                        } else {
                            setRegencies(data);
                        }
                    } else {
                        setRegencies(data);
                    }
                })
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
            if (found) setValue("provinsi_nama", cleanRegionName(found.name));
        }
    }, [selectedProvinsi, provinces, setValue]);

    useEffect(() => {
        if (selectedKabupaten && regencies.length > 0) {
            const found = regencies.find((r) => r.id === selectedKabupaten);
            if (found) setValue("kabupaten_nama", cleanRegionName(found.name));
        }
    }, [selectedKabupaten, regencies, setValue]);

    // 2c. Auto-match kabupaten dari IP city setelah regencies dimuat
    useEffect(() => {
        if (!ipDetectedCity || regencies.length === 0 || selectedKabupaten) return;
        const city = ipDetectedCity;
        // Cari match: prioritaskan KOTA, lalu KABUPATEN
        const normalize = (s: string) => s.toLowerCase().replace(/^(kota|kabupaten)\s+/, '');
        const kotaMatch = regencies.find(r => r.name.toLowerCase().startsWith('kota') && normalize(r.name) === city);
        const anyMatch = regencies.find(r => normalize(r.name) === city || r.name.toLowerCase().includes(city) || city.includes(normalize(r.name)));
        const matched = kotaMatch || anyMatch;
        if (matched) {
            setValue("kabupaten", matched.id, { shouldValidate: false });
            setValue("kabupaten_nama", cleanRegionName(matched.name), { shouldValidate: false });
        }
    }, [regencies, ipDetectedCity, selectedKabupaten, setValue]);

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
            if (found) setValue("kecamatan_nama", cleanRegionName(found.name));
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
            if (found) setValue("kelurahan_nama", cleanRegionName(found.name));
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
                    <div className={`border-2 border-dashed rounded-lg p-6 hover:bg-gray-50 transition cursor-pointer text-center ${fotoError || errors.foto_diri ? "border-red-400 bg-red-50" : "border-gray-300"}`}>
                        <input
                            type="file"
                            accept="image/*"
                            {...fotoRestRegister}
                            onChange={handleFotoChange}
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
                                    <span className="text-xs text-gray-400 mt-1">Close Up Wajah/Setengah badan, Format JPG/PNG/WebP (Max 20MB, Hanya 1 file)</span>
                                </>
                            )}
                        </label>
                    </div>
                    {(fotoError || errors.foto_diri) && (
                        <p className="error-text flex items-center gap-1">
                            <AlertCircle size={12} className="shrink-0" />
                            {fotoError || String(errors.foto_diri?.message)}
                        </p>
                    )}
                </div>

                {/* b. NAMA LENGKAP */}
                <div>
                    <label className="label-text">Nama Lengkap <span className="text-red-500">*</span></label>
                    <input {...register("nama")} className="input-field" placeholder="Sesuai KTP" />
                    {errors.nama && <p className="error-text">{errors.nama.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* c. NO KTP */}
                    <div>
                        <label className="label-text">No KTP <span className="text-red-500">*</span></label>
                        <input {...register("nik")} maxLength={16} className="input-field" placeholder="16 Digit" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '') }} />
                        {errors.nik && <p className="error-text">{errors.nik.message}</p>}
                    </div>

                    {/* d. NO KK */}
                    <div>
                        <label className="label-text">No KK <span className="text-red-500">*</span></label>
                        <input {...register("no_kk")} maxLength={16} className="input-field" placeholder="16 Digit" inputMode="numeric" onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '') }} />
                        {errors.no_kk && <p className="error-text">{errors.no_kk.message}</p>}
                    </div>

                    {/* e. JENIS KELAMIN */}
                    <div>
                        <label className="label-text">Jenis Kelamin <span className="text-red-500">*</span></label>
                        <select {...register("jenis_kelamin")} className="input-field">
                            <option value="">Pilih....</option>
                            <option value="Laki-Laki">Laki-Laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                        {errors.jenis_kelamin && <p className="error-text">{errors.jenis_kelamin.message}</p>}
                    </div>

                    {/* f. AGAMA */}
                    <div>
                        <label className="label-text">Konfirmasi Agama <span className="text-red-500">*</span></label>
                        <div className="mt-2 space-y-3">
                            <label className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${wAgama === 'Islam' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                <input
                                    type="radio"
                                    {...register("agama")}
                                    value="Islam"
                                    className="w-5 h-5 accent-green-600"
                                />
                                <div className="flex flex-col">
                                    <span className={`font-semibold ${wAgama === 'Islam' ? 'text-green-700' : 'text-gray-700'}`}>Saya Beragama Islam</span>
                                    <span className="text-xs text-gray-500">Syarat utama mengikuti program beasiswa ini</span>
                                </div>
                                {wAgama === 'Islam' && <CheckCircle2 className="ml-auto text-green-600" size={20} />}
                            </label>
                            
                            <p className="text-[10px] text-gray-400 italic">* Bagi pendaftar non-muslim mohon maaf belum dapat mengikuti program ini.</p>
                        </div>
                        {errors.agama && <p className="error-text">{errors.agama.message}</p>}
                    </div>

                    {/* g. TEMPAT LAHIR */}
                    <div>
                        <label className="label-text">Tempat Lahir <span className="text-red-500">*</span></label>
                        <input {...register("tempat_lahir")} className="input-field" />
                        {errors.tempat_lahir && <p className="error-text">{errors.tempat_lahir.message}</p>}
                    </div>

                    {/* h. TANGGAL LAHIR */}
                    <div>
                        <label className="label-text">Tanggal Lahir <span className="text-red-500">*</span></label>
                        <input type="date" {...register("tanggal_lahir")} className="input-field" />
                        {errors.tanggal_lahir && <p className="error-text">{errors.tanggal_lahir.message}</p>}
                    </div>
                </div>

                {/* i. EMAIL */}
                <div>
                    <label className="label-text">Email (Wajib Gmail) <span className="text-red-500">*</span></label>
                    <input type="email" {...register("email")} className="input-field" placeholder="nama@gmail.com" />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                </div>

                {/* j. WHATSAPP */}
                <div>
                    <label className="label-text">No Whatsapp <span className="text-red-500">*</span></label>
                    <div className={`flex items-stretch border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${errors.whatsapp ? "border-red-400" : "border-gray-300"}`}>
                        <span className="flex items-center px-3 bg-gray-50 border-r border-gray-300 text-gray-600 font-medium text-sm shrink-0 select-none">+62</span>
                        <input
                            type="tel"
                            {...register("whatsapp")}
                            maxLength={13}
                            inputMode="numeric"
                            className="flex-1 px-3 py-2.5 text-sm outline-none bg-white placeholder-gray-400"
                            placeholder="8xxxxxxxxxx"
                            onInput={(e) => {
                                let v = e.currentTarget.value.replace(/\D/g, '');
                                if (v.startsWith('0')) v = v.substring(1);
                                if (v.startsWith('62')) v = v.substring(2);
                                e.currentTarget.value = v;
                            }}
                        />
                    </div>
                    {errors.whatsapp && <p className="error-text">{errors.whatsapp.message}</p>}
                </div>

                {/* --- CASCADING DROPDOWN WILAYAH (API EMSIFA) --- */}
                <div className="space-y-4 border-t pt-4 mt-4">
                    <h3 className="font-semibold text-gray-700">Alamat Domisili</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* k. PROVINSI */}
                        <div>
                            <label className="label-text">Provinsi <span className="text-red-500">*</span></label>
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
                            <label className="label-text">Kabupaten/Kota <span className="text-red-500">*</span></label>
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
                            <label className="label-text">Kecamatan <span className="text-red-500">*</span></label>
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
                            <label className="label-text">Kelurahan <span className="text-red-500">*</span></label>
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
                            <label className="label-text">Alamat Detail <span className="text-red-500">*</span></label>
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