import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { getCurrentUserDisplay } from "../utils/userDisplay";

type Props = {
  variant?: "default" | "superAdmin" | "teacher" | "student" | "parent" | "admin";
};

const Sidebar = ({ variant = "default" }: Props) => {
  const currentUser = getCurrentUserDisplay();

  if (variant === "admin") {
    return (
      <aside className="sidebar sidebar--admin">
        <div className="sidebar__brand">
          <img src="/logo.svg" alt="SchoolOS" className="sidebar__brandLogo" />
          <div className="sidebar__brandText">
            <span className="sidebar__brandTitle">{currentUser.schoolName}</span>
            <span className="sidebar__brandSubtitle">Management Portal</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </span>
            <span className="sidebar__label">Home</span>
          </NavLink>

          <NavLink
            to="/admin/students/create"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 14a7 7 0 0 1 14 0H5z" />
              </svg>
            </span>
            <span className="sidebar__label">Students</span>
          </NavLink>

          <NavLink
            to="/admin/teachers/create"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M5 4h14v14H5V4zm3 3h8v2H8V7zm0 4h6v2H8v-2z" />
              </svg>
            </span>
            <span className="sidebar__label">Teachers</span>
          </NavLink>

          <NavLink
            to="/admin/classes/create"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 6h16v12H4V6zm4-3h8v2H8V3z" />
              </svg>
            </span>
            <span className="sidebar__label">Classes</span>
          </NavLink>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 4h10v2H7V4zm-2 4h14v12H5V8zm4 3h6v2H9v-2zm0 4h6v2H9v-2z" />
              </svg>
            </span>
            <span className="sidebar__label">Fees</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 4h4v16H4V4zm6 6h4v10h-4V10zm6-4h4v14h-4V6z" />
              </svg>
            </span>
            <span className="sidebar__label">Reports</span>
          </button>
        </nav>

        <div className="sidebar__adminActions">
          <button type="button" className="sidebar__cta">
            New Announcement
          </button>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "sidebar__link sidebar__link--muted sidebar__link--active"
                : "sidebar__link sidebar__link--muted"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 3l2 3h3l1 3 3 2-3 2-1 3h-3l-2 3-2-3H7l-1-3-3-2 3-2 1-3h3l2-3z" />
              </svg>
            </span>
            <span className="sidebar__label">Settings</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "sidebar__link sidebar__link--muted sidebar__link--active"
                : "sidebar__link sidebar__link--muted"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 14a7 7 0 0 1 14 0H5z" />
              </svg>
            </span>
            <span className="sidebar__label">Profile</span>
          </NavLink>
        </div>
      </aside>
    );
  }

  if (variant === "student") {
    return (
      <aside className="sidebar sidebar--student">
        <div className="sidebar__brand">
          <img src="/logo.svg" alt="SchoolOS" className="sidebar__brandLogo" />
          <div className="sidebar__brandText">
            <span className="sidebar__brandTitle">St. Jude's Academy</span>
            <span className="sidebar__brandSubtitle">Student Portal</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </span>
            <span className="sidebar__label">Dashboard</span>
          </NavLink>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M5 4h14v14H5V4zm3 3h8v2H8V7zm0 4h6v2H8v-2z" />
              </svg>
            </span>
            <span className="sidebar__label">Subjects</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M5 4h14v16H5V4zm4 4h6v2H9V8zm0 4h6v2H9v-2z" />
              </svg>
            </span>
            <span className="sidebar__label">Grades</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M6 3h12v4H6V3zm-2 6h16v10H4V9z" />
              </svg>
            </span>
            <span className="sidebar__label">Report Cards</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 3v2m10-2v2M4 7h16v12H4V7zm3 4h4m4 0h4m-8 4h4" />
              </svg>
            </span>
            <span className="sidebar__label">Schedule</span>
          </button>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 14a7 7 0 0 1 14 0H5z" />
              </svg>
            </span>
            <span className="sidebar__label">Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 3l2 3h3l1 3 3 2-3 2-1 3h-3l-2 3-2-3H7l-1-3-3-2 3-2 1-3h3l2-3z" />
              </svg>
            </span>
            <span className="sidebar__label">Settings</span>
          </NavLink>
        </nav>
      </aside>
    );
  }

  if (variant === "parent") {
    return (
      <aside className="sidebar sidebar--parent">
        <div className="sidebar__brand">
          <img src="/logo.svg" alt="SchoolOS" className="sidebar__brandLogo" />
          <div className="sidebar__brandText">
            <span className="sidebar__brandTitle">EduSaaS</span>
            <span className="sidebar__brandSubtitle">Parent Portal</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/parent/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </span>
            <span className="sidebar__label">Dashboard Overview</span>
          </NavLink>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M5 4h14v14H5V4zm3 3h8v2H8V7zm0 4h6v2H8v-2z" />
              </svg>
            </span>
            <span className="sidebar__label">Academic Performance</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 4h10v2H7V4zm-2 4h14v12H5V8zm4 3h6v2H9v-2zm0 4h6v2H9v-2z" />
              </svg>
            </span>
            <span className="sidebar__label">Fee Management</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 5h16v10H6l-2 2V5zm3 4h10" />
              </svg>
            </span>
            <span className="sidebar__label">Communication</span>
          </button>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 14a7 7 0 0 1 14 0H5z" />
              </svg>
            </span>
            <span className="sidebar__label">Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 3l2 3h3l1 3 3 2-3 2-1 3h-3l-2 3-2-3H7l-1-3-3-2 3-2 1-3h3l2-3z" />
              </svg>
            </span>
            <span className="sidebar__label">Settings</span>
          </NavLink>
        </nav>
      </aside>
    );
  }

  if (variant === "teacher") {
    return (
      <aside className="sidebar sidebar--teacher">
        <div className="sidebar__brand">
          <img src="/logo.svg" alt="SchoolOS" className="sidebar__brandLogo" />
          <div className="sidebar__brandText">
            <span className="sidebar__brandTitle">Academic Blue</span>
            <span className="sidebar__brandSubtitle">Teacher Portal</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/teacher-dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </span>
            <span className="sidebar__label">Dashboard</span>
          </NavLink>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M5 5h14v14H5V5zm7 3v8m-4-4h8" />
              </svg>
            </span>
            <span className="sidebar__label">My Classes</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 4h10v4l-5 3-5-3V4zm-3 8h16v8H4v-8z" />
              </svg>
            </span>
            <span className="sidebar__label">Attendance</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 4h10v2H7V4zm0 4h10v2H7V8zm0 4h6v2H7v-2zm-3 4h16v4H4v-4z" />
              </svg>
            </span>
            <span className="sidebar__label">Grading</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M7 3v2m10-2v2M4 7h16v12H4V7zm3 4h4m4 0h4m-8 4h4" />
              </svg>
            </span>
            <span className="sidebar__label">Timetable</span>
          </button>

          <button type="button" className="sidebar__link">
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M5 4h10l4 4v12H5V4zm10 0v4h4" />
              </svg>
            </span>
            <span className="sidebar__label">Resources</span>
          </button>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 14a7 7 0 0 1 14 0H5z" />
              </svg>
            </span>
            <span className="sidebar__label">Profile</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 3l2 3h3l1 3 3 2-3 2-1 3h-3l-2 3-2-3H7l-1-3-3-2 3-2 1-3h3l2-3z" />
              </svg>
            </span>
            <span className="sidebar__label">Settings</span>
          </NavLink>
        </nav>
      </aside>
    );
  }

  if (variant === "superAdmin") {
    return (
      <aside className="sidebar sidebar--superAdmin">
        <div className="sidebar__brand">
          <img src="/logo.svg" alt="SchoolOS" className="sidebar__brandLogo" />
          <div className="sidebar__brandText">
            <span className="sidebar__brandTitle">SchoolOS</span>
          </div>
        </div>

        <nav className="sidebar__nav">
          <NavLink
            to="/super-admin/dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" />
              </svg>
            </span>
            <span className="sidebar__label">Dashboard</span>
          </NavLink>

          <NavLink
            to="/super-admin/schools/create"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M3 7h18v10H3V7zm4-3h10v2H7V4zm0 14h10v2H7v-2z" />
              </svg>
            </span>
            <span className="sidebar__label">Create School</span>
          </NavLink>

          <NavLink
            to="/super-admin/schools/admin"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 3v18M5 7h14M7 11h10M9 15h6" />
              </svg>
            </span>
            <span className="sidebar__label">Create Admin</span>
          </NavLink>

          <NavLink
            to="/super-admin/schools/subscription"
            className={({ isActive }) =>
              isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
            }
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 3v18M5 7h14M7 11h10M9 15h6" />
              </svg>
            </span>
            <span className="sidebar__label">Subscriptions</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 3l2 3h3l1 3 3 2-3 2-1 3h-3l-2 3-2-3H7l-1-3-3-2 3-2 1-3h3l2-3z" />
              </svg>
            </span>
            <span className="sidebar__label">Settings</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "sidebar__link sidebar__link--active" : "sidebar__link")}
          >
            <span className="sidebar__icon">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm-7 14a7 7 0 0 1 14 0H5z" />
              </svg>
            </span>
            <span className="sidebar__label">Profile</span>
          </NavLink>
        </nav>

        <div className="sidebar__user">
          <div className="sidebar__avatar">{currentUser.initials}</div>
          <div>
            <div className="sidebar__userName">{currentUser.name}</div>
            <div className="sidebar__userRole">{currentUser.role}</div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src="/logo.svg" alt="SchoolOS" className="sidebar__defaultLogo" />
      </div>

      <nav className="sidebar__nav">
        <NavLink
          to="/teacher"
          className={({ isActive }) =>
            isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
          }
        >
          <span className="sidebar__icon">📊</span>
          <span className="sidebar__label">Dashboard</span>
        </NavLink>

        <NavLink
          to="/teacher/attendance"
          className={({ isActive }) =>
            isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
          }
        >
          <span className="sidebar__icon">📝</span>
          <span className="sidebar__label">Attendance</span>
        </NavLink>

        <NavLink
          to="/teacher/marks"
          className={({ isActive }) =>
            isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
          }
        >
          <span className="sidebar__icon">📈</span>
          <span className="sidebar__label">Marks</span>
        </NavLink>

        <NavLink
          to="/teacher/results"
          className={({ isActive }) =>
            isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
          }
        >
          <span className="sidebar__icon">🏆</span>
          <span className="sidebar__label">Results</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
