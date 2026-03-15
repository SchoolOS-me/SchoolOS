import { useEffect, useState } from "react";

import DashboardLayout from "../../../layout/DashboardLayout";
import DashboardSkeleton from "../../../components/ui/DashboardSkeleton";
import SystemLoadingOverlay from "../../../components/ui/SystemLoadingOverlay";
import {
  studentAnnouncements,
  studentDeadlines,
  studentGrades,
  studentStats,
} from "../../../mock/studentDashboard";
import { fetchStudentDashboard } from "../../../api/dashboard";
import { USE_MOCK_DATA } from "../../../config/env";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [stats, setStats] = useState(USE_MOCK_DATA ? studentStats : []);
  const [announcements, setAnnouncements] = useState(
    USE_MOCK_DATA ? studentAnnouncements : []
  );
  const [deadlines, setDeadlines] = useState(USE_MOCK_DATA ? studentDeadlines : []);
  const [grades, setGrades] = useState(USE_MOCK_DATA ? studentGrades : []);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA);

  useEffect(() => {
    if (USE_MOCK_DATA) return;

    let isMounted = true;
    setIsLoading(true);

    fetchStudentDashboard()
      .then((data) => {
        if (!isMounted) return;

        setStats([
          {
            id: "gpa",
            label: "Current GPA",
            value: data.stats.gpa ? data.stats.gpa.toFixed(2) : "—",
            trend: "Latest",
            variant: "neutral",
            icon: "↗",
          },
          {
            id: "attendance",
            label: "Attendance Summary",
            value: `${data.stats.attendance_percentage}%`,
            trend: "Last 30 days",
            variant: "neutral",
            icon: "📅",
          },
          {
            id: "credits",
            label: "Credits Earned",
            value: `${data.stats.credits_earned}/${data.stats.credits_total}`,
            variant: "neutral",
            icon: "★",
          },
          {
            id: "courses",
            label: "Active Courses",
            value: String(data.stats.active_courses),
            trend: "Current term",
            variant: "neutral",
            icon: "▣",
          },
        ]);

        setGrades(
          (data.grades || []).map((grade) => ({
            ...grade,
            id: String(grade.id),
          }))
        );
        setAnnouncements(data.announcements || []);
        setDeadlines(data.deadlines || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setStats(studentStats);
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
    <DashboardLayout title="Academic Overview" variant="student">
      <div className="student-dashboard student-dashboard--relative">
        {isLoading && <DashboardSkeleton />}

        {!isLoading && (
          <>
            <div className="student-dashboard__hero">
              <h2>Welcome back, Alex</h2>
              <p>Academic Year 2023-2024 · Spring Semester</p>
            </div>

            <div className="student-dashboard__stats">
              {stats.map((stat) => (
                <div key={stat.id} className="student-stat">
                  <div className="student-stat__header">
                    <span>{stat.label}</span>
                    <span className="student-stat__icon">{stat.icon}</span>
                  </div>
                  <div className="student-stat__value">{stat.value}</div>
                  {stat.id === "credits" ? (
                    <div className="student-stat__bar">
                      <span />
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
              <section className="student-card">
                <div className="student-card__header">
                  <h3>Announcements</h3>
                  <button type="button" className="link-button">View All</button>
                </div>
                {announcements.length ? (
                  announcements.map((item) => (
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
                <section className="student-card">
                  <div className="student-card__header">
                    <h3>Deadlines</h3>
                  </div>
                  {deadlines.length ? (
                    deadlines.map((item) => (
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
                  <button type="button" className="secondary-button">View Calendar</button>
                </section>

                <section className="student-card">
                  <div className="student-card__header">
                    <h3>Recent Grades</h3>
                  </div>
                  {grades.length ? (
                    grades.map((grade) => (
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
