import DashboardLayout from "../../../layout/DashboardLayout";
import {
  parentAttendance,
  parentFeeStatus,
  parentMessage,
  parentStats,
} from "../../../mock/parentDashboard";
import "./ParentDashboard.css";

const ParentDashboard = () => {
  return (
    <DashboardLayout title="Alex's Overview" variant="parent">
      <div className="parent-dashboard">
        <div className="parent-dashboard__hero">
          <h2>Alex's Overview</h2>
          <p>St. Patrick's Elementary · Term 2, 2023</p>
        </div>

        <div className="parent-dashboard__stats">
          {parentStats.map((stat) => (
            <div key={stat.id} className="parent-stat">
              <div className="parent-stat__header">
                <span>{stat.label}</span>
                <span className="parent-stat__icon">{stat.icon}</span>
              </div>
              <div className="parent-stat__value">{stat.value}</div>
              <div
                className={`parent-stat__trend ${
                  stat.variant === "positive" ? "positive" : ""
                }`}
              >
                {stat.trend}
              </div>
            </div>
          ))}
        </div>

        <div className="parent-dashboard__grid">
          <section className="parent-card parent-card--wide">
            <div className="parent-card__header">
              <h3>Academic Progress</h3>
              <button type="button" className="link-button">View Full Report</button>
            </div>
            <div className="parent-progress">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span className="is-active">Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </section>

          <section className="parent-card parent-card--accent">
            <h3>Fee Status</h3>
            <p>Total Outstanding</p>
            <div className="parent-fee">{parentFeeStatus.total}</div>
            {parentFeeStatus.items.map((item) => (
              <div key={item.label} className="parent-fee__row">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </div>
            ))}
            <button type="button" className="parent-primary">Pay Now</button>
            <button type="button" className="parent-link">View Billing History</button>
          </section>

          <section className="parent-card parent-card--wide">
            <div className="parent-card__header">
              <h3>Communication Center</h3>
              <button type="button" className="link-button">...</button>
            </div>
            <div className="parent-message">
              <div className="parent-avatar">DH</div>
              <div>
                <h4>{parentMessage.sender}</h4>
                <p>{parentMessage.message}</p>
              </div>
            </div>
          </section>

          <section className="parent-card">
            <div className="parent-card__header">
              <h3>Attendance</h3>
            </div>
            <div className="parent-attendance">
              <div className="parent-attendance__ring">{parentAttendance.value}</div>
              <div>
                <h4>{parentAttendance.title}</h4>
                <p>{parentAttendance.detail}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
