import React from 'react';
import './Toast.css';

const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  return (
    <div className={`toast-notification ${type}`}>
      <span className="toast-icon">
        {type === 'success' && '✓'}
        {type === 'error' && '✕'}
        {type === 'info' && '✨'}
      </span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;
