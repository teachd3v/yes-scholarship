'use client'

import { useState, useMemo, useEffect, useCallback } from 'react';
import { 
    updateApplicationStatus, 
    deleteApplication, 
    exportAllApplications,
    updateMentorStatus,
    deleteMentor,
    exportAllMentors,
    retryEmail,
    resendWelcomeEmailApplication
} from './actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    CheckCircle, XCircle, Clock, Eye, Check, X, Loader2, Filter, 
    ArrowUpDown, Search, ChevronLeft, ChevronRight, Trash2, 
    ClipboardCheck, Users, UserPlus, Download, Mail, RefreshCw, CheckCircle2, AlertCircle, XCircle as XCircleIcon
} from 'lucide-react';
import Link from 'next/link';
import type { ApplicationListItem, MentorListItem, PaginatedResult, ResendEmailLog, EmailMetrics } from '@/lib/types';
import { formatIncome } from '@/lib/types';
import ConfirmationModal from '@/components/ConfirmationModal';
import * as XLSX from 'xlsx';

interface DashboardProps {
    initialApplicants: PaginatedResult<ApplicationListItem>;
    initialMentors: PaginatedResult<MentorListItem>;
    initialEmailLogs?: { items: ResendEmailLog[], hasNextPage: boolean };
    initialEmailMetrics?: EmailMetrics;
    role?: 'superadmin' | 'admin_wilayah';
    region?: string;
    defaultTab?: string;
}

