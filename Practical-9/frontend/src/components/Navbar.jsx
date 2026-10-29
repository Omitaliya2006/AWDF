import React from 'react';
import './Navbar.css';

export default function Navbar({
  bypassCache,
  onToggleBypass,
  onOpenBenchmark,
  onOpenViva,
  cacheStats
}) {
  return (
    <header className="app-navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">⚡</div>
          <div className="brand-text">
            <span className="brand-tag">AWDF • Practical 9</span>
            <h1 className="brand-title">In-Memory Caching & Query Optimization</h1>
          </div>
        </div>

        <div className="nav-controls">
          {/* Cache Bypass Toggle */}
          <div className={`cache-toggle-wrapper ${bypassCache ? 'bypassed' : 'cached'}`}>
            <label className="switch-label" title="Toggle between reading from node-cache vs directly querying MongoDB">
              <span className="switch-text">
                {bypassCache ? '⚡ Bypass Cache (Direct DB)' : '🛡️ Cache Enabled (node-cache)'}
              </span>
              <input
                type="checkbox"
                checked={bypassCache}
                onChange={(e) => onToggleBypass(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          {/* Hit Rate Pill */}
          {cacheStats && (
            <div className="hitrate-badge" title="Live cache hit ratio">
              <span className="dot"></span>
              <span>Hit Rate: <strong>{cacheStats.hitRate || '0.00%'}</strong></span>
            </div>
          )}

          {/* Benchmark Button */}
          <button className="btn-nav btn-benchmark" onClick={onOpenBenchmark} title="Run automated empirical latency comparison">
            📊 Benchmark
          </button>

          {/* Viva Guide Button */}
          <button className="btn-nav btn-viva" onClick={onOpenViva} title="Oral examination prep guide">
            🎓 Viva Prep
          </button>

          {/* Student Attribution */}
          <div className="student-badge">
            <span className="student-name">Om Italiya</span>
            <span className="student-id">24IT029</span>
          </div>
        </div>
      </div>
    </header>
  );
}
