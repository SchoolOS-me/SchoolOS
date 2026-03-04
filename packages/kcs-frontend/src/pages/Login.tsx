import "./Login.css";

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

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await login(email.trim(), password);
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
      <header className="login-header">
        <div className="login-brand">KCS School Login</div>
        <nav className="login-nav">
          <button type="button">Support</button>
          <button type="button">School Directory</button>
        </nav>
      </header>

      <main className="login-main">
        <div className="login-card">
          <div className="login-logo">
            <span>🎓</span>
          </div>
          <h1>School / Tenant Login</h1>
          <p>Sign in to your student, staff, admin, teacher, or parent account.</p>

          <div className="login-tabs">
            <button type="button" className="is-active">Student</button>
            <button type="button">Staff</button>
            <button type="button">Parent</button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
            Email or School ID
            <div className="login-input">
              <span>@</span>
              <input
                type="email"
                placeholder="e.g. j.doe@stmarys.edu"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            </label>

            <label>
            Password
            <div className="login-input">
              <span>🔒</span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button type="button" className="login-link">Forgot password?</button>
            </div>
            </label>

            <label className="login-check">
            <input type="checkbox" />
            Keep me signed in
            </label>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-primary" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <div className="login-footnote">
            Platform team? <Link className="login-inline-link" to="/login">Use Super Admin Login</Link>
          </div>
        </div>

        <div className="login-divider">
          <span>OR LOGIN WITH</span>
        </div>

        <div className="login-alt">
          <button type="button">Google</button>
          <button type="button">Azure AD</button>
        </div>
      </main>

      <footer className="login-footer">
        <button type="button">Privacy Policy</button>
        <button type="button">Terms of Service</button>
        <button type="button">Contact Support</button>
      </footer>
    </div>
  );
}
