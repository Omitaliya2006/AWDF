import React, { useState } from 'react';
import './Contact.css';

/**
 * Contact Page Component (Route: "/contact")
 * Implements:
 * 1. Controlled form input tied to useState (Lab Step 5 & Rubric)
 * 2. Second useState variable to toggle visibility of an element (Lab Step 6: Tooltip & Live Preview)
 * 3. Real-time live character counting (Supplementary Problem)
 * 4. Real-time mirror preview of user input (Problem Statement)
 */
function Contact() {
  // Lab Step 5: Controlled input states tied to useState
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('AWDF Lab Query');

  // Lab Step 6: Second useState variable to toggle UI visibility (Help Tooltip)
  const [showTooltip, setShowTooltip] = useState(false);

  // Additional useState variable: Toggle visibility of Live Preview Card
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Submission feedback state
  const [isSubmitted, setIsSubmitted] = useState(false);

  const MAX_CHARS = 300;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !senderName.trim()) return;

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleReset = () => {
    setMessage('');
    setSenderName('');
    setSenderEmail('');
    setSubject('AWDF Lab Query');
    setIsSubmitted(false);
  };

  return (
    <div className="contact-page route-page">
      <section className="section-wrapper contact-wrapper">
        <div className="section-header">
          <div>
            <div className="route-indicator-row">
              <span className="state-pill">
                <span className="live-dot" />
                Route: "/contact" • Controlled Component
              </span>
              <span className="student-badge">Om Italiya • 24IT029</span>
            </div>
            <h1 className="section-title">
              <span className="section-title-icon">✉️</span>
              Contact & Interactive Controlled Form
            </h1>
            <p className="section-subtitle">
              Demonstrating two-way binding with <code>useState</code>, real-time input capture, and visibility toggling.
            </p>
          </div>

          {/* Interactive UI Visibility Toggles (useState Requirement) */}
          <div className="contact-toggle-actions">
            {/* Step 6: Help Tooltip Toggle */}
            <button
              type="button"
              onClick={() => setShowTooltip(!showTooltip)}
              className={`btn btn-secondary toggle-btn ${showTooltip ? 'active-toggle' : ''}`}
              title="Click to toggle Help Tooltip visibility"
            >
              <span>{showTooltip ? 'Hide' : 'Show'} Form Help Tooltip</span>
              <span>💡</span>
            </button>

            {/* Toggle Live Preview Card */}
            <button
              type="button"
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`btn btn-secondary toggle-btn ${showLivePreview ? 'active-toggle' : ''}`}
              title="Click to toggle Live Preview card"
            >
              <span>{showLivePreview ? 'Hide' : 'Show'} Real-Time Preview</span>
              <span>👁️</span>
            </button>
          </div>
        </div>

        {/* Lab Step 6: Help Tooltip rendered conditionally based on showTooltip state */}
        {showTooltip && (
          <div className="form-help-tooltip glass-card">
            <div className="tooltip-icon">ℹ️</div>
            <div className="tooltip-content">
              <h4>Lab Step 6 Verification: Controlled Form Guidelines</h4>
              <p>
                In React, an input whose value is bound to state via <code>value=&#123;state&#125;</code> and{' '}
                <code>onChange=&#123;(e) =&gt; setState(e.target.value)&#125;</code> is called a{' '}
                <strong>Controlled Component</strong>. Every keystroke triggers a re-render that updates the state and the DOM simultaneously.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="tooltip-close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Alert Banner */}
        {isSubmitted && (
          <div className="submission-success-banner glass-card">
            <span className="success-icon">✅</span>
            <div>
              <h4>Message Recorded Successfully!</h4>
              <p>
                Controlled state captured for <strong>{senderName}</strong>: "{message.substring(0, 40)}..."
              </p>
            </div>
          </div>
        )}

        <div className="contact-layout-grid">
          {/* Left Column: The Controlled Form */}
          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <h3 className="form-heading">Send a Message</h3>

            {/* Sender Name Controlled Input */}
            <div className="form-field">
              <label htmlFor="sender-name" className="field-label">
                Your Full Name <span className="required">*</span>
              </label>
              <input
                id="sender-name"
                type="text"
                className="text-input"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Om Italiya"
                required
              />
            </div>

            {/* Sender Email Controlled Input */}
            <div className="form-field">
              <label htmlFor="sender-email" className="field-label">
                Email Address
              </label>
              <input
                id="sender-email"
                type="email"
                className="text-input"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. 24it029@charusat.edu.in"
              />
            </div>

            {/* Subject Controlled Dropdown */}
            <div className="form-field">
              <label htmlFor="form-subject" className="field-label">
                Subject
              </label>
              <select
                id="form-subject"
                className="text-input select-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="AWDF Lab Query">AWDF Lab Query (Practical 2)</option>
                <option value="Project Collaboration">Project Collaboration</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>

            {/* Lab Step 5: Controlled Message Input with Live Character Counter */}
            <div className="form-field">
              <div className="label-counter-row">
                <label htmlFor="form-message" className="field-label">
                  Message (Lab Step 5 Controlled Input) <span className="required">*</span>
                </label>
                {/* Supplementary Problem: Live Character Count */}
                <span className={`char-counter ${message.length >= MAX_CHARS ? 'limit-reached' : ''}`}>
                  {message.length} / {MAX_CHARS} chars
                </span>
              </div>
              <textarea
                id="form-message"
                className="text-input textarea-input"
                rows={5}
                maxLength={MAX_CHARS}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here to observe real-time keystroke synchronization..."
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="form-button-row">
              <button type="submit" className="btn btn-primary submit-btn">
                <span>Submit Form</span>
                <span>🚀</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary reset-btn"
              >
                Reset Fields
              </button>
            </div>
          </form>

          {/* Right Column: Real-Time Input Mirror Preview Card (Problem Statement Requirement) */}
          {showLivePreview && (
            <div className="live-preview-card glass-card">
              <div className="preview-header">
                <div className="preview-title-row">
                  <span className="preview-indicator" />
                  <h4>Live State Mirror (Real-Time Keystroke Sync)</h4>
                </div>
                <span className="live-pill">Live Reactivity</span>
              </div>

              <p className="preview-instruction">
                Values below are bound directly to the component's <code>useState</code> variables and update on every single keystroke.
              </p>

              <div className="state-display-box">
                <div className="state-item">
                  <span className="state-label">Name State:</span>
                  <span className="state-value">
                    {senderName || <em className="empty-hint">(Waiting for input...)</em>}
                  </span>
                </div>

                <div className="state-item">
                  <span className="state-label">Email State:</span>
                  <span className="state-value">
                    {senderEmail || <em className="empty-hint">(Empty)</em>}
                  </span>
                </div>

                <div className="state-item">
                  <span className="state-label">Subject State:</span>
                  <span className="state-value highlight">{subject}</span>
                </div>

                <div className="state-item message-state-item">
                  <span className="state-label">Message State (Step 5):</span>
                  <div className="message-bubble">
                    {message ? (
                      <p className="bubble-text">{message}</p>
                    ) : (
                      <em className="empty-hint">Type in the message box to see live state capture...</em>
                    )}
                  </div>
                </div>

                <div className="state-item">
                  <span className="state-label">Character Count:</span>
                  <span className="state-value char-count-val">
                    <strong>{message.length}</strong> characters captured in state
                  </span>
                </div>
              </div>

              {/* Code Verification Card for Viva */}
              <div className="code-evidence-box">
                <span className="evidence-title">Controlled Input Code (Step 5):</span>
                <pre>
                  <code>{`// Contact.jsx:
const [message, setMessage] = useState('');
<input 
  value={message} 
  onChange={(e) => setMessage(e.target.value)} 
/>`}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Contact;
