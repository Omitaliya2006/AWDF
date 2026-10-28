import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NotFound.css';

/**
 * NotFound Component (Route: "*")
 * Supplementary Problem & Post-Lab Requirement: Custom 404 Error Component
 * Captures unknown paths and provides seamless SPA return link.
 */
function NotFound() {
  const location = useLocation();

  return (
    <div className="notfound-page route-page">
      <section className="section-wrapper notfound-card">
        <div className="notfound-code-badge">404 ERROR</div>
        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-desc">
          The requested route <code className="unknown-path">{location.pathname}</code> does not exist in this single-page application.
        </p>

        <div className="notfound-meta-box glass-card">
          <h4>React Router v6 Fallback Handling:</h4>
          <p>
            Captured via the wildcard catch-all route: <code>&lt;Route path="*" element=&lt;NotFound /&gt; /&gt;</code>.
          </p>
        </div>

        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary">
            <span>← Return to Home</span>
          </Link>
          <Link to="/projects" className="btn btn-secondary">
            <span>Browse Projects</span>
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            <span>Contact Om Italiya</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default NotFound;
