import { Link } from "react-router-dom";
import ThemedCompleteLogo from "../../components/ui/ThemedCompleteLogo";
import { useTheme } from "../../theme/useTheme";
import "./NewSchoolFlow.css";

const FEATURE_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Documentation", href: "#resources" },
  { label: "Resources", href: "#resources" },
];

const FEATURE_CARDS = [
  {
    title: "Student Management",
    body: "Complete 360-degree view of student progress, records, and behavioral history.",
    icon: "person",
    tone: "indigo",
  },
  {
    title: "Teacher Portals",
    body: "Empower educators with lesson planning tools, grading systems, and resource sharing.",
    icon: "school",
    tone: "emerald",
  },
  {
    title: "Smart Classrooms",
    body: "Dynamic scheduling, automated timetable generation, and virtual classroom integration.",
    icon: "class",
    tone: "spotlight",
    tall: true,
  },
  {
    title: "Attendance",
    body: "Biometric and mobile attendance tracking with instant parent notifications.",
    icon: "how_to_reg",
    tone: "amber",
  },
  {
    title: "Fee Management",
    body: "Automated invoicing, online payments, and comprehensive financial reporting.",
    icon: "payments",
    tone: "rose",
  },
  {
    title: "Exams & Assessment",
    body: "Online tests, custom report card generation, and performance analytics.",
    icon: "quiz",
    tone: "cyan",
  },
  {
    title: "Communication",
    body: "Integrated SMS, email, and app notifications for seamless school-parent contact.",
    icon: "chat",
    tone: "violet",
  },
  {
    title: "Advanced Analytics",
    body: "AI-driven insights to identify at-risk students and optimize operational efficiency.",
    icon: "insights",
    tone: "success",
  },
];

const INTEGRATED_CANVAS_ITEMS = [
  {
    title: "Unified Data Layer",
    body: "No more silos. Updates in attendance instantly reflect in performance reports and billing.",
  },
  {
    title: "Multi-Role Access",
    body: "Customized views for Admins, Teachers, Parents, and Students from a single secure login.",
  },
  {
    title: "Real-time Sync",
    body: "Global updates propagate across all mobile and web applications in milliseconds.",
  },
];

const STEPS = [
  {
    title: "Setup",
    body: "Define your school structure, grades, and academic cycles in our intuitive configuration wizard.",
  },
  {
    title: "Onboard",
    body: "Bulk import student and staff data via Excel or API. We handle the heavy lifting for you.",
  },
  {
    title: "Manage",
    body: "Go live! Monitor your school's pulse through real-time dashboards and automated reports.",
  },
];

const PRICING_PLANS = [
  {
    name: "Starter",
    price: "$199",
    cadence: "/month",
    body: "Perfect for small learning centers.",
    cta: "Start for Free",
    featured: false,
    items: ["Up to 250 Students", "Core Admin Features", "Mobile App Access"],
  },
  {
    name: "Growth",
    price: "$499",
    cadence: "/month",
    body: "For mid-sized schools scaling fast.",
    cta: "Choose Growth",
    featured: true,
    items: [
      "Up to 1,000 Students",
      "Exam & Fee Management",
      "Parent Communication Hub",
      "Custom Report Cards",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    body: "For large institutions and school chains.",
    cta: "Contact Sales",
    featured: false,
    items: [
      "Unlimited Students",
      "Multi-campus Management",
      "Dedicated Success Manager",
      "Custom Integrations (API)",
    ],
  },
];

const RESOURCE_COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Status"],
  },
  {
    title: "Company",
    links: ["About Us", "Contact Sales", "Support"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Privacy Policy", "Terms of Service"],
  },
  {
    title: "Legal",
    links: ["Cookie Settings", "Security Policy"],
  },
];

