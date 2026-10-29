import React, { useState } from 'react';
import './HeavyChart.css';

/**
 * Heavy Chart Component (Supplementary Problem)
 * Simulates a complex, heavy data visualization library loaded on-demand.
 *
 * Student: Om Italiya (24IT029) - CSPIT CHARUSAT
 */
export default function HeavyChart() {
  const [metric, setMetric] = useState('bundle'); // 'bundle' | 'latency' | 'memory'

  const bundleData = [
    { label: 'Initial Entry (index.js)', size: '138 KB', pct: 38, color: '#6366f1' },
    { label: 'Analytics.chunk.js', size: '78 KB', pct: 22, color: '#a855f7' },
    { label: 'Projects.chunk.js', size: '64 KB', pct: 18, color: '#3b82f6' },
    { label: 'Contact.chunk.js', size: '42 KB', pct: 12, color: '#10b981' },
    { label: 'Home.chunk.js', size: '36 KB', pct: 10, color: '#f59e0b' }
  ];

  const latencyData = [
    { label: 'Before: Monolithic Bundle (Slow 3G)', time: '2850 ms', value: 95, color: '#ef4444' },
    { label: 'After: Initial Lazy Load (Slow 3G)', time: '820 ms', value: 28, color: '#10b981' },
    { label: 'Before: Monolithic Bundle (Fast 3G)', time: '1150 ms', value: 65, color: '#f59e0b' },
    { label: 'After: Initial Lazy Load (Fast 3G)', time: '340 ms', value: 19, color: '#06b6d4' }
  ];

  return (
    <div className="heavy-chart-card">
      <div className="heavy-chart-header">
        <div className="chart-title-box">
          <span className="chart-badge">DYNAMIC HEAVY COMPONENT</span>
          <h3>Interactive Bundle & Profiling Visualizer</h3>
        </div>
        <div className="chart-switch-tabs">
          <button
            className={`chart-tab ${metric === 'bundle' ? 'chart-tab-active' : ''}`}
            onClick={() => setMetric('bundle')}
          >
            📦 Chunk Sizes
          </button>
          <button
            className={`chart-tab ${metric === 'latency' ? 'chart-tab-active' : ''}`}
            onClick={() => setMetric('latency')}
          >
            ⏱ Load Latency
          </button>
        </div>
      </div>

      <div className="chart-body">
        {metric === 'bundle' ? (
          <div className="bundle-bars-container">
            <p className="chart-desc">
              Code-splitting separates the monolithic bundle into independent route chunks loaded on demand:
            </p>
            <div className="bars-list">
              {bundleData.map((item, idx) => (
                <div key={idx} className="bar-row">
                  <div className="bar-info">
                    <span className="bar-label">{item.label}</span>
                    <span className="bar-size">{item.size} ({item.pct}%)</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-callout">
              💡 <strong>Net Gain:</strong> First-time visitors download only <strong>138 KB</strong> instead of <strong>358 KB</strong> upfront!
            </div>
          </div>
        ) : (
          <div className="latency-bars-container">
            <p className="chart-desc">
              Time to Interactive (TTI) comparison under simulated network throttling:
            </p>
            <div className="bars-list">
              {latencyData.map((item, idx) => (
                <div key={idx} className="bar-row">
                  <div className="bar-info">
                    <span className="bar-label">{item.label}</span>
                    <span className="bar-size" style={{ color: item.color }}>{item.time}</span>
                  </div>
                  <div className="bar-track">
                    <div
                      className="bar-fill"
                      style={{ width: `${item.value}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="chart-callout">
              🚀 <strong>~71% faster</strong> initial rendering on bandwidth-constrained mobile networks.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
