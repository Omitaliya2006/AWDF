import React, { useState } from 'react';
import './TaskItem.css';
import { api } from '../services/api';

export default function TaskItem({
  task,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onNotify
}) {
  const [isInspecting, setIsInspecting] = useState(false);
  const [singleCacheStatus, setSingleCacheStatus] = useState(null);

  const handleInspectSingleCache = async () => {
    setIsInspecting(true);
    try {
      const res = await api.getTaskById(task._id);
      if (res.ok) {
        setSingleCacheStatus(res.telemetry);
        onNotify(
          `GET /tasks/${task._id.slice(-6)}: ${res.telemetry.cacheStatus} (${res.telemetry.serverLatency})`,
          res.telemetry.cacheStatus === 'HIT' ? 'success' : 'info'
        );
      }
    } finally {
      setIsInspecting(false);
    }
  };

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

      {/* Single Key Cache Inspector Badge */}
      <div className="task-cache-strip">
        <button
          className="btn-inspect-cache"
          onClick={handleInspectSingleCache}
          disabled={isInspecting}
          title="Queries GET /api/tasks/:id to test single-item caching"
        >
          {isInspecting ? '⚡ Inspecting...' : '🔑 Inspect Single Cache'}
        </button>

        {singleCacheStatus && (
          <span className={`single-cache-pill ${singleCacheStatus.cacheStatus.toLowerCase()}`}>
            {singleCacheStatus.cacheStatus === 'HIT' ? '⚡ RAM HIT' : '🍃 DB MISS'} ({singleCacheStatus.serverLatency})
          </span>
        )}

        <span className="task-id-tag">ID: {task._id ? task._id.slice(-6) : 'N/A'}</span>
      </div>

      <div className="task-footer">
        <span className="task-date">
          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Just now'}
        </span>

        <div className="task-actions">
          <button className="btn-action edit" onClick={() => onEditTask(task)} title="Edit task">
            ✏️
          </button>
          <button className="btn-action delete" onClick={() => onDeleteTask(task._id)} title="Delete task & invalidate cache">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
