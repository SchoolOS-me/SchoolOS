import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { logout } from "../api/auth";
import { authStorage } from "../api/storage";
import { getCurrentUserDisplay } from "../utils/userDisplay";
import { getDashboardVariantFromRole } from "../utils/dashboardVariant";
import "./AccountPages.css";

export function Profile() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const currentUser = getCurrentUserDisplay();
  const rawUser = authStorage.getUser();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      authStorage.clearAll();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <DashboardLayout title="Profile" variant={getDashboardVariantFromRole()}>
      <div className="account-page">
        <section className="account-card">
          <h1>Profile</h1>
          <p>Account details for the active session.</p>
          <div className="account-meta">
            <div className="account-meta__item">
              <div className="account-meta__label">Name</div>
              <div className="account-meta__value">{currentUser.name}</div>
            </div>
            <div className="account-meta__item">
              <div className="account-meta__label">Email</div>
              <div className="account-meta__value">{rawUser?.email || "-"}</div>
            </div>
            <div className="account-meta__item">
              <div className="account-meta__label">Role</div>
              <div className="account-meta__value">{currentUser.role}</div>
            </div>
            <div className="account-meta__item">
              <div className="account-meta__label">School</div>
              <div className="account-meta__value">{rawUser?.school_name || "-"}</div>
            </div>
          </div>

          <div className="account-actions">
            <button type="button" className="danger-button" disabled={isLoggingOut} onClick={handleLogout}>
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
