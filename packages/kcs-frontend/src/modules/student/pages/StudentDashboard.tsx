import DashboardLayout from "../../../layout/DashboardLayout";
import {
  studentAnnouncements,
  studentDeadlines,
  studentGrades,
  studentStats,
} from "../../../mock/studentDashboard";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  return (
    <DashboardLayout title="Academic Overview" variant="student">
      <div className="student-dashboard">
        <div className="student-dashboard__hero">
          <h2>Welcome back, Alex</h2>
          <p>Academic Year 2023-2024 · Spring Semester</p>
        </div>

        <div className="student-dashboard__stats">
          {studentStats.map((stat) => (
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
            {studentAnnouncements.map((item) => (
              <div key={item.id} className="announcement">
                <div className="announcement__head">
                  <h4>{item.title}</h4>
                  <span>{item.time}</span>
                </div>
                <p>{item.description}</p>
                <span className="announcement__tag">{item.tag}</span>
              </div>
            ))}
          </section>

          <div className="student-dashboard__side">
            <section className="student-card">
              <div className="student-card__header">
                <h3>Deadlines</h3>
              </div>
              {studentDeadlines.map((item) => (
                <div key={item.id} className="deadline">
                  <div className="deadline__date">{item.date}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              ))}
              <button type="button" className="secondary-button">View Calendar</button>
            </section>

            <section className="student-card">
              <div className="student-card__header">
                <h3>Recent Grades</h3>
              </div>
              {studentGrades.map((grade) => (
                <div key={grade.id} className="recent-grade">
                  <div>
                    <h4>{grade.subject}</h4>
                    <p>{grade.course}</p>
                  </div>
                  <span>{grade.score}</span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
