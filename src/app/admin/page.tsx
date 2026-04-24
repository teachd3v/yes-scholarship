import DashboardClient from "./DashboardClient";
import { getApplications, getMentors, getEmailLogs, getRecentEmailMetrics } from "./actions";
import { logoutAction, getAdminUser } from "./auth-actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const currentTab = params.tab || 'applicants';
  const cursor = params.cursor || null;
  const direction = (params.direction as 'before' | 'after') || 'after';

  const q = params.q || '';
  const province = params.province || 'All';
  const status = params.status || 'All';
  const screening = params.screening || 'All';
  const income = params.income || 'All';
  const jenjang = params.jenjang || 'All';

  const isEmails = currentTab === 'emails';

  const [applicantsData, mentorsData, adminUser, emailsData, emailsMetrics] = await Promise.all([
    getApplications(currentTab === 'applicants' ? page : 1, { search: q, province, status, screening, income }),
    getMentors(currentTab === 'mentors' ? page : 1, { search: q, province, status, jenjang }),
    getAdminUser(),
    isEmails ? getEmailLogs(50, cursor, direction) : { items: [], hasNextPage: false },
    isEmails ? getRecentEmailMetrics() : { sent: 0, delivered: 0, bounced: 0, failed: 0, total: 0 }
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
              initialEmailLogs={emailsData}
              initialEmailMetrics={emailsMetrics}
              role={adminUser?.role}
              region={adminUser?.region}
              defaultTab={currentTab}
            />
        </div>
      </main>
    </div>
  );
}

