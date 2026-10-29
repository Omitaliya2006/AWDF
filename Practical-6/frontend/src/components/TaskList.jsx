import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

export default function TaskList({
  tasks,
  isLoading,
  error,
  onRetry,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenCreateModal,
  onSeedData
}) {
  if (isLoading) {
    return (
      <div className="task-list-loading">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-error">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Connect to Backend API</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button className="retry-btn" onClick={onRetry}>
            🔄 Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">📋</div>
        <h3>No Tasks Found</h3>
        <p>No tasks match your current filter, or the MongoDB collection is empty.</p>
        <div className="empty-actions">
          <button className="empty-btn-primary" onClick={onOpenCreateModal}>
            + Add New Task
          </button>
          <button className="empty-btn-secondary" onClick={onSeedData}>
            🌱 Load Sample Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <span className="task-count-text">
          Showing <strong>{tasks.length}</strong> task{tasks.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="task-items-wrapper">
        {tasks.map((task) => (
          <TaskItem
            key={task._id || task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
}

