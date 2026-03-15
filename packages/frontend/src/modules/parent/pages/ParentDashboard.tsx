import { useEffect, useState } from "react";

import DashboardLayout from "../../../layout/DashboardLayout";
import {
  parentAttendance,
  parentFeeStatus,
  parentMessage,
  parentStats,
} from "../../../mock/parentDashboard";
import { fetchParentDashboard } from "../../../api/dashboard";
import { USE_MOCK_DATA } from "../../../config/env";
import "./ParentDashboard.css";

const ParentDashboard = () => {
  const [stats, setStats] = useState(parentStats);
  const [feeStatus, setFeeStatus] = useState(parentFeeStatus);
  const [message, setMessage] = useState(parentMessage);
  const [attendance, setAttendance] = useState(parentAttendance);

  useEffect(() => {
    if (USE_MOCK_DATA) return;

    let isMounted = true;
    fetchParentDashboard()
      .then((data) => {
        if (!isMounted) return;

        setStats([
          {
            id: "avg",
            label: "Current Average",
            value: data.stats.current_average
              ? `${data.stats.current_average.toFixed(1)} / 100`
              : "—",
            trend: "Latest published",
            variant: "positive",
            icon: "★",
          },
          {
            id: "fee",
            label: "Next Fee Due",
            value: "—",
            trend: "Fees API pending",
            variant: "neutral",
            icon: "📅",
          },
          {
            id: "alerts",
            label: "Active Alerts",
            value: `${data.stats.alerts} New`,
            trend: "Attendance alerts",
            variant: "neutral",
            icon: "🔔",
          },
        ]);

        setFeeStatus(
          data.fee_status.items.length
            ? data.fee_status
            : parentFeeStatus
        );
        setMessage(data.message || parentMessage);
        setAttendance({
          value: `${data.attendance.value}%`,
          title: data.attendance.title,
          detail: data.attendance.detail,
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setStats(parentStats);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout title="Alex's Overview" variant="parent">
      <div className="parent-dashboard">
        <div className="parent-dashboard__hero">
          <h2>Alex's Overview</h2>
          <p>St. Patrick's Elementary · Term 2, 2023</p>
        </div>

        <div className="parent-dashboard__stats">
          {stats.map((stat) => (
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
            <div className="parent-fee">{feeStatus.total}</div>
            {feeStatus.items.map((item) => (
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
                <h4>{message.sender}</h4>
                <p>{message.message}</p>
              </div>
            </div>
          </section>

          <section className="parent-card">
            <div className="parent-card__header">
              <h3>Attendance</h3>
            </div>
            <div className="parent-attendance">
              <div className="parent-attendance__ring">{attendance.value}</div>
              <div>
                <h4>{attendance.title}</h4>
                <p>{attendance.detail}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
