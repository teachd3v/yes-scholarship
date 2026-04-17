import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-10 text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-red-100 rounded-full p-5">
            <ShieldX className="w-12 h-12 text-red-500" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">Akses Ditolak</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Halaman ini hanya dapat diakses oleh <span className="font-bold text-slate-700">Super Admin</span>. 
            Kamu tidak memiliki izin untuk melihat data ini.
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition text-sm"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
