import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { logout } from "../api/auth";
import { authStorage } from "../api/storage";
import { useTheme } from "../theme/useTheme";
import type { ThemeMode } from "../theme/theme";
import { getDashboardVariantFromRole } from "../utils/dashboardVariant";
import "./AccountPages.css";

const THEME_OPTIONS: Array<{ label: string; value: ThemeMode }> = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

export function Settings() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { mode, resolvedTheme, setMode } = useTheme();

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
    <DashboardLayout title="Settings" variant={getDashboardVariantFromRole()}>
      <div className="account-page">
        <section className="account-card">
          <h1>Appearance</h1>
          <p>
            Choose your theme preference. Current theme: <strong>{resolvedTheme}</strong>
          </p>
          <div className="theme-options">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`theme-option${mode === option.value ? " is-active" : ""}`}
                onClick={() => setMode(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="account-card">
          <h2>Session</h2>
          <p>Sign out from this device.</p>
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
