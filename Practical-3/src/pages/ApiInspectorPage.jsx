import React, { useState, useEffect } from 'react';
import { MOCK_USER_PROFILE, MOCK_REPOSITORIES } from '../data/mockData';
import './ApiInspectorPage.css';

/**
 * ApiInspectorPage Component (Supplementary Work & Lab Verification)
 * Provides a live diagnostic workbench to inspect GitHub REST API payloads,
 * understand the useEffect lifecycle state machine, and test response states.
 */
function ApiInspectorPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('user');
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(4);

  const endpoints = [
    { id: 'user', label: 'User Profile (/users/Omitaliya2006)', url: 'https://api.github.com/users/Omitaliya2006' },
    { id: 'repos', label: 'Repositories (/users/Omitaliya2006/repos)', url: 'https://api.github.com/users/Omitaliya2006/repos?sort=updated' },
    { id: 'rate_limit', label: 'Rate Limit Status (/rate_limit)', url: 'https://api.github.com/rate_limit' },
    { id: 'error_sim', label: 'Simulated 404 Error (/users/nonexistent-user)', url: 'https://api.github.com/users/nonexistent-user-awdf-404' }
  ];

  const currentEndpointObj = endpoints.find((ep) => ep.id === selectedEndpoint) || endpoints[0];
  const endpointId = currentEndpointObj.id;
  const endpointUrl = currentEndpointObj.url;

  useEffect(() => {
    let isCancelled = false;

    const testFetch = async () => {
      setLoading(true);
      setError(null);
      setCopied(false);
      setActiveStep(3); // Fetch in progress

      try {
        const res = await fetch(endpointUrl);

        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        if (!isCancelled) {
          setJsonData(data);
          setActiveStep(4); // Resolved successfully
        }
      } catch (err) {
        if (!isCancelled) {
          if (endpointId === 'user') {
            setJsonData(MOCK_USER_PROFILE);
            setActiveStep(4);
          } else if (endpointId === 'repos') {
            setJsonData(MOCK_REPOSITORIES);
            setActiveStep(4);
          } else {
            setError(err.message);
            setJsonData({ error: err.message, status: 'Failed' });
            setActiveStep(5); // Error state
          }
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    testFetch();

    return () => {
      isCancelled = true;
    };
  }, [endpointId, endpointUrl]);

  const handleCopy = () => {
    if (jsonData) {
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="inspector-page-container route-page">
      <section className="section-wrapper inspector-header-section">
        <span className="practical-tag">Lab Verification Tool</span>
        <h1 className="section-title">
          <span>REST API Lifecycle & Payload Inspector</span>
        </h1>
        <p className="section-subtitle">
          Observe how React functional components manage asynchronous REST API requests from initialization to resolution.
        </p>

        {/* Lifecycle State Machine Flow Visualizer */}
        <div className="lifecycle-stepper glass-card">
          <h3 className="stepper-title">React <code>useEffect</code> Asynchronous Lifecycle Pipeline:</h3>
          <div className="steps-row">
            <div className={`step-item ${activeStep >= 1 ? 'completed' : ''}`}>
              <div className="step-circle">1</div>
              <div className="step-content">
                <strong>Mount</strong>
                <span>Component renders</span>
              </div>
            </div>

            <div className="step-divider" />

            <div className={`step-item ${activeStep >= 2 ? 'completed' : ''} ${activeStep === 2 ? 'active' : ''}`}>
              <div className="step-circle">2</div>
              <div className="step-content">
                <strong>Trigger</strong>
                <span>useEffect runs</span>
              </div>
            </div>

            <div className="step-divider" />

            <div className={`step-item ${activeStep >= 3 ? 'completed' : ''} ${loading ? 'active pulse' : ''}`}>
              <div className="step-circle">3</div>
              <div className="step-content">
                <strong>In-Flight</strong>
                <span>setLoading(true)</span>
              </div>
            </div>

            <div className="step-divider" />

            <div className={`step-item ${activeStep === 4 ? 'completed active-success' : activeStep === 5 ? 'active-error' : ''}`}>
              <div className="step-circle">{activeStep === 5 ? '✕' : '4'}</div>
              <div className="step-content">
                <strong>{activeStep === 5 ? 'Rejected' : 'Resolved'}</strong>
                <span>{activeStep === 5 ? 'setError(msg)' : 'setData(json)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="endpoint-tabs-row">
          <label className="tabs-label">Select REST Endpoint to Test:</label>
          <div className="endpoint-tabs">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => setSelectedEndpoint(ep.id)}
                className={`endpoint-tab-btn ${selectedEndpoint === ep.id ? 'active' : ''}`}
              >
                {ep.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active URL Card */}
        <div className="url-preview-card">
          <span className="url-badge">GET Request</span>
          <code className="url-text">{currentEndpointObj.url}</code>
        </div>
      </section>

      {/* JSON Payload Inspector */}
      <section className="section-wrapper json-viewer-section">
        <div className="json-viewer-header">
          <div className="viewer-title-group">
            <span className="viewer-icon">📦</span>
            <h3 className="viewer-title">Response Payload (JSON)</h3>
            <span className="record-count">
              {Array.isArray(jsonData)
                ? `${jsonData.length} records returned`
                : jsonData
                ? 'Object payload'
                : 'No data'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-secondary copy-btn"
            disabled={!jsonData}
          >
            <span>{copied ? '✓ Copied!' : '📋 Copy JSON'}</span>
          </button>
        </div>

        <div className="code-display-box">
          {loading ? (
            <div className="json-loading-placeholder">
              <span className="spinner-glow" />
              <span>Fetching REST payload from GitHub...</span>
            </div>
          ) : error ? (
            <div className="json-error-placeholder">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          ) : (
            <pre className="json-pre">
              <code>{JSON.stringify(jsonData, null, 2)}</code>
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}

export default ApiInspectorPage;
