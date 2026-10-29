import React, { useState } from 'react';
import './VivaGuideModal.css';

const VIVA_QUESTIONS = [
  {
    q: '1. Why must passwords be hashed with bcrypt instead of stored as plain text, even in a lab project?',
    a: 'Plain text storage violates fundamental security principles. If a database is breached, exposed in logs, or inspected by unauthorized personnel, plain text passwords immediately compromise user accounts across multiple services (due to password reuse).\n\nbcrypt solves this by combining:\n1. Automatic Salt Generation: A unique random salt is generated for each password, rendering precomputed rainbow table attacks useless.\n2. Adaptive Work Factor (Cost Parameter): bcrypt is intentionally computationally slow (e.g., 10 rounds = 1024 iterations), thwarting high-speed GPU brute force attempts.'
  },
  {
    q: '2. What does the auth middleware verify, and what happens if the token is missing or expired?',
    a: 'The auth middleware checks the incoming request headers for "Authorization: Bearer <token>". It calls jwt.verify(token, process.env.JWT_SECRET) to verify:\n• Cryptographic Signature: Proves the token was issued by this server and has not been tampered with.\n• Expiration Time (exp): Confirms the token is still within its validity window (e.g., 1 hour).\n\nIf missing: The middleware halts the pipeline immediately and returns HTTP 401 Unauthorized.\nIf expired: jwt.verify() throws TokenExpiredError. Wrapped in try/catch, the middleware safely returns HTTP 401 with a descriptive message rather than crashing the Node.js process.'
  },
  {
    q: '3. Why must input validation happen on the server even if the frontend already validates the fields?',
    a: 'Frontend validation is an ergonomic UX feature (giving users immediate feedback without a network round-trip), but it provides ZERO security. Any attacker or developer can bypass the React frontend completely using tools like Postman, Thunder Client, curl, or custom Python scripts.\n\nServer-side validation is the authoritative perimeter defense that guarantees every payload entering the database meets strict constraints (valid email format, minimum password length, non-empty task titles, valid enums).'
  },
  {
    q: '4. Why is bcrypt used instead of fast hashing algorithms like SHA-256 or MD5?',
    a: 'General-purpose hash functions like MD5 and SHA-256 were designed to be extremely fast for checksums and data integrity. Modern GPUs can calculate billions of SHA-256 hashes per second, making brute-force cracking trivial.\n\nbcrypt is specifically designed for password hashing. It utilizes an algorithm based on the Blowfish cipher that is deliberately memory-intensive and computationally expensive, drastically raising the hardware cost of any cracking attempt.'
  },
  {
    q: '5. Explain the three components of a JSON Web Token (JWT).',
    a: 'A JWT is composed of three Base64URL-encoded strings separated by dots:\n1. Header: Specifies the token type ("JWT") and the signing algorithm (e.g., "HS256").\n2. Payload: Contains claims about the user (e.g., id, email, role) and metadata (iat = issued at, exp = expiration timestamp).\n3. Signature: Created by taking the encoded header, encoded payload, and signing them with the server\'s private JWT_SECRET using the specified algorithm. Only the server with the secret key can produce a valid signature.'
  },
  {
    q: '6. How does token expiry and logout work in a stateless REST architecture?',
    a: 'Because JWTs are stateless, the backend does not store session IDs in memory or database by default. Token validity is determined solely by the "exp" timestamp encoded in the token.\n• Logout: The client simply deletes the JWT from localStorage and clears component state.\n• Expiry Handling: When a protected endpoint returns HTTP 401 Unauthorized, the client API interceptor clears any invalid token and redirects the user to the login dialog.'
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
            <span className="viva-badge">PRACTICAL 7 VIVA PREPARATION</span>
            <h2>Authentication & Middleware Oral Examination Guide</h2>
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
