import React, { useState } from 'react';
import './VivaGuideModal.css';

const VIVA_QUESTIONS = [
  {
    q: '1. What is the difference between the initial bundle and a lazy-loaded chunk in terms of download timing?',
    a: '• Initial Bundle (e.g. index.js): Downloaded and executed immediately when the user first loads the application. It contains the essential runtime, React core, router definitions, and base layout.\n• Lazy-Loaded Chunk (e.g. Projects.chunk.js): Downloaded on-demand ONLY when the user navigates to the associated route (e.g. /projects). Until that route is visited, the browser never requests or parses that JavaScript, keeping the initial payload minimal.'
  },
  {
    q: '2. Why does lazy loading improve perceived performance even though the total code size stays roughly the same?',
    a: 'Perceived performance is dominated by First Contentful Paint (FCP) and Time to Interactive (TTI):\n1. Network Bottlenecks: A smaller initial bundle finishes downloading much faster, particularly on mobile connections.\n2. Main-Thread Compilation: The browser JavaScript engine must parse, compile, and execute all downloaded script tags. By deferring non-critical routes, the main thread boots immediately.\n3. User Psychology: The user sees an interactive screen in under a second rather than staring at a white blank screen for 3 seconds while code they might never visit downloads.'
  },
  {
    q: '3. In what situations would lazy loading NOT be worth the added complexity?',
    a: '• Tiny / Lightweight Applications: If the entire production application bundle is under 50-80 KB gzipped, splitting it into multiple 5 KB chunks introduces unnecessary HTTP request overhead and network latency without perceptible benefit.\n• Critical Above-the-Fold Paths: Components required for the initial landing experience should not be lazy loaded, as that introduces an unwanted loading spinner on first paint.\n• Highly Interconnected Tiny Modals: Over-splitting small sub-components creates request waterfalls where users experience micro-spinners on every minor interaction.'
  },
  {
    q: '4. Why does React.lazy() require dynamic import() and default exports?',
    a: 'React.lazy() takes a function that returns a Promise resolving to a module with a "default" export: lazy(() => import("./Component")). Under the hood, the dynamic import() syntax triggers the build bundler (Vite / Rollup / Webpack) to create a separate output chunk file and load it via dynamic script injection. React expects the component definition at module.default.'
  },
  {
    q: '5. How does <Suspense> protect the app from crashing when a chunk is loading or network is slow?',
    a: 'When a lazy component is requested, React encounters an unresolved Promise thrown by the lazy loader. Instead of throwing an unhandled runtime exception, the enclosing <Suspense> boundary catches the pending Promise, catches the render tree, and mounts the declared fallback UI (e.g., <PageLoader />). When the Promise resolves, React seamlessly transitions from the fallback to the rendered page.'
  },
  {
    q: '6. How do you simulate and verify lazy loading in Google Chrome DevTools?',
    a: '1. Open DevTools (F12) -> Network tab.\n2. Filter by "JS" to isolate script requests.\n3. Reload the page at "/" - notice only index-[hash].js and Home-[hash].js load.\n4. Set Network Throttling to "Slow 3G" or "Fast 3G".\n5. Click on the "/projects" link -> Observe the Suspense Fallback UI rendered on screen while Projects-[hash].js is actively transferring in the Network waterfall.'
  }
];

export default function VivaGuideModal({ isOpen, onClose }) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="viva-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="viva-header">
          <div className="viva-title-wrapper">
            <span className="viva-badge">EXAM & VIVA PREPARATION</span>
            <h2>Practical 8 Oral Examination Guide</h2>
            <p className="viva-subtitle">Om Italiya (24IT029) • Information Technology • CSPIT CHARUSAT</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close viva guide">
            &times;
          </button>
        </div>

        <div className="viva-body">
          <div className="viva-accordion">
            {VIVA_QUESTIONS.map((item, idx) => (
              <div
                key={idx}
                className={`accordion-item ${openIndex === idx ? 'accordion-item-open' : ''}`}
              >
                <button
                  className="accordion-header"
                  onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                >
                  <span className="accordion-title">{item.q}</span>
                  <span className="accordion-arrow">{openIndex === idx ? '▲' : '▼'}</span>
                </button>
                {openIndex === idx && (
                  <div className="accordion-content">
                    <pre className="accordion-text">{item.a}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="viva-footer">
          <button className="viva-close-btn" onClick={onClose}>
            Close Viva Guide
          </button>
        </div>
      </div>
    </div>
  );
}
