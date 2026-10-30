import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          <strong>Practical 12: CI/CD Pipeline with GitHub Actions</strong> | CHARUSAT CSPIT IT
        </p>
        <p className="student-credit">
          Developed by <strong>Om Italiya (24IT029)</strong> | Course: Advanced Web Development Frameworks (AWDF)
        </p>
        <p className="footer-sub">
          Continuous Integration • Automated Jest Testing • Ubuntu Runner • GitHub Actions Workflow
        </p>
      </div>
    </footer>
  );
};

export default Footer;
