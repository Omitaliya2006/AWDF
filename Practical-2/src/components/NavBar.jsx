import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './NavBar.css';

/**
 * NavBar Component for Practical 2
 * Built strictly using NavLink from 'react-router-dom' (Lab Step 4)
 * to avoid full page reloads and highlight the active route.
 *
 * @param {Object} props
 * @param {string} props.theme - Current theme ('dark' | 'light')
 * @param {Function} props.toggleTheme - State updater for theme
 * @param {boolean} props.showHelpModal - State for help modal visibility
 * @param {Function} props.setShowHelpModal - State updater for modal visibility
 */
function NavBar({ theme, toggleTheme, showHelpModal, setShowHelpModal }) {
  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/projects', label: 'Projects', icon: '💼' },
    { path: '/contact', label: 'Contact', icon: '✉️' },
  ];

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Link using React Router Link */}
        <Link to="/" className="navbar-brand">
          <span className="brand-logo-icon">⚛️</span>
          <div className="brand-titles">
            <span className="brand-name">Om Italiya</span>
            <span className="brand-badge">24IT029 • AWDF</span>
          </div>
        </Link>

        {/* Navigation Menu using NavLink (avoids page reload & adds .active class) */}
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

        {/* Interactive Controls: Theme Toggle & Info Modal (useState UI Toggles) */}
        <div className="navbar-actions">
          {/* Theme Toggle (Supplementary Problem: Dark/Light mode using useState) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="action-icon-btn theme-toggle-btn"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Quick Help / Concepts Modal Toggle (Lab Step 6: useState UI Toggle) */}
          <button
            type="button"
            onClick={() => setShowHelpModal(!showHelpModal)}
            className={`action-icon-btn help-toggle-btn ${showHelpModal ? 'active-tool' : ''}`}
            title="Toggle Practical 2 Concepts Guide"
            aria-label="Toggle help guide"
          >
            💡
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
