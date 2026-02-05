import "./Login.css";

export function Login() {
  return (
    <div className="login-page">
      <header className="login-header">
        <div className="login-brand">SchoolCloud SaaS</div>
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
          <h1>St. Mary's High School</h1>
          <p>Sign in to your student, staff, or parent account.</p>

          <div className="login-tabs">
            <button type="button" className="is-active">Student</button>
            <button type="button">Staff</button>
            <button type="button">Parent</button>
          </div>

          <label>
            Email or School ID
            <div className="login-input">
              <span>@</span>
              <input type="text" placeholder="e.g. j.doe@stmarys.edu" />
            </div>
          </label>

          <label>
            Password
            <div className="login-input">
              <span>🔒</span>
              <input type="password" placeholder="Enter your password" />
              <button type="button" className="login-link">Forgot password?</button>
            </div>
          </label>

          <label className="login-check">
            <input type="checkbox" />
            Keep me signed in
          </label>

          <button type="button" className="login-primary">Sign In →</button>

          <div className="login-footnote">
            Not from St. Mary's? <button type="button">Select a different school</button>
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
