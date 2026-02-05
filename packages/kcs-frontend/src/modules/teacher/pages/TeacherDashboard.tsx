import "./TeacherDashboard.css";

import DashboardLayout from "../../../layout/DashboardLayout";
import TeacherStatCard from "../components/TeacherStatCard";
import RecentClasses from "../components/RecentClasses";
import QuickActions from "../components/QuickActions";
import TodaysSchedule from "../components/TodaysSchedule";
import TeacherTimetable from "../components/TeacherTimetable";
import StudentsList from "../components/StudentList";
const TeacherDashboard = () => {
  return (
    <DashboardLayout title="Teacher Dashboard" variant="teacher">
      <div className="teacher-dashboard">
        <section className="teacher-dashboard__hero">
          <div>
            <p className="teacher-dashboard__breadcrumb">
              Home <span>/</span> Teacher Dashboard
            </p>
            <h2>Good morning, Prof. Sarah!</h2>
            <p className="teacher-dashboard__subtitle">
              Tuesday, February 3, 2026
            </p>
          </div>
          <button type="button" className="teacher-dashboard__action">
            <span aria-hidden="true">+</span>
            Take Attendance
          </button>
        </section>

        <div className="teacher-dashboard__stats">
          <TeacherStatCard
            label="Active Classes"
            value="5 Classes"
            trend="No change"
            trendVariant="neutral"
            icon={
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 6h16v12H4V6zm4-2h8v2H8V4z" />
              </svg>
            }
          />
          <TeacherStatCard
            label="Students Today"
            value="142 Students"
            trend="+5% from avg"
            trendVariant="positive"
            icon={
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 14a7 7 0 0 1 14 0H5z" />
              </svg>
            }
          />
          <TeacherStatCard
            label="Pending Marks"
            value="24 Items"
            trend="-12% completion"
            trendVariant="negative"
            icon={
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 4h10v2H7V4zm0 4h10v2H7V8zm0 4h6v2H7v-2zm-2 4h14v4H5v-4z" />
              </svg>
            }
          />
          <TeacherStatCard
            label="Avg. Attendance"
            value="96%"
            trend="+2% this week"
            trendVariant="positive"
            icon={
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M6 12l4 4 8-8" />
              </svg>
            }
          />
        </div>

        <div className="teacher-dashboard__grid">
          <RecentClasses />
          <QuickActions />
          <StudentsList />
          <TodaysSchedule />
        </div>

        <TeacherTimetable />
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
