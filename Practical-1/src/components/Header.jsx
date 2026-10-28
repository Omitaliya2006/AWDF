import React from 'react';
import './Header.css';

/**
 * Header Component
 * Demonstrates receiving props from parent (name, title, tagline, themeColor)
 * and applying dynamic inline styles using the themeColor prop.
 *
 * @param {Object} props
 * @param {string} props.name - Student Name passed as prop (Required by Lab Step 6)
 * @param {string} props.title - Professional title/role
 * @param {string} props.tagline - Short bio/headline
 * @param {string} props.themeColor - Theme color prop applied as inline style (Supplementary Problem)
 * @param {string} props.rollNo - Student roll number
 */
function Header({ 
  name, 
  title = 'Frontend Developer & Computer Science Student', 
  tagline = 'Crafting clean, accessible, and high-performance component-driven web applications.',
  themeColor = '#6366f1',
  rollNo = '24IT029'
}) {
  return (
    <header 
      id="header" 
      className="header-hero section-wrapper"
      style={{
        borderColor: `${themeColor}40`,
        boxShadow: `0 12px 32px ${themeColor}15`
      }}
    >
      {/* Decorative Glow Orb using themeColor inline style */}
      <div 
        className="header-ambient-glow"
        style={{
          background: `radial-gradient(circle, ${themeColor}25 0%, transparent 70%)`
        }}
      />

      <div className="header-content">
        <div className="header-badge-row">
          <span 
            className="status-pill"
            style={{ 
              borderColor: `${themeColor}50`, 
              color: themeColor,
              backgroundColor: `${themeColor}15`
            }}
          >
            <span 
              className="status-pill-dot" 
              style={{ backgroundColor: themeColor, boxShadow: `0 0 10px ${themeColor}` }}
            />
            CO1 / PO3, PO5 Practical 1
          </span>
          <span className="student-id-pill">Roll No: {rollNo}</span>
        </div>

        {/* Student Name & Site Title */}
        <h1 className="header-name">
          Hi, I'm <span className="highlight-text" style={{ color: themeColor }}>{name}</span> 👋
        </h1>

        <h2 className="header-role">{title}</h2>

        <p className="header-tagline">{tagline}</p>

        {/* Action Buttons */}
        <div className="header-actions">
          <a 
            href="#projects" 
            className="btn btn-primary"
            style={{ 
              background: `linear-gradient(135deg, ${themeColor}, #4338ca)`,
              boxShadow: `0 4px 16px ${themeColor}40`
            }}
          >
            <span>Explore Projects</span>
            <span>↓</span>
          </a>
          <a href="#about" className="btn btn-secondary">
            <span>About Me</span>
          </a>
          <a 
            href="#contact" 
            className="btn btn-secondary"
            style={{ borderColor: `${themeColor}35` }}
          >
            <span>Get in Touch</span>
          </a>
        </div>

        {/* Meta Feature Tags */}
        <div className="header-meta">
          <div className="meta-item">
            <span className="meta-icon">⚡</span>
            <span>Vite Powered</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🧩</span>
            <span>React Components</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🎨</span>
            <span>Dynamic Props: <code style={{ color: themeColor }}>{themeColor}</code></span>
          </div>
        </div>
      </div>

      {/* Avatar / Visual Element */}
      <div className="header-avatar-container">
        <div 
          className="avatar-ring"
          style={{ borderColor: `${themeColor}60` }}
        >
          <div 
            className="avatar-inner"
            style={{ background: `linear-gradient(135deg, ${themeColor}30, #111726)` }}
          >
            <span className="avatar-emoji">👨‍💻</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
