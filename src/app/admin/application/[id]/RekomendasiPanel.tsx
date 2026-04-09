'use client'

import { useState, useRef } from 'react';
import { saveRekomendasi, deleteRekomendasi } from '../../actions';
import { useRouter } from 'next/navigation';
import { ClipboardCheck, ThumbsUp, ThumbsDown, Paperclip, Trash2, Loader2, X, Plus, AlertTriangle } from 'lucide-react';
import type { Rekomendasi } from '@/lib/types';

interface Props {
    id: string;
    lolos_screening: boolean;
    rekomendasi?: Rekomendasi | null;
}

interface BuktiBaru {
    id: number;
    file: File | null;
    keterangan: string;
}

export default function RekomendasiPanel({ id, lolos_screening, rekomendasi }: Props) {
    const router = useRouter();
    const [showForm, setShowForm] = useState(false);
    const [tipe, setTipe] = useState<'rekomendasikan_lolos' | 'rekomendasikan_gagal'>(
        lolos_screening ? 'rekomendasikan_gagal' : 'rekomendasikan_lolos'
    );
    const [catatan, setCatatan] = useState('');
    const [buktiBaru, setBuktiBaru] = useState<BuktiBaru[]>([{ id: 0, file: null, keterangan: '' }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const nextId = useRef(1);

    const addBukti = () => {
        setBuktiBaru(prev => [...prev, { id: nextId.current++, file: null, keterangan: '' }]);
    };

    const removeBukti = (id: number) => {
        setBuktiBaru(prev => prev.filter(b => b.id !== id));
    };

    const updateBukti = (id: number, field: 'file' | 'keterangan', value: File | string) => {
        setBuktiBaru(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const handleSubmit = async () => {
        if (!catatan.trim()) {
            setError('Catatan/alasan rekomendasi wajib diisi.');
            return;
        }
        setError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('id', id);
        formData.append('tipe', tipe);
        formData.append('catatan', catatan);

        buktiBaru.forEach((b, i) => {
            if (b.file) {
                formData.append(`bukti_file_${i}`, b.file);
                formData.append(`bukti_ket_${i}`, b.keterangan);
            }
        });

        const res = await saveRekomendasi(formData);
        setLoading(false);
        if (res.success) {
            setShowForm(false);
            setCatatan('');
            setBuktiBaru([{ id: 0, file: null, keterangan: '' }]);
            router.refresh();
        } else {
            setError(res.error || 'Gagal menyimpan rekomendasi.');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Hapus rekomendasi ini?')) return;
        setLoading(true);
        await deleteRekomendasi(id);
        setLoading(false);
        router.refresh();
    };

    // --- Existing recommendation display ---
    if (rekomendasi && !showForm) {
        const isLolos = rekomendasi.tipe === 'rekomendasikan_lolos';
        return (
            <div className={`rounded-xl border-2 p-4 ${isLolos ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {isLolos
                            ? <ThumbsUp size={18} className="text-green-600" />
                            : <ThumbsDown size={18} className="text-orange-600" />}
                        <span className={`text-sm font-bold ${isLolos ? 'text-green-700' : 'text-orange-700'}`}>
                            {isLolos ? 'Direkomendasikan Lolos' : 'Direkomendasikan Gagal'}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => { setTipe(rekomendasi.tipe); setCatatan(rekomendasi.catatan); setShowForm(true); }}
                            className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded hover:bg-white"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={loading}
                            className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-white"
                        >
                            {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                        </button>
                    </div>
                </div>

                <p className="text-sm text-slate-700 mb-3 leading-relaxed">{rekomendasi.catatan}</p>

                {rekomendasi.bukti_pendukung && rekomendasi.bukti_pendukung.length > 0 && (
                    <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bukti Pendukung</p>
                        {rekomendasi.bukti_pendukung.map((b) => (
                            b.file_url ? (
                                <a
                                    key={b._key}
                                    href={b.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-xs text-blue-600 hover:underline"
                                >
                                    <Paperclip size={12} />
                                    {b.keterangan || 'Lihat Bukti'}
                                </a>
                            ) : null
                        ))}
                    </div>
                )}

                {rekomendasi.dibuat_oleh && (
                    <p className="text-xs text-slate-400 mt-3">
                        Oleh: {rekomendasi.dibuat_oleh}
                        {rekomendasi.tanggal && ` · ${new Date(rekomendasi.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                )}
            </div>
        );
    }

    // --- Form or add button ---
    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 text-sm font-medium transition"
            >
                <ClipboardCheck size={16} />
                Tambah Rekomendasi Override
            </button>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <ClipboardCheck size={16} className="text-blue-500" />
                    Rekomendasi Override
                </h4>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={16} />
                </button>
            </div>

            {/* Tipe */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    type="button"
                    onClick={() => setTipe('rekomendasikan_lolos')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border-2 transition ${
                        tipe === 'rekomendasikan_lolos'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-slate-200 text-slate-400 hover:border-green-300'
                    }`}
                >
                    <ThumbsUp size={14} /> Rekomendasikan Lolos
                </button>
                <button
                    type="button"
                    onClick={() => setTipe('rekomendasikan_gagal')}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold border-2 transition ${
                        tipe === 'rekomendasikan_gagal'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-slate-200 text-slate-400 hover:border-orange-300'
                    }`}
                >
                    <ThumbsDown size={14} /> Rekomendasikan Gagal
                </button>
            </div>

            {/* Context hint */}
            <div className={`text-xs px-3 py-2 rounded-lg flex items-start gap-2 ${
                tipe === 'rekomendasikan_lolos' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
            }`}>
                <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                {tipe === 'rekomendasikan_lolos'
                    ? 'Pendaftar gagal screening otomatis, namun berdasarkan verifikasi lapangan layak dipertimbangkan.'
                    : 'Pendaftar lolos screening otomatis, namun berdasarkan verifikasi lapangan tidak sesuai kriteria.'}
            </div>

            {/* Catatan */}
            <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Catatan / Alasan <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={catatan}
                    onChange={e => setCatatan(e.target.value)}
                    rows={4}
                    placeholder="Jelaskan alasan dan pertimbangan rekomendasi ini..."
                    className="w-full text-sm border border-slate-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
            </div>

            {/* Bukti Pendukung */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Bukti Pendukung (Opsional)
                    </label>
                    <button
                        type="button"
                        onClick={addBukti}
                        className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                        <Plus size={12} /> Tambah
                    </button>
                </div>
                <div className="space-y-2">
                    {buktiBaru.map((b, idx) => (
                        <div key={b.id} className="flex gap-2 items-start">
                            <div className="flex-1 space-y-1">
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={e => e.target.files?.[0] && updateBukti(b.id, 'file', e.target.files[0])}
                                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                                />
                                <input
                                    type="text"
                                    value={b.keterangan}
                                    onChange={e => updateBukti(b.id, 'keterangan', e.target.value)}
                                    placeholder={`Keterangan bukti ${idx + 1}`}
                                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                                />
                            </div>
                            {buktiBaru.length > 1 && (
                                <button onClick={() => removeBukti(b.id)} className="text-red-400 hover:text-red-600 mt-1">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : 'Simpan Rekomendasi'}
            </button>
        </div>
    );
}
