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

      {/* Event metadata badge */}
      <div className="task-event-metadata">
        <span className="meta-assignee">
          👤 Assigned: <strong>{task.assignedTo || 'Om Italiya (24IT029)'}</strong>
        </span>
        <span className="meta-event-hook">
          ⚡ Event: <code>task-{task.completed ? 'updated' : 'created'}</code>
        </span>
      </div>

      <div className="task-footer">
        <span className="task-date">
          {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'Just now'}
        </span>

        <div className="task-actions">
          <button className="btn-action edit" onClick={() => onEditTask(task)} title="Edit task & emit task-updated">
            ✏️
          </button>
          <button
            className="btn-action delete"
            onClick={() => onDeleteTask(task._id, task.title)}
            title="Delete task & emit task-deleted"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
