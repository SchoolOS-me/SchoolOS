import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchParentChildren, fetchParentResults, type ParentChild, type ParentReportCard } from "../../../api/academics";
import { fetchParentDashboard, type ParentDashboardSummary } from "../../../api/dashboard";
import DashboardLayout from "../../../layout/DashboardLayout";
import { getCurrentUserDisplay } from "../../../utils/userDisplay";
import "./ParentDashboard.css";

const ACTIVE_STUDENT_STORAGE_KEY = "parent_active_student_uuid";

function formatPercentage(value: number | null | undefined) {
  if (value == null) {
    return "—";
  }
  return `${value.toFixed(1)}%`;
}

function formatCurrency(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  return "—";
}

function getAttendanceTitle(attendance: number) {
  if (attendance >= 95) {
    return "Excellent Presence";
  }
  if (attendance >= 90) {
    return "Good Standing";
  }
  return "Needs Attention";
}

function getAttendanceDetail(attendance: number) {
  if (attendance >= 95) {
    return "Attendance is consistently strong.";
  }
  if (attendance >= 90) {
    return "A few absences recorded this cycle.";
  }
  return "Attendance is below the expected threshold.";
}

const ParentDashboard = () => {
  const navigate = useNavigate();
  const reportSectionRef = useRef<HTMLElement | null>(null);
  const currentUser = getCurrentUserDisplay();

  const [dashboard, setDashboard] = useState<ParentDashboardSummary | null>(null);
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [selectedStudentUuid, setSelectedStudentUuid] = useState("");
  const [reports, setReports] = useState<ParentReportCard[]>([]);
  const [selectedReportIndex, setSelectedReportIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchParentDashboard(), fetchParentChildren()])
      .then(([dashboardData, childrenData]) => {
        if (!isMounted) {
          return;
        }

        setDashboard(dashboardData);
        setChildren(childrenData);

        const storedStudentUuid = sessionStorage.getItem(ACTIVE_STUDENT_STORAGE_KEY) || "";
        const defaultStudentUuid =
          childrenData.find((child) => child.student_uuid === storedStudentUuid)?.student_uuid ||
          childrenData[0]?.student_uuid ||
          "";

        setSelectedStudentUuid(defaultStudentUuid);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load parent dashboard.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedStudentUuid) {
      return;
    }

    sessionStorage.setItem(ACTIVE_STUDENT_STORAGE_KEY, selectedStudentUuid);

    let isMounted = true;
    const loadReports = async () => {
      await Promise.resolve();

      if (!isMounted) {
        return;
      }

      setIsReportLoading(true);
      setReportError(null);

      try {
        const data = await fetchParentResults(selectedStudentUuid);
        if (!isMounted) {
          return;
        }
        setReports(data);
        setSelectedReportIndex(0);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setReports([]);
        setReportError(err instanceof Error ? err.message : "Failed to load published reports.");
      } finally {
        if (isMounted) {
          setIsReportLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, [selectedStudentUuid]);

  const selectedChild = children.find((child) => child.student_uuid === selectedStudentUuid) || null;
  const selectedSummary = dashboard?.children.find(
    (child) => child.student_uuid === selectedStudentUuid
  ) || null;
  const selectedAlert = dashboard?.alerts.find(
    (alert) => alert.student_uuid === selectedStudentUuid
  ) || null;
  const selectedReport = reports[selectedReportIndex] || null;
  const feeItems = dashboard?.fee_status.items || [];
  const hasFeeData = feeItems.length > 0;

  const communicationMessage = dashboard?.message || (
    selectedAlert
      ? {
          sender: "Attendance Monitor",
          message: `${selectedAlert.name}'s attendance is currently ${formatPercentage(
            selectedAlert.attendance_percentage
          )}.`,
        }
      : selectedReport
        ? {
            sender: selectedReport.exam.name,
            message: `${selectedReport.student.name} scored ${formatPercentage(
              selectedReport.summary.percentage
            )} in the latest published report.`,
          }
        : null
  );

  const stats = [
    {
      id: "avg",
      label: "Current Average",
      value: formatPercentage(selectedSummary?.latest_percentage ?? dashboard?.stats.current_average ?? null),
      trend: selectedReport ? `Latest published · ${selectedReport.exam.name}` : "No published result yet",
      variant: selectedSummary?.latest_percentage != null ? "positive" : "neutral",
      icon: "★",
    },
    {
      id: "fee",
      label: "Outstanding Fees",
      value: formatCurrency(dashboard?.fee_status.total),
      trend: hasFeeData ? `${feeItems.length} open fee item(s)` : "Finance API not available yet",
      variant: hasFeeData ? "positive" : "neutral",
      icon: "📅",
    },
    {
      id: "alerts",
      label: "Active Alerts",
      value: `${selectedAlert ? 1 : 0} New`,
      trend: selectedAlert ? "Attendance requires attention" : "No alerts for this student",
      variant: selectedAlert ? "positive" : "neutral",
      icon: "🔔",
    },
  ];

  return (
    <DashboardLayout
      title={selectedChild ? `${selectedChild.name}'s Overview` : "Parent Overview"}
      variant="parent"
      parentTopbar={{
        students: children.map((child) => ({
          studentUuid: child.student_uuid,
          name: child.name,
          className: child.class,
          sectionName: child.section,
        })),
        activeStudentUuid: selectedStudentUuid,
        onStudentChange: setSelectedStudentUuid,
      }}
    >
      <div className="parent-dashboard" id="dashboard-overview">
        <div className="parent-dashboard__hero">
          <h2>{selectedChild ? `${selectedChild.name}'s Overview` : "Parent Overview"}</h2>
          <p>
            {selectedChild
              ? `${currentUser.schoolName} · ${selectedChild.class} · ${selectedChild.section}${
                  selectedReport ? ` · ${selectedReport.exam.academic_year}` : ""
                }`
              : "No linked student found"}
          </p>
        </div>

        {error && <div className="parent-dashboard__notice parent-dashboard__notice--error">{error}</div>}
        {isLoading && <div className="parent-dashboard__notice">Loading parent dashboard...</div>}

        {!isLoading && !error && (
          <>
            <div className="parent-dashboard__stats" id="alerts">
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
              <section className="parent-card parent-card--wide" id="academic-progress" ref={reportSectionRef}>
                <div className="parent-card__header">
                  <h3>Academic Progress</h3>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => reportSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  >
                    View Full Report
                  </button>
                </div>

                {reportError && <div className="parent-dashboard__notice parent-dashboard__notice--error">{reportError}</div>}
                {isReportLoading && <div className="parent-dashboard__notice">Loading published report cards...</div>}
                {!isReportLoading && !reportError && !reports.length && (
                  <div className="parent-dashboard__notice">
                    No published exam reports are available for the selected student.
                  </div>
                )}

                {!!reports.length && (
                  <>
                    <div className="parent-progress">
                      {reports.map((report, index) => (
                        <button
                          key={`${report.exam.name}-${report.exam.academic_year}`}
                          type="button"
                          className={`parent-progress__button ${
                            index === selectedReportIndex ? "is-active" : ""
                          }`}
                          onClick={() => setSelectedReportIndex(index)}
                        >
                          {report.exam.name}
                        </button>
                      ))}
                    </div>

                    {selectedReport && (
                      <div className="parent-report">
                        <div className="parent-report__summary">
                          <div>
                            <span className="parent-report__label">Overall</span>
                            <strong>{formatPercentage(selectedReport.summary.percentage)}</strong>
                          </div>
                          <div>
                            <span className="parent-report__label">Marks</span>
                            <strong>
                              {selectedReport.summary.total_marks} / {selectedReport.summary.max_marks}
                            </strong>
                          </div>
                          <div>
                            <span className="parent-report__label">Result</span>
                            <strong>{selectedReport.summary.is_pass ? "Pass" : "Review Needed"}</strong>
                          </div>
                        </div>

                        <div className="parent-report__table" aria-label="Published report subjects">
                          {selectedReport.subjects.map((subject) => (
                            <div key={subject.subject_name} className="parent-report__row">
                              <span>{subject.subject_name}</span>
                              <span>
                                {subject.marks_obtained ?? "—"} / {subject.max_marks}
                              </span>
                              <span className={subject.is_pass ? "is-pass" : "is-fail"}>
                                {subject.is_pass ? "Pass" : "At Risk"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </section>

              <section className="parent-card parent-card--accent" id="fee-status">
                <h3>Fee Status</h3>
                <p>Total Outstanding</p>
                <div className="parent-fee">{formatCurrency(dashboard?.fee_status.total)}</div>
                {hasFeeData ? (
                  feeItems.map((item) => (
                    <div key={item.label} className="parent-fee__row">
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))
                ) : (
                  <div className="parent-emptyState">No billing records are being returned by the backend yet.</div>
                )}
                <button type="button" className="parent-primary" disabled={!hasFeeData}>
                  {hasFeeData ? "Pay Now" : "Billing Unavailable"}
                </button>
                <button type="button" className="parent-link" disabled={!hasFeeData}>
                  View Billing History
                </button>
              </section>

              <section className="parent-card parent-card--wide" id="communication-center">
                <div className="parent-card__header">
                  <h3>Communication Center</h3>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                </div>
                {communicationMessage ? (
                  <div className="parent-message">
                    <div className="parent-avatar">
                      {communicationMessage.sender
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("")}
                    </div>
                    <div>
                      <h4>{communicationMessage.sender}</h4>
                      <p>{communicationMessage.message}</p>
                    </div>
                  </div>
                ) : (
                  <div className="parent-dashboard__notice">No recent communication is available.</div>
                )}
              </section>

              <section className="parent-card">
                <div className="parent-card__header">
                  <h3>Attendance</h3>
                </div>
                <div className="parent-attendance">
                  <div className="parent-attendance__ring">
                    {formatPercentage(selectedSummary?.attendance_percentage ?? dashboard?.attendance.value ?? 0)}
                  </div>
                  <div>
                    <h4>{getAttendanceTitle(selectedSummary?.attendance_percentage ?? dashboard?.attendance.value ?? 0)}</h4>
                    <p>{getAttendanceDetail(selectedSummary?.attendance_percentage ?? dashboard?.attendance.value ?? 0)}</p>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
