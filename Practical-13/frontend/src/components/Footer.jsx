import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          <strong>Practical 13: AI API Integration into a Web Application</strong> | CHARUSAT CSPIT IT
        </p>
        <p className="student-credit">
          Developed by <strong>Om Italiya (24IT029)</strong> | Course: Advanced Web Development Frameworks (AWDF)
        </p>
        <p className="footer-sub">
          Responsible AI • Graceful Degradation • Server-Side API Security • In-Memory Rate Limiting
        </p>
      </div>
    </footer>
  );
};

export default Footer;
