import React, { useState } from 'react';
import './PipelineStatusHUD.css';

const PipelineStatusHUD = ({ telemetry }) => {
  const [pipelineMode, setPipelineMode] = useState('passing'); // 'passing' or 'failing'
  const [activeStepTab, setActiveStepTab] = useState('test');

  const stepsPassing = [
    { id: 'checkout', name: 'Checkout Code', icon: '📥', action: 'actions/checkout@v4', status: 'success', duration: '2s' },
    { id: 'setup', name: 'Setup Node.js 18', icon: '⚙️', action: 'actions/setup-node@v4', status: 'success', duration: '3s' },
    { id: 'install', name: 'Install Dependencies', icon: '📦', command: 'npm install', status: 'success', duration: '12s' },
    { id: 'lint', name: 'Static Code Lint', icon: '🔍', command: 'npm run lint', status: 'success', duration: '1s' },
    { id: 'test', name: 'Automated Tests', icon: '🧪', command: 'npm test', status: 'success', duration: '3s' },
    { id: 'status', name: 'Pipeline Status', icon: '✅', result: 'Green Checkmark (Pass)', status: 'success', duration: 'Done' }
  ];

  const stepsFailing = [
    { id: 'checkout', name: 'Checkout Code', icon: '📥', action: 'actions/checkout@v4', status: 'success', duration: '2s' },
    { id: 'setup', name: 'Setup Node.js 18', icon: '⚙️', action: 'actions/setup-node@v4', status: 'success', duration: '3s' },
    { id: 'install', name: 'Install Dependencies', icon: '📦', command: 'npm install', status: 'success', duration: '12s' },
    { id: 'lint', name: 'Static Code Lint', icon: '🔍', command: 'npm run lint', status: 'success', duration: '1s' },
    { id: 'test', name: 'Automated Tests', icon: '❌', command: 'npm run test:broken', status: 'failed', duration: '2s' },
    { id: 'status', name: 'Pipeline Status', icon: '🚫', result: 'Red X (Failed Pipeline)', status: 'failed', duration: 'Exit 1' }
  ];

  const steps = pipelineMode === 'passing' ? stepsPassing : stepsFailing;

  const testLogs = {
    passing: `> practical-12-backend@1.0.0 test
> jest tests/tasks.test.js --detectOpenHandles --forceExit --runInBand

PASS tests/tasks.test.js
  AWDF Practical 12 - CI/CD Automated Test Suite (24IT029)
    1. Health Check & CI Telemetry Verification
      ✓ GET /api/health should return HTTP 200 with service status OK (78 ms)
      ✓ GET /api/tasks/ci-status should report pipeline metadata and roll number (15 ms)
    2. Task CRUD Endpoints in CI Pipeline
      ✓ POST /api/tasks should successfully create a new task (HTTP 201) (29 ms)
      ✓ POST /api/tasks should reject requests missing a required title (HTTP 400) (8 ms)
      ✓ GET /api/tasks should return all tasks in array format (HTTP 200) (9 ms)
      ✓ GET /api/tasks?status=completed should filter tasks appropriately (8 ms)
      ✓ GET /api/tasks/:id should retrieve the created task by ID (14 ms)
      ✓ PUT /api/tasks/:id should update task status and title (HTTP 200) (10 ms)
      ✓ DELETE /api/tasks/:id should delete the task (HTTP 200) (16 ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        1.439 s
Ran all test suites matching /tests\\tasks.test.js/i.
Status: [SUCCESS] CI Pipeline verified all tests passed with exit code 0.`,

    failing: `> practical-12-backend@1.0.0 test:broken
> jest tests/broken.test.js --detectOpenHandles --forceExit --runInBand

  console.log
    [CI DEMO] Running deliberately broken assertion to simulate build failure...

FAIL tests/broken.test.js
  AWDF Practical 12 - Deliberately Broken Pipeline Demonstration (24IT029)
    ✕ DELIBERATELY BROKEN TEST: Should fail pipeline by expecting HTTP status 999 instead of 200 (55 ms)

  ● AWDF Practical 12 - Deliberately Broken Pipeline Demonstration (24IT029) › DELIBERATELY BROKEN TEST: Should fail pipeline by expecting HTTP status 999 instead of 200

    expect(received).toBe(expected) // Object.is equality

    Expected: 999
    Received: 200

      24 |     console.log('[CI DEMO] Running deliberately broken assertion to simulate build failure...');
    > 25 |     expect(res.statusCode).toBe(999);
         |                            ^

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Time:        1.139 s
Error: Process completed with exit code 1.
Status: [FAILED] CI Pipeline blocked deployment due to failing test assertion.`
  };

  return (
    <div className="pipeline-hud-card">
      <div className="hud-header">
        <div className="hud-title-box">
          <span className="hud-icon">⚡</span>
          <div>
            <h3>GitHub Actions CI/CD Pipeline Monitor</h3>
            <p className="hud-subtitle">
              Automated Build, Lint & Jest Test Pipeline for <code>Om Italiya (24IT029)</code>
            </p>
          </div>
        </div>

        <div className="hud-controls">
          <button
            className={`mode-btn ${pipelineMode === 'passing' ? 'active-pass' : ''}`}
            onClick={() => setPipelineMode('passing')}
            title="Demonstrate successful pipeline execution with green checkmark"
          >
            ✅ Passing Pipeline (Green)
          </button>
          <button
            className={`mode-btn ${pipelineMode === 'failing' ? 'active-fail' : ''}`}
            onClick={() => setPipelineMode('failing')}
            title="Demonstrate deliberately broken test pipeline failure"
          >
            ❌ Broken Test (Red X Demo)
          </button>
        </div>
      </div>

      {/* Pipeline Status Summary Banner */}
      <div className={`pipeline-banner ${pipelineMode}`}>
        <div className="banner-left">
          <span className="status-pill">
            {pipelineMode === 'passing' ? 'CI PIPELINE: PASSING' : 'CI PIPELINE: FAILED'}
          </span>
          <span className="workflow-name">Workflow: <strong>AWDF CI Pipeline - 24IT029</strong></span>
          <span className="branch-tag">Branch: <code>main</code></span>
          <span className="trigger-tag">Trigger: <code>on: push</code></span>
        </div>
        <div className="banner-right">
          <span className="badge-preview">
            <img
              src="https://img.shields.io/badge/CI%20Pipeline-passing-brightgreen?logo=github-actions"
              alt="CI Status"
              style={{ filter: pipelineMode === 'failing' ? 'hue-rotate(240deg)' : 'none' }}
            />
          </span>
        </div>
      </div>

      {/* Interactive Step Pipeline Nodes */}
      <div className="pipeline-stepper">
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <div
              className={`step-node ${step.status} ${activeStepTab === step.id ? 'selected' : ''}`}
              onClick={() => setActiveStepTab(step.id)}
            >
              <div className="node-icon">{step.icon}</div>
              <div className="node-info">
                <span className="node-step-num">Step {idx + 1}</span>
                <span className="node-name">{step.name}</span>
                <span className="node-duration">{step.duration}</span>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`step-connector ${steps[idx + 1].status === 'failed' ? 'connector-fail' : 'connector-pass'}`}>
                <div className="connector-line"></div>
                <span className="connector-arrow">▶</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Detail & Terminal Logs */}
      <div className="hud-terminal-section">
        <div className="terminal-header">
          <span className="terminal-dot red"></span>
          <span className="terminal-dot yellow"></span>
          <span className="terminal-dot green"></span>
          <span className="terminal-title">
            Runner Terminal Output — Ubuntu 22.04 LTS (Node 18.x) | {pipelineMode.toUpperCase()} RUN
          </span>
        </div>
        <pre className="terminal-content">
          <code>{testLogs[pipelineMode]}</code>
        </pre>
      </div>

      {/* Pipeline Key Takeaways Box */}
      <div className="pipeline-insights">
        <div className="insight-card">
          <h4>🎯 Rubric 1 & 2: Workflow Trigger & Install</h4>
          <p>
            Triggered automatically on every <code>git push origin main</code>. Executes <code>actions/checkout@v4</code>,
            sets up Node.js 18, and performs clean dependency resolution via <code>npm install</code>.
          </p>
        </div>
        <div className="insight-card">
          <h4>🧪 Rubric 3: Automated Testing Step</h4>
          <p>
            Runs Jest test runner executing <code>tests/tasks.test.js</code> over Express routes with Supertest,
            evaluating HTTP 200, 201, 400 status codes without human intervention.
          </p>
        </div>
        <div className="insight-card">
          <h4>⚡ Rubric 4 & 5: Failure vs Success</h4>
          <p>
            Deliberately broken test asserts HTTP 999, forcing exit code 1 to block bad deployments.
            Fixed pipeline passes 9/9 tests with exit code 0, emitting green checkmark.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PipelineStatusHUD;
