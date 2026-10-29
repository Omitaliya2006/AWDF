import React from 'react';
import './PageLoader.css';

export default function PageLoader({ routeName = 'Route' }) {
  return (
    <div className="page-loader-container" role="status" aria-live="polite">
      <div className="loader-card">
        <div className="loader-spinner-wrapper">
          <div className="loader-spinner"></div>
          <span className="loader-icon-center">⚡</span>
        </div>

        <div className="loader-text-group">
          <h3 className="loader-title">Loading {routeName} Chunk</h3>
          <p className="loader-subtitle">
            <code>React.lazy()</code> & <code>&lt;Suspense&gt;</code> is downloading code-split JavaScript on demand...
          </p>
        </div>

        <div className="loader-progress-track">
          <div className="loader-progress-bar"></div>
        </div>

        {/* Skeleton UI preview to prevent layout shift */}
        <div className="loader-skeleton-preview">
          <div className="skeleton-bar skeleton-title"></div>
          <div className="skeleton-bar skeleton-text"></div>
          <div className="skeleton-bar skeleton-text short"></div>
          <div className="skeleton-grid">
            <div className="skeleton-box"></div>
            <div className="skeleton-box"></div>
          </div>
        </div>

        <span className="loader-tag">Practical 8 • Fallback UI Active</span>
      </div>
    </div>
  );
}
