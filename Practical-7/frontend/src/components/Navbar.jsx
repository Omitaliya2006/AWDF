import React from 'react';
import './Navbar.css';

export default function Navbar({
  user,
  backendStatus,
  onOpenAuthModal,
  onLogout,
  onOpenCreateModal,
  onOpenPipelineModal,
  onOpenVivaModal,
  onSeedData,
  isSeeding
}) {
  const isConnected = backendStatus?.status === 'healthy';

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="logo-badge">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span className="logo-text">TaskFlow <span className="logo-accent">JWT</span></span>
        </div>
        <div className="practical-tag">
          <span className="tag-dot"></span>
          Practical 7 • AWDF
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
        {/* Connection status */}
        <button
          className={`status-indicator ${isConnected ? 'status-online' : 'status-offline'}`}
          onClick={onOpenPipelineModal}
          title="Click to view Express Middleware Pipeline & Token Details"
        >
          <span className="pulse-dot"></span>
          <span className="status-label">
            {isConnected ? 'API & DB Online' : 'Offline'}
          </span>
        </button>

        <button
          className="btn-pipeline"
          onClick={onOpenPipelineModal}
          title="View Middleware Pipeline & JWT Inspector"
        >
          ⚙️ Pipeline HUD
        </button>

        <button
          className="btn-viva"
          onClick={onOpenVivaModal}
          title="Open Lab Evaluation & Viva Guide"
        >
          🎓 Viva Guide
        </button>

        {user ? (
          <>
            <button
              className="btn-secondary"
              onClick={onSeedData}
              disabled={isSeeding}
              title="Reset and load sample tasks for your account"
            >
              {isSeeding ? 'Seeding...' : '🌱 Seed Tasks'}
            </button>

            <button
              className="btn-primary"
              onClick={onOpenCreateModal}
              title="Create a new task in MongoDB"
            >
              + New Task
            </button>

            {/* User Profile Badge & Logout */}
            <div className="user-profile-badge">
              <div className="user-avatar" title={`Logged in as ${user.name} (${user.email})`}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-info-text">
                <span className="user-display-name">{user.name}</span>
                <span className="user-display-email">{user.email}</span>
              </div>
              <button
                className="btn-logout"
                onClick={onLogout}
                title="Log out and clear JWT token"
              >
                Sign Out
              </button>
            </div>
          </>
        ) : (
          <button
            className="btn-auth"
            onClick={onOpenAuthModal}
            title="Sign In or Register"
          >
            🔐 Sign In / Register
          </button>
        )}
      </div>
    </header>
  );
}
