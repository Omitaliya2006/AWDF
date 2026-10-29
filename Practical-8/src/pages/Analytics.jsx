import React from 'react';
import HeavyChart from '../components/HeavyChart';
import './Analytics.css';

export default function Analytics() {
  return (
    <div className="analytics-page-container">
      <div className="chunk-notice-banner-heavy">
        <span className="notice-icon">📊</span>
        <div className="notice-text">
          <strong>Heavy Chunk Loaded:</strong> This data-dense route and visualization bundle was loaded on demand as <code>Analytics.chunk.js</code>!
        </div>
      </div>

      <div className="analytics-header">
        <h2>Performance & Bundle Analytics</h2>
        <p>Live benchmarks, chunk size distribution, and Time to Interactive (TTI) measurements.</p>
      </div>

      {/* Embedded Heavy Visualization */}
      <HeavyChart />

      <div className="metrics-summary-cards">
        <div className="metric-box">
          <span className="box-title">Bundle Strategy</span>
          <span className="box-val text-green">Code-Split (Lazy)</span>
          <p className="box-desc">Dynamic <code>import()</code> via Vite Rollup compiler.</p>
        </div>

        <div className="metric-box">
          <span className="box-title">Initial Download</span>
          <span className="box-val text-indigo">138 KB</span>
          <p className="box-desc">Core React runtime + navigation shell.</p>
        </div>

        <div className="metric-box">
          <span className="box-title">Deferred Chunks</span>
          <span className="box-val text-purple">220 KB</span>
          <p className="box-desc">Loaded only upon user route navigation.</p>
        </div>
      </div>
    </div>
  );
}
