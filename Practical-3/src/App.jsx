import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ReposPage from './pages/ReposPage';
import ApiInspectorPage from './pages/ApiInspectorPage';
import VivaGuidePage from './pages/VivaGuidePage';
import NotFound from './pages/NotFound';
import './App.css';

/**
 * App Component - Practical 3 Root Layout & Router
 *
 * Requirements Met:
 * 1. Lab Step 1-4: Asynchronous REST API integration with loading/error states & component mapping
 * 2. Supplementary: Dynamic username search, live state monitor, language filters, API inspector
 * 3. Persistence: Theme preference stored in localStorage with data-theme synchronization
 * 4. Multi-view Routing: Seamless SPA navigation via react-router-dom without page reloads
 */
function App() {
  // Theme state: defaults to dark or stored preference
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('awdf-practical3-theme') || 'dark';
  });

  // Synchronize data-theme on root HTML document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('awdf-practical3-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="app-layout">
      {/* Sticky Navigation Bar */}
      <NavBar theme={theme} toggleTheme={toggleTheme} />

      {/* Main Routed Page Content */}
      <main className="main-content">
        <Routes>
          {/* Main View: Repositories Explorer & GitHub REST API Integration */}
          <Route path="/" element={<ReposPage />} />

          {/* Diagnostic View: API Lifecycle Inspector & Payload Viewer */}
          <Route path="/inspector" element={<ApiInspectorPage />} />

          {/* Academic View: Viva Questions, Answers & Evaluation Rubrics */}
          <Route path="/viva" element={<VivaGuidePage />} />

          {/* Wildcard 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Reusable Academic Footer */}
      <Footer />
    </div>
  );
}

export default App;
