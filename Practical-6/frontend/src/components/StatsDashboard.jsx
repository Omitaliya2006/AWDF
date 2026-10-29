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
      {/* 1. Total Tasks */}
      <div
        className={`stat-card ${activeFilter.status === 'all' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('status', 'all')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">Total Tasks</span>
          <span className="stat-icon-wrapper stat-total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </span>
        </div>
        <div className="stat-value">{total}</div>
        <div className="stat-subtext">MongoDB Collection Documents</div>
      </div>

      {/* 2. Completed Tasks */}
      <div
        className={`stat-card ${activeFilter.status === 'completed' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('status', 'completed')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">Completed</span>
          <span className="stat-icon-wrapper stat-completed">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div className="stat-value">{completed}</div>
        <div className="stat-progress-bar">
          <div
            className="stat-progress-fill"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
        <div className="stat-subtext">{completionRate}% Completion Rate</div>
      </div>

      {/* 3. Pending Tasks */}
      <div
        className={`stat-card ${activeFilter.status === 'pending' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('status', 'pending')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">In Progress</span>
          <span className="stat-icon-wrapper stat-pending">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </span>
        </div>
        <div className="stat-value">{pending}</div>
        <div className="stat-subtext">Pending Actions</div>
      </div>

      {/* 4. High Priority Alerts */}
      <div
        className={`stat-card ${activeFilter.priority === 'high' ? 'stat-card-active' : ''}`}
        onClick={() => onSelectFilter('priority', activeFilter.priority === 'high' ? 'all' : 'high')}
        role="button"
        tabIndex={0}
      >
        <div className="stat-header">
          <span className="stat-title">High Priority</span>
          <span className="stat-icon-wrapper stat-urgent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
        </div>
        <div className="stat-value">{highPriority}</div>
        <div className="stat-subtext">Urgent Pending Tasks</div>
      </div>
    </section>
  );
}

