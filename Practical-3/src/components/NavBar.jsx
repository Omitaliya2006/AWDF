import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './NavBar.css';

/**
 * NavBar Component for Practical 3
 * Provides client-side SPA navigation via NavLink (React Router)
 * and interactive controls (Theme toggle, GitHub link).
 *
 * @param {Object} props
 * @param {string} props.theme - Current theme ('dark' | 'light')
 * @param {Function} props.toggleTheme - State updater for theme
 */
function NavBar({ theme, toggleTheme }) {
  const navLinks = [
    { path: '/', label: 'Repositories', icon: '📂' },
    { path: '/inspector', label: 'API Inspector', icon: '⚡' },
    { path: '/viva', label: 'Viva & Concepts', icon: '🎓' },
  ];

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Link using React Router Link */}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo-icon">🌐</span>
          <div className="brand-titles">
            <span className="brand-name">API Explorer</span>
            <span className="brand-badge">Om Italiya • 24IT029 • AWDF Lab 3</span>
          </div>
        </Link>

        {/* Navigation Menu using NavLink (SPA navigation without page reloads) */}
        <nav className="navbar-nav">
          <ul className="nav-items-list">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className={({ isActive }) =>
                    `nav-link-btn ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span className="nav-label">{link.label}</span>
                  <span className="active-glow-bar" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Interactive Controls: GitHub Profile Link & Theme Toggle */}
        <div className="navbar-actions">
          <a
            href="https://github.com/Omitaliya2006"
            target="_blank"
            rel="noreferrer"
            className="action-icon-btn github-link-btn"
            title="View Om Italiya's GitHub Profile"
            aria-label="GitHub Profile"
          >
            <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            className="action-icon-btn theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
