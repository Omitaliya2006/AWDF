import React from 'react';
import './HelpModal.css';

/**
 * HelpModal Component
 * Implements reactive UI visibility toggle using useState (Lab Step 6 & Rubric).
 * Displays concise lab theory concepts, routes map, and useState architecture.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Controlled visibility state
 * @param {Function} props.onClose - State updater to close modal
 */
function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-card glass-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-title-row">
            <span className="modal-badge">Practical 2 Guide</span>
            <h3 className="modal-title">⚛️ State Management & React Router v6</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="modal-close-btn"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="concept-block">
            <h4>1. React Router v6 Architecture</h4>
            <p>
              SPA routing avoids full page reload by intercepting anchor clicks and updating the browser History API without refreshing the page.
            </p>
            <ul className="concept-list">
              <li><code>&lt;BrowserRouter&gt;</code> in <code>main.jsx</code> wraps the component tree.</li>
              <li><code>&lt;NavLink to="..."&gt;</code> manages navigation links and automatically sets <code>.active</code> class.</li>
              <li><code>&lt;Routes&gt;</code> & <code>&lt;Route&gt;</code> map paths (<code>/</code>, <code>/projects</code>, <code>/contact</code>, <code>*</code>) to page views.</li>
            </ul>
          </div>

          <div className="concept-block">
            <h4>2. Controlled Form Input with useState</h4>
            <p>
              An input element whose value is controlled by React state. Form data is handled by the component rather than the DOM.
            </p>
            <pre className="code-snippet">
              <code>{`const [message, setMessage] = useState('');
<input 
  value={message} 
  onChange={(e) => setMessage(e.target.value)} 
/>`}</code>
            </pre>
          </div>

          <div className="concept-block">
            <h4>3. Reactive UI State Toggles</h4>
            <ul className="concept-list">
              <li><strong>Dark/Light Theme:</strong> Controlled via <code>theme</code> state on root DOM element.</li>
              <li><strong>Help Guide Modal:</strong> Toggled dynamically with <code>showHelpModal</code> boolean.</li>
              <li><strong>Project Filter Tabs:</strong> Dynamically filters projects using <code>activeFilter</code> state.</li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <span className="student-tag">Om Italiya • 24IT029 • CSPIT</span>
          <button type="button" onClick={onClose} className="btn btn-primary">
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;
