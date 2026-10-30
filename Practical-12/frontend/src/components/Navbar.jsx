import React from 'react';
import './Navbar.css';

const Navbar = ({ onOpenViva }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">⚙️</div>
          <div>
            <h1 className="brand-title">TaskFlow CI/CD Engine</h1>
            <span className="brand-subtitle">Practical 12: CI/CD Pipeline with GitHub Actions</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="student-badge">
            <span className="badge-name">Om Italiya</span>
            <span className="badge-roll">24IT029</span>
          </div>

          <button className="viva-btn" onClick={onOpenViva}>
            📖 Viva Guide & Key Qs
          </button>

          <a
            href="https://github.com/Omitaliya2006/AWDF/actions/workflows/ci.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
          >
            <span>GitHub Actions</span>
            <span className="external-arrow">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
