import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import { logout } from "../api/auth";
import { authStorage } from "../api/storage";
import { fetchCurrentSchool, updateCurrentSchool } from "../api/schools";
import { getDashboardVariantFromRole } from "../utils/dashboardVariant";
import "./AccountPages.css";

const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_LOGO_FILE_SIZE = 5 * 1024 * 1024;

export function Settings() {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolLogoPreview, setSchoolLogoPreview] = useState("");
  const [schoolLogoFile, setSchoolLogoFile] = useState<File | null>(null);
  const [schoolBrandingMessage, setSchoolBrandingMessage] = useState("");
  const [isSavingSchoolBranding, setIsSavingSchoolBranding] = useState(false);
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
      });
      setSchoolLogoPreview(school.logo_url || "");
      setSchoolLogoFile(null);
      setSchoolBrandingMessage("School branding updated.");
      const current = authStorage.getUser();
      if (current) {
        authStorage.setUser({
          ...current,
          school_name: school.name,
          school_code: school.code,
          school_logo_url: school.logo_url || null,
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
          <section className="account-card account-card--branding">
            <h1>School Branding</h1>
            <p>Update your school name, subdomain code, and logo for the admin experience.</p>
            <div className="branding-editor">
              <div className="branding-logoPanel">
                <div className="branding-logoPreview">
                  {schoolLogoPreview ? (
                    <img src={schoolLogoPreview} alt={schoolName || "School logo"} />
                  ) : (
                    <span>{(schoolName || "School").slice(0, 1).toUpperCase()}</span>
                  )}
                </div>
                <label className="branding-uploadButton">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setSchoolBrandingMessage("");
                      if (!file) {
                        setSchoolLogoFile(null);
                        return;
                      }
                      if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
                        setSchoolBrandingMessage("Logo must be a PNG, JPG, or WEBP image.");
                        setSchoolLogoFile(null);
                        return;
                      }
                      if (file.size > MAX_LOGO_FILE_SIZE) {
                        setSchoolBrandingMessage("Logo must be smaller than 5 MB.");
                        setSchoolLogoFile(null);
                        return;
                      }
                      setSchoolLogoFile(file);
                      setSchoolLogoPreview(URL.createObjectURL(file));
                    }}
                  />
                  <span>{schoolLogoFile ? "Replace Logo" : "Upload Logo"}</span>
                </label>
                <p className="branding-uploadHint">Use PNG, JPG, or WEBP up to 5 MB.</p>
              </div>

              <div className="branding-form">
                <label className="branding-field">
                  <span>School Name</span>
                  <input value={schoolName} onChange={(event) => setSchoolName(event.target.value)} placeholder="KCS Public School" />
                </label>

                <label className="branding-field">
                  <span>School Code</span>
                  <input value={schoolCode} onChange={(event) => setSchoolCode(event.target.value)} placeholder="kcs" />
                </label>

                <div className="branding-domainCard">
                  <span className="branding-domainLabel">School login domain</span>
                  <strong>{schoolCode ? `${schoolCode.toLowerCase()}.schoolos.me` : "schoolcode.schoolos.me"}</strong>
                </div>

                {schoolBrandingMessage ? (
                  <p className="branding-status">{schoolBrandingMessage}</p>
                ) : null}

                <div className="account-actions">
                  <button
                    type="button"
                    className="primary-button"
                    disabled={isSavingSchoolBranding}
                    onClick={handleSchoolSave}
                  >
                    {isSavingSchoolBranding ? "Saving..." : "Save Branding"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

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
