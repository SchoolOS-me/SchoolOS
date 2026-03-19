import { useEffect, useRef, useState } from "react";

import DashboardLayout from "../../../layout/DashboardLayout";
import DashboardSkeleton from "../../../components/ui/DashboardSkeleton";
import SystemLoadingOverlay from "../../../components/ui/SystemLoadingOverlay";
import { fetchStudentDashboard, type StudentDashboardSummary } from "../../../api/dashboard";
import "./StudentDashboard.css";

function formatPercentage(value: number | null | undefined) {
  if (value == null) {
    return "—";
  }
  return `${value.toFixed(1)}%`;
}

const StudentDashboard = () => {
  const announcementsRef = useRef<HTMLElement | null>(null);
  const calendarRef = useRef<HTMLElement | null>(null);

  const [dashboard, setDashboard] = useState<StudentDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchStudentDashboard()
      .then((data) => {
        if (!isMounted) {
          return;
        }
        setDashboard(data);
      })
      .catch((err) => {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load student dashboard.");
      })
      .finally(() => {
        if (!isMounted) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = dashboard
    ? [
        {
          id: "gpa",
          label: "Current GPA",
          value: dashboard.stats.gpa ? dashboard.stats.gpa.toFixed(2) : "—",
          trend: "Based on published results",
          variant: "neutral",
          icon: "↗",
        },
        {
          id: "attendance",
          label: "Attendance Summary",
          value: formatPercentage(dashboard.stats.attendance_percentage),
          trend: "Last 30 days",
          variant: dashboard.stats.attendance_percentage >= 90 ? "positive" : "negative",
          icon: "📅",
        },
        {
          id: "credits",
          label: "Credits Earned",
          value: `${dashboard.stats.credits_earned}/${dashboard.stats.credits_total}`,
          variant: "neutral",
          icon: "★",
        },
        {
          id: "courses",
          label: "Active Courses",
          value: String(dashboard.stats.active_courses),
          trend: "Current section subjects",
          variant: "neutral",
          icon: "▣",
        },
      ]
    : [];

  return (
    <DashboardLayout title="Academic Overview" variant="student">
      <div className="student-dashboard student-dashboard--relative">
        {isLoading && <DashboardSkeleton />}

        {!isLoading && error && (
          <div className="student-dashboard__error">{error}</div>
        )}

        {!isLoading && dashboard && (
          <>
            <div className="student-dashboard__hero" id="student-overview">
              <h2>Welcome back, {dashboard.student.name}</h2>
              <p>
                {dashboard.student.school_name || "SchoolOS"} · {dashboard.student.class}{" "}
                {dashboard.student.section} · {dashboard.student.academic_year}
              </p>
            </div>

            <div className="student-dashboard__stats" id="academic-performance">
              {stats.map((stat) => (
                <div key={stat.id} className="student-stat">
                  <div className="student-stat__header">
                    <span>{stat.label}</span>
                    <span className="student-stat__icon">{stat.icon}</span>
                  </div>
                  <div className="student-stat__value">{stat.value}</div>
                  {stat.id === "credits" ? (
                    <div className="student-stat__bar">
                      <span
                        style={{
                          width: `${
                            dashboard.stats.credits_total
                              ? (dashboard.stats.credits_earned / dashboard.stats.credits_total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`student-stat__trend ${stat.variant || ""}`}>
                      {stat.trend}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="student-dashboard__grid">
              <section className="student-card" id="announcements" ref={announcementsRef}>
                <div className="student-card__header">
                  <h3>Announcements</h3>
                  <button
                    type="button"
                    className="link-button"
                    onClick={() =>
                      announcementsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  >
                    View All
                  </button>
                </div>
                {dashboard.announcements.length ? (
                  dashboard.announcements.map((item) => (
                    <div key={item.id} className="announcement">
                      <div className="announcement__head">
                        <h4>{item.title}</h4>
                        <span>{item.time}</span>
                      </div>
                      <p>{item.description}</p>
                      <span className="announcement__tag">{item.tag}</span>
                    </div>
                  ))
                ) : (
                  <p className="student-empty-state">No announcements available.</p>
                )}
              </section>

              <div className="student-dashboard__side">
                <section className="student-card" id="deadlines">
                  <div className="student-card__header">
                    <h3>Deadlines</h3>
                  </div>
                  {dashboard.deadlines.length ? (
                    dashboard.deadlines.map((item) => (
                      <div key={item.id} className="deadline">
                        <div className="deadline__date">{item.date}</div>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.subtitle}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="student-empty-state">No upcoming deadlines.</p>
                  )}
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                  >
                    View Calendar
                  </button>
                </section>

                <section className="student-card" id="recent-grades">
                  <div className="student-card__header">
                    <h3>Recent Grades</h3>
                  </div>
                  {dashboard.grades.length ? (
                    dashboard.grades.map((grade) => (
                      <div key={grade.id} className="recent-grade">
                        <div>
                          <h4>{grade.subject}</h4>
                          <p>{grade.course}</p>
                        </div>
                        <span>{grade.score}</span>
                      </div>
                    ))
                  ) : (
                    <p className="student-empty-state">No grades published yet.</p>
                  )}
                </section>
              </div>
            </div>

            <div className="student-dashboard__grid student-dashboard__grid--stacked">
              <section className="student-card" id="announcements-feed">
                <div className="student-card__header">
                  <h3>All Updates</h3>
                </div>
                {dashboard.announcements.length ? (
                  dashboard.announcements.map((item) => (
                    <div key={`${item.id}-feed`} className="announcement">
                      <div className="announcement__head">
                        <h4>{item.title}</h4>
                        <span>{item.time}</span>
                      </div>
                      <p>{item.description}</p>
                      <span className="announcement__tag">{item.tag}</span>
                    </div>
                  ))
                ) : (
                  <p className="student-empty-state">No recent academic updates yet.</p>
                )}
              </section>

              <section className="student-card" id="academic-calendar" ref={calendarRef}>
                <div className="student-card__header">
                  <h3>Academic Calendar</h3>
                </div>
                {dashboard.deadlines.length ? (
                  dashboard.deadlines.map((item) => (
                    <div key={`${item.id}-calendar`} className="deadline">
                      <div className="deadline__date">{item.date}</div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.subtitle}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="student-empty-state">No upcoming calendar items.</p>
                )}
              </section>
            </div>
          </>
        )}

        {isLoading && (
          <SystemLoadingOverlay
            title="Loading dashboard..."
            subtitle="Preparing your academic data"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
