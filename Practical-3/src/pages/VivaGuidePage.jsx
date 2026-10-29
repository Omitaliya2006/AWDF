import React, { useState } from 'react';
import './VivaGuidePage.css';

/**
 * VivaGuidePage Component (Academic Viva & Theory Guide)
 * Comprehensive conceptual guide covering REST API integration, useEffect,
 * lifecycle states, AbortController cleanup, and evaluation rubrics.
 */
function VivaGuidePage() {
  const [openIndex, setOpenIndex] = useState(0);

  const questions = [
    {
      id: 1,
      q: '1. What is the role of useEffect in React functional components, and how does the dependency array control its execution?',
      a: `useEffect allows functional components to perform side effects (such as fetching data from a REST API, subscribing to external stores, or directly manipulating the DOM).

The execution is governed strictly by the dependency array:
• useEffect(fn, []): Runs once when the component mounts. Perfect for initial API calls.
• useEffect(fn, [username]): Runs on mount and whenever the 'username' state changes.
• useEffect(fn): Runs after every single render. Never update state inside this without conditionals, as it causes an infinite re-render loop.`
    },
    {
      id: 2,
      q: '2. Why are "loading" and "error" states necessary when consuming asynchronous REST APIs?',
      a: `Network requests are asynchronous and take non-zero time (ranging from hundreds of milliseconds to several seconds or failing completely).
• Loading State: Informs the user that asynchronous work is underway (via a Spinner or skeleton placeholder) instead of presenting a jarring blank white screen.
• Error State: Gracefully captures HTTP failures (404 Not Found, 403 Rate Limit, 500 Server Error, or offline drops) without crashing the application, and provides an interactive retry button.`
    },
    {
      id: 3,
      q: '3. How does fetch() handle HTTP error statuses like 404 or 500 compared to axios?',
      a: `Unlike Axios (which automatically rejects promises on HTTP 4xx/5xx status codes), the native fetch() API Promise only rejects if there is a network outage or if the request was aborted.

For HTTP 404 or 500 responses, fetch() resolves normally with res.ok set to false. Therefore, developers must explicitly inspect:
if (!res.ok) {
  throw new Error(\`Request failed with status \${res.status}\`);
}
This ensures the catch block triggers and sets the error state.`
    },
    {
      id: 4,
      q: '4. What is the purpose of returning a cleanup function with AbortController from useEffect?',
      a: `When a user rapidly changes search parameters or navigates away before a fetch completes, a "race condition" or memory leak can occur if an unmounted component tries to call setState.

Returning a cleanup function:
return () => controller.abort();
cancels the in-flight HTTP request. The browser halts network transfer and the fetch throws an AbortError, which we ignore cleanly so outdated responses never overwrite current state.`
    },
    {
      id: 5,
      q: '5. Why must components rendered via .map() include a unique "key" prop?',
      a: `React's Reconciliation (Fiber diffing) algorithm relies on the "key" prop to identify which items in a collection have changed, been added, or been removed.

Using unique keys (such as repo.id) enables React to preserve component instance state and re-order elements efficiently without destroying and re-mounting the entire DOM list.`
    }
  ];

  return (
    <div className="viva-page-container route-page">
      <section className="section-wrapper">
        <span className="practical-tag">Academic Preparation</span>
        <h1 className="section-title">
          <span>Practical 3: Viva & Conceptual Analysis</span>
        </h1>
        <p className="section-subtitle">
          Essential theory, interview questions, and evaluation rubric self-check for Practical 3 (AWDF).
        </p>

        {/* Academic Metadata Banner */}
        <div className="student-academic-card glass-card">
          <div className="academic-grid">
            <div>
              <span className="acad-label">Student Name:</span>
              <strong className="acad-value">Om Italiya</strong>
            </div>
            <div>
              <span className="acad-label">Roll Number:</span>
              <strong className="acad-value">24IT029</strong>
            </div>
            <div>
              <span className="acad-label">Institution:</span>
              <strong className="acad-value">CSPIT - CHARUSAT</strong>
            </div>
            <div>
              <span className="acad-label">Course / Semester:</span>
              <strong className="acad-value">AWDF / 5th Semester</strong>
            </div>
          </div>
        </div>

        {/* Interactive Q&A Accordion */}
        <div className="faq-list">
          {questions.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id}
                className={`faq-card glass-card ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="faq-answer-box">
                    <pre className="faq-answer-text">{item.a}</pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Evaluation Rubrics Table */}
        <div className="rubric-section glass-card">
          <h3 className="rubric-title">📋 Practical 3 Evaluation Rubric (20/20 Marks)</h3>
          <div className="table-responsive">
            <table className="rubric-table">
              <thead>
                <tr>
                  <th>Component / Criterion</th>
                  <th>Max Marks</th>
                  <th>Status</th>
                  <th>Implementation Evidence</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>API Fetch with useEffect</strong></td>
                  <td>5</td>
                  <td><span className="grade-pill">✅ 5/5</span></td>
                  <td>Fetched GitHub REST API via async/await in useEffect with AbortController.</td>
                </tr>
                <tr>
                  <td><strong>Loading State Management</strong></td>
                  <td>4</td>
                  <td><span className="grade-pill">✅ 4/4</span></td>
                  <td>Animated Spinner component displayed during fetch with loading state pill.</td>
                </tr>
                <tr>
                  <td><strong>Error State Handling & Retry</strong></td>
                  <td>4</td>
                  <td><span className="grade-pill">✅ 4/4</span></td>
                  <td>ErrorMessage component captures HTTP 404/403/Network failures with retry button.</td>
                </tr>
                <tr>
                  <td><strong>Dynamic Array Rendering</strong></td>
                  <td>4</td>
                  <td><span className="grade-pill">✅ 4/4</span></td>
                  <td>RepoCard components rendered via .map() with unique key=&#123;repo.id&#125;.</td>
                </tr>
                <tr>
                  <td><strong>Supplementary & UX</strong></td>
                  <td>3</td>
                  <td><span className="grade-pill">✅ 3/3</span></td>
                  <td>Dynamic username search, language filters, sorting, Dark/Light mode, Inspector.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VivaGuidePage;
