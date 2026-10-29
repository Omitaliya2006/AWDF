import React, { useState, useEffect } from 'react';
import './TaskForm.css';

export default function TaskForm({ isOpen, onClose, onSubmit, initialTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [completed, setCompleted] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      setCompleted(Boolean(initialTask.completed));
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCompleted(false);
    }
    setValidationError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setValidationError('Task title is required.');
      return;
    }
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container task-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-box">
            <span className="header-icon">{initialTask ? '✏️' : '➕'}</span>
            <div>
              <h3>{initialTask ? 'Edit Task' : 'Create New Task'}</h3>
              <p className="header-sub">
                ⚡ Write operation will automatically invalidate <code>all_tasks</code> cache key.
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="task-form-body">
          {validationError && (
            <div className="form-alert-error">⚠️ {validationError}</div>
          )}

          <div className="form-group">
            <label>Task Title *</label>
            <input
              type="text"
              placeholder="e.g. Implement distributed Redis cache"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Provide context or instructions for this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="form-select"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                Mark as Completed
              </label>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {initialTask ? 'Update & Invalidate Cache' : 'Create & Invalidate Cache'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
