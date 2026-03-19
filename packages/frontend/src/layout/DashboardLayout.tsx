import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./DashboardLayout.css";

type ParentTopbarStudent = {
  studentUuid: string;
  name: string;
  className: string;
  sectionName: string;
};

type Props = {
  title?: string;
  variant?: "default" | "superAdmin" | "teacher" | "student" | "parent" | "admin";
  parentTopbar?: {
    students: ParentTopbarStudent[];
    activeStudentUuid: string;
    onStudentChange: (studentUuid: string) => void;
  };
  children: ReactNode;
};

const DashboardLayout = ({ title, variant = "default", parentTopbar, children }: Props) => {
  return (
    <div className={`dashboardLayout dashboardLayout--${variant}`}>
      <Sidebar variant={variant} />
      <div className="dashboardMain">
        <Topbar title={title} variant={variant} parentTopbar={parentTopbar} />
        <main className="dashboardContent">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
