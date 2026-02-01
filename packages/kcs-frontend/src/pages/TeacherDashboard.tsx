import './TeacherDashboard.css';

import DashboardLayout from '../layout/DashboardLayout';
import StatCard from '../components/cards/StatCard';
import RecentClasses from '../components/teacher/RecentClasses';
import QuickActions from '../components/teacher/QuickActions';
import TeacherTimetable from '../components/teacher/TeacherTimetable';
import StudentsList from '../components/teacher/StudentList';
import TodaysSchedule from '../components/teacher/TodaysSchedule';


const TeacherDashboard = () => {
  return (
    <DashboardLayout>
      <div className="teacher-dashboard">
        <div className="teacher-dashboard__stats">
          <StatCard label="Total Students" value="120" />
          <StatCard label="Classes Today" value="6" />
          <StatCard label="Attendance" value="92%" />
          <StatCard label="Pending Tasks" value="3" />
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
