import React from 'react';
import './ContainerTopologyHUD.css';

export default function ContainerTopologyHUD({ containerInfo, taskCount, onRefreshInfo }) {
  const container = containerInfo?.container || {};
  const network = containerInfo?.network || {};

  return (
    <section className="topology-hud">
      {/* Top Banner: Orchestration Control Bar */}
      <div className="topology-header">
        <div className="header-left">
          <div className="docker-badge">
            <span className="docker-icon">🐳</span>
            <span>Docker Compose Orchestration</span>
          </div>
          <span className="network-pill">
            Network: <strong>app-network (bridge)</strong>
          </span>
          <span className="volume-pill">
            Volume: <strong>mongo-data (named)</strong>
          </span>
        </div>

        <div className="header-right">
          <div className="compose-command-badge" title="Single command to start entire stack">
            <span className="cmd-prefix">$</span>
            <code>docker-compose up --build</code>
          </div>
          <button className="btn-refresh-info" onClick={onRefreshInfo} title="Poll container telemetry">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* 3-Tier Multi-Container Topology Visualization */}
      <div className="containers-grid">
        {/* Container 1: Frontend */}
        <div className="service-card frontend-service">
          <div className="service-top">
            <span className="service-icon">⚛️</span>
            <div className="service-meta">
              <span className="service-type">Client Service</span>
              <h4 className="service-name">frontend</h4>
            </div>
            <span className="status-indicator live">RUNNING</span>
          </div>

          <div className="service-details">
            <div className="detail-row">
              <span className="label">Host Port:</span>
              <span className="val highlight">5173:5173</span>
            </div>
            <div className="detail-row">
              <span className="label">Base Image:</span>
              <span className="val">node:18-alpine</span>
            </div>
            <div className="detail-row">
              <span className="label">Build Mode:</span>
              <span className="val badge-stage">Multi-Stage Build</span>
            </div>
            <div className="detail-row">
              <span className="label">Upstream Dep:</span>
              <span className="val">depends_on: backend</span>
            </div>
          </div>
        </div>

        {/* Network Connector 1 */}
        <div className="network-pipe">
          <div className="pipe-line"></div>
          <span className="pipe-label">Proxy / API</span>
          <div className="pipe-arrow">➔</div>
        </div>

        {/* Container 2: Backend */}
        <div className="service-card backend-service">
          <div className="service-top">
            <span className="service-icon">🟢</span>
            <div className="service-meta">
              <span className="service-type">API Service</span>
              <h4 className="service-name">backend</h4>
            </div>
            <span className="status-indicator live">RUNNING</span>
          </div>

          <div className="service-details">
            <div className="detail-row">
              <span className="label">Host Port:</span>
              <span className="val highlight">5000:5000</span>
            </div>
            <div className="detail-row">
              <span className="label">Container Host:</span>
              <span className="val mono">{container.hostname || 'container_id'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Node Version:</span>
              <span className="val">{container.nodeVersion || 'v18.x'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Inter-Container URI:</span>
              <span className="val uri-val">mongodb://mongodb:27017</span>
            </div>
          </div>
        </div>

        {/* Network Connector 2 */}
        <div className="network-pipe">
          <div className="pipe-line"></div>
          <span className="pipe-label">WiredTiger TCP</span>
          <div className="pipe-arrow">➔</div>
        </div>

        {/* Container 3: MongoDB */}
        <div className="service-card db-service">
          <div className="service-top">
            <span className="service-icon">🍃</span>
            <div className="service-meta">
              <span className="service-type">Database Service</span>
              <h4 className="service-name">mongodb</h4>
            </div>
            <span className="status-indicator live">HEALTHY</span>
          </div>

          <div className="service-details">
            <div className="detail-row">
              <span className="label">Host Port:</span>
              <span className="val highlight">27017:27017</span>
            </div>
            <div className="detail-row">
              <span className="label">Official Image:</span>
              <span className="val">mongo:6.0</span>
            </div>
            <div className="detail-row">
              <span className="label">Named Volume:</span>
              <span className="val badge-vol">mongo-data:/data/db</span>
            </div>
            <div className="detail-row">
              <span className="label">Stored Tasks:</span>
              <span className="val count-val">{taskCount} documents</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistence & DNS Explanation Footer */}
      <div className="topology-footer-note">
        <div className="note-item">
          <span className="note-icon">💡</span>
          <span>
            <strong>Service-Name DNS:</strong> Inside the bridge network, containers communicate directly via Compose service names (<code>mongodb://mongodb:27017</code>), resolving through Docker's internal embedded DNS server.
          </span>
        </div>
        <div className="note-item">
          <span className="note-icon">💾</span>
          <span>
            <strong>Data Persistence:</strong> The <code>mongo-data</code> named volume persists all task data on the host machine across container stops and restarts (<code>docker-compose down</code> ➔ <code>up</code>).
          </span>
        </div>
      </div>
    </section>
  );
}
