import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        School Panel
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
