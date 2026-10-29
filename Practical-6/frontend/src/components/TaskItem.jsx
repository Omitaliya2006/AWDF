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
    if (window.confirm(`Are you sure you want to delete task "${task.title}" from MongoDB?`)) {
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
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
          {/* Completion Checkbox */}
          <button
            type="button"
            className={`checkbox-btn ${task.completed ? 'checkbox-checked' : ''} ${isToggling ? 'checkbox-loading' : ''}`}
            onClick={handleToggle}
            disabled={isToggling}
            aria-label={task.completed ? 'Mark pending' : 'Mark completed'}
          >
            {task.completed && (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </button>

          {/* Details */}
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
              <span className="task-time" title={task.createdAt}>
                🕒 {formatDate(task.createdAt)}
              </span>
              <span className="task-mongo-id" title={`MongoDB Document ID: ${task._id || task.id}`}>
                🆔 {(task._id || task.id || '').toString().slice(-6)}
              </span>
              {task.completed && (
                <span className="badge-resolved">✓ Resolved</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="task-actions">
          <button
            className="action-btn edit-btn"
            onClick={() => onEditTask(task)}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>

          <button
            className="action-btn delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete Task from MongoDB"
            aria-label="Delete Task"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

