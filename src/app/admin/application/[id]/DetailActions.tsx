'use client'

import { useState } from 'react';
import { updateApplicationStatus } from "../../actions";
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function DetailActions({ id, currentStatus }: { id: string, currentStatus: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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

    const handleUpdate = (status: 'approved' | 'rejected') => {
        const isApprove = status === 'approved';
        setModal({
            isOpen: true,
            title: isApprove ? "Setujui Lamaran" : "Tolak Lamaran",
            message: isApprove 
                ? "Apakah Anda yakin ingin menyetujui lamaran ini?" 
                : "Apakah Anda yakin ingin menolak lamaran ini?",
            type: isApprove ? "success" : "danger",
            confirmLabel: isApprove ? "Ya, Setujui" : "Ya, Tolak",
            onConfirm: async () => {
                setLoading(true);
                try {
                    await updateApplicationStatus(id, status);
                    router.refresh();
                    closeModal();
                } catch {
                    setModal({
                        isOpen: true,
                        title: "Gagal Mengupdate",
                        message: "Terjadi kesalahan saat mengupdate status.",
                        type: "danger",
                        confirmLabel: "Tutup",
                        onConfirm: () => closeModal(),
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (loading) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="space-y-3">
            <button
                onClick={() => handleUpdate('approved')}
                disabled={currentStatus === 'approved'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition ${
                    currentStatus === 'approved' 
                    ? 'bg-green-100 text-green-700 cursor-default' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200'
                }`}
            >
                <CheckCircle size={20} />
                {currentStatus === 'approved' ? 'Sudah Disetujui' : 'Terima Lamaran (Approve)'}
            </button>

            <button
                onClick={() => handleUpdate('rejected')}
                disabled={currentStatus === 'rejected'}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition ${
                    currentStatus === 'rejected' 
                    ? 'bg-red-100 text-red-700 cursor-default' 
                    : 'bg-white border-2 border-red-100 text-red-600 hover:bg-red-50'
                }`}
            >
                <XCircle size={20} />
                {currentStatus === 'rejected' ? 'Sudah Ditolak' : 'Tolak Lamaran (Reject)'}
            </button>
            
            <div className="text-center">
                 <button onClick={() => router.back()} className="text-sm text-slate-400 hover:text-slate-600 underline">
                    Kembali
                </button>
            </div>

            <ConfirmationModal
                isOpen={modal.isOpen}
                onClose={closeModal}
                onConfirm={modal.onConfirm}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                confirmLabel={modal.confirmLabel}
                isLoading={loading}
            />
        </div>
    );
}
