import { apiFetch } from "./client";

export type AdminDashboardSummary = {
  academics: {
    students: number;
    teachers: number;
    classes: number;
    sections: number;
  };
  attendance: {
    today_percentage: number;
  };
  exams: {
    total_exams: number;
    pass_percentage: number;
  };
};

export type TeacherDashboardSummary = {
  stats: {
    active_classes: number;
    students_today: number;
    pending_marks: number;
    avg_attendance: number;
  };
  classes: Array<{
    section_id: number;
    class: string;
    section: string;
    subjects: string[];
  }>;
  today_sessions: Array<{
    id: number;
    date: string;
    class: string;
    section: string;
    status: string;
  }>;
};

export type StudentDashboardSummary = {
  stats: {
    gpa: number | null;
    attendance_percentage: number;
    credits_earned: number;
    credits_total: number;
    active_courses: number;
  };
  grades: Array<{
    id: number;
    subject: string;
    course: string;
    score: string;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    time: string;
    description: string;
    tag: string;
  }>;
  deadlines: Array<{
    id: string;
    date: string;
    title: string;
    subtitle: string;
  }>;
};

export type ParentDashboardSummary = {
  stats: {
    current_average: number | null;
    attendance_percentage: number;
    alerts: number;
  };
  fee_status: {
    total: number | string;
    items: Array<{ label: string; value: string }>;
  };
  message: {
    sender: string;
    message: string;
  } | null;
  attendance: {
    value: number;
    title: string;
    detail: string;
  };
  alerts: Array<{
    student_id: number;
    name: string;
    attendance_percentage: number;
  }>;
  children: Array<{
    id: number;
    name: string;
    class: string;
    section: string;
    attendance_percentage: number;
    latest_percentage: number | null;
  }>;
};

export type SuperAdminDashboardSummary = {
  stats: {
    total_schools: number;
    active_subscriptions: number;
    expired_subscriptions: number;
    trial_schools: number;
  };
  schools: Array<{
    id: number;
    name: string;
    admin_name: string | null;
    admin_email: string | null;
    subscription_status: "active" | "trial" | "expired";
  }>;
};

export function fetchAdminDashboard() {
  return apiFetch<AdminDashboardSummary>("/dashboard/admin");
}

export function fetchTeacherDashboard() {
  return apiFetch<TeacherDashboardSummary>("/dashboard/teacher");
}

export function fetchStudentDashboard() {
  return apiFetch<StudentDashboardSummary>("/dashboard/student");
}

export function fetchParentDashboard() {
  return apiFetch<ParentDashboardSummary>("/dashboard/parent");
}

export function fetchSuperAdminDashboard() {
  return apiFetch<SuperAdminDashboardSummary>("/dashboard/super-admin");
}
