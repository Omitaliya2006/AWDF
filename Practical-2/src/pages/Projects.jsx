import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

/**
 * Projects Page Component (Route: "/projects")
 * Renders Om Italiya's 3 featured projects.
 * Demonstrates:
 * 1. Client-side routing with React Router
 * 2. useState for category filtering
 * 3. useState for toggling detailed project preview drawer/modal (UI visibility toggle)
 */
function Projects() {
  // useState variable 1: Selected project category filter
  const [selectedCategory, setSelectedCategory] = useState('All');

  // useState variable 2: Selected project for detail modal (UI visibility toggle)
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  const projectsData = [
    {
      id: 1,
      title: 'MediSlip – Hospital Slip Management Portal',
      category: 'Healthcare System',
      description: 'MediSlip is a digital hospital slip management system designed to simplify the creation, management, and tracking of hospital slips. It aims to streamline hospital workflows, reduce paperwork, and improve the accessibility of patient-related records.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
      highlights: [
        'Instant digital OPD and prescription slip generation',
        'Role-based doctor, receptionist, and patient access controls',
        'Secure patient record search and chronological visit histories',
        'Zero paper waste with downloadable PDF receipt summaries'
      ],
      githubUrl: 'https://github.com/Omitaliya2006/AWDF',
      demoUrl: '#'
    },
    {
      id: 2,
      title: 'Human Resource Management System (HRMS)',
      category: 'Enterprise Web App',
      description: 'A web-based HR management system designed to streamline employee data management, attendance tracking, and HR-related administrative tasks. It helps organizations improve efficiency by centralizing employee information and simplifying HR workflows.',
      technologies: ['React', 'JavaScript', 'Database Management', 'Admin Dashboard'],
      highlights: [
        'Centralized employee database with document verification tracking',
        'Daily check-in/check-out attendance logging and leave approvals',
        'Visual administrative dashboard with department metrics',
        'Real-time automated salary slip generation and payroll alerts'
      ],
      githubUrl: 'https://github.com/Omitaliya2006/AWDF',
      demoUrl: '#'
    },
    {
      id: 3,
      title: 'House Price Predictor',
      category: 'Machine Learning',
      description: 'A machine learning-based application that predicts house prices based on property features and relevant housing data. It helps users estimate property values using data analysis and predictive modeling to support informed real estate decisions.',
      technologies: ['Python', 'Machine Learning', 'Data Analysis', 'Predictive Modeling'],
      highlights: [
        'Feature engineering on locality, square footage, and amenities',
        'Regression modeling with high R² predictive accuracy',
        'Interactive property parameter input interface for real-time predictions',
        'Exploratory data analysis with pricing trend visualizations'
      ],
      githubUrl: 'https://github.com/Omitaliya2006/AWDF',
      demoUrl: '#'
    }
  ];

  const categories = ['All', 'Healthcare System', 'Enterprise Web App', 'Machine Learning'];

  const filteredProjects = selectedCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <div className="projects-page route-page">
      <section className="section-wrapper projects-wrapper">
        <div className="section-header">
          <div>
            <div className="route-indicator-row">
              <span className="state-pill">
                <span className="live-dot" />
                Route: "/projects"
              </span>
              <span className="state-count-tag">
                Showing {filteredProjects.length} of {projectsData.length} Projects
              </span>
            </div>
            <h1 className="section-title">
              <span className="section-title-icon">💼</span>
              Featured Software Projects
            </h1>
            <p className="section-subtitle">
              Portfolio projects by Om Italiya (24IT029) • Filter dynamically using <code>useState</code>
            </p>
          </div>

          {/* useState Category Filter Tabs */}
          <div className="category-filter-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="projects-card-grid">
          {filteredProjects.map((project) => (
            <article key={project.id} className="project-feature-card glass-card">
              <div className="card-top-row">
                <span className="category-pill">{project.category}</span>
                <span className="project-id-tag">ID: 0{project.id}</span>
              </div>

              <h2 className="project-heading">{project.title}</h2>
              <p className="project-summary">{project.description}</p>

              <div className="tech-tags-list">
                {project.technologies.map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>

              <div className="card-footer-actions">
                <button
                  type="button"
                  onClick={() => setActiveProjectModal(project)}
                  className="btn btn-primary details-btn"
                >
                  <span>Architecture Details</span>
                  <span>🔍</span>
                </button>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary code-link"
                >
                  <span>Source</span>
                  <span>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner with Routing Link */}
        <div className="projects-contact-cta glass-card">
          <div className="cta-text">
            <h3>Interested in collaborating on a project?</h3>
            <p>Visit the Contact page to send a message via our controlled React form.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            <span>Go to Contact Page</span>
            <span>✉️</span>
          </Link>
        </div>
      </section>

      {/* Reactive Project Details Modal (UI Visibility Toggle via useState) */}
      {activeProjectModal && (
        <div className="modal-backdrop" onClick={() => setActiveProjectModal(null)}>
          <div className="project-detail-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="category-pill">{activeProjectModal.category}</span>
                <h3 className="modal-project-title">{activeProjectModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="modal-project-body">
              <h4>Project Synopsis</h4>
              <p className="modal-desc">{activeProjectModal.description}</p>

              <h4>Core Architectural Highlights</h4>
              <ul className="highlights-list">
                {activeProjectModal.highlights.map((h, i) => (
                  <li key={i}>
                    <span className="check-icon">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <h4>Technology Stack</h4>
              <div className="tech-tags-list">
                {activeProjectModal.technologies.map((t) => (
                  <span key={t} className="tech-tag">{t}</span>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <span className="student-tag">Developer: Om Italiya (24IT029)</span>
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                className="btn btn-secondary"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
