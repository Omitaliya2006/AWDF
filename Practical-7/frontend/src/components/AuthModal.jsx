import React, { useState } from 'react';
import api from '../services/api';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setEmail('demo.student@charusat.edu.in');
    setPassword('SecuredPass123');
    setName('Om Italiya (24IT029)');
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Client-side quick checks
    if (mode === 'register' && name.trim().length < 2) {
      setErrorMsg('Name must be at least 2 characters long.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    try {
      setIsSubmitting(true);
      let response;
      if (mode === 'register') {
        response = await api.register({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password
        });
      } else {
        response = await api.login({
          email: email.trim().toLowerCase(),
          password
        });
      }

      onAuthSuccess(response.user, response.token);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="auth-header">
          <div className="auth-brand">
            <span className="auth-icon-badge">🔐</span>
            <div className="auth-title-box">
              <h2>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
              <p className="auth-subtitle">
                JWT Authentication & Middleware Pipeline • Practical 7
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        {/* Tab switch */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`}
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === 'register' ? 'auth-tab-active' : ''}`}
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
          >
            Register New User
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errorMsg && (
            <div className="auth-error-banner">
              <span className="error-icon">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">
                Full Name <span className="req-star">*</span>
              </label>
              <input
                id="auth-name"
                type="text"
                placeholder="e.g. Om Italiya"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="auth-input"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">
              Email Address <span className="req-star">*</span>
            </label>
            <input
              id="auth-email"
              type="email"
              placeholder="e.g. 24it029@charusat.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={mode === 'login'}
              className="auth-input"
            />
          </div>

          <div className="auth-field">
            <div className="label-with-hint">
              <label htmlFor="auth-pwd">
                Password <span className="req-star">*</span>
              </label>
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              id="auth-pwd"
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="auth-input"
            />
            <span className="auth-hint">
              Hashed with bcrypt (10 salt rounds) before database storage.
            </span>
          </div>

          <div className="auth-actions">
            <button
              type="button"
              className="demo-credentials-btn"
              onClick={handleFillDemo}
              title="Populate test student credentials"
            >
              ⚡ Fill Demo Credentials
            </button>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Processing...'
                : mode === 'login'
                ? 'Sign In & Get JWT'
                : 'Create Account & Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
