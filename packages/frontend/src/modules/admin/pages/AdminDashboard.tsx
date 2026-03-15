import { useEffect, useState } from "react";

import DashboardLayout from "../../../layout/DashboardLayout";
import DashboardSkeleton from "../../../components/ui/DashboardSkeleton";
import SystemLoadingOverlay from "../../../components/ui/SystemLoadingOverlay";
import {
  adminActivity,
  adminCalendar,
  adminQuickActions,
  adminStats,
} from "../../../mock/adminDashboard";
import { fetchAdminDashboard } from "../../../api/dashboard";
import { USE_MOCK_DATA } from "../../../config/env";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(USE_MOCK_DATA ? adminStats : []);
  const [activity, setActivity] = useState(USE_MOCK_DATA ? adminActivity : []);
  const [calendar, setCalendar] = useState(USE_MOCK_DATA ? adminCalendar : []);
  const [quickActions, setQuickActions] = useState(
    USE_MOCK_DATA ? adminQuickActions : []
  );
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);

  useEffect(() => {
    if (USE_MOCK_DATA) return;

    let isMounted = true;
    setIsLoading(true);

    fetchAdminDashboard()
      .then((data) => {
        if (!isMounted) return;
        setStats([
          {
            id: "students",
            label: "Total Students",
            value: String(data.academics.students),
            trend: `${data.academics.classes} Classes`,
          },
          {
            id: "attendance",
            label: "Attendance Rate",
            value: `${data.attendance.today_percentage}%`,
            trend: "Today",
          },
          {
            id: "fees",
            label: "Pending Fees",
            value: "$0",
            trend: "Fees API pending",
          },
          {
            id: "teachers",
            label: "Active Teachers",
            value: String(data.academics.teachers),
            trend: `${data.academics.sections} Sections`,
          },
        ]);

        // Backend summary currently returns only top stats.
        setActivity([]);
        setCalendar([]);
        setQuickActions([]);
      })
      .catch(() => {
        if (!isMounted) return;
        setStats(adminStats);
        setActivity(adminActivity);
        setCalendar(adminCalendar);
        setQuickActions(adminQuickActions);
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
    <DashboardLayout title="School Overview" variant="admin">
      <div className="admin-dashboard admin-dashboard--relative">
        {isLoading && <DashboardSkeleton />}
        {!isLoading && (
          <>
            <div className="admin-dashboard__header">
              <div>
                <p className="admin-dashboard__breadcrumb">
                  Dashboard <span>/</span> School Overview
                </p>
                <h2>School Overview</h2>
                <p className="admin-dashboard__subtitle">
                  Welcome back. Monitoring activity for Term 2, 2024.
                </p>
              </div>
              <div className="admin-dashboard__actions">
                <button type="button" className="button-secondary">Export Data</button>
                <button type="button" className="button-primary">Add Student</button>
              </div>
            </div>

            <div className="admin-dashboard__stats">
              {stats.map((stat) => (
                <div key={stat.id} className="admin-stat">
                  <div className="admin-stat__header">
                    <span>{stat.label}</span>
                    <span className="admin-stat__icon">◈</span>
                  </div>
                  <div className="admin-stat__value">{stat.value}</div>
                  <div className="admin-stat__trend">{stat.trend}</div>
                </div>
              ))}
            </div>

            <div className="admin-dashboard__grid">
              <section className="admin-card">
                <div className="admin-card__header">
                  <h3>Recent Student Activity</h3>
                  <button type="button" className="link-button">View all</button>
                </div>
                {activity.map((item) => (
                  <div key={item.id} className="admin-activity">
                    <div className="admin-activity__avatar">{item.initials}</div>
                    <div className="admin-activity__info">
                      <h4>{item.name}</h4>
                      <p>{item.detail}</p>
                    </div>
                    <span className="admin-activity__time">{item.time}</span>
                  </div>
                ))}
                {!activity.length && (
                  <p className="admin-empty-state">No recent activity available.</p>
                )}
              </section>

              <div className="admin-dashboard__side">
                <section className="admin-card admin-card--accent">
                  <h3>Academic Calendar</h3>
                  <p>Next exam period starts in 12 days.</p>
                  {calendar.map((item) => (
                    <div key={item.id} className="admin-calendar__item">
                      <div className="admin-calendar__icon">{item.icon}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.time}</p>
                      </div>
                    </div>
                  ))}
                  {!calendar.length && (
                    <p className="admin-empty-state admin-empty-state--on-accent">
                      No calendar items available.
                    </p>
                  )}
                </section>

                <section className="admin-card">
                  <div className="admin-card__header">
                    <h3>Quick Actions</h3>
                  </div>
                  <div className="admin-quick">
                    {quickActions.map((action) => (
                      <button key={action} type="button">
                        {action}
                      </button>
                    ))}
                    {!quickActions.length && (
                      <p className="admin-empty-state">No quick actions available.</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}

        {isLoading && (
          <SystemLoadingOverlay
            title="Loading school dashboard..."
            subtitle="Please wait while we sync records"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
