import "./SuperAdminLogin.css";

import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../api/auth";

const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN: "/super-admin/dashboard",
  SCHOOL_ADMIN: "/admin/dashboard",
  TEACHER: "/teacher-dashboard",
  STUDENT: "/student/dashboard",
  PARENT: "/parent/dashboard",
};

export function SuperAdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email.trim(), password);
      if (user.role !== "SUPER_ADMIN") {
        setError("This screen is only for Super Admin login. Use School Login instead.");
        return;
      }
      const route = ROLE_ROUTES[user.role] || "/super-admin/dashboard";
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
    <div className="super-login-page">
      <main className="super-login-main">
        <div className="super-login-logoWrap">
          <div className="super-login-logoIcon" aria-hidden="true">🛡</div>
          <h1>KCS Administration</h1>
        </div>

        <section className="super-login-card">
          <header className="super-login-cardHead">
            <h2>Platform Login</h2>
            <p>Access the KCS Administration Panel</p>
          </header>

          <form className="super-login-form" onSubmit={handleSubmit}>
            <label htmlFor="super-email">Email Address</label>
            <div className="super-login-inputWrap">
              <span aria-hidden="true">✉</span>
              <input
                id="super-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="superadmin@kcs.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="super-login-passHead">
              <label htmlFor="super-password">Password</label>
              <button type="button">Forgot password?</button>
            </div>
            <div className="super-login-inputWrap">
              <span aria-hidden="true">🔒</span>
              <input
                id="super-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <label className="super-login-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Remember session for 30 days
            </label>

            {error && <div className="super-login-error">{error}</div>}

            <button className="super-login-submit" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login to Console"}
            </button>
          </form>

          <footer className="super-login-footer">
            <Link to="/school-login">Login to your School instead</Link>
          </footer>
        </section>

        <p className="super-login-copy">© 2024 KCS International • Security Standard Verified</p>
      </main>
    </div>
  );
}

