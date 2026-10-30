import React from 'react';
import './Navbar.css';

export default function Navbar({ onOpenViva, containerInfo }) {
  const isConnected = containerInfo?.network?.dbConnectionState === 'connected';

  return (
    <header className="app-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">🐳</div>
          <div className="brand-text">
            <span className="brand-tag">AWDF • Practical 11</span>
            <h1 className="brand-title">Containerization with Docker & Docker Compose</h1>
          </div>
        </div>

        <div className="nav-controls">
          {/* Container Connection State Badge */}
          <div className={`db-state-badge ${isConnected ? 'connected' : 'connecting'}`}>
            <span className="state-dot"></span>
            <span>MongoDB Container: <strong>{isConnected ? 'Connected' : 'Active'}</strong></span>
          </div>

          {/* Viva Guide Button */}
          <button className="btn-nav btn-viva" onClick={onOpenViva} title="Oral examination prep guide">
            🎓 Viva Prep
          </button>

          {/* Student Badge */}
          <div className="student-badge">
            <span className="student-name">Om Italiya</span>
            <span className="student-id">24IT029</span>
          </div>
        </div>
      </div>
    </header>
  );
}
