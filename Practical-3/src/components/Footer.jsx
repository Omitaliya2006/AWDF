import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Footer Component for Practical 3
 * Provides academic credentials, practical details, and quick links.
 */
function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="brand-logo-icon">🌐</span>
              <span className="brand-title">Om Italiya • GitHub Explorer</span>
            </div>
            <p className="footer-description">
              <strong>Practical 3:</strong> REST API Integration & Data Rendering in React using{' '}
              <code>useEffect</code>, <code>fetch()</code>, and asynchronous lifecycle state handling (<code>loading</code>, <code>error</code>, <code>data</code>).
            </p>
            <div className="footer-badges">
              <span className="footer-tag">CO2 / PO3, PO5</span>
              <span className="footer-tag">CSPIT • 5th Semester</span>
              <span className="footer-tag">Roll No: 24IT029</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-links">
              <li>
                <Link to="/" className="footer-link">Repositories Explorer</Link>
              </li>
              <li>
                <Link to="/inspector" className="footer-link">API Inspector & State Monitor</Link>
              </li>
              <li>
                <Link to="/viva" className="footer-link">Viva & Theory Concepts Guide</Link>
              </li>
              <li>
                <a
                  href="https://api.github.com/users/Omitaliya2006/repos"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-link"
                >
                  Raw GitHub REST API ↗
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4 className="footer-col-title">Academic Details</h4>
            <ul className="footer-contact-info">
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:24it029@charusat.edu.in" className="footer-link">
                  24it029@charusat.edu.in
                </a>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>CSPIT, CHARUSAT University, Changa</span>
              </li>
              <li>
                <span className="contact-icon">💻</span>
                <span>Department of Information Technology</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-row">
          <p className="copyright-text">
            © {CURRENT_YEAR} <strong>Om Italiya (24IT029)</strong>. CHARUSAT - CSPIT. Built with React 19 & Vite.
          </p>
          <div className="tech-pills">
            <span className="tech-pill">React 19</span>
            <span className="tech-pill">GitHub REST API</span>
            <span className="tech-pill">useEffect & fetch</span>
            <span className="tech-pill">Async Lifecycle</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
