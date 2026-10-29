import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <span className="notfound-code">404</span>
      <h2>Route Chunk Not Found</h2>
      <p>The requested URL path does not exist in the routing table.</p>
      <Link to="/" className="btn-home">
        &larr; Return to Home
      </Link>
    </div>
  );
}
