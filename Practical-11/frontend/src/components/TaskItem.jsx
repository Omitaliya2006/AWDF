import React from 'react';
import './TaskItem.css';

export default function TaskItem({
  task,
  onToggleComplete,
  onEditTask,
  onDeleteTask
}) {
  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
      <div className="task-header">
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task)}
          />
          <span className="checkmark"></span>
        </label>

        <div className="task-title-group">
          <h4 className={`task-title ${task.completed ? 'strike' : ''}`}>{task.title}</h4>
          <span className={`priority-tag ${task.priority}`}>{task.priority}</span>
        </div>
      </div>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {/* Container Volume Badge */}
      <div className="task-volume-strip">
        <span className="volume-label">
          💾 Persisted in: <code>awdf-mongo-data-24it029</code>
        </span>
        <span className="env-badge">Docker Container</span>
      </div>

      <div className="task-footer">
        <span className="task-date">
          {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Just now'}
        </span>

        <div className="task-actions">
          <button className="btn-action edit" onClick={() => onEditTask(task)} title="Edit task in container">
            ✏️
          </button>
          <button
            className="btn-action delete"
            onClick={() => onDeleteTask(task._id, task.title)}
            title="Delete task from persistent volume"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
