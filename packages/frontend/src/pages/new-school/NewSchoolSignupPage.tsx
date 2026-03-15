import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assignSubscription, createSchool, createSchoolAdmin } from "../../api/schools";
import ThemedCompleteLogo from "../../components/ui/ThemedCompleteLogo";
import { saveOnboardingDraft } from "./onboardingStorage";
import "./NewSchoolFlow.css";

function toSchoolCode(name: string): string {
  const compact = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 14);

  const suffix = Math.floor(Math.random() * 900 + 100).toString();
  return compact ? `${compact}-${suffix}` : `SCHOOL-${suffix}`;
}

export default function NewSchoolSignupPage() {
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState("");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const school = await createSchool({
        name: schoolName.trim(),
        code: toSchoolCode(schoolName),
        contact_email: adminEmail.trim(),
      });

      await createSchoolAdmin(school.uuid, {
        email: adminEmail.trim(),
        password: adminPassword,
      });

      await assignSubscription(school.uuid, { plan: "free" });

      saveOnboardingDraft({
        schoolUuid: school.uuid,
        schoolName: school.name,
        adminName: adminName.trim(),
        adminEmail: adminEmail.trim(),
      });

      navigate("/onboarding/details");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Signup failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ns-page ns-page--flat">
      <div className="ns-authWrap">
        <header className="ns-authHeader">
          <div className="ns-shell">
            <Link className="ns-brand" to="/">
              <ThemedCompleteLogo />
            </Link>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>Already have an account?</span>
              <Link className="ns-btn ns-btn--ghost" to="/login">Log In</Link>
            </div>
          </div>
        </header>

        <main className="ns-authMain">
          <section className="ns-authBrand">
            <img src="/logo.svg" alt="SchoolOS icon" />
            <h1>Get started with SchoolOS</h1>
            <p>Create your school workspace in a few minutes.</p>
          </section>

          <section className="ns-authCard">
            <form className="ns-formGrid" onSubmit={handleSubmit}>
              <div className="ns-field">
                <label htmlFor="school-name">School Name</label>
                <input
                  id="school-name"
                  type="text"
                  value={schoolName}
                  onChange={(event) => setSchoolName(event.target.value)}
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div className="ns-field">
                <label htmlFor="admin-name">Admin Name</label>
                <input
                  id="admin-name"
                  type="text"
                  value={adminName}
                  onChange={(event) => setAdminName(event.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="ns-field">
                <label htmlFor="admin-email">Admin Email</label>
                <input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(event) => setAdminEmail(event.target.value)}
                  placeholder="name@school.edu"
                  required
                />
              </div>
              <div className="ns-field">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  placeholder="Create a strong password"
                  minLength={8}
                  required
                />
              </div>

              {error && <div className="ns-alert ns-alert--error">{error}</div>}

              <button type="submit" className="ns-btn ns-btn--solid" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create School"}
              </button>
            </form>

            <p className="ns-help">
              By creating a school, you agree to our Terms of Service and Privacy Policy.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
