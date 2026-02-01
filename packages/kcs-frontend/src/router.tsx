import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import TeacherDashboard from './pages/TeacherDashboard';
import './styles/variables.css';


export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Login /> },
      { path: '/login', element: <Login /> },
      { path: '*', element: <NotFound /> },
      {path: '/teacher-dashboard', element: <TeacherDashboard />},
    ],
  },
]);
