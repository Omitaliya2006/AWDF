import React from 'react';
import './Navbar.css';

export default function Navbar({
  eventStats,
  onOpenViva,
  onSimulateError,
  onClearLogs
}) {
  return (
    <header className="app-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">📢</div>
          <div className="brand-text">
            <span className="brand-tag">AWDF • Practical 10</span>
            <h1 className="brand-title">Asynchronous Processing & Event-Driven Architecture</h1>
          </div>
        </div>

        <div className="nav-controls">
          {/* Live Event Stats Pills */}
          {eventStats && (
            <div className="event-pills-group">
              <span className="event-pill created" title="task-created events emitted">
                ✨ Created: <strong>{eventStats['task-created'] || 0}</strong>
              </span>
              <span className="event-pill deleted" title="task-deleted events emitted">
                🗑️ Deleted: <strong>{eventStats['task-deleted'] || 0}</strong>
              </span>
              {eventStats['error'] > 0 && (
                <span className="event-pill error" title="error events caught">
                  ⚠️ Errors: <strong>{eventStats['error']}</strong>
                </span>
              )}
            </div>
          )}

          {/* Simulate Error Button */}
          <button
            className="btn-nav btn-sim-error"
            onClick={onSimulateError}
            title="Emit test background error to verify error listener"
          >
            ⚠️ Test Error Event
          </button>

          {/* Viva Guide Button */}
          <button
            className="btn-nav btn-viva"
            onClick={onOpenViva}
            title="Oral examination prep guide"
          >
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

