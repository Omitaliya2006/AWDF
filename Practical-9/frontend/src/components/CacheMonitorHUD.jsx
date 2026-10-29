import React from 'react';
import './CacheMonitorHUD.css';

export default function CacheMonitorHUD({
  stats,
  latestTelemetry,
  onFlushCache,
  onRefreshStats,
  isLoading
}) {
  const hits = stats?.hits || 0;
  const misses = stats?.misses || 0;
  const total = stats?.totalRequests || (hits + misses);
  const hitRate = stats?.hitRate || (total > 0 ? ((hits / total) * 100).toFixed(1) + '%' : '0.0%');
  const activeKeys = stats?.activeKeys || [];

  return (
    <section className="cache-hud">
      {/* Top Banner: Latest Call Telemetry */}
      <div className="telemetry-banner">
        <div className="banner-left">
          <span className="banner-label">Latest API Call Status:</span>
          {latestTelemetry ? (
            <span className={`status-pill ${latestTelemetry.cacheStatus.toLowerCase()}`}>
              {latestTelemetry.cacheStatus === 'HIT' && '⚡ CACHE HIT (RAM)'}
              {latestTelemetry.cacheStatus === 'MISS' && '🍃 CACHE MISS (DB Fetch & Cache Set)'}
              {latestTelemetry.cacheStatus === 'BYPASS' && '⚠️ CACHE BYPASSED (Direct DB)'}
              {latestTelemetry.cacheStatus === 'ERROR' && '❌ CALL FAILED'}
            </span>
          ) : (
            <span className="status-pill idle">IDLE (Awaiting Request)</span>
          )}
        </div>

        <div className="banner-right">
          <div className="latency-indicator">
            <span className="latency-label">Response Time:</span>
            <span className="latency-val">
              {latestTelemetry?.serverLatency || `${latestTelemetry?.clientLatencyMs || 0}ms`}
            </span>
          </div>

          <button
            className="btn-flush"
            onClick={onFlushCache}
            disabled={isLoading}
            title="Purge all cached keys from NodeCache"
          >
            🗑️ Flush Cache
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card hit-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-info">
            <span className="metric-title">Cache Hits</span>
            <span className="metric-value">{hits}</span>
            <span className="metric-sub">Served directly from RAM</span>
          </div>
        </div>

        <div className="metric-card miss-card">
          <div className="metric-icon">🔍</div>
          <div className="metric-info">
            <span className="metric-title">Cache Misses</span>
            <span className="metric-value">{misses}</span>
            <span className="metric-sub">Required MongoDB query</span>
          </div>
        </div>

        <div className="metric-card rate-card">
          <div className="metric-icon">📈</div>
          <div className="metric-info">
            <span className="metric-title">Hit Rate Ratio</span>
            <span className="metric-value">{hitRate}</span>
            <div className="metric-bar-bg">
              <div
                className="metric-bar-fill"
                style={{ width: `${Math.min(100, parseFloat(hitRate) || 0)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card keys-card">
          <div className="metric-icon">🗝️</div>
          <div className="metric-info">
            <span className="metric-title">Active In-Memory Keys</span>
            <span className="metric-value">{activeKeys.length}</span>
            <span className="metric-sub">TTL: {stats?.stdTTL || 60}s stdTTL</span>
          </div>
        </div>
      </div>

      {/* Active Keys & Invalidation Feed */}
      <div className="hud-details-grid">
        <div className="hud-panel keys-panel">
          <div className="panel-header">
            <h4>📦 Active Cache Keys in NodeCache</h4>
            <span className="keys-count-badge">{activeKeys.length} key(s)</span>
          </div>
          {activeKeys.length === 0 ? (
            <p className="empty-keys">Cache is currently empty. Perform a GET request to populate.</p>
          ) : (
            <div className="keys-chip-container">
              {activeKeys.map((key) => (
                <div key={key} className="key-chip">
                  <span className="chip-icon">🔑</span>
                  <span className="chip-name">{key}</span>
                  <span className="chip-ttl">~{stats?.stdTTL || 60}s</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hud-panel invalidation-panel">
          <div className="panel-header">
            <h4>🔄 Invalidation Logic Monitor</h4>
            <span className="inval-badge">Total Clears: {stats?.totalInvalidations || 0}</span>
          </div>
          <div className="invalidation-summary">
            <p className="inval-note">
              <strong>Rule:</strong> Any <code>POST</code>, <code>PUT</code>, or <code>DELETE</code> automatically triggers <code>cache.del('all_tasks')</code> to prevent stale data.
            </p>
            {stats?.lastInvalidation ? (
              <div className="last-inval-box">
                <span className="inval-time">
                  Last Invalidation: {new Date(stats.lastInvalidation.timestamp).toLocaleTimeString()}
                </span>
                <span className="inval-key">
                  Target Key: <code>{stats.lastInvalidation.key}</code>
                </span>
              </div>
            ) : (
              <p className="no-inval">No invalidations triggered since last server start.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
