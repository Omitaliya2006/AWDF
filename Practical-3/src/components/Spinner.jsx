import React from 'react';
import './Spinner.css';

/**
 * Spinner Component (Lab Step 3 Requirement & Rubric)
 * Displays a modern, animated loading spinner while asynchronous data fetching is in progress.
 *
 * @param {Object} props
 * @param {string} props.message - Optional custom loading status message
 */
function Spinner({ message = 'Fetching public repositories from GitHub REST API...' }) {
  return (
    <div className="spinner-container glass-card" role="status" aria-live="polite">
      <div className="spinner-ring">
        <div className="spinner-glow" />
        <div className="spinner-inner" />
      </div>
      <div className="spinner-text-group">
        <h3 className="spinner-title">Loading Asynchronous Data</h3>
        <p className="spinner-desc">{message}</p>
        <span className="state-pill">
          <span className="live-dot" />
          State: loading === true
        </span>
      </div>
    </div>
  );
}

export default Spinner;
