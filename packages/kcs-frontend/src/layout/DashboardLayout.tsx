import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./DashboardLayout.css";

type Props = {
  title?: string;
  variant?: "default" | "superAdmin" | "teacher" | "student" | "parent" | "admin";
  children: ReactNode;
};

const DashboardLayout = ({ title, variant = "default", children }: Props) => {
  return (
    <div className={`dashboardLayout dashboardLayout--${variant}`}>
      <Sidebar variant={variant} />
      <div className="dashboardMain">
        <Topbar title={title} variant={variant} />
        <main className="dashboardContent">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
