import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
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
import "./styles/variables.css";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/login", element: <Login /> },

      { path: "/teacher-dashboard", element: <TeacherDashboard /> },
      { path: "/super-admin/dashboard", element: <SuperAdminDashboard /> },
      { path: "/super-admin/schools/create", element: <CreateSchool /> },
      { path: "/super-admin/schools/admin", element: <CreateSchoolAdmin /> },
      { path: "/super-admin/schools/subscription", element: <AssignSubscription /> },
      { path: "/admin/dashboard", element: <AdminDashboard /> },
      { path: "/admin/students/create", element: <CreateStudent /> },
      { path: "/admin/teachers/create", element: <CreateTeacher /> },
      { path: "/admin/classes/create", element: <CreateClassSection /> },
      { path: "/student/dashboard", element: <StudentDashboard /> },
      { path: "/parent/dashboard", element: <ParentDashboard /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);
