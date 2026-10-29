import React, { useState } from 'react';
import './VivaGuideModal.css';

const VIVA_QA = [
  {
    q: '1. Why must the cache be invalidated on every write operation, and what would happen to data correctness if it were not?',
    a: `If the cache is not invalidated upon write operations (POST, PUT, DELETE), subsequent GET requests will continue reading the old data stored in memory until the TTL expires. This causes a "stale read anomaly" where users see outdated information (e.g., deleted tasks still appearing, edited titles not updating, or newly created tasks missing). Invalidating the key ('all_tasks' and 'task_:id') guarantees that the next read forces a fresh query to MongoDB, ensuring strict cache coherence and data consistency.`
  },
  {
    q: '2. What is a reasonable TTL (time-to-live) for cached data in a task management context, and what trade-offs exist?',
    a: `In a personal task manager, 60 seconds (1 minute) is an optimal TTL. 
• Short TTL (e.g., 5s): High data freshness, but lower cache hit ratio and more database queries.
• Long TTL (e.g., 3600s / 1 hr): Maximum database load reduction and high cache hit ratio, but higher risk of serving stale data if an edge-case write misses cache invalidation, and increased RAM consumption.
A 60s TTL provides a strong balance: frequent reads are served in <1ms without touching MongoDB, while expired keys are automatically pruned every 120s (checkperiod).`
  },
  {
    q: '3. Why is in-memory caching (node-cache) not suitable for a multi-server/multi-instance deployment?',
    a: `node-cache stores data in the local V8 process memory of the single Node.js instance. In a clustered or load-balanced environment with multiple server instances (e.g., Instance A and Instance B behind NGINX):
• If a client sends a POST request routed to Instance A, Instance A invalidates its local memory.
• But Instance B still has the old cached data in its memory!
• If the next GET request routes to Instance B, the user receives stale data.
For multi-server architectures, a distributed in-memory cache like Redis or Memcached is required so all application instances share a unified central cache.`
  },
  {
    q: '4. What caching pattern is implemented in this practical (Cache-Aside vs Write-Through)?',
    a: `This practical implements the Cache-Aside pattern (also known as Lazy Loading):
1. The application checks the cache first.
2. On Cache HIT: returns cached data immediately from RAM.
3. On Cache MISS: queries MongoDB, writes the result to cache, and returns the response.
4. On Mutation: writes directly to MongoDB and invalidates (deletes) the cached key so the next read triggers a fresh fetch.`
  },
  {
    q: '5. How was the performance improvement measured and proven empirically?',
    a: `Using high-resolution timers (process.hrtime() on backend and performance.now() on frontend):
• Uncached MongoDB Query: Takes ~15ms - 25ms due to TCP connection overhead, BSON serialization, disk indexing, and document parsing.
• Cached node-cache Read: Takes ~0.6ms - 1.2ms directly from RAM hash-table.
This yields an empirical ~94% latency reduction (a 15x - 20x speedup), dramatically reducing database CPU cycles and query contention.`
  },
  {
    q: '6. What does the X-Cache header convey to HTTP clients?',
    a: `The X-Cache response header informs clients of the caching tier status:
• X-Cache: HIT → The response payload was served directly from the in-memory cache (RAM).
• X-Cache: MISS → The cache did not contain the key; MongoDB was queried, and the cache was populated.
• X-Cache: BYPASS → The client explicitly requested uncached data (via ?bypassCache=true).`
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
              <h3>Practical 9 Oral Viva & Theory Defense Guide</h3>
              <p className="header-sub">In-Memory Caching, TTL Trade-offs, and Invalidation Mechanics</p>
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
