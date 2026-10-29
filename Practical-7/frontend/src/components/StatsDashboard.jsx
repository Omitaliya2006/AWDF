import React from 'react';
import './StatsDashboard.css';

export default function StatsDashboard({ tasks, activeFilter, onSelectFilter }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === 'high' && !t.completed).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="stats-grid">
      <div
        className={`stat-card ${activeFilter.status === 'all' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('status', 'all')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">My Tasks</span>
          <span className="stat-icon-wrapper stat-total">📋</span>
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-subtext">Scoped to Authenticated User</div>
      </div>

      <div
        className={`stat-card ${activeFilter.status === 'completed' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('status', 'completed')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">Completed</span>
          <span className="stat-icon-wrapper stat-completed">✓</span>
        </div>
        <div className="stat-value">{completed}</div>
        <div className="stat-progress-bar">
          <div className="stat-progress-fill" style={{ width: `${completionRate}%` }}></div>
        </div>
        <div className="stat-subtext">{completionRate}% Completion Rate</div>
      </div>

      <div
        className={`stat-card ${activeFilter.status === 'pending' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('status', 'pending')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">Pending</span>
          <span className="stat-icon-wrapper stat-pending">⏳</span>
        </div>
        <div className="stat-value">{pending}</div>
        <div className="stat-subtext">Awaiting Completion</div>
      </div>

      <div
        className={`stat-card ${activeFilter.priority === 'high' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('priority', activeFilter.priority === 'high' ? 'all' : 'high')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">High Priority</span>
          <span className="stat-icon-wrapper stat-urgent">⚡</span>
        </div>
        <div className="stat-value">{highPriority}</div>
        <div className="stat-subtext">Urgent Focus Tasks</div>
      </div>
    </section>
  );
}
