import React from 'react';
import './ApiStateWidget.css';

/**
 * ApiStateWidget Component (Lab Step 3 & 4 Demonstration)
 * Real-time HUD showing the 3 asynchronous lifecycle states:
 * - loading (boolean)
 * - error (string | null)
 * - data (count & response metadata)
 *
 * @param {Object} props
 * @param {boolean} props.loading - Fetch loading state
 * @param {string|null} props.error - Fetch error message or null
 * @param {number} props.dataCount - Number of items fetched
 * @param {number} props.latency - Fetch duration in milliseconds
 * @param {string} props.endpoint - Active API endpoint URL
 * @param {number} props.statusCode - HTTP response status code
 */
function ApiStateWidget({ loading, error, dataCount = 0, latency = 0, endpoint = '', statusCode = 200 }) {
  let statusBadgeClass = 'badge-success';
  let statusText = `${statusCode} OK`;

  if (loading) {
    statusBadgeClass = 'badge-loading';
    statusText = 'In-Flight...';
  } else if (error) {
    statusBadgeClass = 'badge-error';
    statusText = statusCode ? `${statusCode} Error` : 'Network Failed';
  }

  return (
    <div className="api-state-widget glass-card">
      <div className="widget-header">
        <span className="widget-title">
          <span className="widget-pulse-dot" style={{ backgroundColor: loading ? '#f59e0b' : error ? '#f43f5e' : '#10b981' }} />
          Async State Monitor
        </span>
        <span className={`api-status-badge ${statusBadgeClass}`}>
          {statusText}
        </span>
      </div>

      <div className="widget-grid">
        <div className="widget-stat">
          <span className="widget-stat-label">State: loading</span>
          <span className={`widget-stat-value ${loading ? 'val-true' : 'val-false'}`}>
            {loading ? 'true' : 'false'}
          </span>
        </div>

        <div className="widget-stat">
          <span className="widget-stat-label">State: error</span>
          <span className={`widget-stat-value ${error ? 'val-error' : 'val-null'}`}>
            {error ? 'Active' : 'null'}
          </span>
        </div>

        <div className="widget-stat">
          <span className="widget-stat-label">State: repos</span>
          <span className="widget-stat-value val-data">
            {dataCount} items
          </span>
        </div>

        <div className="widget-stat">
          <span className="widget-stat-label">Latency</span>
          <span className="widget-stat-value val-time">
            {latency > 0 ? `${latency}ms` : '—'}
          </span>
        </div>
      </div>

      {endpoint && (
        <div className="widget-endpoint-row">
          <span className="endpoint-method">GET</span>
          <code className="endpoint-url" title={endpoint}>{endpoint}</code>
        </div>
      )}
    </div>
  );
}

export default ApiStateWidget;
