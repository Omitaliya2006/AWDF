import React from 'react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component (Lab Step 3 Requirement & Supplementary Problem)
 * Renders on failed API calls without crashing the app, with an interactive retry button.
 *
 * @param {Object} props
 * @param {string} props.message - Error message from catch block or HTTP status
 * @param {Function} props.onRetry - Callback function to re-trigger the fetch request
 */
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container glass-card" role="alert">
      <div className="error-icon-box">
        <span className="error-icon">⚠️</span>
      </div>

      <div className="error-content">
        <div className="error-badge-row">
          <span className="error-badge">Network Error State</span>
          <span className="state-pill" style={{ borderColor: '#f43f5e', color: '#f43f5e', background: 'rgba(244, 63, 94, 0.12)' }}>
            State: error !== null
          </span>
        </div>

        <h3 className="error-title">Failed to Fetch GitHub Repositories</h3>
        <p className="error-description">
          An asynchronous error occurred while consuming the GitHub REST API:
        </p>

        <div className="error-code-box">
          <code>{message || 'Unknown network error. The endpoint could not be reached or rate limit was exceeded.'}</code>
        </div>

        <div className="error-actions">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn btn-primary retry-btn"
            >
              <span>🔄 Retry API Request</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
