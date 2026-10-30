import React, { useState } from 'react';
import './EventMonitorHUD.css';

export default function EventMonitorHUD({
  eventLogs,
  eventStats,
  currentDelay,
  onUpdateDelay,
  onClearLogs,
  onRefreshLogs
}) {
  const [sliderVal, setSliderVal] = useState(currentDelay || 1500);

  const handleSliderChange = (val) => {
    setSliderVal(val);
    onUpdateDelay(val);
  };

  const latestEvent = eventLogs && eventLogs.length > 0 ? eventLogs[0] : null;

  return (
    <section className="event-hud">
      {/* Top Banner: Timestamp Ordering Evidence */}
      <div className="hud-banner">
        <div className="banner-evidence-card">
          <div className="evidence-header">
            <span className="evidence-badge">🔬 Empirical Non-Blocking Proof</span>
            <h4>API Response vs Background Listener Timestamps</h4>
          </div>

          {latestEvent ? (
            <div className="timeline-flow">
              <div className="timeline-point api-point">
                <span className="point-icon">⚡</span>
                <div className="point-info">
                  <span className="point-tag">1. HTTP API Response Sent (Instant)</span>
                  <span className="point-time">
                    {latestEvent.apiResponseAt ? new Date(latestEvent.apiResponseAt).toLocaleTimeString() + `.${new Date(latestEvent.apiResponseAt).getMilliseconds()}ms` : 'N/A'}
                  </span>
                  <span className="point-status">HTTP 201 Created Returned</span>
                </div>
              </div>

              <div className="timeline-arrow-connector">
                <span className="arrow-line"></span>
                <span className="arrow-delta">
                  {latestEvent.durationMs !== null ? `+${latestEvent.durationMs}ms non-blocking gap` : '⏳ processing in background...'}
                </span>
                <span className="arrow-line"></span>
              </div>

              <div className={`timeline-point listener-point ${latestEvent.status}`}>
                <span className="point-icon">
                  {latestEvent.status === 'completed' ? '✅' : latestEvent.status === 'failed' ? '❌' : '⏳'}
                </span>
                <div className="point-info">
                  <span className="point-tag">2. Background Listener Finished</span>
                  <span className="point-time">
                    {latestEvent.handlerCompletedAt
                      ? new Date(latestEvent.handlerCompletedAt).toLocaleTimeString() + `.${new Date(latestEvent.handlerCompletedAt).getMilliseconds()}ms`
                      : 'Processing asynchronously...'}
                  </span>
                  <span className="point-status">
                    {latestEvent.status === 'completed'
                      ? 'Notification logged without blocking request'
                      : latestEvent.status === 'failed'
                      ? 'Error caught by error listener'
                      : 'Task in Node.js event loop'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="timeline-empty">
              <p>Create or delete a task to trigger background events and generate live timestamp comparison.</p>
            </div>
          )}
        </div>

        {/* Delay Controller & Actions */}
        <div className="delay-controller-card">
          <div className="delay-header">
            <h4>⏱️ Background Delay Simulator</h4>
            <span className="delay-value-badge">{sliderVal} ms</span>
          </div>
          <p className="delay-desc">
            Controls artificial delay inside <code>taskListeners.js</code> (via <code>setTimeout</code>) to visibly exhibit the asynchronous non-blocking event loop behavior.
          </p>

          <div className="slider-wrapper">
            <input
              type="range"
              min="0"
              max="3000"
              step="250"
              value={sliderVal}
              onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
              className="delay-slider"
            />
            <div className="slider-ticks">
              <span>0ms (Immediate)</span>
              <span>1500ms (Default)</span>
              <span>3000ms (Heavy Job)</span>
            </div>
          </div>

          <div className="hud-actions">
            <button className="btn-hud refresh" onClick={onRefreshLogs} title="Refresh background logs">
              🔄 Refresh Stream
            </button>
            <button className="btn-hud clear" onClick={onClearLogs} title="Clear event stream">
              🗑️ Clear Logs
            </button>
          </div>
        </div>
      </div>

      {/* Live Background Event Stream */}
      <div className="event-stream-container">
        <div className="stream-header">
          <div className="stream-title-group">
            <h3>📢 Live Asynchronous Notification & Audit Stream</h3>
            <span className="stream-count-badge">{eventLogs.length} Events Logged</span>
          </div>
          <span className="event-loop-tag">Node.js EventEmitter • Non-Blocking</span>
        </div>

        {eventLogs.length === 0 ? (
          <div className="empty-stream">
            <p>No background events recorded yet. Create or delete a task to dispatch an event!</p>
          </div>
        ) : (
          <div className="event-cards-list">
            {eventLogs.map((log) => (
              <div key={log.id} className={`event-log-card ${log.event} ${log.status}`}>
                <div className="log-card-left">
                  <span className="log-icon">
                    {log.event === 'task-created' && '✨'}
                    {log.event === 'task-deleted' && '🗑️'}
                    {log.event === 'task-updated' && '✏️'}
                    {log.event === 'error' && '⚠️'}
                  </span>
                  <div className="log-main-info">
                    <div className="log-top-row">
                      <span className={`event-badge ${log.event}`}>{log.event}</span>
                      <span className={`status-badge ${log.status}`}>
                        {log.status === 'completed' && '✅ Completed'}
                        {log.status === 'processing' && '⏳ Processing'}
                        {log.status === 'failed' && '❌ Failed'}
                      </span>
                      <span className="log-task-title">"{log.taskTitle}"</span>
                    </div>
                    <p className="log-msg-text">{log.logMessage}</p>
                  </div>
                </div>

                <div className="log-card-right">
                  <div className="log-timing-strip">
                    <span className="timing-label">API Responded:</span>
                    <span className="timing-val">
                      {log.apiResponseAt ? new Date(log.apiResponseAt).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                  <div className="log-timing-strip">
                    <span className="timing-label">Listener Done:</span>
                    <span className="timing-val">
                      {log.handlerCompletedAt ? new Date(log.handlerCompletedAt).toLocaleTimeString() : 'In Progress...'}
                    </span>
                  </div>
                  {log.durationMs !== null && (
                    <span className="delta-pill">⏱️ +{log.durationMs}ms</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

