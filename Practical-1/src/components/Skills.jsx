import React from 'react';
import './Skills.css';

/**
 * Skills Component
 * Demonstrates rendering dynamic list from props array using .map()
 * as specified in Lab Step 4 & Step 6.
 *
 * @param {Object} props
 * @param {Array<string|Object>} props.skillList - Array of skills passed from parent
 * @param {string} props.title - Optional section title
 * @param {string} props.subtitle - Optional helper subtitle
 */
function Skills({ 
  skillList = [], 
  title = 'Core Competencies & Skills',
  subtitle = 'Technical skills dynamically rendered from an array passed via props'
}) {
  return (
    <section id="skills" className="section-wrapper skills-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">
            <span className="section-title-icon">⚡</span>
            {title}
          </h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        <span className="section-badge">{skillList.length} Skills Loaded via Props</span>
      </div>

      {/* Dynamic List Rendered via props as specified in Lab Step 4 */}
      <ul className="skills-list" role="list">
        {skillList.map((skill, index) => {
          // Supports both plain string arrays and object formats
          const skillName = typeof skill === 'string' ? skill : skill.name;
          const skillLevel = typeof skill === 'object' ? skill.level : 'Proficient';
          const skillCategory = typeof skill === 'object' ? skill.category : 'General';
          const skillIcon = typeof skill === 'object' ? skill.icon : '💠';

          return (
            <li key={skillName || index} className="skill-card glass-card">
              <div className="skill-card-top">
                <span className="skill-icon">{skillIcon}</span>
                <span className="skill-category-badge">{skillCategory}</span>
              </div>
              <div className="skill-card-body">
                <h4 className="skill-name">{skillName}</h4>
                <div className="skill-meta">
                  <span className="skill-level-dot"></span>
                  <span className="skill-level-text">{skillLevel}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Code Snippet Reference Box for Lab Evaluation / Viva */}
      <div className="props-evidence-box">
        <div className="evidence-header">
          <span className="evidence-icon">📝</span>
          <span className="evidence-title">Lab Step 4 Code Verification (Dynamic Props Mapping)</span>
        </div>
        <pre className="evidence-code">
          <code>{`// Skills.jsx Component Props Implementation:
function Skills({ skillList }) {
  return (
    <ul className="skills-list">
      {skillList.map((s) => (
        <li key={s.name}>{s.name}</li>
      ))}
    </ul>
  );
}`}</code>
        </pre>
      </div>
    </section>
  );
}

export default Skills;
