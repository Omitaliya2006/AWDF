import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-left">
          <p className="footer-text">
            <strong>Practical 9:</strong> In-Memory Caching and Query Optimization using <code>node-cache</code>
          </p>
          <p className="footer-sub">
            Course: Advanced Web Development Frameworks (AWDF) • CO2, CO4 / PO3, PO5
          </p>
        </div>

        <div className="footer-right">
          <div className="student-card">
            <span className="sc-name">Om Italiya</span>
            <span className="sc-meta">Roll No: 24IT029 • CSPIT CHARUSAT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
