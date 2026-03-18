import "./Login.css";

import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../api/auth";
import ThemedCompleteLogo from "../components/ui/ThemedCompleteLogo";

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
            <ThemedCompleteLogo className="login-logoImage" />
            <p>Welcome back, please sign in to your account.</p>
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
          </form>

          <div className="login-footnote">
            Don&apos;t have an account? <Link className="login-inline-link" to="/super-admin/login">Contact Administrator</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
