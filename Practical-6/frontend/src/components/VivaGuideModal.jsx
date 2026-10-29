import React, { useState } from 'react';
import './VivaGuideModal.css';

const VIVA_QUESTIONS = [
  {
    q: '1. What is the 3-Tier Architecture in this MERN Task Manager?',
    a: '• Presentation Tier (Frontend): React 19 single-page app built with Vite, managing reactive state and rendering task components.\n• Application / Logic Tier (Backend): Node.js + Express.js REST server handling request routing, logging middleware, input validation, and business logic on port 5000.\n• Data Tier (Database): MongoDB running on port 27017, storing persisted task documents accessed through Mongoose ODM.'
  },
  {
    q: '2. What is CORS and why is it necessary between React and Express?',
    a: 'CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making AJAX requests to a different domain, port, or protocol than the one serving the web page. Since React runs on port 5173 and Express runs on port 5000, they are different origins. The Express backend uses the "cors" middleware to send headers like "Access-Control-Allow-Origin: *" which permits the browser to complete the fetch() calls.'
  },
  {
    q: '3. How does React handle asynchronous API calls without blocking UI rendering?',
    a: 'React uses standard JavaScript asynchronous paradigms (async/await, fetch(), and Promises) combined with state hooks (useState) and lifecycle hooks (useEffect). When a component mounts, useEffect initiates the fetch() request in the background and sets "isLoading: true". When the Promise resolves or rejects, React updates the state (setTasks or setError) and triggers a reactive re-render to display the new data, keeping the UI fully interactive.'
  },
  {
    q: '4. How does Mongoose ODM schema validation and pre-save hooks work?',
    a: 'Mongoose models define schema rules such as required fields (title: required), string length constraints (minlength: 2), and enums (priority: ["low", "medium", "high"]). The pre-save hook "taskSchema.pre(\'save\')" automatically executes before MongoDB writes to trim extraneous whitespace and refresh updatedAt timestamps. If invalid data is submitted, Mongoose generates a ValidationError which the backend error middleware transforms into an HTTP 400 response.'
  },
  {
    q: '5. Which HTTP status codes are used across this application and why?',
    a: '• 200 OK: Successful GET (retrieve tasks) and PUT (update task)\n• 201 Created: Successful POST (new task document created in MongoDB)\n• 400 Bad Request: Mongoose validation errors or invalid MongoDB ObjectId\n• 404 Not Found: Task ID does not exist in collection, or undefined route\n• 500 Internal Server Error: Unhandled database or server exception'
  },
  {
    q: '6. What is the difference between Optimistic vs Pessimistic UI updates?',
    a: '• Pessimistic update: The UI waits for the backend server and MongoDB to confirm the change before updating the state (e.g., showing a spinner until 200 OK is received). This ensures 100% data consistency.\n• Optimistic update: The UI immediately updates the screen assuming the network call will succeed, and only rolls back if an error occurs. Our application uses a hybrid approach: fast loading states with instant toast feedback upon server confirmation.'
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
            <h2>Practical 6 Oral Examination Guide</h2>
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

