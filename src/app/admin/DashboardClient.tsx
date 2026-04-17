'use client'

import { useState, useMemo } from 'react';
import { 
    updateApplicationStatus, 
    deleteApplication, 
    exportAllApplications,
    updateMentorStatus,
    deleteMentor,
    exportAllMentors
} from './actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    CheckCircle, XCircle, Clock, Eye, Check, X, Loader2, Filter, 
    ArrowUpDown, Search, ChevronLeft, ChevronRight, Trash2, 
    ClipboardCheck, Users, UserPlus, Download 
} from 'lucide-react';
import Link from 'next/link';
import type { ApplicationListItem, MentorListItem, PaginatedResult } from '@/lib/types';
import { formatIncome } from '@/lib/types';
import ConfirmationModal from '@/components/ConfirmationModal';
import * as XLSX from 'xlsx';

interface DashboardProps {
    initialApplicants: PaginatedResult<ApplicationListItem>;
    initialMentors: PaginatedResult<MentorListItem>;
    role?: 'superadmin' | 'admin_wilayah';
    region?: string;
    defaultTab?: string;
}

export default function DashboardClient({ 
    initialApplicants, 
    initialMentors, 
    role, 
    region,
    defaultTab = 'applicants'
}: DashboardProps) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        confirmLabel?: string;
        type?: "danger" | "success" | "info" | "warning";
        onConfirm: (val?: string) => void;
        showInput?: boolean;
        inputType?: "text" | "password" | "textarea";
        inputPlaceholder?: string;
    }>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    const [modalInput, setModalInput] = useState("");

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
        setModalInput("");
    };

    const handleDelete = (id: string, type: 'applicant' | 'mentor') => {
        setModalInput("");
        setModal({
            isOpen: true,
            title: type === 'applicant' ? "Hapus Pendaftar" : "Hapus Mentor",
            message: "Aksi ini tidak dapat dibatalkan. Masukkan password admin untuk mengonfirmasi penghapusan data.",
            type: "danger",
            confirmLabel: "Ya, Hapus Permanen",
            showInput: true,
            inputType: "password",
            inputPlaceholder: "Password Admin",
            onConfirm: async (val?: string) => {
                if (!val) {
                    alert("Password wajib diisi!");
                    return;
                }
                setLoadingId(id);
                const res = type === 'applicant' 
                    ? await deleteApplication(id, val) 
                    : await deleteMentor(id, val);
                
                if (!res.success) {
                    alert(res.error || "Gagal menghapus data.");
                    setLoadingId(null);
                } else {
                    closeModal();
                    router.refresh();
                    setLoadingId(null);
                }
            },
        });
    };

    const handleStatusUpdate = (id: string, newStatus: 'approved' | 'rejected', type: 'applicant' | 'mentor') => {
        const isApprove = newStatus === 'approved';
        setModalInput("");
        setModal({
            isOpen: true,
            title: isApprove ? "Setujui" : "Tolak",
            message: isApprove 
                ? "Apakah Anda yakin ingin menyetujui data ini?" 
                : "Silakan berikan alasan penolakan data ini:",
            type: isApprove ? "success" : "danger",
            confirmLabel: isApprove ? "Ya, Setujui" : "Ya, Tolak",
            showInput: !isApprove,
            inputType: "textarea",
            inputPlaceholder: "Alasan penolakan...",
            onConfirm: async (val?: string) => {
                if (!isApprove && !val?.trim()) {
                    alert("Alasan penolakan wajib diisi!");
                    return;
                }
                setLoadingId(id);
                if (type === 'applicant') {
                    await updateApplicationStatus(id, newStatus, isApprove ? undefined : val);
                } else {
                    await updateMentorStatus(id, newStatus, isApprove ? undefined : val);
                }
                setLoadingId(null);
                closeModal();
                router.refresh();
            }
        });
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            if (activeTab === 'applicants') {
                const data = await exportAllApplications();
                const worksheet = XLSX.utils.json_to_sheet(data.map(app => ({
                    'Nama': app.biodata.nama,
                    'Email': app.biodata.email,
                    'WA': app.biodata.whatsapp,
                    'Jenis Kelamin': app.biodata.jenis_kelamin,
                    'Wilayah': app.biodata.provinsi_nama,
                    'Alamat': app.biodata.alamat_detail,
                    'Asal Sekolah': app.seleksi.asal_sekolah,
                    'Jenjang': app.seleksi.jenjang_pendidikan,
                    'Status': app.status,
                    'Skor': app.scoring?.total_skor || 0,
                    'Lolos Screening': app.scoring?.lolos_screening ? 'YA' : 'TIDAK',
                    'Alasan Gagal': [app.scoring?.alasan_gagal?.join(', '), app.rejectedReason].filter(Boolean).join(' | ') || '-'
                })));
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
                XLSX.writeFile(workbook, `YES_Applicants_${new Date().toLocaleDateString()}.xlsx`);
            } else {
                const data = await exportAllMentors();
                const worksheet = XLSX.utils.json_to_sheet(data.map(m => ({
                    'Nama': m.biodata.nama_lengkap,
                    'Email': m.biodata.email,
                    'WA': m.biodata.whatsapp,
                    'Jenis Kelamin': m.biodata.jenis_kelamin,
                    'Wilayah': m.domisili.provinsi_nama,
                    'Alamat': m.domisili.alamat_detail,
                    'Jenjang Pendidikan': m.pendidikan.jenjang,
                    'Jurusan': m.pendidikan.jurusan,
                    'Status': m.status,
                    'Lancar Al-Quran': m.tambahan.lancar_quran,
                    'Alasan Gagal': [m.scoring?.alasan_gagal?.join(', '), m.rejectedReason].filter(Boolean).join(' | ') || '-'
                })));
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Mentors");
                XLSX.writeFile(workbook, `YES_Mentors_${new Date().toLocaleDateString()}.xlsx`);
            }
        } catch (error) {
            console.error("Export failed:", error);
            alert("Gagal mengekspor data.");
        } finally {
            setIsExporting(false);
        }
    };

    // Filters State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterProvince, setFilterProvince] = useState<string>('All');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    
    // Applicant Specific Filters
    const [filterIncome, setFilterIncome] = useState<string>('All');
    const [filterScore, setFilterScore] = useState<string>('All');
    const [filterScreening, setFilterScreening] = useState<string>('All');
    
    // Mentor Specific Filters
    const [filterJenjang, setFilterJenjang] = useState<string>('All');

    const [sortBy, setSortBy] = useState<string>('date_desc');

    const applications = initialApplicants.items;
    const mentors = initialMentors.items;

    // Derived Data: Filtered & Sorted Logic
    const filteredData = useMemo(() => {
        if (activeTab === 'applicants') {
            let result = [...applications];
            if (filterProvince !== 'All') result = result.filter(app => app.provinsi_nama === filterProvince);
            if (filterIncome !== 'All') result = result.filter(app => app.penghasilan_ortu === filterIncome);
            if (filterStatus !== 'All') result = result.filter(app => app.status === filterStatus);
            if (filterScreening !== 'All') result = result.filter(app => (filterScreening === 'Lolos' ? app.lolos_screening : !app.lolos_screening));
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                result = result.filter(app => app.nama?.toLowerCase().includes(q) || app.email?.toLowerCase().includes(q));
            }
            // Sort
            result.sort((a, b) => {
                if (sortBy === 'score_desc') return (b.total_skor || 0) - (a.total_skor || 0);
                if (sortBy === 'score_asc') return (a.total_skor || 0) - (b.total_skor || 0);
                if (sortBy === 'date_desc') return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
                if (sortBy === 'date_asc') return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
                return 0;
            });
            return result;
        } else {
            let result = [...mentors];
            if (filterProvince !== 'All') result = result.filter(m => m.provinsi_nama === filterProvince);
            if (filterStatus !== 'All') result = result.filter(m => m.status === filterStatus);
            if (filterJenjang !== 'All') result = result.filter(m => m.jenjang === filterJenjang);
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                result = result.filter(m => m.nama?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q));
            }
             // Sort
             result.sort((a, b) => {
                if (sortBy === 'date_desc') return new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime();
                if (sortBy === 'date_asc') return new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime();
                return 0;
            });
            return result;
        }
    }, [activeTab, applications, mentors, filterProvince, filterIncome, filterStatus, filterScreening, filterJenjang, searchQuery, sortBy]);

    // Pagination constants
    const currentData = activeTab === 'applicants' ? initialApplicants : initialMentors;
    const totalPages = currentData.totalPages;
    const currentPage = currentData.page;
    const totalItems = currentData.total;

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(`/admin?tab=${activeTab}&page=${page}`);
    };

    const switchTab = (tab: string) => {
        setActiveTab(tab);
        router.push(`/admin?tab=${tab}&page=1`);
    };

    // Stats
    const stats = useMemo(() => {
        if (activeTab === 'applicants') {
            return {
                total: initialApplicants.total,
                approved: applications.filter(a => a.status === 'approved').length,
                pending: applications.filter(a => a.status === 'pending').length,
                rejected: applications.filter(a => a.status === 'rejected').length,
                lolos: applications.filter(a => a.lolos_screening).length,
                gagal: applications.filter(a => !a.lolos_screening).length,
            };
        } else {
            return {
                total: initialMentors.total,
                approved: mentors.filter(m => m.status === 'approved').length,
                pending: mentors.filter(m => m.status === 'pending').length,
                rejected: mentors.filter(m => m.status === 'rejected').length,
                lolos: 0,
                gagal: 0,
            };
        }
    }, [activeTab, initialApplicants, initialMentors, applications, mentors]);

    return (
        <div className="space-y-6 p-6">
            {/* Tabs Header */}
            <div className="flex border-b border-slate-200 gap-8">
                <button 
                    onClick={() => switchTab('applicants')}
                    className={`pb-4 text-sm font-bold transition-colors relative flex items-center gap-2 ${
                        activeTab === 'applicants' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Users size={18} />
                    Penerima Manfaat
                    {activeTab === 'applicants' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                </button>
                {/* Tab Mentor YES — hanya untuk superadmin */}
                {role === 'superadmin' && (
                    <button 
                        onClick={() => switchTab('mentors')}
                        className={`pb-4 text-sm font-bold transition-colors relative flex items-center gap-2 ${
                            activeTab === 'mentors' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <UserPlus size={18} />
                        Mentor YES
                        {activeTab === 'mentors' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                    </button>
                )}
                <div className="flex-1" />
                <button
                    onClick={handleExportExcel}
                    disabled={isExporting}
                    className="mb-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition disabled:opacity-50"
                >
                    {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                    Export Excel {activeTab === 'applicants' ? 'Pendaftar' : 'Mentor'}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <StatCard label={`Total ${activeTab === 'applicants' ? 'Pendaftar' : 'Calon Mentor'}`} value={stats.total} icon={<Clock size={16} />} color="bg-blue-50 text-blue-700" />
                <StatCard label="Approved" value={stats.approved} icon={<Check size={16} />} color="bg-emerald-100 text-emerald-800" />
                <StatCard label="Pending" value={stats.pending} icon={<Clock size={16} />} color="bg-yellow-100 text-yellow-800" />
                <StatCard label="Rejected" value={stats.rejected} icon={<X size={16} />} color="bg-gray-100 text-gray-800" />
                {activeTab === 'applicants' && (
                    <StatCard label="Lolos Screening" value={stats.lolos} icon={<CheckCircle size={16} />} color="bg-green-50 text-green-700" />
                )}
            </div>

            {/* Filters Section */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Cari Nama / Email..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3">
                         <div className="flex items-center gap-2">
                             <span className="text-sm text-slate-500">Urutkan:</span>
                             <select
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg p-2 outline-none"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="date_desc">Terbaru</option>
                                <option value="date_asc">Terlama</option>
                                {activeTab === 'applicants' && (
                                    <>
                                        <option value="score_desc">Skor Tertinggi</option>
                                        <option value="score_asc">Skor Terendah</option>
                                    </>
                                )}
                            </select>
                         </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                        <option value="All">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <select className="filter-select" value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)}>
                         <option value="All">Semua Wilayah</option>
                         {/* Static for now or derive from data */}
                         {["Jawa Barat", "Jawa Timur", "Sumatera Utara", "Sumatera Barat", "Sumatera Selatan", "Riau", "DI Yogyakarta", "Sulawesi Selatan", "Aceh"].map(p => (
                             <option key={p} value={p}>{p}</option>
                         ))}
                    </select>

                    {activeTab === 'applicants' ? (
                        <>
                            <select className="filter-select" value={filterScreening} onChange={(e) => setFilterScreening(e.target.value)}>
                                <option value="All">Semua Screening</option>
                                <option value="Lolos">Lolos</option>
                                <option value="Gagal">Gagal</option>
                            </select>
                            <select className="filter-select" value={filterIncome} onChange={(e) => setFilterIncome(e.target.value)}>
                                <option value="All">Semua Penghasilan</option>
                                <option value="range_a">0 - &lt; 1 Jt</option>
                                <option value="range_b">1 - 2.5 Jt</option>
                                <option value="range_c">&gt; 2.5 Jt</option>
                            </select>
                        </>
                    ) : (
                        <select className="filter-select" value={filterJenjang} onChange={(e) => setFilterJenjang(e.target.value)}>
                            <option value="All">Semua Jenjang</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                        </select>
                    )}
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            {activeTab === 'applicants' ? (
                                <tr>
                                    <th className="px-6 py-4">Nama Pendaftar</th>
                                    <th className="px-6 py-4">Wilayah</th>
                                    <th className="px-6 py-4 text-center">Screening</th>
                                    <th className="px-6 py-4 text-center">Skor</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="px-6 py-4">Nama Calon Mentor</th>
                                    <th className="px-6 py-4">Domisili</th>
                                    <th className="px-6 py-4">Pendidikan</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredData.map((item) => {
                                const isLoading = loadingId === item._id;
                                if (activeTab === 'applicants') {
                                    const app = item as ApplicationListItem;
                                    return (
                                        <tr key={app._id} className="hover:bg-slate-50 transition group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{app.nama}</div>
                                                <div className="text-xs text-slate-400">{app.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">{app.provinsi_nama}</td>
                                            <td className="px-6 py-4 text-center">
                                                 {app.lolos_screening ? (
                                                    <span className="badge-success">Lolos</span>
                                                 ) : (
                                                    <span className="badge-danger">Gagal</span>
                                                 )}
                                            </td>
                                            <td className="px-6 py-4 text-center font-black text-slate-800 text-lg">{app.total_skor}</td>
                                            <td className="px-6 py-4 text-center"><StatusBadge status={app.status} /></td>
                                            <td className="px-6 py-4">
                                                <ActionButtons 
                                                    id={app._id} 
                                                    status={app.status} 
                                                    type="applicant" 
                                                    isLoading={isLoading} 
                                                    onStatusUpdate={handleStatusUpdate} 
                                                    onDelete={handleDelete}
                                                    detailUrl={`/admin/application/${app._id}`}
                                                />
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    const mentor = item as MentorListItem;
                                    return (
                                        <tr key={mentor._id} className="hover:bg-slate-50 transition group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{mentor.nama}</div>
                                                <div className="text-xs text-slate-400">{mentor.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">{mentor.provinsi_nama}</td>
                                            <td className="px-6 py-4">
                                                 <div className="text-xs font-bold text-blue-600">{mentor.jenjang}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center"><StatusBadge status={mentor.status} /></td>
                                            <td className="px-6 py-4">
                                                <ActionButtons 
                                                    id={mentor._id} 
                                                    status={mentor.status} 
                                                    type="mentor" 
                                                    isLoading={isLoading} 
                                                    onStatusUpdate={handleStatusUpdate} 
                                                    onDelete={handleDelete}
                                                    detailUrl={`/admin/mentor/${mentor._id}`}
                                                />
                                            </td>
                                        </tr>
                                    );
                                }
                            })}

                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                                        <Search size={40} className="mx-auto mb-3 opacity-20" />
                                        <p>Tidak ada data ditemukan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Halaman {currentPage} dari {totalPages} ({totalItems} data)
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-4 text-sm font-bold text-slate-700">{currentPage}</span>
                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .filter-select {
                    @apply bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-blue-500 block w-full p-2 outline-none;
                }
                .badge-success { @apply px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700; }
                .badge-danger { @apply px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700; }
                .action-btn { @apply p-1.5 rounded-md transition duration-200; }
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
                showInput={modal.showInput}
                inputType={modal.inputType}
                inputPlaceholder={modal.inputPlaceholder}
                inputValue={modalInput}
                onInputChange={(val) => setModalInput(val)}
            />
        </div>
    );
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
    return (
        <div className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col items-center justify-center text-center gap-1 hover:shadow-md transition">
            <div className={`p-2 rounded-full ${color} mb-1 bg-opacity-20`}>{icon}</div>
            <div className="text-xl font-black text-slate-800">{value}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (status === 'approved') return <span className="px-2 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 border border-blue-200 uppercase tracking-wider">Approved</span>
    if (status === 'rejected') return <span className="px-2 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">Rejected</span>
    return <span className="px-2 py-1 rounded-full text-[10px] font-black bg-yellow-100 text-yellow-700 border border-yellow-200 animate-pulse uppercase tracking-wider">Pending</span>
}

function ActionButtons({ id, status, type, isLoading, onStatusUpdate, onDelete, detailUrl }: any) {
    return (
        <div className="flex items-center justify-center gap-2">
            {isLoading ? (
                <Loader2 size={18} className="animate-spin text-slate-400" />
            ) : (
                <>
                    <button
                        onClick={() => onStatusUpdate(id, 'approved', type)}
                        disabled={status === 'approved' || status === 'rejected'}
                        title={status === 'rejected' ? "Gagal/Ditolak (Kunci)" : "Approve"}
                        className={`action-btn transition ${
                            status === 'approved' 
                            ? 'text-blue-600 bg-blue-50 cursor-default' 
                            : status === 'rejected'
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-400 hover:bg-blue-100 hover:text-blue-600'
                        }`}
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={() => onStatusUpdate(id, 'rejected', type)}
                        disabled={status === 'rejected'}
                        title={status === 'rejected' ? "Sudah Ditolak" : "Reject"}
                        className={`action-btn transition ${
                            status === 'rejected' 
                            ? 'text-red-300 bg-red-50 cursor-not-allowed' 
                            : 'text-slate-400 hover:bg-red-100 hover:text-red-600'
                        }`}
                    >
                        <X size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(id, type)}
                        title="Hapus"
                        className="action-btn hover:bg-red-100 hover:text-red-700 text-slate-400"
                    >
                        <Trash2 size={16} />
                    </button>
                </>
            )}
            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <Link
                href={detailUrl}
                className="action-btn hover:bg-slate-100 hover:text-slate-800 text-slate-400"
                title="Lihat Detail"
            >
                <Eye size={16} />
            </Link>
        </div>
    );
}

