import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 3500);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={`toast-container toast-${toast.type || 'info'}`}>
      <span className="toast-icon">
        {toast.type === 'success' && '✓'}
        {toast.type === 'error' && '⚠️'}
        {toast.type === 'info' && 'ℹ️'}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
}

