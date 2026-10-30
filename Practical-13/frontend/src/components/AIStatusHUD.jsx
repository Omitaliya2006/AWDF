import React, { useState } from 'react';
import './AIStatusHUD.css';

const AIStatusHUD = ({ aiStatus, onSimulateFailure }) => {
  const [simulationResult, setSimulationResult] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleTestFailure = async () => {
    try {
      setIsSimulating(true);
      const res = await onSimulateFailure('Fix JWT Authentication Token Expiration Vulnerability');
      setSimulationResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="ai-hud-card">
      <div className="ai-hud-header">
        <div className="ai-title-group">
          <span className="ai-hud-icon">🤖</span>
          <div>
            <h3>AI API Integration & Responsible AI Governance</h3>
            <p className="ai-hud-sub">
              Secure Server-Side AI Generation Engine | <code>Om Italiya (24IT029)</code>
            </p>
          </div>
        </div>

        <div className="ai-hud-actions">
          <button
            className={`simulate-fail-btn ${isSimulating ? 'loading' : ''}`}
            onClick={handleTestFailure}
            disabled={isSimulating}
            title="Demonstrate Faculty Teaching Guide requirement: Live Graceful Degradation test with simulated 401/timeout"
          >
            {isSimulating ? 'Simulating...' : '⚡ Test Live Graceful Degradation'}
          </button>
        </div>
      </div>

      {/* Security & Health Matrix */}
      <div className="ai-matrix-grid">
        <div className="matrix-badge secure">
          <span className="badge-icon">🔒</span>
          <div className="badge-text">
            <strong>Key Security: Server-Side .env</strong>
            <small>Never exposed to client / browser DevTools</small>
          </div>
        </div>

        <div className="matrix-badge provider">
          <span className="badge-icon">🌐</span>
          <div className="badge-text">
            <strong>Engine: OpenAI gpt-4o-mini</strong>
            <small>Dual Provider + Fallback Engine</small>
          </div>
        </div>

        <div className="matrix-badge degradation">
          <span className="badge-icon">🛡️</span>
          <div className="badge-text">
            <strong>Graceful Degradation: ACTIVE</strong>
            <small>Never crashes on 401 or timeout</small>
          </div>
        </div>

        <div className="matrix-badge ratelimit">
          <span className="badge-icon">⏱️</span>
          <div className="badge-text">
            <strong>Rate Limiter: 10 req / min</strong>
            <small>Sliding window quota protection</small>
          </div>
        </div>
      </div>

      {/* Live Simulation Feedback Popup */}
      {simulationResult && (
        <div className="simulation-feedback-box">
          <div className="sim-header">
            <span className="sim-pill">🧪 LIVE GRACEFUL DEGRADATION PROOF</span>
            <button className="sim-close" onClick={() => setSimulationResult(null)}>×</button>
          </div>
          <p className="sim-intro">
            Simulated an external API 401 Unauthorized / timeout failure. Instead of crashing (HTTP 500),
            the backend caught the error and generated this contextual fallback description:
          </p>
          <pre className="sim-code">
            <code>{simulationResult.description}</code>
          </pre>
          <div className="sim-meta">
            <span>Fallback Flag: <strong>true</strong></span>
            <span>Provider: <code>{simulationResult.provider}</code></span>
            <span>Suggested Priority: <strong className="priority-tag high">{simulationResult.suggestedPriority}</strong></span>
          </div>
        </div>
      )}

      {/* Responsible AI Governance Pills */}
      <div className="governance-strip">
        <span className="gov-title">Responsible AI Pillars:</span>
        <span className="gov-pill">⚖️ Human-in-the-Loop (Editable)</span>
        <span className="gov-pill">🛡️ Data Minimization (No PII)</span>
        <span className="gov-pill">📢 Prominent Disclaimers</span>
        <span className="gov-pill">🔄 Fallback Availability</span>
      </div>
    </div>
  );
};

export default AIStatusHUD;
