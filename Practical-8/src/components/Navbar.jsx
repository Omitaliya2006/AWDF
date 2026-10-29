import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({
  onOpenHUD,
  onOpenViva,
  throttle,
  onChangeThrottle
}) {
  const location = useLocation();

  const getChunkName = (pathname) => {
    switch (pathname) {
      case '/': return 'Home.chunk.js';
      case '/projects': return 'Projects.chunk.js';
      case '/analytics': return 'Analytics.chunk.js';
      case '/contact': return 'Contact.chunk.js';
      default: return 'NotFound.chunk.js';
    }
  };

  const currentChunk = getChunkName(location.pathname);

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="logo-badge">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span className="logo-text">SpeedFlow <span className="logo-accent">LazyLoad</span></span>
        </div>
        <div className="practical-tag">
          <span className="tag-dot"></span>
          Practical 8 • AWDF
        </div>
      </div>

      <nav className="navbar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} end>
          Home
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          Projects <span className="nav-lazy-dot" title="Lazy Route">●</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          Analytics <span className="nav-lazy-dot" title="Heavy Chunk">●</span>
        </NavLink>
        <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          Contact <span className="nav-lazy-dot" title="Lazy Route">●</span>
        </NavLink>
      </nav>

      <div className="navbar-right">
        {/* Active Chunk Indicator */}
        <div className="chunk-pill" title="Currently mounted route chunk file">
          <span className="chunk-label">CHUNK:</span>
          <span className="chunk-name">{currentChunk}</span>
        </div>

        {/* Network Throttle Simulator Selector */}
        <div className="throttle-selector" title="Simulate Network Throttling to observe Suspense Fallback UI">
          <span className="throttle-icon">📶</span>
          <select
            value={throttle}
            onChange={(e) => onChangeThrottle(e.target.value)}
            className="throttle-select"
          >
            <option value="instant">Fast (No Delay)</option>
            <option value="fast3g">Fast 3G (700ms)</option>
            <option value="slow3g">Slow 3G (1.5s)</option>
          </select>
        </div>

        <button className="btn-hud" onClick={onOpenHUD} title="Open Performance Profiler & Bundle Metrics">
          📊 Profiler HUD
        </button>

        <button className="btn-viva" onClick={onOpenViva} title="Open Practical 8 Oral Examination Guide">
          🎓 Viva Guide
        </button>
      </div>
    </header>
  );
}
