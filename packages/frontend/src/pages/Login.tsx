import "./Login.css";

import { useState } from "react";
import { useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import { fetchSchoolBrandingByCode } from "../api/schools";
import ThemedCompleteLogo from "../components/ui/ThemedCompleteLogo";
import { resolveTheme, type ThemeMode } from "../theme/theme";

const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: "/super-admin/dashboard",
  SCHOOL_ADMIN: "/admin/dashboard",
  TEACHER: "/teacher-dashboard",
  STUDENT: "/student/dashboard",
  PARENT: "/parent/dashboard",
};

export function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [branding, setBranding] = useState<{
    name: string;
    code: string;
    logoUrl?: string | null;
    themeMode?: ThemeMode | null;
    subdomain?: string | null;
  } | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    if (!hostname.endsWith(".schoolos.me")) {
      return;
    }
    const [subdomain] = hostname.split(".");
    if (!subdomain || subdomain === "www" || subdomain === "api") {
      return;
    }
    fetchSchoolBrandingByCode(subdomain)
      .then((school) =>
        setBranding({
          name: school.name,
          code: school.code,
          logoUrl: school.logo_url,
          themeMode: school.theme_mode || "system",
          subdomain: school.subdomain,
        })
      )
      .catch(() => setBranding(null));
  }, []);

  useEffect(() => {
    if (!branding?.themeMode) {
      return;
    }
    const root = document.documentElement;
    const previousMode = root.getAttribute("data-theme-mode");
    const previousTheme = root.getAttribute("data-theme");
    root.setAttribute("data-theme-mode", branding.themeMode);
    root.setAttribute("data-theme", resolveTheme(branding.themeMode));
    return () => {
      if (previousMode) root.setAttribute("data-theme-mode", previousMode);
      else root.removeAttribute("data-theme-mode");
      if (previousTheme) root.setAttribute("data-theme", previousTheme);
      else root.removeAttribute("data-theme");
    };
  }, [branding]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(identifier.trim(), password);
      if (user.role === "SUPER_ADMIN") {
        setError("Super Admin users must login from the Super Admin screen.");
        return;
      }
      const route = ROLE_ROUTES[user.role] || "/login";
      navigate(route);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <section className="login-card">
          <header className="login-card-head">
            <div className="login-logoWrap">
              {branding?.logoUrl ? (
                <img src={branding.logoUrl} alt={branding.name} className="login-logoImage login-logoImage--school" />
              ) : (
                <ThemedCompleteLogo className="login-logoImage" />
              )}
            </div>
            {branding ? (
              <>
                <h1 className="login-schoolTitle">{branding.name}</h1>
                <p>
                  Sign in to the {branding.code.toUpperCase()} portal at {branding.subdomain}
                </p>
              </>
            ) : (
              <p>Welcome back, please sign in to your account.</p>
            )}
          </header>

          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="school-login-identifier">Email Address or Phone Number</label>
            <div className="login-input">
              <span aria-hidden="true">✉</span>
              <input
                id="school-login-identifier"
                type="text"
                placeholder="user@school.edu or +1 555 000 0000"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
            </div>

            <label htmlFor="school-login-password">Password</label>
            <div className="login-input">
              <span aria-hidden="true">🔒</span>
              <input
                id="school-login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button type="button" className="login-link">Forgot password?</button>
            </div>

            <label className="login-check">
              <input type="checkbox" />
              Remember me
            </label>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-primary" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {!branding ? (
              <Link to="/super-admin/login" className="login-secondary">
                Super Admin Login
              </Link>
            ) : null}
          </form>

          <div className="login-footnote">
            Don&apos;t have an account?{" "}
            <span className="login-inline-link">
              {branding ? `Contact ${branding.name}` : "Contact Administrator"}
            </span>
          </div>
        </section>
      </main>
    </div>
  );
}
