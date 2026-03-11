'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
    return (
        <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition print:hidden shadow-sm"
        >
            <Printer size={16} />
            Cetak PDF
        </button>
    );
}
