import React from 'react';
import './About.css';

/**
 * About Component
 * Presents student biographical information, academic background,
 * and course alignment (CO1 / PO3, PO5) through props.
 *
 * @param {Object} props
 * @param {string} props.bio - Narrative biography text
 * @param {Object} props.studentInfo - Structured academic details
 */
function About({ 
  bio, 
  studentInfo = {
    institution: 'CSPIT',
    course: 'Advanced Web Development Frameworks (AWDF)',
    department: 'Information Technology',
    currentSemester: '5th Semester',
    focusArea: 'Modern Frontend Engineering & Full Stack React'
  }
}) {
  return (
    <section id="about" className="section-wrapper about-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="section-title-icon">👤</span>
          About Me
        </h2>
        <span className="section-badge">Student Profile</span>
      </div>

      <div className="about-grid">
        {/* Left column: Bio statement */}
        <div className="about-bio-card glass-card">
          <h3 className="about-subheading">Background & Aspirations</h3>
          <p className="about-bio-text">{bio}</p>
          
          <div className="about-course-alignment">
            <h4 className="alignment-title">Course Alignment</h4>
            <div className="alignment-tags">
              <span className="course-tag">
                <strong>CO1:</strong> React Basics & Component Architecture
              </span>
              <span className="course-tag">
                <strong>PO3:</strong> Design/Development of Solutions
              </span>
              <span className="course-tag">
                <strong>PO5:</strong> Modern Tool Usage (Vite, React 19)
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Academic Details Card */}
        <div className="about-info-card glass-card">
          <h3 className="about-subheading">Academic Details</h3>
          <ul className="info-list">
            <li className="info-item">
              <span className="info-label">Institution</span>
              <span className="info-value">{studentInfo.institution}</span>
            </li>
            <li className="info-item">
              <span className="info-label">Course</span>
              <span className="info-value">{studentInfo.course}</span>
            </li>
            <li className="info-item">
              <span className="info-label">Department</span>
              <span className="info-value">{studentInfo.department}</span>
            </li>
            <li className="info-item">
              <span className="info-label">Semester</span>
              <span className="info-value">{studentInfo.currentSemester}</span>
            </li>
            <li className="info-item">
              <span className="info-label">Focus</span>
              <span className="info-value highlight">{studentInfo.focusArea}</span>
            </li>
          </ul>

          <div className="about-metrics">
            <div className="metric-box">
              <span className="metric-number">4+</span>
              <span className="metric-label">Components</span>
            </div>
            <div className="metric-box">
              <span className="metric-number">100%</span>
              <span className="metric-label">Reusable</span>
            </div>
            <div className="metric-box">
              <span className="metric-number">0</span>
              <span className="metric-label">JSX Duplication</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
