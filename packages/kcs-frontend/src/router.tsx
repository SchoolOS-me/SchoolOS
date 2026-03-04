import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import { MainLayout } from "./layout/MainLayout";
import { Login } from "./pages/Login";
import { SuperAdminLogin } from "./pages/SuperAdminLogin";
import { NotFound } from "./pages/NotFound";
import { authStorage } from "./api/storage";
import TeacherDashboard from "./modules/teacher/pages/TeacherDashboard";
import SuperAdminDashboard from "./modules/super-admin/pages/SuperAdminDashboard";
import CreateSchool from "./modules/super-admin/pages/CreateSchool";
import CreateSchoolAdmin from "./modules/super-admin/pages/CreateSchoolAdmin";
import AssignSubscription from "./modules/super-admin/pages/AssignSubscription";
import StudentDashboard from "./modules/student/pages/StudentDashboard";
import ParentDashboard from "./modules/parent/pages/ParentDashboard";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import CreateStudent from "./modules/admin/pages/CreateStudent";
import CreateTeacher from "./modules/admin/pages/CreateTeacher";
import CreateClassSection from "./modules/admin/pages/CreateClassSection";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import "./styles/variables.css";

const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: "/super-admin/dashboard",
  SCHOOL_ADMIN: "/admin/dashboard",
  TEACHER: "/teacher-dashboard",
  STUDENT: "/student/dashboard",
  PARENT: "/parent/dashboard",
};

function getHomeRoute(): string {
  const user = authStorage.getUser();
  if (user?.role && ROLE_ROUTES[user.role]) {
    return ROLE_ROUTES[user.role];
  }
  return "/login";
}

function RequireAuth({ children }: { children: ReactElement }) {
  const token = authStorage.getAccessToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnly({ children }: { children: ReactElement }) {
  const token = authStorage.getAccessToken();
  if (token) return <Navigate to={getHomeRoute()} replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "/login", element: <PublicOnly><SuperAdminLogin /></PublicOnly> },
      { path: "/school-login", element: <PublicOnly><Login /></PublicOnly> },

      { path: "/teacher-dashboard", element: <RequireAuth><TeacherDashboard /></RequireAuth> },
      { path: "/super-admin/dashboard", element: <RequireAuth><SuperAdminDashboard /></RequireAuth> },
      { path: "/super-admin/schools/create", element: <RequireAuth><CreateSchool /></RequireAuth> },
      { path: "/super-admin/schools/admin", element: <RequireAuth><CreateSchoolAdmin /></RequireAuth> },
      { path: "/super-admin/schools/subscription", element: <RequireAuth><AssignSubscription /></RequireAuth> },
      { path: "/admin/dashboard", element: <RequireAuth><AdminDashboard /></RequireAuth> },
      { path: "/admin/students/create", element: <RequireAuth><CreateStudent /></RequireAuth> },
      { path: "/admin/teachers/create", element: <RequireAuth><CreateTeacher /></RequireAuth> },
      { path: "/admin/classes/create", element: <RequireAuth><CreateClassSection /></RequireAuth> },
      { path: "/student/dashboard", element: <RequireAuth><StudentDashboard /></RequireAuth> },
      { path: "/parent/dashboard", element: <RequireAuth><ParentDashboard /></RequireAuth> },
      { path: "/profile", element: <RequireAuth><Profile /></RequireAuth> },
      { path: "/settings", element: <RequireAuth><Settings /></RequireAuth> },

      { path: "*", element: <RequireAuth><NotFound /></RequireAuth> },
    ],
  },
]);
