'use client'

import { useState, useMemo } from 'react';
import { updateApplicationStatus, deleteApplication } from './actions';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, Eye, Check, X, Loader2, Filter, ArrowUpDown, Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { ApplicationListItem } from '@/lib/types';
import { formatIncome } from '@/lib/types';
import ConfirmationModal from '@/components/ConfirmationModal';

interface DashboardProps {
    applications: ApplicationListItem[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
}

export default function DashboardClient({ applications, currentPage, totalPages, totalItems }: DashboardProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'success' | 'info' | 'warning';
        onConfirm: () => void;
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info',
        onConfirm: () => {},
    });

    const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

    const handleDelete = (id: string) => {
        setModal({
            isOpen: true,
            title: "Hapus Pendaftaran",
            message: "Apakah Anda yakin ingin menghapus data ini? Data yang dihapus tidak dapat dikembalikan.",
            type: "danger",
            confirmLabel: "Ya, Hapus",
            onConfirm: async () => {
                setLoadingId(id);
                const res = await deleteApplication(id);
                if (!res.success) {
                    // Show error modal
                    setModal({
                        isOpen: true,
                        title: "Gagal Menghapus",
                        message: res.error || "Terjadi kesalahan saat menghapus data.",
                        type: "danger",
                        confirmLabel: "Tutup",
                        onConfirm: () => closeModal(),
                    });
                } else {
                    closeModal();
                    router.refresh();
                }
                setLoadingId(null);
            }
        });
    };

    // Filters State (client-side filtering within current page)
    const [filterProvince, setFilterProvince] = useState<string>('All');
    const [filterIncome, setFilterIncome] = useState<string>('All');
    const [filterScore, setFilterScore] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterScreening, setFilterScreening] = useState<string>('All');
    const [sortBy, setSortBy] = useState<string>('score_desc');
    const [searchQuery, setSearchQuery] = useState("");

    const handleStatusUpdate = (id: string, newStatus: 'approved' | 'rejected') => {
        const isApprove = newStatus === 'approved';
        setModal({
            isOpen: true,
            title: isApprove ? "Setujui Pendaftaran" : "Tolak Pendaftaran",
            message: isApprove 
                ? "Apakah Anda yakin ingin menyetujui pendaftaran ini?" 
                : "Apakah Anda yakin ingin menolak pendaftaran ini?",
            type: isApprove ? "success" : "danger",
            confirmLabel: isApprove ? "Ya, Setujui" : "Ya, Tolak",
            onConfirm: async () => {
                setLoadingId(id);
                await updateApplicationStatus(id, newStatus);
                setLoadingId(null);
                closeModal();
                router.refresh();
            }
        });
    };

    // Pagination handler
    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(`/admin?page=${page}`);
    };

    // Derived Data: Unique Provinces for Filter
    const provinces = useMemo(() => {
        const provs = new Set(applications.map(app => app.provinsi_nama).filter(Boolean));
        return Array.from(provs).sort();
    }, [applications]);

    // Derived Data: Filtered & Sorted Applications
    const processedApps = useMemo(() => {
        let result = [...applications];

        if (filterProvince !== 'All') {
            result = result.filter(app => app.provinsi_nama === filterProvince);
        }
        if (filterIncome !== 'All') {
            result = result.filter(app => app.penghasilan_ortu === filterIncome);
        }
        if (filterStatus !== 'All') {
            result = result.filter(app => app.status === filterStatus);
        }
        if (filterScreening !== 'All') {
            const isLolos = filterScreening === 'Lolos';
            result = result.filter(app => app.lolos_screening === isLolos);
        }
        if (filterScore !== 'All') {
            result = result.filter(app => {
                const avg = (
                    (Number(app.nilai_raport_1 || 0) +
                     Number(app.nilai_raport_2 || 0) +
                     Number(app.nilai_raport_3 || 0)) / 3
                );
                return filterScore === '>=60' ? avg >= 60 : avg < 60;
            });
        }
        if (searchQuery) {
            const lowerInfo = searchQuery.toLowerCase();
            result = result.filter(app =>
                app.nama?.toLowerCase().includes(lowerInfo) ||
                app.email?.toLowerCase().includes(lowerInfo)
            );
        }

        result.sort((a, b) => {
            if (sortBy === 'score_desc') return (b.total_skor || 0) - (a.total_skor || 0);
            if (sortBy === 'score_asc') return (a.total_skor || 0) - (b.total_skor || 0);
            if (sortBy === 'date_desc') return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
            if (sortBy === 'date_asc') return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
            return 0;
        });

        return result;
    }, [applications, filterProvince, filterIncome, filterScore, filterStatus, filterScreening, sortBy, searchQuery]);

    // Statistics Cards Data (from current page data)
    const stats = useMemo(() => {
        return {
            total: totalItems,
            lolos: applications.filter(a => a.lolos_screening).length,
            gagal: applications.filter(a => !a.lolos_screening).length,
            approved: applications.filter(a => a.status === 'approved').length,
            pending: applications.filter(a => a.status === 'pending').length,
            rejected: applications.filter(a => a.status === 'rejected').length,
        }
    }, [applications, totalItems]);


    return (
        <div className="space-y-6">

            {/* 1. Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Pendaftar" value={stats.total} icon={<Clock size={16} />} color="bg-blue-50 text-blue-700" />
                <StatCard label="Lolos Screening" value={stats.lolos} icon={<CheckCircle size={16} />} color="bg-green-50 text-green-700" />
                <StatCard label="Gagal Screening" value={stats.gagal} icon={<XCircle size={16} />} color="bg-red-50 text-red-700" />
                <StatCard label="Approved" value={stats.approved} icon={<Check size={16} />} color="bg-emerald-100 text-emerald-800" />
                <StatCard label="Pending" value={stats.pending} icon={<Clock size={16} />} color="bg-yellow-100 text-yellow-800" />
                <StatCard label="Rejected" value={stats.rejected} icon={<X size={16} />} color="bg-gray-100 text-gray-800" />
            </div>

            {/* 2. Filters & Actions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Cari Nama / Email..."
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Urutkan:</span>
                        <select
                            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="score_desc">Skor Tertinggi</option>
                            <option value="score_asc">Skor Terendah</option>
                            <option value="date_desc">Terbaru</option>
                            <option value="date_asc">Terlama</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
                     {/* Province Filter */}
                     <select
                        className="filter-select"
                        value={filterProvince}
                        onChange={(e) => setFilterProvince(e.target.value)}
                    >
                        <option value="All">Semua Provinsi</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                     </select>

                     {/* Income Filter */}
                     <select
                        className="filter-select"
                        value={filterIncome}
                        onChange={(e) => setFilterIncome(e.target.value)}
                     >
                        <option value="All">Semua Penghasilan</option>
                        <option value="range_a">0 - &lt; 1 Juta</option>
                        <option value="range_b">1 - 2.5 Juta</option>
                        <option value="range_c">2.6 - 4 Juta</option>
                        <option value="range_d">4 - 5 Juta</option>
                        <option value="range_e">&gt; 5 Juta</option>
                     </select>

                     {/* Score Filter */}
                     <select
                        className="filter-select"
                        value={filterScore}
                        onChange={(e) => setFilterScore(e.target.value)}
                     >
                        <option value="All">Semua Rata-rata Nilai</option>
                        <option value=">=60">&ge; 60 (Lolos Standar)</option>
                        <option value="<60">&lt; 60 (Di Bawah Standar)</option>
                     </select>

                     {/* Status Filter */}
                     <select
                        className="filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                     >
                        <option value="All">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                     </select>

                     {/* Screening Filter */}
                     <select
                        className="filter-select"
                        value={filterScreening}
                        onChange={(e) => setFilterScreening(e.target.value)}
                     >
                        <option value="All">Semua Screening</option>
                        <option value="Lolos">Lolos Screening</option>
                        <option value="Gagal">Gagal Screening</option>
                     </select>
                </div>
            </div>

            {/* 3. Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Daftar Pendaftar</h3>
                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                        Menampilkan {processedApps.length} dari {applications.length} Data (Halaman {currentPage}/{totalPages || 1})
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3">Tanggal</th>
                                <th className="px-6 py-3">Nama Lengkap</th>
                                <th className="px-6 py-3">Data Penunjang</th>
                                <th className="px-6 py-3 text-center">Screening</th>
                                <th className="px-6 py-3 text-center cursor-pointer hover:bg-slate-100" onClick={() => setSortBy(sortBy === 'score_desc' ? 'score_asc' : 'score_desc')}>
                                    <div className="flex items-center justify-center gap-1">Skor <ArrowUpDown size={12}/></div>
                                </th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {processedApps.map((app) => {
                                const isLoading = loadingId === app._id;
                                return (
                                <tr key={app._id} className="hover:bg-slate-50 transition group">
                                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap text-xs">
                                        {new Date(app._createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        <div className="text-[10px] text-slate-400">{new Date(app._createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div>{app.nama}</div>
                                        <div className="text-xs text-slate-500 font-normal">{app.provinsi_nama}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">
                                        <div><span className="font-semibold">Penghasilan:</span> {formatIncome(app.penghasilan_ortu)}</div>
                                        <div>
                                            <span className="font-semibold">Rata Rapor:</span> {((Number(app.nilai_raport_1 || 0) + Number(app.nilai_raport_2 || 0) + Number(app.nilai_raport_3 || 0)) / 3).toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {app.lolos_screening ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle size={12} /> Lolos
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <XCircle size={12} /> Gagal
                                            </span>
                                        )}
                                    </td>
                                     <td className="px-6 py-4 text-center font-bold text-slate-700 text-lg">
                                        {app.total_skor}
                                     </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            {isLoading ? (
                                                <Loader2 size={18} className="animate-spin text-slate-400" />
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                        title="Approve"
                                                        className={`action-btn hover:bg-blue-100 hover:text-blue-600 ${app.status === 'approved' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                        title="Reject"
                                                        className={`action-btn hover:bg-red-100 hover:text-red-600 ${app.status === 'rejected' ? 'text-red-600 bg-red-50' : 'text-slate-400'}`}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(app._id)}
                                                        title="Hapus Permanen"
                                                        className="action-btn hover:bg-red-100 hover:text-red-700 text-slate-400"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            <div className="w-px h-4 bg-slate-200 mx-1"></div>
                                            <Link
                                                href={`/admin/application/${app._id}`}
                                                className="action-btn hover:bg-slate-100 hover:text-slate-800 text-slate-400"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                             {processedApps.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <Filter size={32} className="text-slate-200" />
                                            <p>Tidak ada data yang cocok dengan filter.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 4. Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Halaman {currentPage} dari {totalPages} ({totalItems} data)
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .reduce<(number | string)[]>((acc, p, idx, arr) => {
                                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('...');
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, idx) =>
                                    typeof p === 'string' ? (
                                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-400">...</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p)}
                                            className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                                                p === currentPage
                                                    ? 'bg-blue-600 text-white shadow-sm'
                                                    : 'border border-slate-200 text-slate-600 hover:bg-white'
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

             <style jsx>{`
                .filter-select {
                    @apply bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5;
                }
                .action-btn {
                    @apply p-1.5 rounded-md transition duration-200;
                }
            `}</style>
            
            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmLabel={modal.confirmLabel}
                isLoading={loadingId !== null} 
            />
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
    return (
        <div className={`p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col items-center justify-center text-center gap-1 hover:shadow-md transition`}>
            <div className={`p-2 rounded-full ${color} mb-1 bg-opacity-20`}>
                {icon}
            </div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'approved') return <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Approved</span>
    if (status === 'rejected') return <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">Rejected</span>
    return <span className="px-2 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 animate-pulse">Pending</span>
}
