import React, { useState } from 'react';
import './TaskItem.css';

export default function TaskItem({
  task,
  onToggleComplete,
  onEditTask,
  onDeleteTask
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await onToggleComplete(task._id || task.id, !task.completed);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      try {
        setIsDeleting(true);
        await onDeleteTask(task._id || task.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <article className={`task-card ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-content">
        <div className="task-left">
          <button
            type="button"
            className={`checkbox-btn ${task.completed ? 'checkbox-checked' : ''}`}
            onClick={handleToggle}
            disabled={isToggling}
            aria-label="Toggle completed"
          >
            {task.completed && '✓'}
          </button>

          <div className="task-info">
            <div className="task-headline">
              <h3 className={`task-title ${task.completed ? 'task-title-done' : ''}`}>
                {task.title}
              </h3>
              <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                {task.priority || 'medium'}
              </span>
            </div>

            {task.description && (
              <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
              <span className="task-time">🕒 {formatDate(task.createdAt)}</span>
              <span className="task-id-badge">
                🆔 {(task._id || task.id || '').toString().slice(-6)}
              </span>
              <span className="task-lock-badge">🔒 JWT Protected</span>
            </div>
          </div>
        </div>

        <div className="task-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEditTask(task)}
            title="Edit Task"
          >
            ✎
          </button>
          <button
            className="action-btn delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Task"
          >
            🗑
          </button>
        </div>
      </div>
    </article>
  );
}
