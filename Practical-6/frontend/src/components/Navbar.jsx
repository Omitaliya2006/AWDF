import React from 'react';
import './Navbar.css';

export default function Navbar({
  backendStatus,
  onOpenCreateModal,
  onOpenVivaModal,
  onOpenMonitorModal,
  onSeedData,
  isSeeding
}) {
  const isConnected = backendStatus?.status === 'healthy';

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="logo-badge">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="logo-text">TaskFlow <span className="logo-accent">MERN</span></span>
        </div>
        <div className="practical-tag">
          <span className="tag-dot"></span>
          Practical 6 • AWDF
        </div>
      </div>

      <div className="navbar-center">
        <div className="student-pill" title="Om Italiya - 24IT029 - CSPIT CHARUSAT">
          <span className="student-name">Om Italiya</span>
          <span className="student-id">24IT029</span>
          <span className="student-dept">IT • Sem 5</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Connection status indicator */}
        <button
          className={`status-indicator ${isConnected ? 'status-online' : 'status-offline'}`}
          onClick={onOpenMonitorModal}
          title="Click to view full-stack network architecture & server logs"
        >
          <span className="pulse-dot"></span>
          <span className="status-label">
            {isConnected ? 'API & DB Connected' : 'Server Disconnected'}
          </span>
        </button>

        {/* Action buttons */}
        <button
          className="btn-secondary"
          onClick={onSeedData}
          disabled={isSeeding}
          title="Reset database to default sample tasks"
        >
          {isSeeding ? 'Seeding...' : '🌱 Reset & Seed'}
        </button>

        <button
          className="btn-viva"
          onClick={onOpenVivaModal}
          title="Open Lab Evaluation & Viva Guide"
        >
          🎓 Viva Guide
        </button>

        <button
          className="btn-primary"
          onClick={onOpenCreateModal}
          title="Create a new task in MongoDB"
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Task
        </button>
      </div>
    </header>
  );
}

