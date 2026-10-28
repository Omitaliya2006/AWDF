import React from 'react';
import './NavBar.css';

/**
 * NavBar Component (Supplementary Problem Solution)
 * Features dynamic active section highlighting, glassmorphism design, and responsive layout.
 *
 * @param {Object} props
 * @param {string} props.activeSection - Currently active section ID
 * @param {Function} props.setActiveSection - State updater for active section
 * @param {string} props.rollNo - Student roll number badge
 */
function NavBar({ activeSection, setActiveSection, rollNo = '24IT029' }) {
  const navItems = [
    { id: 'header', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="navbar-glass">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => handleNavClick('header')}>
          <div className="brand-logo">
            <span className="brand-icon">⚛️</span>
            <span className="brand-text">Portfolio</span>
          </div>
          <span className="roll-badge">{rollNo}</span>
        </div>

        {/* Navigation Menu */}
        <ul className="navbar-links">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  id={`nav-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.label}
                  {isActive && <span className="active-indicator" />}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Live Status indicator */}
        <div className="navbar-status">
          <span className="status-dot"></span>
          <span className="status-text">Practical 1</span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
