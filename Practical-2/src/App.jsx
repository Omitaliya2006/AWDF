import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HelpModal from './components/HelpModal';

// Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

/**
 * App Component - Root Routing & State Manager for Practical 2
 *
 * Requirements Met:
 * 1. Step 2 & 3: Multi-page SPA Routing with React Router v6 (<Routes> and <Route>)
 * 2. Step 4: NavLink integration for smooth navigation without page reloads
 * 3. Step 5 & 6: Reactive useState state variables (Theme toggle, Help modal visibility, Contact form)
 * 4. Supplementary: 404 Wildcard Route (*) & Dark/Light mode toggle
 */
function App() {
  // useState: Theme toggle (Supplementary Problem: Dark/Light mode toggle applied to root element)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'dark';
  });

  // useState: Help Modal visibility toggle (Lab Step 6: UI visibility toggle)
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Synchronize theme with root DOM attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-layout">
      {/* Navigation Bar with Link/NavLink */}
      <NavBar
        theme={theme}
        toggleTheme={toggleTheme}
        showHelpModal={showHelpModal}
        setShowHelpModal={setShowHelpModal}
      />

      {/* Reactive Help & Theory Concepts Modal (useState UI Visibility Toggle) */}
      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      {/* Main Content Area: Routes */}
      <main className="main-content">
        <Routes>
          {/* Route 1: Home */}
          <Route path="/" element={<Home />} />

          {/* Route 2: Projects */}
          <Route path="/projects" element={<Projects />} />

          {/* Route 3: Contact (Controlled Form) */}
          <Route path="/contact" element={<Contact />} />

          {/* Route 4: Wildcard 404 Not Found (Supplementary Problem) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
}

export default App;
