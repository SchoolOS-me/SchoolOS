import DashboardLayout from "../../../layout/DashboardLayout";
import {
  adminActivity,
  adminCalendar,
  adminQuickActions,
  adminStats,
} from "../../../mock/adminDashboard";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <DashboardLayout title="School Overview" variant="admin">
      <div className="admin-dashboard">
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
          {adminStats.map((stat) => (
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
            {adminActivity.map((item) => (
              <div key={item.id} className="admin-activity">
                <div className="admin-activity__avatar">{item.initials}</div>
                <div className="admin-activity__info">
                  <h4>{item.name}</h4>
                  <p>{item.detail}</p>
                </div>
                <span className="admin-activity__time">{item.time}</span>
              </div>
            ))}
          </section>

          <div className="admin-dashboard__side">
            <section className="admin-card admin-card--accent">
              <h3>Academic Calendar</h3>
              <p>Next exam period starts in 12 days.</p>
              {adminCalendar.map((item) => (
                <div key={item.id} className="admin-calendar__item">
                  <div className="admin-calendar__icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.time}</p>
                  </div>
                </div>
              ))}
            </section>

            <section className="admin-card">
              <div className="admin-card__header">
                <h3>Quick Actions</h3>
              </div>
              <div className="admin-quick">
                {adminQuickActions.map((action) => (
                  <button key={action} type="button">
                    {action}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
