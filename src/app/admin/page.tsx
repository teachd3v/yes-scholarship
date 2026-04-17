import DashboardClient from "./DashboardClient";
import { getApplications, getMentors } from "./actions";
import { logoutAction, getAdminUser } from "./auth-actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ page?: string; tab?: string }> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const currentTab = params.tab || 'applicants';

  const [applicantsData, mentorsData, adminUser] = await Promise.all([
    getApplications(currentTab === 'applicants' ? page : 1),
    getMentors(currentTab === 'mentors' ? page : 1),
    getAdminUser()
  ]);

  const isSuperAdmin = adminUser?.role === 'superadmin';
  const dashboardTitle = isSuperAdmin 
    ? "Admin Dashboard (Super Admin)" 
    : `Admin Wilayah: ${adminUser?.region || 'Unknown'}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold p-2 text-xl rounded-lg">YES</div>
            <h1 className="text-xl font-bold text-slate-800">{dashboardTitle}</h1>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
                {adminUser?.username || 'Admin'}
            </span>
            <form action={logoutAction}>
                <button type="submit" className="text-sm text-red-600 font-medium hover:underline">
                    Logout
                </button>
            </form>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <DashboardClient
              initialApplicants={applicantsData}
              initialMentors={mentorsData}
              role={adminUser?.role}
              region={adminUser?.region}
              defaultTab={currentTab}
            />
        </div>
      </main>
    </div>
  );
}

