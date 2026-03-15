import { Link } from "react-router-dom";
import ThemedCompleteLogo from "../../components/ui/ThemedCompleteLogo";
import "./NewSchoolFlow.css";

const FEATURES = [
  {
    title: "Student Management",
    body: "Manage admissions, academic profiles, records, and progression from one dashboard.",
  },
  {
    title: "Teacher Management",
    body: "Schedule faculty, assign classes, and track performance across departments.",
  },
  {
    title: "Attendance Tracking",
    body: "Automated attendance capture with real-time parent notifications.",
  },
  {
    title: "Fee Collection",
    body: "Collect fees online with digital receipts and due-date reminders.",
  },
  {
    title: "Exam And Grading",
    body: "Run assessments, publish marks, and generate report cards instantly.",
  },
  {
    title: "Communication Hub",
    body: "Centralize school-to-parent and teacher-to-student communication channels.",
  },
];

export default function NewSchoolLandingPage() {
  return (
    <div className="ns-page">
      <header className="ns-nav">
        <div className="ns-shell ns-navRow">
          <Link className="ns-brand" to="/">
            <ThemedCompleteLogo />
          </Link>

          <nav className="ns-navLinks" aria-label="Landing links">
            <a href="#features">Features</a>
            <a href="#setup">How it works</a>
            <a href="#security">Security</a>
          </nav>

          <div className="ns-heroActions" style={{ marginTop: 0 }}>
            <Link className="ns-btn ns-btn--ghost" to="/login">Log In</Link>
            <Link className="ns-btn ns-btn--solid" to="/signup">Start Your School</Link>
          </div>
        </div>
      </header>

      <main className="ns-shell">
        <section className="ns-hero">
          <div className="ns-chip">
            <span className="ns-dot" aria-hidden="true" />
            Multi-Campus Ready
          </div>
          <h1 className="ns-title">
            Run Your Entire School on <span className="ns-titleAccent">One Platform</span>
          </h1>
          <p className="ns-subtitle">
            SchoolOS helps schools manage students, teachers, classes, attendance, fees, exams, and
            communication from one secure cloud workspace.
          </p>
          <div className="ns-heroActions">
            <Link className="ns-btn ns-btn--solid" to="/signup">Create School Workspace</Link>
            <button className="ns-btn ns-btn--ghost" type="button">Book Demo</button>
          </div>

          <article className="ns-showcase" aria-label="Dashboard preview">
            <div className="ns-showcaseGrid">
              <div className="ns-showcaseCard">
                <h4>Students</h4>
                <p>Admissions, roster management, and individual profile timelines.</p>
              </div>
              <div className="ns-showcaseCard">
                <h4>Academics</h4>
                <p>Class scheduling, attendance automation, and grading workflows.</p>
              </div>
              <div className="ns-showcaseCard">
                <h4>Finance</h4>
                <p>Fee collection, receipts, reminders, and subscription controls.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="ns-section" id="features">
          <h2 className="ns-sectionTitle">Built for modern education teams</h2>
          <div className="ns-featureGrid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="ns-featureCard">
                <h4>{feature.title}</h4>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ns-section" id="setup">
          <h2 className="ns-sectionTitle">Get started in three steps</h2>
          <div className="ns-featureGrid">
            <article className="ns-featureCard">
              <h4>1. Create Your School</h4>
              <p>Register your institution and configure the super admin account.</p>
            </article>
            <article className="ns-featureCard">
              <h4>2. Set Academic Structure</h4>
              <p>Add grades, sections, and your session settings for the school year.</p>
            </article>
            <article className="ns-featureCard" id="security">
              <h4>3. Invite Team And Go Live</h4>
              <p>Invite admins and teachers, then launch your workspace instantly.</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
