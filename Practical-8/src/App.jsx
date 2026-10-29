import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import PerformanceHUD from './components/PerformanceHUD';
import VivaGuideModal from './components/VivaGuideModal';
import lazyWithDelay from './utils/lazyWithDelay';
import './App.css';

// Step 3: Convert route imports to code-split dynamic imports using lazy()
const Home = lazyWithDelay(() => import('./pages/Home'));
const Projects = lazyWithDelay(() => import('./pages/Projects'));
const Analytics = lazyWithDelay(() => import('./pages/Analytics'));
const Contact = lazyWithDelay(() => import('./pages/Contact'));
const NotFound = lazyWithDelay(() => import('./pages/NotFound'));

export default function App() {
  const [isHUDOpen, setIsHUDOpen] = useState(false);
  const [isVivaOpen, setIsVivaOpen] = useState(false);
  const [throttle, setThrottle] = useState(() => localStorage.getItem('p8_throttle') || 'fast3g');

  useEffect(() => {
    window.__PRACTICAL_8_THROTTLE__ = throttle;
    localStorage.setItem('p8_throttle', throttle);
  }, [throttle]);

  return (
    <div className="app-shell">
      {/* Top Navigation */}
      <Navbar
        onOpenHUD={() => setIsHUDOpen(true)}
        onOpenViva={() => setIsVivaOpen(true)}
        throttle={throttle}
        onChangeThrottle={setThrottle}
      />

      {/* Main Content Area with Route-Based Code Splitting & Suspense Boundary */}
      <main className="app-main">
        <div className="container">
          {/* Step 4: Wrap the Routes block with Suspense and a meaningful Fallback UI */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home onOpenHUD={() => setIsHUDOpen(true)} />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {/* Persistent Footer */}
      <Footer />

      {/* Profiler & Viva Modals */}
      <PerformanceHUD
        isOpen={isHUDOpen}
        onClose={() => setIsHUDOpen(false)}
      />

      <VivaGuideModal
        isOpen={isVivaOpen}
        onClose={() => setIsVivaOpen(false)}
      />
    </div>
  );
}
