import React from 'react';
import './TaskList.css';
import TaskItem from './TaskItem';

export default function TaskList({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  isLoading
}) {
  if (isLoading && tasks.length === 0) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner"></div>
        <p>Connecting to backend container service on port 5000...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">🐳</div>
        <h3>No tasks in container volume</h3>
        <p>Create a task to write documents to the MongoDB container and observe named volume persistence!</p>
      </div>
    );
  }

  return (
    <div className="task-cards-grid">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
}
