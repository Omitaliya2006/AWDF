import React, { useState } from 'react';
import './VivaGuideModal.css';

const VivaGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  const questions = [
    {
      q: "Q1. Why must the AI API key be called from the backend rather than directly from the React frontend?",
      a: (
        <div>
          <p>
            <strong>1. Direct Credential Theft:</strong> Any API key included in client-side React code (even in <code>.env.production</code> or bundled with Vite) is delivered directly to the user's browser. Anyone can open DevTools, inspect the JavaScript bundle or Network tab, and steal the key.
          </p>
          <p>
            <strong>2. Billing & Quota Abuse (Denial-of-Wallet):</strong> An exposed OpenAI or Gemini API key allows malicious actors to consume your API credits, trigger massive billing charges, or cause your account to be suspended.
          </p>
          <p>
            <strong>3. Rate Limiting & Governance:</strong> Calling the API via an Express backend allows you to enforce centralized rate limiting, sanitize and validate user input, log audit trails, and implement fallback logic.
          </p>
          <p className="viva-highlight">
            🔒 <strong>Implementation Proof:</strong> In this practical, <code>OPENAI_API_KEY</code> is stored strictly in the backend <code>.env</code> file. The React client only communicates with our own authenticated endpoint <code>POST /api/ai/generate-description</code>.
          </p>
        </div>
      )
    },
    {
      q: "Q2. What does 'graceful degradation' mean in this context, and why does it matter for a feature that depends on a third-party service outside your control?",
      a: (
        <div>
          <p>
            <strong>Graceful Degradation</strong> is the architectural principle where a system continues to operate at an acceptable, albeit slightly reduced, level of functionality when a non-essential or third-party component fails, rather than crashing completely.
          </p>
          <p>
            <strong>Why it matters for external AI APIs:</strong>
          </p>
          <ul>
            <li>Third-party AI providers (OpenAI, Gemini) experience outages, latency spikes, rate limit exhaustion (HTTP 429), or invalid credential errors (HTTP 401).</li>
            <li>If the AI endpoint threw an unhandled exception or returned HTTP 500, users wouldn't be able to create tasks at all!</li>
            <li>With graceful degradation, our backend catches the error, serves an intelligent contextual fallback description, flags <code>fallback: true</code>, and allows the user to write or edit their task smoothly. AI is an <em>enhancement</em>, never a single point of failure.</li>
          </ul>
        </div>
      )
    },
    {
      q: "Q3. What are the privacy and governance implications of sending task data to an external AI API, and what kind of data should never be sent this way?",
      a: (
        <div>
          <p>
            <strong>Privacy & Data Sovereignty Risks:</strong> When prompts are sent to external cloud AI APIs, prompt data travels over the public internet to third-party data centers, where it may be logged, reviewed, or potentially used for model training unless zero-data-retention agreements are signed.
          </p>
          <p>
            <strong>Data that should NEVER be sent to third-party AI APIs:</strong>
          </p>
          <ul>
            <li><strong>Personally Identifiable Information (PII):</strong> Full names, Social Security numbers, phone numbers, home addresses, passport IDs.</li>
            <li><strong>Credentials & Secrets:</strong> Passwords, private API keys, database connection strings, JWT secrets, SSH certificates.</li>
            <li><strong>Confidential Business Data:</strong> Trade secrets, proprietary source code, unannounced financial figures, legal contracts.</li>
            <li><strong>Regulated Healthcare & Financial Data:</strong> Patient health records (HIPAA) or credit card CVVs (PCI-DSS).</li>
          </ul>
          <p className="viva-highlight">
            🛡️ <strong>Data Minimization Principle:</strong> We only send the task title (e.g. "Implement user authentication") and strip all user IDs or tokens.
          </p>
        </div>
      )
    },
    {
      q: "Q4. How does the rate limiter protect the application and what happens when it is exceeded?",
      a: (
        <div>
          <p>
            We implemented a sliding-window in-memory rate limiter (<code>src/middleware/rateLimiter.js</code>) that restricts each client IP to a maximum of <strong>10 AI generation requests per minute</strong>.
          </p>
          <ul>
            <li><strong>Headers Emitted:</strong> <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, and <code>Retry-After</code>.</li>
            <li><strong>Status Code:</strong> Returns <code>HTTP 429 Too Many Requests</code> if quota is exceeded.</li>
            <li><strong>Frontend Response:</strong> Displays a clean toast notification informing the student to wait a few seconds before generating another description, preventing quota exhaustion.</li>
          </ul>
        </div>
      )
    },
    {
      q: "Q5. What are the four core pillars of Responsible AI implemented in this practical?",
      a: (
        <div>
          <ol>
            <li>
              <strong>Human-in-the-Loop (Agency):</strong> AI suggestions are presented in an editable text area. The user retains ultimate control to accept, modify, or completely rewrite the text.
            </li>
            <li>
              <strong>Transparency & Disclaimers:</strong> Prominent banner <code>"⚠️ AI-generated suggestion. Please review and verify accuracy before saving."</code> explicitly tells users the content was machine-generated.
            </li>
            <li>
              <strong>Data Minimization:</strong> Only the task title string is transmitted; no database records, user cookies, or passwords are ever passed into the AI prompt.
            </li>
            <li>
              <strong>Reliability & Fallbacks:</strong> The core application functions seamlessly even during AI outages via local heuristic fallback generators.
            </li>
          </ol>
        </div>
      )
    },
    {
      q: "Q6. How does this feature satisfy the 'Meaningful Purpose' requirement vs a trivial prompt demo?",
      a: (
        <div>
          <p>
            Instead of a generic chatbot or isolated prompt box:
          </p>
          <ul>
            <li>It analyzes the domain semantics of the task title.</li>
            <li>It auto-generates structured scope and acceptance criteria bullet points directly into the task creation form.</li>
            <li>It predicts and pre-selects the recommended priority (e.g. "Fix crash" ➔ High Priority; "Update CSS" ➔ Medium Priority).</li>
            <li>It estimates realistic completion deadlines and sets <code>isAiGenerated: true</code> in the MongoDB document for auditability.</li>
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
              <h3>Practical 13: Viva Voce & Responsible AI Guide</h3>
              <p>Student: <strong>Om Italiya (24IT029)</strong> | Course: AWDF (CO6 / PO3, PO5, PO12)</p>
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
          <span className="viva-rubric">Rubric: API Security (5m) • Meaningfulness (5m) • Graceful Degradation (5m) • Response Handling (5m)</span>
          <button className="modal-done-btn" onClick={onClose}>Close Guide</button>
        </div>
      </div>
    </div>
  );
};

export default VivaGuideModal;
