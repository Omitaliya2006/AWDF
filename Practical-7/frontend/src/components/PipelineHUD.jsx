import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './PipelineHUD.css';

export default function PipelineHUD({ isOpen, onClose, backendStatus, user }) {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const token = api.getToken();
  let decodedToken = null;
  let isExpired = false;
  let expiresInText = 'No token';

  if (token) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadJson = atob(parts[1]);
        decodedToken = JSON.parse(payloadJson);
        const expTime = decodedToken.exp * 1000;
        const now = Date.now();
        if (now > expTime) {
          isExpired = true;
          expiresInText = 'Expired';
        } else {
          const minutesLeft = Math.round((expTime - now) / 60000);
          expiresInText = `${minutesLeft} min remaining`;
        }
      }
    } catch {
      // Ignored if invalid token format
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadLogs();
    }
  }, [isOpen]);

  const loadLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const serverLogs = await api.getLogs();
      setLogs(serverLogs);
    } catch {
      // Ignored
    } finally {
      setIsLoadingLogs(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="hud-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="hud-header">
          <div className="hud-brand">
            <span className="hud-badge">MIDDLEWARE PIPELINE HUD</span>
            <h2>Authentication & Pipeline Inspector</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close HUD">
            &times;
          </button>
        </div>

        {/* Tab switcher */}
        <div className="hud-tabs">
          <button
            className={`hud-tab ${activeTab === 'pipeline' ? 'hud-tab-active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            ⚡ Express Pipeline
          </button>
          <button
            className={`hud-tab ${activeTab === 'jwt' ? 'hud-tab-active' : ''}`}
            onClick={() => setActiveTab('jwt')}
          >
            🔑 JWT Token Inspector
          </button>
          <button
            className={`hud-tab ${activeTab === 'logs' ? 'hud-tab-active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📡 Live Request Logs ({logs.length})
          </button>
        </div>

        <div className="hud-body">
          {activeTab === 'pipeline' && (
            <div className="pipeline-flow-container">
              <p className="flow-intro">
                Sequential execution order of middleware in <code>server.js</code> for every incoming request:
              </p>

              <div className="pipeline-steps">
                {/* 1. CORS */}
                <div className="pipeline-node node-global">
                  <div className="node-num">1</div>
                  <div className="node-info">
                    <h4>CORS Middleware</h4>
                    <p>Allows origin <code>http://localhost:5173</code>, sets <code>Access-Control-Allow-Origin: *</code>.</p>
                  </div>
                  <span className="node-tag">Global</span>
                </div>

                <div className="pipeline-connector">↓ next()</div>

                {/* 2. Logger */}
                <div className="pipeline-node node-global">
                  <div className="node-num">2</div>
                  <div className="node-info">
                    <h4>Request Logger</h4>
                    <p>Captures Method, URL, Timestamp, and measures execution latency in ms.</p>
                  </div>
                  <span className="node-tag">Global</span>
                </div>

                <div className="pipeline-connector">↓ next()</div>

                {/* 3. Body Parser */}
                <div className="pipeline-node node-global">
                  <div className="node-num">3</div>
                  <div className="node-info">
                    <h4>Body Parser</h4>
                    <p>Parses JSON bodies (<code>express.json()</code>) and urlencoded payloads.</p>
                  </div>
                  <span className="node-tag">Global</span>
                </div>

                <div className="pipeline-connector">↓ next()</div>

                {/* 4. Auth Middleware */}
                <div className="pipeline-node node-auth">
                  <div className="node-num">4</div>
                  <div className="node-info">
                    <h4>JWT Auth Middleware (Protected Routes)</h4>
                    <p>Extracts <code>Authorization: Bearer &lt;token&gt;</code>, verifies with <code>jwt.verify()</code>, sets <code>req.user</code>. Returns HTTP 401 if missing/invalid/expired.</p>
                  </div>
                  <span className="node-tag tag-auth">Auth Layer</span>
                </div>

                <div className="pipeline-connector">↓ next()</div>

                {/* 5. Validation Middleware */}
                <div className="pipeline-node node-validation">
                  <div className="node-num">5</div>
                  <div className="node-info">
                    <h4>Input Validation Middleware</h4>
                    <p>Enforces at least 3 rules: email format regex, password length &ge; 6, title &ge; 2 chars, priority enum. Returns HTTP 400 if invalid.</p>
                  </div>
                  <span className="node-tag tag-val">Validation</span>
                </div>

                <div className="pipeline-connector">↓ next()</div>

                {/* 6. Controller */}
                <div className="pipeline-node node-controller">
                  <div className="node-num">6</div>
                  <div className="node-info">
                    <h4>Route Controllers (MongoDB / Mongoose)</h4>
                    <p>Executes database operations scoped to authenticated user ID: <code>Task.find(&#123; user: req.user.id &#125;)</code>.</p>
                  </div>
                  <span className="node-tag tag-db">Controller</span>
                </div>

                <div className="pipeline-connector">↓ Error / Unhandled</div>

                {/* 7. Centralized Error Handler */}
                <div className="pipeline-node node-error">
                  <div className="node-num">7</div>
                  <div className="node-info">
                    <h4>Centralized Error Handler (4 Parameters)</h4>
                    <p>Transforms Mongoose errors, CastErrors, and JWT exceptions into consistent JSON without leaking stack traces.</p>
                  </div>
                  <span className="node-tag tag-err">Last in Pipeline</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jwt' && (
            <div className="jwt-container">
              {token ? (
                <>
                  <div className="jwt-status-card">
                    <div className="jwt-status-header">
                      <span className="jwt-label">Active JWT Session</span>
                      <span className={`jwt-pill ${isExpired ? 'jwt-pill-expired' : 'jwt-pill-valid'}`}>
                        {isExpired ? 'Token Expired' : 'Valid Signature'}
                      </span>
                    </div>
                    <div className="jwt-timer">
                      ⏱ Expiry Status: <strong>{expiresInText}</strong>
                    </div>
                  </div>

                  <div className="jwt-parts-grid">
                    <div className="jwt-box">
                      <span className="jwt-box-title">Decoded Payload</span>
                      <pre className="jwt-code">{JSON.stringify(decodedToken, null, 2)}</pre>
                    </div>

                    <div className="jwt-box">
                      <span className="jwt-box-title">Raw Bearer Token</span>
                      <div className="jwt-raw-preview">{token}</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-token-card">
                  <div className="no-token-icon">🔒</div>
                  <h3>No JWT Token Present</h3>
                  <p>You are currently logged out or browsing anonymously. Sign in or register to generate a signed JWT token.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-container">
              <div className="logs-toolbar">
                <span className="logs-count">Recent Requests ({logs.length})</span>
                <button className="refresh-logs-btn" onClick={loadLogs} disabled={isLoadingLogs}>
                  {isLoadingLogs ? 'Refreshing...' : '🔄 Refresh Logs'}
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="no-logs">No request logs recorded yet.</div>
              ) : (
                <div className="logs-list">
                  {logs.slice(0, 25).map((log) => (
                    <div key={log.id} className="log-row">
                      <span className={`log-method method-${log.method.toLowerCase()}`}>{log.method}</span>
                      <span className="log-url">{log.url}</span>
                      <span className={`log-code code-${Math.floor(log.statusCode / 100)}xx`}>{log.statusCode}</span>
                      <span className="log-user" title="Request User">{log.user || 'Anon'}</span>
                      <span className="log-duration">{log.duration}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
