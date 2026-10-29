import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

export default function TaskList({
  tasks,
  isLoading,
  error,
  user,
  onRetry,
  onOpenAuthModal,
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

  // If user is not authenticated
  if (!user) {
    return (
      <div className="auth-required-card">
        <div className="auth-req-icon">🔐</div>
        <h3>Authentication Required</h3>
        <p>
          All task routes are protected by the Express JWT Authentication Middleware.
          Sign in or register to access your personalized tasks.
        </p>
        <button className="auth-req-btn" onClick={onOpenAuthModal}>
          Sign In / Register to Continue
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-list-error">
        <div className="error-icon">⚠️</div>
        <h3>Failed to Load Protected Tasks</h3>
        <p>{error}</p>
        <button className="retry-btn" onClick={onRetry}>
          🔄 Retry Connection
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">📝</div>
        <h3>No Tasks in Your Account</h3>
        <p>You haven't created any tasks yet, or no tasks match your filter.</p>
        <div className="empty-actions">
          <button className="empty-btn-primary" onClick={onOpenCreateModal}>
            + Create New Task
          </button>
          <button className="empty-btn-secondary" onClick={onSeedData}>
            🌱 Load Sample Tasks
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <span className="task-count-text">
          Showing <strong>{tasks.length}</strong> task{tasks.length === 1 ? '' : 's'} for <strong>{user.name}</strong>
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
