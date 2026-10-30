import React from 'react';
import './Toast.css';

export default function Toast({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`toast-container ${type || 'info'}`}>
      <span className="toast-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && '🐳'}
      </span>
      <span className="toast-msg">{message}</span>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  );
}
