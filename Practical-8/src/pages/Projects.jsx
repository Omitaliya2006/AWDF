import React, { useState } from 'react';
import './Projects.css';

const SAMPLE_PROJECTS = [
  {
    id: 1,
    title: 'Full-Stack Task Manager (MERN)',
    category: 'Full-Stack',
    tech: ['React 19', 'Express 4.21', 'MongoDB', 'Mongoose'],
    desc: 'End-to-end task management platform with persistent MongoDB storage and RESTful CRUD endpoints.',
    status: 'Completed'
  },
  {
    id: 2,
    title: 'JWT Authentication & Security Pipeline',
    category: 'Backend',
    tech: ['Node.js', 'bcryptjs', 'jsonwebtoken', 'Express Middleware'],
    desc: 'Express middleware pipeline enforcing 10 salt rounds password hashing, Bearer tokens, and input validation.',
    status: 'Completed'
  },
  {
    id: 3,
    title: 'GitHub API REST Inspector',
    category: 'Frontend',
    tech: ['React 19', 'Hooks (useEffect)', 'AbortController', 'REST API'],
    desc: 'Asynchronous GitHub repository explorer with dynamic profile lookup, filters, and loading fallbacks.',
    status: 'Completed'
  },
  {
    id: 4,
    title: 'Multi-Page SPA Router',
    category: 'Frontend',
    tech: ['React Router v7', 'useState', 'Modular CSS', 'Vite'],
    desc: 'Client-side routing with NavLink active states, controlled forms, and reactive dark mode toggle.',
    status: 'Completed'
  }
];

export default function Projects() {
  const [filter, setFilter] = useState('All');

  const filteredProjects =
    filter === 'All'
      ? SAMPLE_PROJECTS
      : SAMPLE_PROJECTS.filter((p) => p.category === filter);

  return (
    <div className="projects-page-container">
      <div className="chunk-notice-banner">
        <span className="notice-icon">📦</span>
        <div className="notice-text">
          <strong>Lazy Route Activated:</strong> This component was dynamically downloaded as <code>Projects.chunk.js</code> via <code>React.lazy()</code>.
        </div>
      </div>

      <div className="projects-header">
        <div>
          <h2>Featured Academic Projects</h2>
          <p>Practical deliverables developed by Om Italiya (24IT029) for AWDF Course.</p>
        </div>

        <div className="filter-pills">
          {['All', 'Full-Stack', 'Frontend', 'Backend'].map((cat) => (
            <button
              key={cat}
              className={`filter-pill ${filter === cat ? 'filter-pill-active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-grid">
        {filteredProjects.map((proj) => (
          <div key={proj.id} className="project-card">
            <div className="project-card-top">
              <span className="project-cat-badge">{proj.category}</span>
              <span className="project-status-badge">{proj.status}</span>
            </div>
            <h3>{proj.title}</h3>
            <p className="project-desc">{proj.desc}</p>
            <div className="project-tech-tags">
              {proj.tech.map((t, idx) => (
                <span key={idx} className="tech-tag">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
