import React, { useState } from 'react';
import './VivaGuideModal.css';

const VivaGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const questions = [
    {
      q: "Q1. What is the difference between Continuous Integration and Continuous Deployment, and which one does this practical actually demonstrate?",
      a: (
        <div>
          <p>
            <strong>Continuous Integration (CI):</strong> The automated practice of frequently merging developer code changes into a central shared repository (e.g., <code>main</code>), followed immediately by automated builds, linting, and automated test execution. CI verifies whether the new code broke any existing functionality.
          </p>
          <p>
            <strong>Continuous Delivery (CD):</strong> Ensures that every code change that passes CI is automatically packaged and prepared to be deployed to production at any moment with a single manual trigger.
          </p>
          <p>
            <strong>Continuous Deployment (CD):</strong> Goes a step further where every change that passes all CI stages is automatically deployed directly into production without any human intervention.
          </p>
          <p className="viva-highlight">
            👉 <strong>This Practical Demonstrates CI (Continuous Integration):</strong> It triggers on <code>git push origin main</code>, sets up the Node environment, runs <code>npm install</code>, runs automated Jest/Supertest tests, and reports a green checkmark or red X.
          </p>
        </div>
      )
    },
    {
      q: "Q2. Why does running tests automatically on every push catch problems earlier than testing manually before release?",
      a: (
        <div>
          <p>
            <strong>1. Shift-Left Testing:</strong> Issues are identified immediately within seconds of code commit while the code logic is fresh in the author's mind, rather than days or weeks later during pre-release staging.
          </p>
          <p>
            <strong>2. Blast Radius Reduction:</strong> Each commit contains a small, discrete delta. When a test fails on a push, the regression is pinpointed directly to that commit rather than wading through hundreds of batched changes.
          </p>
          <p>
            <strong>3. Elimination of Human Error:</strong> Manual testing is prone to fatigue, skipping repetitive test cases, or environmental discrepancies. CI runs tests deterministically in an isolated sandbox.
          </p>
        </div>
      )
    },
    {
      q: "Q3. What makes a good test for a CI pipeline vs one that is too fragile or too slow?",
      a: (
        <div>
          <ul>
            <li>
              <strong>Fast Execution:</strong> A good CI test completes in milliseconds or a few seconds. If a test suite takes 45 minutes, developers will bypass it or productivity will plummet.
            </li>
            <li>
              <strong>Deterministic (No Flakiness):</strong> Good tests never intermittently fail due to external network latency or random timing race conditions. They use isolated test databases or mocks.
            </li>
            <li>
              <strong>Self-Contained & Repeatable:</strong> Tests must set up and tear down their own state without relying on existing database rows or host machine configuration.
            </li>
            <li>
              <strong>Clear Failure Diagnostics:</strong> Good tests output exact expectations vs actual received values (e.g., <code>Expected 200, Received 400 with message 'Title is required'</code>).
            </li>
          </ul>
        </div>
      )
    },
    {
      q: "Q4. How would you extend this pipeline to deploy automatically after tests pass?",
      a: (
        <div>
          <p>
            To convert this CI pipeline into a full <strong>CI/CD pipeline</strong>:
          </p>
          <ol>
            <li>
              Add a second job <code>deploy</code> that specifies <code>needs: [build-and-test]</code> so it only runs if the test suite passes with exit code 0.
            </li>
            <li>
              <strong>Docker Image Publishing:</strong> Build and push a tagged Docker image to Docker Hub or GitHub Container Registry (GHCR) using <code>docker/build-push-action@v5</code>.
            </li>
            <li>
              <strong>Hosting Trigger:</strong> Trigger a deployment hook to cloud platforms like Render, Vercel, AWS ECS, or Kubernetes via SSH or authenticated REST webhook.
            </li>
          </ol>
        </div>
      )
    },
    {
      q: "Q5. What are GitHub Actions secrets, and when would you need them in a CI/CD pipeline?",
      a: (
        <div>
          <p>
            <strong>GitHub Actions Secrets</strong> are encrypted environment variables stored securely in the repository settings (<code>Settings &gt; Secrets and variables &gt; Actions</code>). They are masked in runner logs so credentials are never exposed in plaintext.
          </p>
          <p>
            <strong>When they are needed:</strong>
          </p>
          <ul>
            <li>Production database connection strings (<code>MONGODB_URI</code>)</li>
            <li>Cloud provider API tokens and access keys (<code>AWS_ACCESS_KEY_ID</code>, <code>RENDER_API_KEY</code>)</li>
            <li>Docker Hub credentials (<code>DOCKERHUB_USERNAME</code>, <code>DOCKERHUB_TOKEN</code>)</li>
            <li>JWT Secret keys and third-party API tokens</li>
          </ul>
          <p>
            Syntax in YAML: <code>${`{{ secrets.DOCKERHUB_TOKEN }}`}</code>
          </p>
        </div>
      )
    },
    {
      q: "Q6. Explain the GitHub Actions workflow syntax used in this practical (.github/workflows/ci.yml).",
      a: (
        <div>
          <ul>
            <li><code>name:</code> Human-readable label displayed in the GitHub Actions tab.</li>
            <li><code>on: push: branches: [main]</code> Event trigger listening for commits pushed to the main branch.</li>
            <li><code>jobs: build-and-test:</code> A collection of sequential steps that execute on a fresh virtual runner.</li>
            <li><code>runs-on: ubuntu-latest:</code> Specifies the GitHub-hosted virtual machine operating system (Ubuntu 22.04 LTS).</li>
            <li><code>services: mongodb:</code> Spins up an isolated MongoDB Docker container sidecar on the runner.</li>
            <li><code>uses: actions/checkout@v4:</code> Clones the git repository into the runner workspace.</li>
            <li><code>uses: actions/setup-node@v4:</code> Installs Node.js 18.x and sets up npm PATH.</li>
            <li><code>run: npm install / npm test:</code> Executes the shell commands to install dependencies and run Jest tests.</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-icon">🎓</span>
            <div>
              <h3>Practical 12: Viva Voce & Key Questions Guide</h3>
              <p>Student: <strong>Om Italiya (24IT029)</strong> | Course: AWDF (CO5 / PO3, PO5)</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          {questions.map((item, idx) => (
            <button
              key={idx}
              className={`modal-tab-btn ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              Q{idx + 1}
            </button>
          ))}
        </div>

        <div className="modal-body">
          <h4 className="viva-question">{questions[activeTab].q}</h4>
          <div className="viva-answer">{questions[activeTab].a}</div>
        </div>

        <div className="modal-footer">
          <span className="viva-rubric">Syllabus Alignment: Packt GitHub Actions Masterclass Mod 1 & 2</span>
          <button className="modal-done-btn" onClick={onClose}>Close Guide</button>
        </div>
      </div>
    </div>
  );
};

export default VivaGuideModal;
