import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/**
 * Home Page Component (Route: "/")
 * Composes Header, About, Skills, and an interactive Viva guide drawer.
 * Utilizes useState for reactive UI visibility toggling and skill categorization.
 */
function Home() {
  // useState variable 1: Toggle UI visibility for Lab 2 Architecture & Viva guide
  const [showVivaGuide, setShowVivaGuide] = useState(false);

  // useState variable 2: Category filter for skills
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('All');

  const skillsData = [
    { name: 'React 19 & JSX', category: 'Frontend', level: 'Advanced', icon: '⚛️' },
    { name: 'React Router v7', category: 'Frontend', level: 'Proficient', icon: '🧭' },
    { name: 'useState & State Management', category: 'Frontend', level: 'Advanced', icon: '🔄' },
    { name: 'JavaScript (ES6+)', category: 'Core', level: 'Advanced', icon: '📜' },
    { name: 'HTML5 & Semantic DOM', category: 'Core', level: 'Expert', icon: '🌐' },
    { name: 'CSS3 & Glassmorphism', category: 'Styling', level: 'Proficient', icon: '🎨' },
    { name: 'Node.js & Express', category: 'Backend', level: 'Proficient', icon: '🟢' },
    { name: 'MongoDB & Database', category: 'Backend', level: 'Proficient', icon: '🍃' },
    { name: 'Python & ML Modeling', category: 'Machine Learning', level: 'Proficient', icon: '🐍' },
  ];

  const categories = ['All', 'Frontend', 'Core', 'Backend', 'Machine Learning'];

  const filteredSkills = selectedSkillCategory === 'All'
    ? skillsData
    : skillsData.filter((s) => s.category === selectedSkillCategory);

  return (
    <div className="home-page route-page">
      {/* Hero Section */}
      <section className="section-wrapper hero-section">
        <div className="hero-content">
          <div className="badge-row">
            <span className="state-pill">
              <span className="live-dot" />
              Route: "/" • SPA Home View
            </span>
            <span className="academic-badge">CSPIT • 5th Sem IT</span>
          </div>

          <h1 className="hero-title">
            Hi, I'm <span className="highlight-text">Om Italiya</span> 👋
          </h1>
          <h2 className="hero-subtitle">
            Frontend & React Architecture Developer (24IT029)
          </h2>
          <p className="hero-description">
            Welcome to <strong>Practical 2: State Management & Multi-Page Routing</strong> in React. 
            Demonstrating single-page application navigation with <code>react-router-dom</code> and reactive state management using <code>useState</code> hooks without full page reloads.
          </p>

          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              <span>View Projects ({3})</span>
              <span>→</span>
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              <span>Contact Form (useState)</span>
              <span>✉️</span>
            </Link>
            {/* useState UI visibility toggle button */}
            <button
              type="button"
              onClick={() => setShowVivaGuide(!showVivaGuide)}
              className="btn btn-secondary toggle-guide-btn"
            >
              <span>{showVivaGuide ? 'Hide' : 'Show'} Lab Concept Guide</span>
              <span>{showVivaGuide ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>

        <div className="hero-avatar">
          <div className="avatar-circle">
            <span className="avatar-icon">👨‍💻</span>
          </div>
        </div>
      </section>

      {/* Reactive UI Visibility Toggle Section (useState Requirement) */}
      {showVivaGuide && (
        <section className="section-wrapper viva-guide-box">
          <div className="viva-header">
            <div className="viva-title-group">
              <span className="viva-badge">useState Active</span>
              <h3 className="viva-title">📘 Practical 2 Technical Concepts Breakdown</h3>
            </div>
            <button
              type="button"
              onClick={() => setShowVivaGuide(false)}
              className="viva-close"
              title="Close guide"
            >
              ✕
            </button>
          </div>
          <div className="viva-grid">
            <div className="viva-card glass-card">
              <h4>Client-Side Routing</h4>
              <p>
                Uses <code>BrowserRouter</code> and <code>NavLink</code> to dynamically manipulate the browser History API, swapping views instantly without refreshing the page.
              </p>
            </div>
            <div className="viva-card glass-card">
              <h4>Reactive State (useState)</h4>
              <p>
                Triggers automatic re-renders when state updates. Used here to toggle this guide's visibility and to filter skills dynamically.
              </p>
            </div>
            <div className="viva-card glass-card">
              <h4>Controlled Form Inputs</h4>
              <p>
                Contact inputs are 100% controlled components bound to React state, enabling real-time validation and live character counting.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="section-wrapper about-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-title-icon">👤</span>
              About Om Italiya
            </h2>
            <p className="section-subtitle">
              Academic Background & Coursework Alignment (CO1 / PO3, PO5)
            </p>
          </div>
          <span className="section-badge">Student Profile</span>
        </div>

        <div className="about-grid">
          <div className="about-bio-card glass-card">
            <h3 className="card-heading">Biographical Overview</h3>
            <p className="bio-text">
              I am <strong>Om Italiya</strong> (Roll No: <strong>24IT029</strong>), currently in my 5th Semester of B.Tech Information Technology at <strong>CSPIT, CHARUSAT University</strong>.
              My primary focus lies in architecting scalable, reactive web applications using modern React ecosystems, component decomposition, and full-stack integration.
            </p>
            <div className="alignment-tags">
              <span className="tag-item"><strong>CO1:</strong> Component Architecture & Routing</span>
              <span className="tag-item"><strong>PO3:</strong> Modular Software Design</span>
              <span className="tag-item"><strong>PO5:</strong> Modern Web Engineering Tools</span>
            </div>
          </div>

          <div className="about-stats-card glass-card">
            <h3 className="card-heading">Academic Metadata</h3>
            <ul className="meta-list">
              <li>
                <span className="meta-lbl">Institution:</span>
                <span className="meta-val">CSPIT (CHARUSAT)</span>
              </li>
              <li>
                <span className="meta-lbl">Course:</span>
                <span className="meta-val">Advanced Web Development Frameworks</span>
              </li>
              <li>
                <span className="meta-lbl">Semester:</span>
                <span className="meta-val highlight">5th Semester</span>
              </li>
              <li>
                <span className="meta-lbl">Email:</span>
                <span className="meta-val">24it029@charusat.edu.in</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Skills Section with useState Interactive Category Filter */}
      <section className="section-wrapper skills-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">
              <span className="section-title-icon">⚡</span>
              Technical Competencies
            </h2>
            <p className="section-subtitle">
              Filter competencies dynamically using <code>useState</code> category state
            </p>
          </div>
          <div className="skills-filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedSkillCategory(cat)}
                className={`filter-btn ${selectedSkillCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <div key={skill.name} className="skill-item-card glass-card">
              <div className="skill-card-header">
                <span className="skill-icon">{skill.icon}</span>
                <span className="skill-cat-pill">{skill.category}</span>
              </div>
              <h4 className="skill-name">{skill.name}</h4>
              <div className="skill-level-row">
                <span className="level-indicator" />
                <span className="level-text">{skill.level}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
