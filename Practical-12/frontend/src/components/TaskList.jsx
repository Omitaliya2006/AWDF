import React from 'react';
import TaskItem from './TaskItem';
import './TaskList.css';

const TaskList = ({ tasks, loading, onUpdate, onDelete, onToast }) => {
  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="spinner"></div>
        <p>Synchronizing tasks with CI-tested API...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-list-empty">
        <span className="empty-icon">📋</span>
        <p>No tasks found matching filter criteria.</p>
        <span className="empty-hint">Create a new task to verify API persistence.</span>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToast={onToast}
        />
      ))}
    </div>
  );
};

export default TaskList;
