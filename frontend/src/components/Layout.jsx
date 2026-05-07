import { Bookmark, LogOut, Newspaper } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const Layout = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="site-header">
        <nav className="nav-wrap" aria-label="Primary navigation">
          <NavLink to="/" className="brand" aria-label="HN Bookmarks home">
            <span className="brand-mark">HN</span>
            <span>Bookmarks</span>
          </NavLink>

          <div className="nav-actions">
            <NavLink to="/" className="nav-link">
              <Newspaper size={17} aria-hidden="true" />
              Stories
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/bookmarks" className="nav-link">
                  <Bookmark size={17} aria-hidden="true" />
                  Saved
                </NavLink>
                <span className="user-chip">{user?.name}</span>
                <button className="icon-text-button" type="button" onClick={logout}>
                  <LogOut size={17} aria-hidden="true" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
                <NavLink to="/register" className="primary-link">
                  Register
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
