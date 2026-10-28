import React from 'react';
import './Footer.css';

/**
 * Footer Component
 * Displays contact information, copyright notice, and academic practical credentials.
 *
 * @param {Object} props
 * @param {string} props.name - Student Name passed as prop
 * @param {string} props.rollNo - Student Roll Number
 * @param {number|string} props.year - Current academic year
 * @param {string} props.email - Contact email
 */
function Footer({ 
  name = 'Om Italiya', 
  rollNo = '24IT029', 
  year = new Date().getFullYear(),
  email = '24it029@charusat.edu.in'
}) {
  return (
    <footer id="contact" className="footer-container">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-logo">
              <span className="brand-icon">⚛️</span>
              <span className="brand-text">{name}'s Portfolio</span>
            </div>
            <p className="footer-bio">
              Built as part of <strong>Practical 1: Introduction to React & Component Architecture</strong>.
              Demonstrating reusable functional components and props hierarchy.
            </p>
          </div>

          <div className="footer-contact-card">
            <h4 className="footer-section-title">Get in Touch</h4>
            <ul className="footer-contact-list">
              <li>
                <span className="contact-icon">📧</span>
                <a href={`mailto:${email}`} className="contact-link">{email}</a>
              </li>
              <li>
                <span className="contact-icon">🎓</span>
                <span>Roll No: <strong>{rollNo}</strong> (AWDF Lab)</span>
              </li>
              <li>
                <span className="contact-icon">📍</span>
                <span>Department of Information Technology</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {year} <strong>{name}</strong>. All rights reserved. Built with React & Vite.
          </p>
          <div className="footer-badges">
            <span className="footer-badge">CO1 / PO3, PO5</span>
            <span className="footer-badge">100% Component Driven</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
