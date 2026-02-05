import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import TeacherDashboard from "./modules/teacher/pages/TeacherDashboard";
import SuperAdminDashboard from "./modules/super-admin/pages/SuperAdminDashboard";
import StudentDashboard from "./modules/student/pages/StudentDashboard";
import ParentDashboard from "./modules/parent/pages/ParentDashboard";
import AdminDashboard from "./modules/admin/pages/AdminDashboard";
import "./styles/variables.css";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },

      { path: "/teacher-dashboard", element: <TeacherDashboard /> },
      { path: "/super-admin/dashboard", element: <SuperAdminDashboard /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/student/dashboard", element: <StudentDashboard /> },
      { path: "/parent/dashboard", element: <ParentDashboard /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
