import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: 'Om Italiya',
    email: '24it029@charusat.edu.in',
    subject: 'Practical 8 Evaluation & Profiling Inquiry',
    message: 'Hello Faculty, Practical 8 code-splitting and Suspense fallback have been implemented successfully!'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page-container">
      <div className="chunk-notice-banner-contact">
        <span className="notice-icon">📬</span>
        <div className="notice-text">
          <strong>Lazy Route Activated:</strong> This contact module was loaded as <code>Contact.chunk.js</code> on demand.
        </div>
      </div>

      <div className="contact-card">
        <div className="contact-header">
          <h2>Contact & Academic Inquiries</h2>
          <p>Get in touch regarding AWDF lab assignments and project feedback.</p>
        </div>

        {submitted ? (
          <div className="contact-success-box">
            <span className="success-icon">✓</span>
            <h3>Message Recorded Successfully</h3>
            <p>Thank you for submitting your feedback. Code chunk remains cached in browser memory!</p>
            <button className="btn-send-again" onClick={() => setSubmitted(false)}>
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-contact-submit">
              Send Academic Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
