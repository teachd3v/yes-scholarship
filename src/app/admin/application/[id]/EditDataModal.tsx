'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Lock, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { updateApplicationData } from '../../actions';
import { verifyAdminPassword } from '../../auth-actions';
import type { ApplicationDetail } from '@/lib/types';

interface EditDataModalProps {
    app: ApplicationDetail;
}

type Region = { id: string; name: string };

export default function EditDataModal({ app }: EditDataModalProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<'password' | 'form'>('password');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [saveError, setSaveError] = useState('');

    // Wilayah cascading state
    const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [villages, setVillages] = useState<Region[]>([]);
    const [loadingWilayah, setLoadingWilayah] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState({
        // Biodata
        nama: app.biodata.nama || '',
        nik: app.biodata.nik || '',
        no_kk: app.biodata.no_kk || '',
        email: app.biodata.email || '',
        whatsapp: app.biodata.whatsapp || '',
        jenis_kelamin: app.biodata.jenis_kelamin || '',
        agama: app.biodata.agama || '',
        tempat_lahir: app.biodata.tempat_lahir || '',
        tanggal_lahir: app.biodata.tanggal_lahir || '',
        alamat_detail: app.biodata.alamat_detail || '',
        // Wilayah
        provinsi: app.biodata.provinsi || '',
        provinsi_nama: app.biodata.provinsi_nama || '',
        kabupaten: app.biodata.kabupaten || '',
        kabupaten_nama: app.biodata.kabupaten_nama || '',
        kecamatan: app.biodata.kecamatan || '',
        kecamatan_nama: app.biodata.kecamatan_nama || '',
        kelurahan: app.biodata.kelurahan || '',
        kelurahan_nama: app.biodata.kelurahan_nama || '',
        // Keluarga
        nama_ayah: app.keluarga.nama_ayah || '',
        nama_ibu: app.keluarga.nama_ibu || '',
        kondisi_ayah: app.keluarga.kondisi_ayah || '',
        kondisi_ibu: app.keluarga.kondisi_ibu || '',
        penghasilan_ortu: app.keluarga.penghasilan_ortu || '',
        kontak_ortu: app.keluarga.kontak_ortu || '',
        jumlah_saudara: String(app.keluarga.jumlah_saudara ?? ''),
        // Seleksi
        asal_sekolah: app.seleksi.asal_sekolah || '',
        jenjang_pendidikan: app.seleksi.jenjang_pendidikan || '',
        nilai_raport_1: String(app.seleksi.nilai_raport_1 ?? ''),
        nilai_raport_2: String(app.seleksi.nilai_raport_2 ?? ''),
        nilai_raport_3: String(app.seleksi.nilai_raport_3 ?? ''),
        status_beasiswa: app.seleksi.status_beasiswa || '',
        keterangan_beasiswa: app.seleksi.keterangan_beasiswa || '',
        motivasi: app.seleksi.motivasi || '',
        sumber_info: app.seleksi.sumber_info || '',
        social_media: app.seleksi.social_media || '',
        kategori_hafalan: app.seleksi.kategori_hafalan || '',
    });

    const setF = (key: keyof typeof form, val: string) =>
        setForm(prev => ({ ...prev, [key]: val }));

    // Load provinces on open
    useEffect(() => {
        if (!isOpen) return;
        fetch(`${BASE_URL}/provinces.json`).then(r => r.json()).then(setProvinces).catch(() => {});
    }, [isOpen]);

    // Load regencies when provinsi changes
    useEffect(() => {
        if (!form.provinsi) { setRegencies([]); return; }
        setLoadingWilayah('kabupaten');
        fetch(`${BASE_URL}/regencies/${form.provinsi}.json`).then(r => r.json()).then(data => { setRegencies(data); setLoadingWilayah(null); }).catch(() => setLoadingWilayah(null));
    }, [form.provinsi]);

    // Load districts when kabupaten changes
    useEffect(() => {
        if (!form.kabupaten) { setDistricts([]); return; }
        setLoadingWilayah('kecamatan');
        fetch(`${BASE_URL}/districts/${form.kabupaten}.json`).then(r => r.json()).then(data => { setDistricts(data); setLoadingWilayah(null); }).catch(() => setLoadingWilayah(null));
    }, [form.kabupaten]);

    // Load villages when kecamatan changes
    useEffect(() => {
        if (!form.kecamatan) { setVillages([]); return; }
        setLoadingWilayah('kelurahan');
        fetch(`${BASE_URL}/villages/${form.kecamatan}.json`).then(r => r.json()).then(data => { setVillages(data); setLoadingWilayah(null); }).catch(() => setLoadingWilayah(null));
    }, [form.kecamatan]);

    const handleOpen = () => {
        setStep('password');
        setPassword('');
        setPasswordError('');
        setSaveError('');
        setIsOpen(true);
    };

    const handleClose = () => { if (!isLoading) setIsOpen(false); };

    const handlePasswordSubmit = async () => {
        if (!password.trim()) { setPasswordError('Password wajib diisi'); return; }
        setIsLoading(true);
        setPasswordError('');
        try {
            const valid = await verifyAdminPassword(password);
            if (!valid) { setPasswordError('Password salah. Coba lagi.'); return; }
            setStep('form');
        } catch {
            setPasswordError('Terjadi kesalahan, coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setSaveError('');

        const patch = {
            nama: form.nama, nik: form.nik, no_kk: form.no_kk, email: form.email,
            whatsapp: form.whatsapp, jenis_kelamin: form.jenis_kelamin, agama: form.agama,
            tempat_lahir: form.tempat_lahir, tanggal_lahir: form.tanggal_lahir,
            alamat_detail: form.alamat_detail,
            provinsi: form.provinsi, provinsi_nama: form.provinsi_nama,
            kabupaten: form.kabupaten, kabupaten_nama: form.kabupaten_nama,
            kecamatan: form.kecamatan, kecamatan_nama: form.kecamatan_nama,
            kelurahan: form.kelurahan, kelurahan_nama: form.kelurahan_nama,
            nama_ayah: form.nama_ayah, nama_ibu: form.nama_ibu,
            kondisi_ayah: form.kondisi_ayah, kondisi_ibu: form.kondisi_ibu,
            penghasilan_ortu: form.penghasilan_ortu, kontak_ortu: form.kontak_ortu,
            jumlah_saudara: form.jumlah_saudara ? Number(form.jumlah_saudara) : undefined,
            asal_sekolah: form.asal_sekolah, jenjang_pendidikan: form.jenjang_pendidikan,
            nilai_raport_1: form.nilai_raport_1 ? Number(form.nilai_raport_1) : undefined,
            nilai_raport_2: form.nilai_raport_2 ? Number(form.nilai_raport_2) : undefined,
            nilai_raport_3: form.nilai_raport_3 ? Number(form.nilai_raport_3) : undefined,
            status_beasiswa: form.status_beasiswa, keterangan_beasiswa: form.keterangan_beasiswa,
            motivasi: form.motivasi, sumber_info: form.sumber_info,
            social_media: form.social_media, kategori_hafalan: form.kategori_hafalan,
        };

        const result = await updateApplicationData(app._id, password, patch);
        setIsLoading(false);

        if (!result.success) {
            if (result.error === 'Password salah') {
                setStep('password');
                setPasswordError('Password salah. Masukkan ulang.');
            } else {
                setSaveError(result.error || 'Gagal menyimpan');
            }
            return;
        }

        setIsOpen(false);
        router.refresh();
    };

    const inputCls = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500";
    const labelCls = "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1 block";

    const field = (label: string, key: keyof typeof form, type = 'text') => (
        <div>
            <label className={labelCls}>{label}</label>
            <input type={type} value={form[key]} onChange={e => setF(key, e.target.value)} className={inputCls} />
        </div>
    );

    const selectField = (label: string, key: keyof typeof form, opts: { value: string; label: string }[]) => (
        <div>
            <label className={labelCls}>{label}</label>
            <select value={form[key]} onChange={e => setF(key, e.target.value)} className={inputCls}>
                <option value="">Pilih...</option>
                {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </div>
    );

    return (
        <>
            <button onClick={handleOpen} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-blue-200 text-blue-600 font-bold hover:bg-blue-50 transition text-sm">
                <Save size={16} /> Edit Data Peserta
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
                            <h3 className="font-bold text-slate-800">
                                {step === 'password' ? 'Verifikasi Password Admin' : `Edit Data: ${app.biodata.nama}`}
                            </h3>
                            {!isLoading && (
                                <button onClick={handleClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                            )}
                        </div>

                        {/* Step: Password */}
                        {step === 'password' && (
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                                    <Lock className="text-amber-600 shrink-0" size={18} />
                                    <p className="text-sm text-amber-800">Edit data peserta memerlukan verifikasi password akun admin Anda.</p>
                                </div>
                                <div>
                                    <label className={labelCls}>Password Akun Admin</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
                                            onKeyDown={e => { if (e.key === 'Enter') handlePasswordSubmit(); }}
                                            className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordError ? 'border-red-400' : 'border-slate-200'}`}
                                            placeholder="Masukkan password Anda"
                                            autoFocus
                                        />
                                        <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                    {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
                                </div>
                                <button onClick={handlePasswordSubmit} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2">
                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                    Lanjutkan
                                </button>
                            </div>
                        )}

                        {/* Step: Form */}
                        {step === 'form' && (
                            <>
                                <div className="overflow-y-auto flex-1 px-6 py-4 space-y-6">
                                    {saveError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">{saveError}</div>
                                    )}

                                    {/* BIODATA */}
                                    <div>
                                        <h4 className="font-bold text-slate-700 mb-3 border-b pb-1">Biodata Diri</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {field("Nama Lengkap", "nama")}
                                            {field("NIK", "nik")}
                                            {field("No KK", "no_kk")}
                                            {field("Email", "email", "email")}
                                            {field("WhatsApp", "whatsapp")}
                                            {selectField("Jenis Kelamin", "jenis_kelamin", [
                                                { value: "Laki-Laki", label: "Laki-Laki" },
                                                { value: "Perempuan", label: "Perempuan" },
                                            ])}
                                            {selectField("Agama", "agama", [
                                                { value: "Islam", label: "Islam" }, { value: "Kristen", label: "Kristen" },
                                                { value: "Katolik", label: "Katolik" }, { value: "Hindu", label: "Hindu" },
                                                { value: "Buddha", label: "Buddha" }, { value: "Konghucu", label: "Konghucu" },
                                            ])}
                                            {field("Tempat Lahir", "tempat_lahir")}
                                            {field("Tanggal Lahir", "tanggal_lahir", "date")}
                                        </div>
                                    </div>

                                    {/* ALAMAT DOMISILI */}
                                    <div>
                                        <h4 className="font-bold text-slate-700 mb-3 border-b pb-1">Alamat Domisili</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Provinsi */}
                                            <div>
                                                <label className={labelCls}>Provinsi</label>
                                                <select
                                                    value={form.provinsi}
                                                    onChange={e => {
                                                        const id = e.target.value;
                                                        const found = provinces.find(p => p.id === id);
                                                        setF('provinsi', id);
                                                        setF('provinsi_nama', found?.name || '');
                                                        setF('kabupaten', ''); setF('kabupaten_nama', '');
                                                        setF('kecamatan', ''); setF('kecamatan_nama', '');
                                                        setF('kelurahan', ''); setF('kelurahan_nama', '');
                                                    }}
                                                    className={inputCls}
                                                >
                                                    <option value="">{provinces.length === 0 ? 'Memuat...' : 'Pilih...'}</option>
                                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                                </select>
                                            </div>

                                            {/* Kabupaten */}
                                            <div>
                                                <label className={labelCls}>Kabupaten/Kota</label>
                                                <select
                                                    value={form.kabupaten}
                                                    disabled={!form.provinsi || loadingWilayah === 'kabupaten'}
                                                    onChange={e => {
                                                        const id = e.target.value;
                                                        const found = regencies.find(r => r.id === id);
                                                        setF('kabupaten', id);
                                                        setF('kabupaten_nama', found?.name || '');
                                                        setF('kecamatan', ''); setF('kecamatan_nama', '');
                                                        setF('kelurahan', ''); setF('kelurahan_nama', '');
                                                    }}
                                                    className={`${inputCls} disabled:bg-gray-100`}
                                                >
                                                    <option value="">{loadingWilayah === 'kabupaten' ? 'Memuat...' : 'Pilih...'}</option>
                                                    {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                </select>
                                            </div>

                                            {/* Kecamatan */}
                                            <div>
                                                <label className={labelCls}>Kecamatan</label>
                                                <select
                                                    value={form.kecamatan}
                                                    disabled={!form.kabupaten || loadingWilayah === 'kecamatan'}
                                                    onChange={e => {
                                                        const id = e.target.value;
                                                        const found = districts.find(d => d.id === id);
                                                        setF('kecamatan', id);
                                                        setF('kecamatan_nama', found?.name || '');
                                                        setF('kelurahan', ''); setF('kelurahan_nama', '');
                                                    }}
                                                    className={`${inputCls} disabled:bg-gray-100`}
                                                >
                                                    <option value="">{loadingWilayah === 'kecamatan' ? 'Memuat...' : 'Pilih...'}</option>
                                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                                </select>
                                            </div>

                                            {/* Kelurahan */}
                                            <div>
                                                <label className={labelCls}>Kelurahan/Desa</label>
                                                <select
                                                    value={form.kelurahan}
                                                    disabled={!form.kecamatan || loadingWilayah === 'kelurahan'}
                                                    onChange={e => {
                                                        const id = e.target.value;
                                                        const found = villages.find(v => v.id === id);
                                                        setF('kelurahan', id);
                                                        setF('kelurahan_nama', found?.name || '');
                                                    }}
                                                    className={`${inputCls} disabled:bg-gray-100`}
                                                >
                                                    <option value="">{loadingWilayah === 'kelurahan' ? 'Memuat...' : 'Pilih...'}</option>
                                                    {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                                </select>
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className={labelCls}>Alamat Detail</label>
                                                <textarea value={form.alamat_detail} onChange={e => setF('alamat_detail', e.target.value)} rows={2} className={inputCls} placeholder="Nama Jalan/Nomor Rumah/RT/RW" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* KELUARGA */}
                                    <div>
                                        <h4 className="font-bold text-slate-700 mb-3 border-b pb-1">Data Keluarga</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {field("Nama Ayah", "nama_ayah")}
                                            {selectField("Kondisi Ayah", "kondisi_ayah", [
                                                { value: "Bekerja", label: "Bekerja" }, { value: "Tidak Bekerja", label: "Tidak Bekerja" }, { value: "Wafat", label: "Wafat" },
                                            ])}
                                            {field("Nama Ibu", "nama_ibu")}
                                            {selectField("Kondisi Ibu", "kondisi_ibu", [
                                                { value: "Bekerja", label: "Bekerja" }, { value: "Tidak Bekerja", label: "Tidak Bekerja" }, { value: "Wafat", label: "Wafat" },
                                            ])}
                                            {selectField("Penghasilan Ortu", "penghasilan_ortu", [
                                                { value: "range_a", label: "0 - < 1 Juta" }, { value: "range_b", label: "1 - 2.5 Juta" },
                                                { value: "range_c", label: "2.6 - 4 Juta" }, { value: "range_d", label: "4 - 5 Juta" }, { value: "range_e", label: "> 5 Juta" },
                                            ])}
                                            {field("Kontak Ortu/Wali", "kontak_ortu")}
                                            {field("Jumlah Saudara", "jumlah_saudara", "number")}
                                        </div>
                                    </div>

                                    {/* SELEKSI */}
                                    <div>
                                        <h4 className="font-bold text-slate-700 mb-3 border-b pb-1">Data Seleksi</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {field("Asal Sekolah", "asal_sekolah")}
                                            {selectField("Jenis Pendidikan", "jenjang_pendidikan", [
                                                { value: "SMA", label: "SMA" }, { value: "MA", label: "MA" }, { value: "SMK", label: "SMK" },
                                            ])}
                                            {field("Nilai Raport Sem 1", "nilai_raport_1", "number")}
                                            {field("Nilai Raport Sem 2", "nilai_raport_2", "number")}
                                            {field("Nilai Raport Sem 3", "nilai_raport_3", "number")}
                                            {selectField("Status Beasiswa", "status_beasiswa", [
                                                { value: "Tidak", label: "Tidak" }, { value: "Ya_PIP", label: "Ya, PIP" }, { value: "Ya_Lainnya", label: "Ya, Lainnya" },
                                            ])}
                                            {field("Keterangan Beasiswa", "keterangan_beasiswa")}
                                            {selectField("Hafalan Quran", "kategori_hafalan", [
                                                { value: "Surat Pendek", label: "Surat-Surat Pendek" }, { value: "Juz 30", label: "Juz 30" },
                                                { value: "3 Juz", label: "3 Juz" }, { value: ">3 Juz", label: ">3 Juz" },
                                            ])}
                                            {selectField("Sumber Info", "sumber_info", [
                                                { value: "IG", label: "Instagram" }, { value: "Website", label: "Website" }, { value: "Whatsapp", label: "Whatsapp" },
                                            ])}
                                            {field("Social Media", "social_media")}
                                            <div className="md:col-span-2">
                                                <label className={labelCls}>Motivasi</label>
                                                <textarea value={form.motivasi} onChange={e => setF('motivasi', e.target.value)} rows={3} className={inputCls} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 border-t border-slate-200 flex gap-3 shrink-0">
                                    <button onClick={handleClose} disabled={isLoading} className="flex-1 border border-slate-300 text-slate-700 rounded-lg py-2.5 font-medium hover:bg-slate-50 transition disabled:opacity-50">
                                        Batal
                                    </button>
                                    <button onClick={handleSave} disabled={isLoading} className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 font-bold hover:bg-blue-700 transition disabled:opacity-70 flex items-center justify-center gap-2">
                                        {isLoading ? <><Loader2 size={16} className="animate-spin" /> Menyimpan...</> : <><Save size={16} /> Simpan Perubahan</>}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
