import React, { useState } from 'react';
import './App.css';

// Importing independently structured, reusable components
import NavBar from './components/NavBar';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';

/**
 * App Component - Root Component
 * Composes all individual components into a single-page portfolio layout.
 * Passes data down to child components via props.
 *
 * Architecture Tree:
 * App.jsx
 * ├── NavBar.jsx (Supplementary: active section indicator)
 * ├── Header.jsx (Lab Step 6: receives name & themeColor props)
 * ├── About.jsx (Receives bio & student details props)
 * ├── Skills.jsx (Lab Step 4 & 6: receives skillList props array)
 * ├── Projects.jsx (Post-Lab Assignment: renders 3 projects)
 * └── Footer.jsx (Receives copyright & contact props)
 */
function App() {
  // Navigation active section state
  const [activeSection, setActiveSection] = useState('header');

  // Dynamic prop states for testing live changes (Supplementary & Post-lab work)
  const [studentName, setStudentName] = useState('Om Italiya');
  const [themeColor, setThemeColor] = useState('#6366f1'); // Indigo

  // Skill list passed as prop to Skills.jsx (Lab Step 4 & Step 6)
  const [skillsData, setSkillsData] = useState([
    { name: 'React 19', category: 'Frontend', level: 'Advanced', icon: '⚛️' },
    { name: 'JavaScript (ES6+)', category: 'Core', level: 'Advanced', icon: '📜' },
    { name: 'JSX & Architecture', category: 'Frontend', level: 'Proficient', icon: '🧩' },
    { name: 'Vite Build Tool', category: 'Tooling', level: 'Proficient', icon: '⚡' },
    { name: 'HTML5 & Semantic UI', category: 'Core', level: 'Expert', icon: '🌐' },
    { name: 'CSS3 & Glassmorphism', category: 'Styling', level: 'Proficient', icon: '🎨' },
    { name: 'Props & Data Flow', category: 'React', level: 'Advanced', icon: '🔄' },
    { name: 'Git & Version Control', category: 'DevOps', level: 'Proficient', icon: '🐙' }
  ]);

  // Student academic information passed as prop to About.jsx
  const studentInfo = {
    institution: 'CSPIT',
    course: 'Advanced Web Development Frameworks (AWDF)',
    department: 'Information Technology',
    currentSemester: '5th Semester',
    focusArea: 'Modern Frontend Engineering & Full Stack React'
  };

  // Biography text passed as prop to About.jsx
  const studentBio = `I am Om Italiya, a dedicated Information Technology undergraduate in 5th Semester at CSPIT (CHARUSAT). Through hands-on laboratory practicals with React and Vite, I specialize in developing full-stack web applications, modular component architectures, and intelligent systems while ensuring clean code, optimal user experiences, and robust unidirectional data flow.`;

  // Featured Projects list passed as prop to Projects.jsx (Post-Lab Assignment)
  const projectsData = [
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
  ];

  // Predefined color presets for testing props changes
  const colorPresets = [
    { label: 'Indigo', value: '#6366f1' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Emerald', value: '#10b981' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Rose', value: '#f43f5e' }
  ];

  // Helper to add a skill dynamically to demonstrate props re-render
  const handleAddSampleSkill = () => {
    const sampleSkills = ['TypeScript', 'TailwindCSS', 'Next.js', 'Redux Toolkit', 'GraphQL'];
    const randomSkill = sampleSkills[Math.floor(Math.random() * sampleSkills.length)];
    if (!skillsData.some((s) => s.name === randomSkill)) {
      setSkillsData((prev) => [
        ...prev,
        { name: randomSkill, category: 'Ecosystem', level: 'Learning', icon: '✨' }
      ]);
    }
  };

  return (
    <div className="app-container">
      {/* 1. NavBar Component (Supplementary Problem) */}
      <NavBar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        rollNo="24IT029"
      />

      <main className="main-content">
        {/* Interactive Props Testing Bar for Lab Evaluation & Post-Lab Experimentation */}
        <div className="props-controller-bar">
          <div className="controller-header">
            <span className="controller-title">
              🧪 Dynamic Props Interactive Controller (Post-Lab Experiment)
            </span>
            <span className="controller-hint">
              Modify values below to observe how child components react to props changes in real-time
            </span>
          </div>

          <div className="controller-grid">
            {/* Change Name Prop */}
            <div className="control-group">
              <label htmlFor="student-name-input" className="control-label">
                Name Prop (Header & Footer):
              </label>
              <input
                id="student-name-input"
                type="text"
                className="control-input"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter student name..."
              />
            </div>

            {/* Change Theme Color Prop */}
            <div className="control-group">
              <label className="control-label">
                Theme Color Prop (Header Inline Style):
              </label>
              <div className="color-presets">
                {colorPresets.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => setThemeColor(c.value)}
                    className={`color-dot-btn ${themeColor === c.value ? 'active' : ''}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Add Skill to Array Prop */}
            <div className="control-group">
              <label className="control-label">
                SkillList Array Prop (Skills Component):
              </label>
              <button
                type="button"
                onClick={handleAddSampleSkill}
                className="control-action-btn"
              >
                + Append Skill to Array ({skillsData.length} total)
              </button>
            </div>
          </div>
        </div>

        {/* 2. Header Component (Receives name & themeColor props) */}
        <Header 
          name={studentName}
          title="Frontend & React Architecture Developer"
          tagline="Building scalable, accessible, and reusable component interfaces using React 19 and modern Vite tooling."
          themeColor={themeColor}
          rollNo="24IT029"
        />

        {/* 3. About Component (Receives bio and studentInfo props) */}
        <About 
          bio={studentBio} 
          studentInfo={studentInfo}
        />

        {/* 4. Skills Component (Receives skillList array prop) */}
        <Skills 
          skillList={skillsData} 
          title="Technical Competencies"
          subtitle="Dynamic component rendering via array props and .map() iteration"
        />

        {/* 5. Projects Component (Student Assignment / Post-Lab Work - Receives projectsData prop) */}
        <Projects projectList={projectsData} />
      </main>

      {/* 6. Footer Component (Receives name, rollNo, and email props) */}
      <Footer 
        name={studentName}
        rollNo="24IT029"
        year={2026}
        email="24it029@charusat.edu.in"
      />
    </div>
  );
}

export default App;
