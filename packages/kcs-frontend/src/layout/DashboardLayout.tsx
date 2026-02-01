import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './DashboardLayout.css';

type Props = {
  children: ReactNode;
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <div className="dashboardLayout">
      <Sidebar />
      <div className="dashboardMain">
        <Topbar />
        <main className="dashboardContent">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
