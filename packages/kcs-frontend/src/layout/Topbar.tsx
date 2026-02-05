import "./Topbar.css";

type Props = {
  title?: string;
  variant?: "default" | "superAdmin" | "teacher" | "student" | "parent" | "admin";
};

const Topbar = ({ title, variant = "default" }: Props) => {
  if (variant === "admin") {
    return (
      <header className="topbar topbar--admin">
        <div className="topbar__left">
          <div className="topbar__school">
            <span className="topbar__schoolIcon">🏛</span>
            <span>Greenwood International</span>
          </div>
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
          <div className="topbar__divider" aria-hidden="true" />
          <div className="topbar__user">
            <div className="topbar__userText">
              <span className="topbar__userName">Alex Thompson</span>
              <span className="topbar__userRole">Super Admin</span>
            </div>
            <div className="topbar__userAvatar">AT</div>
          </div>
        </div>
      </header>
    );
  }

  if (variant === "parent") {
    return (
      <header className="topbar topbar--parent">
        <div className="topbar__switch">
          <span className="topbar__switchLabel">Switch Student</span>
          <button type="button" className="topbar__switchButton">
            Alex Johnson · Grade 4
            <span aria-hidden="true">▾</span>
          </button>
        </div>
        <nav className="topbar__nav">
          <button type="button" className="topbar__navItem is-active">
            Calendar
          </button>
          <button type="button" className="topbar__navItem">
            Directory
          </button>
        </nav>
        <div className="topbar__right">
          <button type="button" className="topbar__iconButton" aria-label="Notifications">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </button>
          <div className="topbar__user">
            <div className="topbar__userText">
              <span className="topbar__userName">Sarah Johnson</span>
              <span className="topbar__userRole">Primary Parent</span>
            </div>
            <div className="topbar__userAvatar">SJ</div>
          </div>
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
          <span className="topbar__roleBadge">Student Role</span>
          <button type="button" className="topbar__iconButton" aria-label="Notifications">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </button>
          <div className="topbar__userAvatar">AT</div>
        </div>
      </header>
    );
  }

  if (variant === "teacher") {
    return (
      <header className="topbar topbar--teacher">
        <div className="topbar__brand">
          <span className="topbar__brandMark" />
          <span className="topbar__brandText">SchoolManage SaaS</span>
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
          <div className="topbar__avatar">PS</div>
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
          />
        </div>
        <div className="topbar__right">
          <button type="button" className="topbar__iconButton" aria-label="Notifications">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M12 3a5 5 0 0 0-5 5v2.2c0 .7-.3 1.3-.8 1.8l-1.2 1.2h14l-1.2-1.2c-.5-.5-.8-1.1-.8-1.8V8a5 5 0 0 0-5-5zm0 18a2.5 2.5 0 0 0 2.4-2h-4.8A2.5 2.5 0 0 0 12 21z" />
            </svg>
          </button>
          <span className="topbar__divider" aria-hidden="true" />
          <div className="topbar__user">
            <div className="topbar__userText">
              <span className="topbar__userName">Alex Thompson</span>
              <span className="topbar__userRole">Super Admin</span>
            </div>
            <div className="topbar__userAvatar">AT</div>
          </div>
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
