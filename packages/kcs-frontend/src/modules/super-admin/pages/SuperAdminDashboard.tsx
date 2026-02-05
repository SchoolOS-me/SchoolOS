import DashboardLayout from "../../../layout/DashboardLayout";
import SuperAdminStatCard from "../components/SuperAdminStatCard";
import SchoolsTable from "../components/SchoolsTable";
import { superAdminSchools, superAdminStats } from "../../../mock/superAdminDashboard";
import "./SuperAdminDashboard.css";

interface School {
  id: string;
  name: string;
  adminName: string;
  adminEmail: string;
  subscriptionStatus: "active" | "trial" | "expired";
}

const mockSchools: School[] = superAdminSchools;
const SuperAdminDashboard = () => {
  return (
    <DashboardLayout title="Super Admin Dashboard" variant="superAdmin">
      <div className="super-admin-dashboard">
        <div className="super-admin-stats">
          {superAdminStats.map((stat) => (
            <SuperAdminStatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendVariant={stat.trendVariant}
              icon={
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M4 5h16v14H4V5zm4 4h8v2H8V9zm0 4h8v2H8v-2z" />
                </svg>
              }
            />
          ))}
        </div>

        <section className="super-admin-section">
          <SchoolsTable schools={mockSchools} />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
