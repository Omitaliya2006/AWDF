import React, { useState } from 'react';
import './VivaGuideModal.css';

const VIVA_QA = [
  {
    q: '1. Why does emitting an event not block the API response, even though both run on the same Node.js process?',
    a: `By standard design, EventEmitter's emit() calls listener functions synchronously. However, when asynchronous operations (such as setTimeout, setImmediate, or async I/O calls) are utilized within the listener or when emit() is placed after the res.status(201).json() call:
1. The Express route handler prepares and transmits the HTTP 201 response immediately, completing the HTTP request-response cycle on the client.
2. The asynchronous listener callback is offloaded to the Node.js Event Loop (Timers/Poll phase).
3. The Node.js single thread is freed up to process incoming requests without waiting for the background listener (e.g. email sending, logging, webhook dispatching) to complete.`
  },
  {
    q: '2. What would happen to API response time if the notification logic were placed directly inside the POST route instead of in an event handler?',
    a: `If the notification logic (e.g. querying an email SMTP server or heavy audit logging taking 1500ms) were placed directly inside the POST /tasks route:
• The HTTP client would be blocked for the full 1500ms+ while the server performs the side effect.
• API response latency would spike from ~15ms to over 1500ms.
• Server throughput (requests per second) would drop drastically, causing client timeouts under concurrent traffic.
Using EventEmitter decouples side effects from the critical request path, keeping API response latency under ~20ms.`
  },
  {
    q: '3. Why is EventEmitter suitable for this application scale, but not for high-throughput multi-server production systems?',
    a: `Node.js EventEmitter is an in-process, in-memory event bus:
• Single Process Limitation: It only works within a single Node.js process memory space. If an app scales horizontally across multiple instances (e.g. behind NGINX or in Docker/Kubernetes), events emitted on Server A cannot reach listeners on Server B.
• No Persistence or Guarantees: If the Node.js process crashes while a background event is queued, the event is permanently lost (no at-least-once delivery or message acknowledgments).
• Production Alternative: High-throughput systems use distributed message brokers like RabbitMQ, Apache Kafka, or Redis Pub/Sub/BullMQ.`
  },
  {
    q: '4. What special behavior occurs when an unhandled "error" event is emitted on an EventEmitter?',
    a: `EventEmitter treats the 'error' event as a special reserved case:
• If an EventEmitter emits an 'error' event and NO listener has been registered for 'error', Node.js treats it as an uncaught exception, prints the stack trace, and immediately terminates (crashes) the entire Node.js process!
• Therefore, robust architectures must always register at least one taskEvents.on('error', (err) => { ... }) listener to catch background processing failures gracefully.`
  },
  {
    q: '5. How does the console timestamp ordering prove non-blocking execution?',
    a: `In this practical:
1. When a task is created, the route logs: [API] Response sent at T_0 (e.g. 18:35:21.665Z) and returns HTTP 201 to the client.
2. The background listener executes after the configured delay and logs: [Notification] Task created at T_1 (e.g. 18:35:22.271Z).
Because T_1 > T_0 (by exactly the ~600ms - 1500ms background delay), this provides irrefutable empirical proof that the client received its response long before the background task completed.`
  },
  {
    q: '6. How does this event-driven architecture compare with Practical 9\'s caching strategy?',
    a: `Both techniques optimize the critical request-response path:
• Practical 9 (Caching): Decouples database reads by serving data directly from in-memory RAM (node-cache), reducing read latency from ~16ms to ~0.8ms.
• Practical 10 (Event-Driven): Decouples write side effects by delegating notifications and audit trails to asynchronous background listeners, ensuring mutations respond in ~15ms without waiting for slow downstream tasks.`
  }
];

export default function VivaGuideModal({ isOpen, onClose }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container viva-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-box">
            <span className="header-icon">🎓</span>
            <div>
              <h3>Practical 10 Oral Viva & Theory Defense Guide</h3>
              <p className="header-sub">EventEmitter, Non-Blocking Event Loop, and Side-Effect Decoupling</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="viva-modal-body">
          <div className="viva-tabs">
            {VIVA_QA.map((item, idx) => (
              <button
                key={idx}
                className={`viva-tab-btn ${activeIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                Q{idx + 1}: {item.q.split('?')[0].replace(/^\d+\.\s*/, '').slice(0, 36)}...
              </button>
            ))}
          </div>

          <div className="viva-content-box">
            <h4 className="viva-question">{VIVA_QA[activeIdx].q}</h4>
            <div className="viva-answer">
              {VIVA_QA[activeIdx].a.split('\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <span className="footer-meta">Prepared by Om Italiya (24IT029) • AWDF Lab</span>
          <button className="btn-done" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
