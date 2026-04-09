import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { logout } from "../api/auth";
import { authStorage } from "../api/storage";
import { fetchCurrentSchool, updateCurrentSchool } from "../api/schools";
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
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolLogoPreview, setSchoolLogoPreview] = useState("");
  const [schoolLogoFile, setSchoolLogoFile] = useState<File | null>(null);
  const [schoolThemeMode, setSchoolThemeMode] = useState<ThemeMode>("system");
  const [schoolBrandingMessage, setSchoolBrandingMessage] = useState("");
  const [isSavingSchoolBranding, setIsSavingSchoolBranding] = useState(false);
  const { mode, resolvedTheme, setMode } = useTheme();
  const currentUser = authStorage.getUser();

  useEffect(() => {
    if (currentUser?.role !== "SCHOOL_ADMIN") {
      return;
    }
    fetchCurrentSchool()
      .then((school) => {
        setSchoolName(school.name);
        setSchoolCode(school.code);
        setSchoolLogoPreview(school.logo_url || "");
        setSchoolThemeMode(school.theme_mode || "system");
      })
      .catch(() => undefined);
  }, [currentUser?.role]);

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

  const handleSchoolSave = async () => {
    setIsSavingSchoolBranding(true);
    setSchoolBrandingMessage("");
    try {
      const school = await updateCurrentSchool({
        name: schoolName.trim(),
        code: schoolCode.trim(),
        logo: schoolLogoFile || undefined,
        theme_mode: schoolThemeMode,
      });
      setSchoolLogoPreview(school.logo_url || "");
      setSchoolThemeMode(school.theme_mode || "system");
      setSchoolBrandingMessage("School branding updated.");
      const current = authStorage.getUser();
      if (current) {
        authStorage.setUser({
          ...current,
          school_name: school.name,
          school_code: school.code,
          school_logo_url: school.logo_url || null,
          school_theme_mode: school.theme_mode || "system",
        });
      }
    } catch (error) {
      setSchoolBrandingMessage(error instanceof Error ? error.message : "Unable to update school branding.");
    } finally {
      setIsSavingSchoolBranding(false);
    }
  };

  return (
    <DashboardLayout title="Settings" variant={getDashboardVariantFromRole()}>
      <div className="account-page">
        {currentUser?.role === "SCHOOL_ADMIN" ? (
          <section className="account-card">
            <h1>School Branding</h1>
            <p>Customize the school admin login and dashboard shell for your domain.</p>
            <div className="theme-options" style={{ justifyContent: "flex-start", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              {schoolLogoPreview ? (
                <img src={schoolLogoPreview} alt={schoolName || "School logo"} style={{ width: 72, height: 72, objectFit: "contain", borderRadius: 12 }} />
              ) : null}
              <div style={{ display: "grid", gap: 12, flex: "1 1 320px" }}>
                <input value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="School name" />
                <input value={schoolCode} onChange={(event) => setSchoolCode(event.target.value)} placeholder="School code" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null;
                    setSchoolLogoFile(file);
                    if (file) {
                      setSchoolLogoPreview(URL.createObjectURL(file));
                    }
                  }}
                />
                <p>
                  School login domain: <strong>{schoolCode ? `${schoolCode.toLowerCase()}.schoolos.me` : "schoolcode.schoolos.me"}</strong>
                </p>
                <div>
                  <p>
                    School portal theme
                  </p>
                  <div className="theme-options">
                    {THEME_OPTIONS.map((option) => (
                      <button
                        key={`school-${option.value}`}
                        type="button"
                        className={`theme-option${schoolThemeMode === option.value ? " is-active" : ""}`}
                        disabled={isSavingSchoolBranding}
                        onClick={() => setSchoolThemeMode(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                {schoolBrandingMessage ? <p>{schoolBrandingMessage}</p> : null}
                <div className="account-actions">
                  <button type="button" className="theme-option is-active" disabled={isSavingSchoolBranding} onClick={handleSchoolSave}>
                    {isSavingSchoolBranding ? "Saving..." : "Save Branding"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

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