export default function DashboardClient({ 
    initialApplicants, 
    initialMentors, 
    initialEmailLogs,
    initialEmailMetrics,
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

    const handleRetryEmail = (id: string, to: string[]) => {
        setModalInput("");
        setModal({
            isOpen: true,
            title: "Kirim Ulang Email",
            message: `Kirim ulang email ke ${to.join(', ')}?`,
            type: "info",
            confirmLabel: "Ya, Kirim Ulang",
            showInput: false,
            onConfirm: async () => {
                setLoadingId(id);
                const res = await retryEmail(id);
                setLoadingId(null);
                closeModal();
                if (!res.success) {
                    alert(res.error || "Gagal mengirim ulang email");
                } else {
                    alert("Email berstatus dikirim ulang!");
                    router.refresh();
                }
            }
        });
    };

    const handleResendWelcomeApp = (id: string, name: string) => {
        setModalInput("");
        setModal({
            isOpen: true,
            title: "Paksa Kirim Email Welcome",
            message: `Apakah Anda yakin ingin mengirim ulang email 'Pendaftaran Berhasil' ke pendaftar bernama ${name}? Tindakan ini akan mengirim email baru via Resend.`,
            type: "info",
            confirmLabel: "Ya, Kirim",
            showInput: false,
            onConfirm: async () => {
                setLoadingId(id);
                const res = await resendWelcomeEmailApplication(id);
                setLoadingId(null);
                closeModal();
                if (!res.success) {
                    alert(res.error || "Gagal mengirim email welcome!");
                } else {
                    alert("Berhasil! Email verifikasi telah diloncatkan kembali ke antrean.");
                    router.refresh();
                }
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
                    'Tanggal Daftar': new Date(app._createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
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
                    'Tanggal Daftar': new Date(m._createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
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

    // Filters State - sync with searchParams
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
    const [filterProvince, setFilterProvince] = useState<string>(searchParams.get('province') || 'All');
    const [filterStatus, setFilterStatus] = useState<string>(searchParams.get('status') || 'All');
    
    // Applicant Specific Filters
    const [filterIncome, setFilterIncome] = useState<string>(searchParams.get('income') || 'All');
    const [filterScreening, setFilterScreening] = useState<string>(searchParams.get('screening') || 'All');
    
    // Mentor Specific Filters
    const [filterJenjang, setFilterJenjang] = useState<string>(searchParams.get('jenjang') || 'All');

    const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'date_desc');

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(window.location.search);
            if (searchQuery) params.set('q', searchQuery);
            else params.delete('q');
            params.set('page', '1'); // Reset to page 1 on search
            router.push(`/admin?${params.toString()}`);
        }, 600);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, router]);

    // Update filters effect (excluding search)
    const updateFilters = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        
        if (filterProvince !== 'All') params.set('province', filterProvince); else params.delete('province');
        if (filterStatus !== 'All') params.set('status', filterStatus); else params.delete('status');
        if (filterIncome !== 'All') params.set('income', filterIncome); else params.delete('income');
        if (filterScreening !== 'All') params.set('screening', filterScreening); else params.delete('screening');
        if (filterJenjang !== 'All') params.set('jenjang', filterJenjang); else params.delete('jenjang');
        if (sortBy !== 'date_desc') params.set('sort', sortBy); else params.delete('sort');
        
        params.set('page', '1'); // Reset to page 1 on filter change
        router.push(`/admin?${params.toString()}`);
    }, [filterProvince, filterStatus, filterIncome, filterScreening, filterJenjang, sortBy, router]);

    // Run updateFilters when dropdowns change
    const firstUpdate = useState(true);
    useEffect(() => {
        if (firstUpdate[0]) {
            firstUpdate[1](false);
            return;
        }
        updateFilters();
    }, [filterProvince, filterStatus, filterIncome, filterScreening, filterJenjang, sortBy]);

    // Pagination constants
    const currentData = activeTab === 'applicants' ? initialApplicants : initialMentors;
    const filteredData = currentData.items; 

    const totalPages = currentData.totalPages;
    const currentPage = currentData.page;
    const totalItems = currentData.total;

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        const params = new URLSearchParams(window.location.search);
        params.set('page', page.toString());
        router.push(`/admin?${params.toString()}`);
    };


    const handleEmailPagination = (direction: 'before' | 'after') => {
        const items = initialEmailLogs?.items || [];
        if (items.length === 0) return;
        
        let cursor = '';
        if (direction === 'before') {
             cursor = items[0].id;
        } else {
             cursor = items[items.length - 1].id;
        }

        router.push(`/admin?tab=emails&direction=${direction}&cursor=${cursor}`);
    };

    const switchTab = (tab: string) => {
        setActiveTab(tab);
        const params = new URLSearchParams();
        params.set('tab', tab);
        params.set('page', '1');
        router.push(`/admin?${params.toString()}`);
    };

    // Stats
    const stats = useMemo(() => {
        if (activeTab === 'applicants') {
            return {
                total: initialApplicants.total,
                approved: initialApplicants.stats?.approved || 0,
                pending: initialApplicants.stats?.pending || 0,
                rejected: initialApplicants.stats?.rejected || 0,
                lolos: initialApplicants.stats?.lolos || 0,
                gagal: initialApplicants.stats?.gagal || 0,
            };
        } else {
            return {
                total: initialMentors.total,
                approved: initialMentors.stats?.approved || 0,
                pending: initialMentors.stats?.pending || 0,
                rejected: initialMentors.stats?.rejected || 0,
                lolos: 0,
                gagal: 0,
            };
        }
    }, [activeTab, initialApplicants, initialMentors]);

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
                {role === 'superadmin' && (
                    <button 
                        onClick={() => switchTab('emails')}
                        className={`pb-4 text-sm font-bold transition-colors relative flex items-center gap-2 ${
                            activeTab === 'emails' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        <Mail size={18} />
                        Log Email
                        {activeTab === 'emails' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
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
            {activeTab === 'emails' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <StatCard label="Total Emails (Recent)" value={initialEmailMetrics?.total || 0} icon={<Mail size={16} />} color="bg-blue-50 text-blue-700" />
                    <StatCard label="Terkirim" value={initialEmailMetrics?.sent || 0} icon={<Check size={16} />} color="bg-gray-100 text-gray-600" />
                    <StatCard label="Delivered" value={initialEmailMetrics?.delivered || 0} icon={<CheckCircle2 size={16} />} color="bg-emerald-100 text-emerald-800" />
                    <StatCard label="Bounced" value={initialEmailMetrics?.bounced || 0} icon={<AlertCircle size={16} />} color="bg-yellow-100 text-yellow-800" />
                    <StatCard label="Gagal" value={initialEmailMetrics?.failed || 0} icon={<XCircleIcon size={16} />} color="bg-red-100 text-red-800" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <StatCard label={`Total ${activeTab === 'applicants' ? 'Pendaftar' : 'Calon Mentor'}`} value={stats.total} icon={<Clock size={16} />} color="bg-blue-50 text-blue-700" />
                    <StatCard label="Approved" value={stats.approved} icon={<Check size={16} />} color="bg-emerald-100 text-emerald-800" />
                    <StatCard label="Pending" value={stats.pending} icon={<Clock size={16} />} color="bg-yellow-100 text-yellow-800" />
                    <StatCard label="Rejected" value={stats.rejected} icon={<X size={16} />} color="bg-gray-100 text-gray-800" />
                    {activeTab === 'applicants' && (
                        <StatCard label="Lolos Screening" value={stats.lolos} icon={<CheckCircle size={16} />} color="bg-green-50 text-green-700" />
                    )}
                </div>
            )}

            {/* Filters Section (Hide For Emails) */}
            {activeTab !== 'emails' && (
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
                         {Array.from(new Set([
                             ...["JAWA BARAT", "JAWA TIMUR", "SUMATERA UTARA", "SUMATERA BARAT", "SUMATERA SELATAN", "RIAU", "DI YOGYAKARTA", "SULAWESI SELATAN", "ACEH", "DKI JAKARTA", "BANTEN", "JAWA TENGAH", "BALI", "LAMPUNG", "KALIMANTAN TIMUR", "KALIMANTAN BARAT"],
                             ...initialApplicants.items.map(a => a.provinsi_nama?.toUpperCase()).filter(Boolean),
                             ...initialMentors.items.map(m => m.provinsi_nama?.toUpperCase()).filter(Boolean)
                         ])).sort().map(p => (
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
            )}

            {/* Main Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            {activeTab === 'emails' ? (
                                <tr>
                                    <th className="px-6 py-4">Penerima</th>
                                    <th className="px-6 py-4">Subjek</th>
                                    <th className="px-6 py-4 text-center">Tanggal & Waktu</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            ) : activeTab === 'applicants' ? (
                                <tr>
                                    <th className="px-6 py-4">Nama Pendaftar</th>
                                    <th className="px-6 py-4">Wilayah</th>
                                    <th className="px-6 py-4 text-center">Tanggal Daftar</th>
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
                                    <th className="px-6 py-4 text-center">Tanggal Daftar</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {activeTab === 'emails' ? (
                                initialEmailLogs?.items?.map((email) => {
                                    const isLoading = loadingId === email.id;
                                    return (
                                        <tr key={email.id} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{Array.isArray(email.to) ? email.to.join(', ') : email.to}</div>
                                                <div className="text-xs text-slate-400">Dari: {email.from}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 text-sm max-w-[200px] truncate" title={email.subject}>
                                                {email.subject}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-[10px] font-bold text-slate-500">
                                                    {new Date(email.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-[9px] text-slate-400">
                                                    {new Date(email.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <ResendStatusBadge status={email.last_event || 'sent'} />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleRetryEmail(email.id, email.to)}
                                                    disabled={isLoading}
                                                    title="Kirim Ulang"
                                                    className="action-btn hover:bg-slate-200 text-slate-600 disabled:opacity-50"
                                                >
                                                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                            filteredData.map((item) => {
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
                                                <div className="text-[10px] font-bold text-slate-500">
                                                    {new Date(app._createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-[9px] text-slate-400">
                                                    {new Date(app._createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
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
                                                    onResendEmail={() => handleResendWelcomeApp(app._id, app.nama || '')}
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
                                            <td className="px-6 py-4 text-center">
                                                <div className="text-[10px] font-bold text-slate-500">
                                                    {new Date(mentor._createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                                <div className="text-[9px] text-slate-400">
                                                    {new Date(mentor._createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                </div>
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
                            })
                            )}

                            {((activeTab !== 'emails' && filteredData.length === 0) || (activeTab === 'emails' && (!initialEmailLogs || initialEmailLogs.items.length === 0))) && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                                        <Search size={40} className="mx-auto mb-3 opacity-20" />
                                        <p>Tidak ada data ditemukan.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {activeTab !== 'emails' && totalPages > 1 && (
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
                
                {/* Resend Pagination */}
                {activeTab === 'emails' && (
                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                        <p className="text-sm text-slate-500">Menampilkan Email via Resend</p>
                        <div className="flex items-center gap-2">
                             <button
                                onClick={() => handleEmailPagination('before')}
                                disabled={!searchParams.get('cursor')} // simple check, prev only if there is a cursor
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 text-xs font-semibold"
                            >
                                <div className="flex gap-1 items-center"><ChevronLeft size={14} /> Sebelumnya</div>
                            </button>
                            <button
                                onClick={() => handleEmailPagination('after')}
                                disabled={!initialEmailLogs || !initialEmailLogs.hasNextPage}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-30 text-xs font-semibold"
                            >
                                <div className="flex gap-1 items-center">Selanjutnya <ChevronRight size={14} /></div>
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

function ResendStatusBadge({ status }: { status: string }) {
    const format = status.toLowerCase();
    switch (format) {
        case 'delivered':
             return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">Delivered</span>;
        case 'bounced':
             return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Bounced</span>;
        case 'failed':
        case 'delivery_delayed':
             return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">Failed</span>;
        default:
             return <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 capitalize">{format}</span>;
    }
}

function ActionButtons({ id, status, type, isLoading, onStatusUpdate, onDelete, detailUrl, onResendEmail }: any) {
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
                    {type === 'applicant' && onResendEmail && (
                        <button
                            onClick={onResendEmail}
                            title="Paksa Kirim Ulang Email Pendaftaran"
                            className="action-btn hover:bg-blue-100 hover:text-blue-700 text-slate-400"
                        >
                            <Mail size={16} />
                        </button>
                    )}
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

