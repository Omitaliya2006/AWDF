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
            <h2>{editingTask ? 'Edit Task Document' : 'Create New Task'}</h2>
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

          {/* Title Field */}
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
              placeholder="e.g. Implement REST API validation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              autoFocus
              className="form-input"
            />
            <span className="form-hint">Mongoose schema constraint: required, minlength 2, trimmed.</span>
          </div>

          {/* Description Field */}
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="task-desc">Description (Optional)</label>
              <span className="char-count">{description.length}/500</span>
            </div>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Additional task requirements or implementation details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className="form-textarea"
            />
          </div>

          {/* Priority Select */}
          <div className="form-group">
            <label htmlFor="task-priority">Priority Level</label>
            <div className="priority-options">
              {[
                { value: 'low', label: '🟢 Low', desc: 'Standard task' },
                { value: 'medium', label: '🟡 Medium', desc: 'Normal attention' },
                { value: 'high', label: '🔴 High', desc: 'Urgent priority' }
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
                  <span className="priority-radio-label">{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Completed Checkbox (for editing) */}
          {editingTask && (
            <div className="form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={completed}
                  onChange={(e) => setCompleted(e.target.checked)}
                />
                <span>Mark task as completed</span>
              </label>
            </div>
          )}

          {/* Form Actions */}
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
                ? 'Saving to MongoDB...'
                : editingTask
                ? 'Update Document'
                : 'Create Task Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