export default function NewSchoolLandingPage() {
  const { resolvedTheme, setMode } = useTheme();
  const nextMode = resolvedTheme === "dark" ? "light" : "dark";
  const themeLabel = resolvedTheme === "dark" ? "Light" : "Dark";

  return (
    <div className="ns-page nsl-page">
      <header className="nsl-nav">
        <div className="nsl-shell nsl-navRow">
          <Link className="nsl-brand" to="/">
            <ThemedCompleteLogo className="nsl-brandLogo" />
          </Link>

          <nav className="nsl-navLinks" aria-label="Landing links">
            {FEATURE_LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nsl-navActions">
            <button className="nsl-themeToggle" type="button" onClick={() => setMode(nextMode)}>
              <span className="material-symbols-outlined" aria-hidden="true">
                {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
              </span>
              {themeLabel}
            </button>
            <Link className="nsl-linkButton" to="/login">
              Log In
            </Link>
            <Link className="nsl-button nsl-button--primary" to="/signup">
              Start Your School
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="nsl-hero">
          <div className="nsl-shell nsl-heroGrid">
            <div className="nsl-heroContent">
              <span className="nsl-pill">New: Multi-campus support is here</span>
              <h1>
                Run Your Entire School on <span>One Platform</span>
              </h1>
              <p>
                Unify academics, administration, and communication in a single, high-performance
                ecosystem. Built for the modern educational institution.
              </p>
              <div className="nsl-heroActions">
                <Link className="nsl-button nsl-button--primary" to="/signup">
                  Start Your School
                </Link>
                <a className="nsl-button nsl-button--secondary" href="#pricing">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    play_circle
                  </span>
                  Book Demo
                </a>
              </div>
            </div>

            <div className="nsl-dashboardWrap" aria-label="SchoolOS dashboard preview">
              <div className="nsl-dashboardGlow" />
              <div className="nsl-dashboard">
                <div className="nsl-dashboardSidebar">
                  {["grid_view", "person", "school", "payments"].map((icon, index) => (
                    <div key={icon} className={`nsl-sidebarIcon${index === 0 ? " is-active" : ""}`}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {icon}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="nsl-dashboardMain">
                  <div className="nsl-dashboardTop">
                    <div className="nsl-skeleton nsl-skeleton--title" />
                    <div className="nsl-skeleton nsl-skeleton--avatar" />
                  </div>

                  <div className="nsl-statsRow">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="nsl-statCard">
                        <div className="nsl-skeleton nsl-skeleton--label" />
                        <div className="nsl-skeleton nsl-skeleton--value" />
                      </div>
                    ))}
                  </div>

                  <div className="nsl-listCard">
                    <div className="nsl-skeleton nsl-skeleton--wide" />
                    <div className="nsl-listStack">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="nsl-skeleton nsl-skeleton--row" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="nsl-section nsl-section--base" id="features">
          <div className="nsl-shell">
            <div className="nsl-sectionIntro">
              <h2>Powerful Features for Every Stakeholder</h2>
              <p>Everything you need to manage your institution with precision and ease.</p>
            </div>

            <div className="nsl-featureGrid">
              {FEATURE_CARDS.map((feature) => (
                <article
                  key={feature.title}
                  className={`nsl-featureCard nsl-featureCard--${feature.tone}${feature.tall ? " nsl-featureCard--tall" : ""}`}
                >
                  <div className="nsl-featureIcon">
                    <span className="material-symbols-outlined" aria-hidden="true">
                      {feature.icon}
                    </span>
                  </div>
                  <div className="nsl-featureBody">
                    <h3>{feature.title}</h3>
                    <p>{feature.body}</p>
                  </div>
                  {feature.tall ? (
                    <div className="nsl-featureMockup" aria-hidden="true">
                      <div />
                      <div />
                      <div />
                    </div>
                  ) : null}
                  {feature.tone === "success" ? (
                    <div className="nsl-analyticsBars" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="nsl-section nsl-section--panel">
          <div className="nsl-shell nsl-canvasGrid">
            <div className="nsl-floatingCanvas" aria-hidden="true">
              <div className="nsl-glassCard nsl-glassCard--main">
                <div className="nsl-glassHeader">
                  <h4>Student Directory</h4>
                  <span className="material-symbols-outlined">more_horiz</span>
                </div>
                <div className="nsl-directoryList">
                  <div className="nsl-directoryItem">
                    <div className="nsl-avatarBadge nsl-avatarBadge--indigo">JD</div>
                    <div>
                      <strong>Jane Doe</strong>
                      <span>Grade 10-A • Outstanding</span>
                    </div>
                    <em>Active</em>
                  </div>
                  <div className="nsl-directoryItem">
                    <div className="nsl-avatarBadge nsl-avatarBadge--amber">MS</div>
                    <div>
                      <strong>Mark Smith</strong>
                      <span>Grade 12-C • On Leave</span>
                    </div>
                    <em className="is-muted">Away</em>
                  </div>
                </div>
              </div>

              <div className="nsl-glassCard nsl-glassCard--events">
                <div className="nsl-eventHeader">
                  <span className="material-symbols-outlined">calendar_today</span>
                  <h4>Upcoming Events</h4>
                </div>
                <div className="nsl-progressTrack">
                  <span />
                </div>
                <div className="nsl-eventMeta">
                  <span>Final Exams</span>
                  <span>60% Setup</span>
                </div>
              </div>

              <div className="nsl-glassCard nsl-glassCard--chart">
                <div className="nsl-chartBlock">
                  <span className="material-symbols-outlined">bar_chart</span>
                </div>
              </div>
            </div>

            <div className="nsl-canvasContent">
              <h2>One Integrated Canvas for Your Entire Team</h2>
              <ul className="nsl-checkList">
                {INTEGRATED_CANVAS_ITEMS.map((item) => (
                  <li key={item.title}>
                    <div className="nsl-checkIcon">
                      <span className="material-symbols-outlined" aria-hidden="true">
                        check
                      </span>
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="nsl-section nsl-section--base" id="setup">
          <div className="nsl-shell">
            <div className="nsl-sectionIntro">
              <h2>Implementation as Simple as 1-2-3</h2>
              <p>Go from paperwork to paperless in record time.</p>
            </div>

            <div className="nsl-steps">
              {STEPS.map((step, index) => (
                <article key={step.title} className="nsl-stepCard">
                  <div className="nsl-stepNumber">{index + 1}</div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="nsl-section nsl-section--panel" id="pricing">
          <div className="nsl-shell">
            <div className="nsl-sectionIntro">
              <h2>Predictable Pricing for Any Scale</h2>
              <p>Transparent plans designed to grow with your institution.</p>
            </div>

            <div className="nsl-pricingGrid">
              {PRICING_PLANS.map((plan) => (
                <article
                  key={plan.name}
                  className={`nsl-pricingCard${plan.featured ? " nsl-pricingCard--featured" : ""}`}
                >
                  {plan.featured ? <span className="nsl-pricingBadge">Most Popular</span> : null}
                  <div className="nsl-pricingTop">
                    <h3>{plan.name}</h3>
                    <div className="nsl-pricingValue">
                      <span>{plan.price}</span>
                      {plan.cadence ? <small>{plan.cadence}</small> : null}
                    </div>
                    <p>{plan.body}</p>
                  </div>

                  <ul className="nsl-pricingList">
                    {plan.items.map((item) => (
                      <li key={item}>
                        <span className="material-symbols-outlined" aria-hidden="true">
                          check_circle
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`nsl-button ${plan.featured ? "nsl-button--inverted" : "nsl-button--outline"}`}
                    type="button"
                  >
                    {plan.cta}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="nsl-section nsl-section--base nsl-security" id="security">
          <div className="nsl-shell nsl-securityGrid">
            <div className="nsl-securityCopy">
              <span className="nsl-kicker">Bank-Grade Security</span>
              <h2>Your Institution&apos;s Data is Our Priority</h2>
              <p>
                We employ multi-layered security protocols to ensure student and staff privacy is
                never compromised.
              </p>

              <div className="nsl-securityFeatures">
                <div className="nsl-securityFeature">
                  <div className="nsl-securityIcon">
                    <span className="material-symbols-outlined">verified_user</span>
                  </div>
                  <div>
                    <h3>Multi-Tenancy</h3>
                    <p>Strict data isolation between organizations.</p>
                  </div>
                </div>
                <div className="nsl-securityFeature">
                  <div className="nsl-securityIcon">
                    <span className="material-symbols-outlined">cloud_done</span>
                  </div>
                  <div>
                    <h3>99.9% Uptime</h3>
                    <p>Distributed cloud infrastructure for zero downtime.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="nsl-terminalCard" aria-label="Encryption details">
              <div className="nsl-terminalTop">
                <div className="nsl-terminalDots">
                  <span />
                  <span />
                  <span />
                </div>
                <strong>TLS 1.3 ENCRYPTION ACTIVE</strong>
              </div>
              <div className="nsl-terminalBody">
                <div>$ openssl s_client -connect schoolos.com:443</div>
                <div className="is-dim">---</div>
                <div>Certificate chain</div>
                <div className="is-accent">0 s:CN = *.schoolos.com</div>
                <div className="is-accent">i:C = US, O = DigiCert Inc, CN = SchoolOS Root CA</div>
                <div className="is-dim">---</div>
                <div>Peer signing digest: SHA256</div>
                <div>Server Temp Key: X25519, 253 bits</div>
              </div>
            </div>
          </div>
        </section>

        <section className="nsl-section nsl-section--base">
          <div className="nsl-shell nsl-ctaWrap">
            <div className="nsl-ctaCard">
              <div className="nsl-ctaMark" aria-hidden="true">
                <img src="/logo.svg" alt="" />
              </div>
              <h2>Ready to Transform Your School Today?</h2>
              <p>
                Join 5,000+ educational institutions worldwide that trust SchoolOS for their daily
                operations.
              </p>
              <div className="nsl-heroActions nsl-heroActions--center">
                <Link className="nsl-button nsl-button--primary" to="/signup">
                  Start Your School Today
                </Link>
                <button className="nsl-button nsl-button--secondary" type="button">
                  Talk to Sales
                </button>
              </div>
              <div className="nsl-trustRow" aria-hidden="true">
                <span>FERPA Ready</span>
                <span>SOC 2</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="nsl-footer" id="resources">
        <div className="nsl-shell nsl-footerGrid">
          <div className="nsl-footerBrand">
            <Link className="nsl-brand" to="/">
              <ThemedCompleteLogo className="nsl-brandLogo nsl-brandLogo--footer" />
            </Link>
            <p>
              Building the future of educational infrastructure. Unifying administration, teaching,
              and learning in one secure OS.
            </p>
            <div className="nsl-socials" aria-label="Social links">
              {["public", "mail", "call"].map((icon) => (
                <a key={icon} href="#resources">
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {RESOURCE_COLUMNS.map((column) => (
            <div key={column.title}>
              <h4>{column.title}</h4>
              <ul>
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#resources">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="nsl-shell nsl-footerBottom">
          <span>© 2024 SchoolOS Inc. All rights reserved.</span>
          <div className="nsl-status">
            <span />
            <strong>System Status: Operational</strong>
          </div>
        </div>
      </footer>
    </div>
  );
}
