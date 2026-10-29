import React, { useState, useEffect } from 'react';
import './TaskForm.css';

export default function TaskForm({
  isOpen,
  onClose,
  onSubmit,
  editingTask = null
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [completed, setCompleted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setCompleted(Boolean(editingTask.completed));
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCompleted(false);
    }
    setFormError('');
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setFormError('Task title is required.');
      return;
    }
    if (trimmedTitle.length < 2) {
      setFormError('Task title must be at least 2 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');

      await onSubmit({
        title: trimmedTitle,
        description: description.trim(),
        priority,
        ...(editingTask ? { completed } : {})
      });

      onClose();
    } catch (err) {
      setFormError(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <span className="modal-badge">{editingTask ? 'PUT /tasks/:id' : 'POST /tasks'}</span>
            <h2>{editingTask ? 'Edit Task' : 'Create Protected Task'}</h2>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          {formError && (
            <div className="form-alert">
              <span className="alert-icon">⚠️</span>
              <span>{formError}</span>
            </div>
          )}

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-title">
                Task Title <span className="required-star">*</span>
              </label>
              <span className="char-count">{title.length}/100</span>
            </div>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Implement input validation middleware"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              autoFocus
              className="form-input"
            />
            <span className="form-hint">Server validation: required, minlength 2 chars, trimmed.</span>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-desc">Description (Optional)</label>
              <span className="char-count">{description.length}/500</span>
            </div>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Details or notes for this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <div className="priority-options">
              {[
                { value: 'low', label: '🟢 Low' },
                { value: 'medium', label: '🟡 Medium' },
                { value: 'high', label: '🔴 High' }
              ].map((p) => (
                <label
                  key={p.value}
                  className={`priority-radio-card ${priority === p.value ? `priority-selected-${p.value}` : ''}`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={priority === p.value}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {editingTask && (
            <div className="form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                <span>Mark task completed</span>
              </label>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : editingTask
                ? 'Update Task'
                : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
