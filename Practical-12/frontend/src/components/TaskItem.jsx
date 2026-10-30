import React, { useState } from 'react';
import './TaskItem.css';

const TaskItem = ({ task, onUpdate, onDelete, onToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleSave = async () => {
    if (!editTitle.trim()) {
      onToast('Title cannot be empty', 'error');
      return;
    }
    try {
      await onUpdate(task._id, {
        title: editTitle,
        status: editStatus,
        priority: editPriority
      });
      setIsEditing(false);
      onToast('Task updated successfully', 'success');
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  const handleToggleStatus = async () => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await onUpdate(task._id, { status: nextStatus });
      onToast(`Task marked as ${nextStatus}`, 'success');
    } catch (err) {
      onToast(err.message, 'error');
    }
  };

  return (
    <div className={`task-item-card ${task.status}`}>
      {isEditing ? (
        <div className="task-edit-mode">
          <input
            type="text"
            className="edit-title-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <div className="edit-selects">
            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in-progress">In-Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="edit-btn-group">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-item-top">
            <button
              className={`checkbox-circle ${task.status === 'completed' ? 'checked' : ''}`}
              onClick={handleToggleStatus}
              title="Toggle task completion"
            >
              {task.status === 'completed' && '✓'}
            </button>

            <div className="task-title-group">
              <h4 className={`task-title ${task.status === 'completed' ? 'strikethrough' : ''}`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
            </div>

            <div className="task-badges">
              <span className={`priority-tag ${task.priority}`}>
                {task.priority}
              </span>
              <span className={`status-tag ${task.status}`}>
                {task.status}
              </span>
            </div>
          </div>

          <div className="task-item-bottom">
            <span className="task-meta">
              👤 <code>{task.assignedTo || 'Om Italiya (24IT029)'}</code>
            </span>

            <div className="task-actions">
              <button className="icon-btn edit" onClick={() => setIsEditing(true)} title="Edit Task">
                ✏️
              </button>
              <button className="icon-btn delete" onClick={() => onDelete(task._id)} title="Delete Task">
                🗑️
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
