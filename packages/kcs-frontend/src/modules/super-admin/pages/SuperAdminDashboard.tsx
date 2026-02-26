import { useEffect, useState } from "react";

import DashboardLayout from "../../../layout/DashboardLayout";
import SuperAdminStatCard from "../components/SuperAdminStatCard";
import SchoolsTable from "../components/SchoolsTable";
import DashboardSkeleton from "../../../components/ui/DashboardSkeleton";
import SystemLoadingOverlay from "../../../components/ui/SystemLoadingOverlay";
import { superAdminSchools, superAdminStats } from "../../../mock/superAdminDashboard";
import { fetchSuperAdminDashboard } from "../../../api/dashboard";
import { USE_MOCK_DATA } from "../../../config/env";
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
  const [stats, setStats] = useState(superAdminStats);
  const [schools, setSchools] = useState(mockSchools);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);

  useEffect(() => {
    if (USE_MOCK_DATA) return;

    let isMounted = true;
    setIsLoading(true);

    fetchSuperAdminDashboard()
      .then((data) => {
        if (!isMounted) return;

        setStats([
          {
            id: "totalSchools",
            label: "Total Schools",
            value: String(data.stats.total_schools),
            trend: "All tenants",
            trendVariant: "positive",
          },
          {
            id: "activeSubscriptions",
            label: "Active Subscriptions",
            value: String(data.stats.active_subscriptions),
            trend: "Active",
            trendVariant: "positive",
          },
          {
            id: "expiredSubscriptions",
            label: "Expired Subscriptions",
            value: String(data.stats.expired_subscriptions),
            trend: "Expired",
            trendVariant: "negative",
          },
          {
            id: "trialSchools",
            label: "Trial Schools",
            value: String(data.stats.trial_schools),
            trend: "Trials",
            trendVariant: "neutral",
          },
        ]);

        const mappedSchools = data.schools.map((school) => ({
          id: String(school.id),
          name: school.name,
          adminName: school.admin_name || "—",
          adminEmail: school.admin_email || "—",
          subscriptionStatus: school.subscription_status,
        }));

        setSchools(mappedSchools.length ? mappedSchools : mockSchools);
      })
      .catch(() => {
        if (!isMounted) return;
        setStats(superAdminStats);
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout title="Super Admin Dashboard" variant="superAdmin">
      <div className="super-admin-dashboard super-admin-dashboard--relative">
        {isLoading && <DashboardSkeleton variant="table" />}

        {!isLoading && (
          <>
            <div className="super-admin-stats">
              {stats.map((stat) => (
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
              <SchoolsTable schools={schools} />
            </section>
          </>
        )}

        {isLoading && (
          <SystemLoadingOverlay
            title="Fetching school data..."
            subtitle="Please wait while we sync records"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;
