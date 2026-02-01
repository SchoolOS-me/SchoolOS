import { Outlet, Link } from 'react-router-dom';

export function MainLayout() {
  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #ccc' }}>
        <Link to="/teacher">Teacher</Link>
      </header>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
