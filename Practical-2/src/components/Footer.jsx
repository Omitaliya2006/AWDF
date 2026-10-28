import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer Component for Practical 2
 * Uses Link from 'react-router-dom' for SPA navigation to prevent full page reloads.
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <span className="brand-logo-icon">⚛️</span>
              <span className="brand-title">Om Italiya Portfolio</span>
            </div>
            <p className="footer-description">
              <strong>Practical 2:</strong> State Management & Multi-Page Routing in React using{' '}
              <code>useState</code> and <code>react-router-dom</code>.
            </p>
            <div className="footer-badges">
              <span className="footer-tag">CO1 / PO3, PO5</span>
              <span className="footer-tag">CSPIT • 5th Semester</span>
              <span className="footer-tag">Roll No: 24IT029</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Quick Routes</h4>
            <ul className="footer-nav-links">
              <li>
                <Link to="/" className="footer-link">Home (Overview & Skills)</Link>
              </li>
              <li>
                <Link to="/projects" className="footer-link">Featured Projects</Link>
              </li>
              <li>
                <Link to="/contact" className="footer-link">Contact (Controlled Form)</Link>
              </li>
              <li>
                <Link to="/invalid-route-demo" className="footer-link">404 Demo Page</Link>
              </li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4 className="footer-col-title">Connect</h4>
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
            © {currentYear} <strong>Om Italiya (24IT029)</strong>. All rights reserved. Built with React & Vite.
          </p>
          <div className="tech-pills">
            <span className="tech-pill">React 19</span>
            <span className="tech-pill">React Router v7</span>
            <span className="tech-pill">useState Hooks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
