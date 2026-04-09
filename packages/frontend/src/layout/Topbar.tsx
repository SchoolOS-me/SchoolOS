import "./Topbar.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUserDisplay } from "../utils/userDisplay";

type ParentTopbarStudent = {
  studentUuid: string;
  name: string;
  className: string;
  sectionName: string;
};

type Props = {
  title?: string;
  variant?: "default" | "superAdmin" | "teacher" | "student" | "parent" | "admin";
  parentTopbar?: {
    students: ParentTopbarStudent[];
    activeStudentUuid: string;
    onStudentChange: (studentUuid: string) => void;
  };
};

const Topbar = ({ title, variant = "default", parentTopbar }: Props) => {
  const currentUser = getCurrentUserDisplay();
  const profileAriaLabel = `Open profile for ${currentUser.name}`;
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchMessage, setSearchMessage] = useState("");

  const resolveAdminSearchRoute = (rawQuery: string): { path: string | null; message?: string } => {
    const normalized = rawQuery.trim().toLowerCase();
    if (!normalized) return { path: null };
    const routes: Array<{ keywords: string[]; path: string }> = [
      { keywords: ["dashboard", "home", "overview"], path: "/admin/dashboard" },
      { keywords: ["student", "students", "admission"], path: "/admin/students/create" },
      { keywords: ["teacher", "teachers", "staff"], path: "/admin/teachers/create" },
      { keywords: ["class", "classes", "section", "sections"], path: "/admin/classes/create" },
      { keywords: ["setting", "settings", "theme", "branding"], path: "/settings" },
      { keywords: ["profile", "account"], path: "/profile" },
    ];
    const matchedRoute = routes.find((item) =>
      item.keywords.some((keyword) => normalized.includes(keyword))
    );
    if (matchedRoute) {
      return { path: matchedRoute.path };
    }

    if (["result", "results", "report", "reports"].some((keyword) => normalized.includes(keyword))) {
      return { path: null, message: "Reports and results are not available in school admin yet." };
    }
    if (["fee", "fees", "payment", "payments"].some((keyword) => normalized.includes(keyword))) {
      return { path: null, message: "Fees module is still pending for school admin." };
    }
    if (["calendar", "exam", "schedule"].some((keyword) => normalized.includes(keyword))) {
      return { path: null, message: "Academic calendar setup is not dynamic yet." };
    }
    if (["notification", "notifications", "message", "messages", "chat"].some((keyword) => normalized.includes(keyword))) {
      return { path: null, message: "Notifications and messaging are coming soon." };
    }

    return { path: null, message: "No matching admin page found for that search yet." };
  };

  const handleSearchSubmit = () => {
    const { path, message } = resolveAdminSearchRoute(query);
    if (path) {
      navigate(path);
      setQuery("");
      setSearchMessage("");
      return;
    }
    setSearchMessage(message || "");
  };

  if (variant === "admin") {
    return (
      <header className="topbar topbar--admin">
        <div className="topbar__left">
          <div className="topbar__school">
            <img
              src={currentUser.schoolLogoUrl || "/logo.svg"}
              alt={currentUser.schoolName}
              className="topbar__schoolIcon"
            />
            <span>{currentUser.schoolName}</span>
          </div>
        </div>
        <div className="topbar__center">
          <div className="topbar__searchWrap">
            <span className="topbar__searchIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M11 4a7 7 0 1 0 4.4 12.4l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
              </svg>
            </span>
            <input
              className="topbar__searchInput"
              type="search"
              placeholder="Search records..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (searchMessage) {
                  setSearchMessage("");
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleSearchSubmit();
                }
              }}
            />
          </div>
          {searchMessage ? <p className="topbar__searchMessage">{searchMessage}</p> : null}
        </div>
        <div className="topbar__right">
          <button
            type="button"
            className="topbar__iconButton topbar__iconButton--disabled"
            aria-label="Notifications coming soon"
            title="Notifications module is coming soon"
          >
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </button>
          <button
            type="button"
            className="topbar__iconButton topbar__iconButton--disabled"
            aria-label="Messages coming soon"
            title="Messaging module is coming soon"
          >
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M4 5h16v10H6l-2 2V5zm3 4h10" />
            </svg>
          </button>
          <div className="topbar__divider" aria-hidden="true" />
          <Link to="/profile" className="topbar__user topbar__profileLink" aria-label={profileAriaLabel}>
            <div className="topbar__userText">
              <span className="topbar__userName">{currentUser.name}</span>
              <span className="topbar__userRole">{currentUser.role}</span>
            </div>
            <div className="topbar__userAvatar">{currentUser.initials}</div>
          </Link>
        </div>
      </header>
    );
  }

  if (variant === "parent") {
    const activeStudent = parentTopbar?.students.find(
      (student) => student.studentUuid === parentTopbar.activeStudentUuid
    );

    return (
      <header className="topbar topbar--parent">
        <div className="topbar__switch">
          <span className="topbar__switchLabel">Switch Student</span>
          {parentTopbar?.students.length ? (
            <label className="topbar__switchButton">
              <select
                className="topbar__switchSelect"
                value={parentTopbar.activeStudentUuid}
                onChange={(event) => parentTopbar.onStudentChange(event.target.value)}
                aria-label="Switch active student"
              >
                {parentTopbar.students.map((student) => (
                  <option key={student.studentUuid} value={student.studentUuid}>
                    {student.name} · {student.className} {student.sectionName}
                  </option>
                ))}
              </select>
              <span aria-hidden="true">▾</span>
            </label>
          ) : (
            <button type="button" className="topbar__switchButton">
              {currentUser.name} · Active Student
              <span aria-hidden="true">▾</span>
            </button>
          )}
        </div>
        <nav className="topbar__nav">
          <a href="/parent/dashboard#academic-progress" className="topbar__navItem is-active">
            Academic Progress
          </a>
          <a href="/parent/dashboard#communication-center" className="topbar__navItem">
            Directory
          </a>
        </nav>
        <div className="topbar__right">
          <a
            href="/parent/dashboard#alerts"
            className="topbar__iconButton"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </a>
          <Link to="/profile" className="topbar__user topbar__profileLink" aria-label={profileAriaLabel}>
            <div className="topbar__userText">
              <span className="topbar__userName">{currentUser.name}</span>
              <span className="topbar__userRole">
                {activeStudent
                  ? `${currentUser.role} · ${activeStudent.className} ${activeStudent.sectionName}`
                  : currentUser.role}
              </span>
            </div>
            <div className="topbar__userAvatar">{currentUser.initials}</div>
          </Link>
        </div>
      </header>
    );
  }

  if (variant === "student") {
    return (
      <header className="topbar topbar--student">
        <div className="topbar__left">
          {title && <h1 className="topbarTitle">{title}</h1>}
        </div>
        <div className="topbar__center">
          <span className="topbar__searchIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M11 4a7 7 0 1 0 4.4 12.4l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
            </svg>
          </span>
          <input
            className="topbar__searchInput"
            type="search"
            placeholder="Search assignments, files"
          />
        </div>
        <div className="topbar__right">
          <span className="topbar__roleBadge">{currentUser.schoolName}</span>
          <a
            href="/student/dashboard#announcements"
            className="topbar__iconButton"
            aria-label="Notifications"
          >
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </a>
          <Link
            to="/profile"
            className="topbar__userAvatar topbar__profileAvatar"
            aria-label={profileAriaLabel}
          >
            {currentUser.initials}
          </Link>
        </div>
      </header>
    );
  }

  if (variant === "teacher") {
    return (
      <header className="topbar topbar--teacher">
        <div className="topbar__brand">
          <img
            src={currentUser.schoolLogoUrl || "/logo.svg"}
            alt={currentUser.schoolName}
            className="topbar__brandLogo"
          />
          <div className="topbar__brandStack">
            <span className="topbar__brandText">{currentUser.schoolName}</span>
            <span className="topbar__brandMeta">{currentUser.schoolCode?.toUpperCase() || "School Portal"}</span>
          </div>
        </div>
        <nav className="topbar__nav">
          <button type="button" className="topbar__navItem is-active">
            Dashboard
          </button>
          <button type="button" className="topbar__navItem">
            Reports
          </button>
        </nav>
        <div className="topbar__center">
          <span className="topbar__searchIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M11 4a7 7 0 1 0 4.4 12.4l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
            </svg>
          </span>
          <input
            className="topbar__searchInput"
            type="search"
            placeholder="Search students, classes..."
          />
        </div>
        <div className="topbar__right">
          <button type="button" className="topbar__iconButton" aria-label="Notifications">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </button>
          <button type="button" className="topbar__iconButton" aria-label="Messages">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M4 5h16v10H6l-2 2V5zm3 4h10" />
            </svg>
          </button>
          <Link
            to="/profile"
            className="topbar__avatar topbar__profileAvatar"
            aria-label={profileAriaLabel}
          >
            {currentUser.initials}
          </Link>
        </div>
      </header>
    );
  }

  if (variant === "superAdmin") {
    return (
      <header className="topbar topbar--superAdmin">
        <div className="topbar__left">
          {title && <h1 className="topbarTitle">{title}</h1>}
        </div>
        <div className="topbar__center">
          <span className="topbar__searchIcon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M11 4a7 7 0 1 0 4.4 12.4l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10z" />
            </svg>
          </span>
          <input
            className="topbar__searchInput"
            type="search"
            placeholder="Search records..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSearchSubmit();
              }
            }}
          />
        </div>
        <div className="topbar__right">
          <button type="button" className="topbar__iconButton" aria-label="Notifications">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </button>
          <span className="topbar__divider" aria-hidden="true" />
          <Link to="/profile" className="topbar__user topbar__profileLink" aria-label={profileAriaLabel}>
            <div className="topbar__userText">
              <span className="topbar__userName">{currentUser.name}</span>
              <span className="topbar__userRole">{currentUser.role}</span>
            </div>
            <div className="topbar__userAvatar">{currentUser.initials}</div>
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="topbar">
      {title && <h1 className="topbarTitle">{title}</h1>}
    </header>
  );
};

export default Topbar;
