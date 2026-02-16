import DashboardClient from "./DashboardClient";
import { getApplications } from "./actions";
import { logoutAction } from "./auth-actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const data = await getApplications(page);

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold p-2 text-xl rounded-lg">YES</div>
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Admin</span>
            <form action={logoutAction}>
                <button type="submit" className="text-sm text-red-600 font-medium hover:underline">
                    Logout
                </button>
            </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="font-bold text-slate-700">Daftar Pendaftar ({data.total})</h2>
            </div>

            <DashboardClient
              applications={data.items}
              currentPage={data.page}
              totalPages={data.totalPages}
              totalItems={data.total}
            />
        </div>
      </main>
    </div>
  );
}
