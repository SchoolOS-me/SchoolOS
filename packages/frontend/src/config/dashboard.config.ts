export type DashboardRole = 'teacher' | 'student' | 'admin';

export const dashboardConfig = {
  teacher: {
    title: 'Teacher Dashboard',
    showSchedule: true,
    showStudents: true,
    showStats: true,
  },
  student: {
    title: 'Student Dashboard',
    showSchedule: true,
    showStudents: false,
    showStats: true,
  },
  admin: {
    title: 'Admin Dashboard',
    showSchedule: false,
    showStudents: true,
    showStats: true,
  },
};
