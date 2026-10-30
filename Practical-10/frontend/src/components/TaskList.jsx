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
        <p>Fetching tasks from server...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <div className="empty-icon">📭</div>
        <h3>No tasks found</h3>
        <p>Create a new task to dispatch an asynchronous background event and observe the non-blocking execution!</p>
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
