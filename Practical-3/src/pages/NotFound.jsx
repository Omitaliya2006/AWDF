import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NotFound.css';

/**
 * NotFound Component (Supplementary Wildcard Route Handler)
 * Captures unknown routes and guides user back to home without page reloads.
 */
function NotFound() {
  const location = useLocation();

  return (
    <div className="not-found-container glass-card route-page">
      <div className="not-found-icon">🧭</div>
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-desc">
        The route <code>{location.pathname}</code> does not exist in this single page application.
      </p>
      <Link to="/" className="btn btn-primary not-found-btn">
        <span>← Return to Repositories Explorer</span>
      </Link>
    </div>
  );
}

export default NotFound;
