import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FullStackMonitor.css';

export default function FullStackMonitor({ isOpen, onClose, backendStatus }) {
  const [logs, setLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [activeTab, setActiveTab] = useState('architecture');

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
      // Ignored if server offline
    } finally {
      setIsLoadingLogs(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="monitor-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="monitor-header">
          <div className="monitor-title-wrapper">
            <span className="monitor-badge">SYSTEM HUD</span>
            <h2>Full-Stack Network Architecture & Monitor</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close monitor">
            &times;
          </button>
        </div>

        {/* Tab switcher */}
        <div className="monitor-tabs">
          <button
            className={`tab-btn ${activeTab === 'architecture' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('architecture')}
          >
            📐 3-Tier Architecture
          </button>
          <button
            className={`tab-btn ${activeTab === 'logs' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📡 Live Server Logs ({logs.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'schema' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('schema')}
          >
            🍃 Mongoose Schema
          </button>
        </div>

        <div className="monitor-body">
          {activeTab === 'architecture' && (
            <div className="arch-container">
              <div className="arch-flow">
                {/* Tier 1: React Frontend */}
                <div className="arch-tier tier-frontend">
                  <div className="tier-icon">⚛️</div>
                  <div className="tier-header">
                    <h4>React 19 SPA</h4>
                    <span className="tier-port">:5173 (Vite)</span>
                  </div>
                  <div className="tier-status status-good">Active Client</div>
                  <ul className="tier-specs">
                    <li>Unidirectional Data Flow</li>
                    <li>State & Lifecycle Hooks</li>
                    <li>Asynchronous fetch() Service</li>
                  </ul>
                </div>

                <div className="arch-arrow">
                  <span className="arrow-label">CORS REST API</span>
                  <div className="arrow-line"></div>
                </div>

                {/* Tier 2: Express Backend */}
                <div className="arch-tier tier-backend">
                  <div className="tier-icon">⚡</div>
                  <div className="tier-header">
                    <h4>Express.js Server</h4>
                    <span className="tier-port">:5000 (Node.js)</span>
                  </div>
                  <div className={`tier-status ${backendStatus?.status === 'healthy' ? 'status-good' : 'status-bad'}`}>
                    {backendStatus?.status === 'healthy' ? 'API Online' : 'API Offline'}
                  </div>
                  <ul className="tier-specs">
                    <li>Logger & CORS Pipeline</li>
                    <li>REST CRUD Handlers</li>
                    <li>Centralized Error Handling</li>
                  </ul>
                </div>

                <div className="arch-arrow">
                  <span className="arrow-label">Mongoose ODM</span>
                  <div className="arrow-line"></div>
                </div>

                {/* Tier 3: MongoDB */}
                <div className="arch-tier tier-db">
                  <div className="tier-icon">🍃</div>
                  <div className="tier-header">
                    <h4>MongoDB Server</h4>
                    <span className="tier-port">:27017</span>
                  </div>
                  <div className={`tier-status ${backendStatus?.database?.status === 'connected' ? 'status-good' : 'status-bad'}`}>
                    {backendStatus?.database?.status || 'Connecting'}
                  </div>
                  <ul className="tier-specs">
                    <li>Database: awdf_fullstack_24it029</li>
                    <li>Collection: tasks</li>
                    <li>Schema Validation & Pre-Hooks</li>
                  </ul>
                </div>
              </div>

              {/* Student Metadata Box */}
              <div className="student-metadata-box">
                <div className="meta-item">
                  <span className="meta-label">Student:</span>
                  <span className="meta-value">Om Italiya (24IT029)</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">College:</span>
                  <span className="meta-value">CSPIT - CHARUSAT</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Course:</span>
                  <span className="meta-value">AWDF (Practical 6)</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">API Base:</span>
                  <span className="meta-value mono">{api.getBaseUrl()}</span>
                </div>
              </div>
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
                <div className="no-logs">No request logs recorded yet. Interact with the UI to generate requests.</div>
              ) : (
                <div className="logs-list">
                  {logs.slice(0, 25).map((log) => (
                    <div key={log.id} className="log-row">
                      <span className={`log-method method-${log.method.toLowerCase()}`}>{log.method}</span>
                      <span className="log-url">{log.url}</span>
                      <span className={`log-code code-${Math.floor(log.statusCode / 100)}xx`}>{log.statusCode}</span>
                      <span className="log-duration">{log.duration}</span>
                      <span className="log-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="schema-container">
              <table className="schema-table">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>Constraints</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>title</code></td>
                    <td><code>String</code></td>
                    <td><code>required: true, minlength: 2, trim: true</code></td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td><code>description</code></td>
                    <td><code>String</code></td>
                    <td><code>trim: true, maxlength: 500</code></td>
                    <td><code>""</code></td>
                  </tr>
                  <tr>
                    <td><code>completed</code></td>
                    <td><code>Boolean</code></td>
                    <td>Primitive boolean</td>
                    <td><code>false</code></td>
                  </tr>
                  <tr>
                    <td><code>priority</code></td>
                    <td><code>String</code></td>
                    <td><code>enum: ['low', 'medium', 'high']</code></td>
                    <td><code>'medium'</code></td>
                  </tr>
                  <tr>
                    <td><code>createdAt</code></td>
                    <td><code>Date</code></td>
                    <td>Timestamp</td>
                    <td><code>Date.now</code></td>
                  </tr>
                  <tr>
                    <td><code>updatedAt</code></td>
                    <td><code>Date</code></td>
                    <td>Pre-save hook refreshed</td>
                    <td><code>Date.now</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

