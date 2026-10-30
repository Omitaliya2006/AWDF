import React, { useState, useEffect } from 'react';
import './TaskForm.css';

export default function TaskForm({ isOpen, onClose, onSubmit, initialTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('Om Italiya (24IT029)');
  const [completed, setCompleted] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 'medium');
      setAssignedTo(initialTask.assignedTo || 'Om Italiya (24IT029)');
      setCompleted(Boolean(initialTask.completed));
      setSimulateError(false);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssignedTo('Om Italiya (24IT029)');
      setCompleted(false);
      setSimulateError(false);
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
      assignedTo: assignedTo.trim() || 'Om Italiya (24IT029)',
      completed,
      simulateError
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container task-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-box">
            <span className="header-icon">{initialTask ? '✏️' : '📢'}</span>
            <div>
              <h3>{initialTask ? 'Edit Task' : 'Dispatch Task & Emit Event'}</h3>
              <p className="header-sub">
                ⚡ API responds immediately (HTTP 201); EventEmitter notifies listener asynchronously.
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
              placeholder="e.g. Architect distributed event stream with EventEmitter"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Assigned User</label>
            <input
              type="text"
              placeholder="Assignee name (e.g. Om Italiya - 24IT029)"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Enter task details to be logged by background notification listener..."
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

          {/* Simulate error in listener toggle (Supplementary Problem) */}
          {!initialTask && (
            <div className="error-sim-banner">
              <label className="error-sim-label">
                <input
                  type="checkbox"
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                />
                <span>Simulate Background Listener Exception (Test Error Listener)</span>
              </label>
              <p className="error-sim-hint">
                Throws an error inside the background handler to verify the <code>taskEvents.on('error')</code> listener catches it without crashing the server.
              </p>
            </div>
          )}

          <div className="form-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {initialTask ? 'Update & Emit' : 'Create & Emit Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
