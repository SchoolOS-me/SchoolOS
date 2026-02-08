import "./TeacherDashboard.css";

import { useEffect, useState } from "react";

import DashboardLayout from "../../../layout/DashboardLayout";
import TeacherStatCard from "../components/TeacherStatCard";
import RecentClasses from "../components/RecentClasses";
import QuickActions from "../components/QuickActions";
import TodaysSchedule from "../components/TodaysSchedule";
import TeacherTimetable from "../components/TeacherTimetable";
import StudentsList from "../components/StudentList";
import {
  recentClasses,
  teacherStudents,
  todaysSchedule,
  weeklyTimetable,
} from "../../../mock/teacherDashboard";
import { fetchTeacherDashboard } from "../../../api/dashboard";
import { USE_MOCK_DATA } from "../../../config/env";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    activeClasses: "0 Classes",
    studentsToday: "0 Students",
    pendingMarks: "0 Items",
    avgAttendance: "0%",
  });
  const [classesToday, setClassesToday] = useState(recentClasses);
  const [scheduleToday, setScheduleToday] = useState(todaysSchedule);
  const [students, setStudents] = useState(teacherStudents);
  const [timetable, setTimetable] = useState(weeklyTimetable);

  useEffect(() => {
    if (USE_MOCK_DATA) return;

    let isMounted = true;
    fetchTeacherDashboard()
      .then((data) => {
        if (!isMounted) return;

        setStats({
          activeClasses: `${data.stats.active_classes} Classes`,
          studentsToday: `${data.stats.students_today} Students`,
          pendingMarks: `${data.stats.pending_marks} Items`,
          avgAttendance: `${data.stats.avg_attendance}%`,
        });

        const mappedClasses = data.classes.map((item, index) => ({
          id: item.section_id || index,
          subject: item.subjects[0] || "Subject",
          className: `${item.class} ${item.section}`,
          time: "Today",
          room: "Room",
        }));
        setClassesToday(mappedClasses.length ? mappedClasses : recentClasses);

        const mappedSchedule = data.today_sessions.map((session) => ({
          id: session.id,
          time: session.date,
          subject: "Class Session",
          class: `${session.class} ${session.section}`,
          room: "Room",
          isNow: session.status === "submitted",
        }));
        setScheduleToday(
          mappedSchedule.length ? mappedSchedule : todaysSchedule
        );

        setStudents(teacherStudents);
        setTimetable(weeklyTimetable);
      })
      .catch(() => {
        if (!isMounted) return;
        setStats({
          activeClasses: "5 Classes",
          studentsToday: "0 Students",
          pendingMarks: "0 Items",
          avgAttendance: "0%",
        });
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
            value={stats.activeClasses}
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
            value={stats.studentsToday}
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
            value={stats.pendingMarks}
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
            value={stats.avgAttendance}
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
          <RecentClasses items={classesToday} />
          <QuickActions />
          <StudentsList title="Grade 8-A Students" students={students} />
          <TodaysSchedule items={scheduleToday} />
        </div>

        <TeacherTimetable timetable={timetable} />
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
