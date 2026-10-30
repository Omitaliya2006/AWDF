import React, { useState } from 'react';
import './TaskForm.css';

const TaskForm = ({ onTaskCreated, onToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Om Italiya (24IT029)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      onToast('Task title is required', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onTaskCreated(formData);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        assignedTo: 'Om Italiya (24IT029)'
      });
      onToast('Task created and validated successfully', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="task-form-card">
      <div className="form-header">
        <h4>Create New Task (API Validated)</h4>
        <span className="form-ci-badge">Jest Validated Schema</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title *</label>
          <input
            type="text"
            placeholder="e.g. Implement Docker healthcheck & CI badge"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Add detailed task scope or testing requirements..."
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Assigned Engineer</label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />
        </div>

        <button type="submit" className="submit-task-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Validating & Saving...' : '＋ Add Task to Pipeline'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
