import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home({ onOpenHUD }) {
  return (
    <div className="home-container">
      {/* Hero Banner */}
      <section className="home-hero">
        <span className="hero-badge">PERFORMANCE OPTIMIZATION & CODE SPLITTING</span>
        <h1 className="hero-title">
          Next-Gen React Frontend Acceleration
        </h1>
        <p className="hero-description">
          Demonstrating route-based code splitting with <code>React.lazy()</code> and <code>&lt;Suspense&gt;</code> fallback boundaries. Minimizing initial JavaScript payload and accelerating Time to Interactive.
        </p>

        <div className="hero-actions">
          <Link to="/projects" className="btn-hero-primary">
            🚀 Explore Projects (Lazy Route)
          </Link>
          <button onClick={onOpenHUD} className="btn-hero-secondary">
            📊 View Bundle Profiler HUD
          </button>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="stats-highlight-grid">
        <div className="highlight-card">
          <span className="highlight-icon">⚡</span>
          <div className="highlight-val">138 KB</div>
          <div className="highlight-lbl">Initial JS Payload</div>
          <p className="highlight-sub">Reduced from 358 KB via dynamic code-splitting.</p>
        </div>

        <div className="highlight-card">
          <span className="highlight-icon">⏳</span>
          <div className="highlight-val">0.82 s</div>
          <div className="highlight-lbl">Slow 3G Load Time</div>
          <p className="highlight-sub">71.2% faster initial boot time on throttled networks.</p>
        </div>

        <div className="highlight-card">
          <span className="highlight-icon">📦</span>
          <div className="highlight-val">5 Chunks</div>
          <div className="highlight-lbl">Vite Bundle Output</div>
          <p className="highlight-sub">Independent route chunks loaded on demand.</p>
        </div>

        <div className="highlight-card">
          <span className="highlight-icon">🛡️</span>
          <div className="highlight-val">&lt;Suspense&gt;</div>
          <div className="highlight-lbl">Zero Blank Screens</div>
          <p className="highlight-sub">Meaningful skeleton fallback while chunks transfer.</p>
        </div>
      </section>

      {/* Feature Nav Cards */}
      <section className="route-cards-grid">
        <Link to="/projects" className="route-card card-projects">
          <div className="route-card-header">
            <span className="route-tag">LAZY ROUTE</span>
            <span className="route-chunk-name">Projects.chunk.js</span>
          </div>
          <h3>Task & Portfolio Projects</h3>
          <p>
            Explore modular project architectures with interactive filters. Downloaded only when you click this card.
          </p>
          <span className="card-arrow">Navigate &rarr;</span>
        </Link>

        <Link to="/analytics" className="route-card card-analytics">
          <div className="route-card-header">
            <span className="route-tag tag-heavy">HEAVY COMPONENT</span>
            <span className="route-chunk-name">Analytics.chunk.js</span>
          </div>
          <h3>Performance Analytics</h3>
          <p>
            Interactive SVG data visualizer and latency waterfall simulation. Heavy visualization library isolated in its own bundle.
          </p>
          <span className="card-arrow">Navigate &rarr;</span>
        </Link>

        <Link to="/contact" className="route-card card-contact">
          <div className="route-card-header">
            <span className="route-tag">LAZY ROUTE</span>
            <span className="route-chunk-name">Contact.chunk.js</span>
          </div>
          <h3>Contact & Inquiry</h3>
          <p>
            Controlled state form with real-time character counters and input validation.
          </p>
          <span className="card-arrow">Navigate &rarr;</span>
        </Link>
      </section>
    </div>
  );
}
