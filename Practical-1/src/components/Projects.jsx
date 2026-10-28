import React from 'react';
import './Projects.css';

/**
 * Projects Component (Student Assignment / Post-Lab Work)
 * Renders a list of projects passed down via props.
 * Demonstrates component reusability and dynamic prop mapping.
 *
 * @param {Object} props
 * @param {Array<Object>} props.projectList - Array of project objects
 */
function Projects({ 
  projectList = [
    {
      id: 1,
      title: 'MediSlip – Hospital Slip Management Portal',
      description: 'MediSlip is a digital hospital slip management system designed to simplify the creation, management, and tracking of hospital slips. It aims to streamline hospital workflows, reduce paperwork, and improve the accessibility of patient-related records.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
      category: 'Healthcare System',
      liveDemoUrl: '#',
      githubUrl: 'https://github.com'
    },
    {
      id: 2,
      title: 'Human Resource Management System (HRMS)',
      description: 'A web-based HR management system designed to streamline employee data management, attendance tracking, and HR-related administrative tasks. It helps organizations improve efficiency by centralizing employee information and simplifying HR workflows.',
      technologies: ['React', 'JavaScript', 'Database Management', 'Admin Dashboard'],
      category: 'Enterprise Web App',
      liveDemoUrl: '#',
      githubUrl: 'https://github.com'
    },
    {
      id: 3,
      title: 'House Price Predictor',
      description: 'A machine learning-based application that predicts house prices based on property features and relevant housing data. It helps users estimate property values using data analysis and predictive modeling to support informed real estate decisions.',
      technologies: ['Python', 'Machine Learning', 'Data Analysis', 'Predictive Modeling'],
      category: 'Machine Learning',
      liveDemoUrl: '#',
      githubUrl: 'https://github.com'
    }
  ]
}) {
  return (
    <section id="projects" className="section-wrapper projects-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span className="section-title-icon">🚀</span>
            Featured Projects
          </h2>
          <p className="section-subtitle">
            Post-Laboratory assignment: Reusable project cards rendered from props
          </p>
        </div>
        <span className="section-badge">{projectList.length} Projects</span>
      </div>

      <div className="projects-grid">
        {projectList.map((project) => (
          <article key={project.id} className="project-card glass-card">
            <div className="project-header">
              <span className="project-category">{project.category}</span>
              <div className="project-links">
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="project-icon-link"
                  title="Source Code"
                >
                  ⌥
                </a>
                <a 
                  href={project.liveDemoUrl} 
                  className="project-icon-link"
                  title="Live Demo"
                >
                  ↗
                </a>
              </div>
            </div>

            <h3 className="project-title">{project.title}</h3>
            <p className="project-desc">{project.description}</p>

            <div className="project-tech-stack">
              {project.technologies.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;
