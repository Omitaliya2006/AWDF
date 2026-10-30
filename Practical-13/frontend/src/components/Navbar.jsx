import React from 'react';
import './Navbar.css';

const Navbar = ({ onOpenViva }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-logo">🤖</div>
          <div>
            <h1 className="brand-title">TaskFlow AI Assistant</h1>
            <span className="brand-subtitle">Practical 13: AI API Integration into Web Application</span>
          </div>
        </div>

        <div className="navbar-actions">
          <div className="student-badge">
            <span className="badge-name">Om Italiya</span>
            <span className="badge-roll">24IT029</span>
          </div>

          <button className="viva-btn" onClick={onOpenViva}>
            📖 Viva & Responsible AI Guide
          </button>

          <a
            href="https://github.com/Omitaliya2006/AWDF"
            target="_blank"
            rel="noopener noreferrer"
            className="github-btn"
          >
            <span>GitHub Repository</span>
            <span className="external-arrow">↗</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
